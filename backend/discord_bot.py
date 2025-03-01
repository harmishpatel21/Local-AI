import os
import aiohttp
import discord
from discord.ext import commands
from dotenv import load_dotenv
from collections import defaultdict
from typing import Dict, List

# Load environment variables
load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')
API_URL = 'http://localhost:8000/chat'

# Initialize bot
intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix='!', intents=intents)

# Store conversation history per channel
conversation_history: Dict[int, List[dict]] = defaultdict(list)

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user}')

@bot.command(name='chat')
async def chat_command(ctx: commands.Context, *, message: str):
    """Chat with AI through Discord"""
    try:
        history = conversation_history[ctx.channel.id]
        print(message)
        async with ctx.typing():
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    API_URL,
                    json={
                        'message': message,
                        'history': history
                    }
                ) as response:
                    
                    if response.status == 200:
                        full_response = await response.text()
                        await send_chunked_messages(ctx, full_response)
                        update_history(ctx.channel.id, message, full_response)
                        
                    else:
                        await ctx.send(f"⚠️ API Error (Status: {response.status})")

    except aiohttp.ClientConnectorError:
        await ctx.send("🔴 Could not connect to AI service")
    except Exception as e:
        await ctx.send(f"❌ Error: {str(e)}")
        conversation_history[ctx.channel.id] = history[:-1]

@bot.command(name='resetchat')
async def reset_chat(ctx: commands.Context):
    """Reset conversation history"""
    conversation_history[ctx.channel.id] = []
    await ctx.send("🔄 Conversation history cleared!")

def update_history(channel_id: int, user_msg: str, ai_response: str):
    """Manage conversation history with limit"""
    history = conversation_history[channel_id]
    history.extend([
        {'role': 'user', 'content': user_msg},
        {'role': 'assistant', 'content': ai_response}
    ])
    # Keep last 10 exchanges (20 messages)
    conversation_history[channel_id] = history[-20:]

async def send_chunked_messages(ctx: commands.Context, text: str):
    """Split long messages for Discord"""
    chunks = [text[i:i+2000] for i in range(0, len(text), 2000)]
    for chunk in chunks:
        await ctx.send(chunk)

if __name__ == "__main__":
    bot.run(TOKEN)
