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
    """Split messages while preserving markdown formatting"""
    
    # Maximum Discord message length
    MAX_LENGTH = 1990
    
    # Helper function to find closing code block
    def find_code_block_end(text: str, start: int) -> int:
        return text.find("```", start + 3)
    
    chunks = []
    current_chunk = ""
    i = 0
    
    while i < len(text):
        # Handle code blocks
        if text[i:i+3] == "```":
            # Find the end of the code block
            code_end = find_code_block_end(text, i)
            if code_end == -1:  # No closing block found
                code_block = text[i:]
                i = len(text)
            else:
                code_block = text[i:code_end+3]
                i = code_end + 3
            
            # If current chunk plus code block would be too long, split
            if len(current_chunk) + len(code_block) > MAX_LENGTH:
                if current_chunk:
                    chunks.append(current_chunk)
                    current_chunk = ""
                
                # If code block itself is too long, split it
                if len(code_block) > MAX_LENGTH:
                    # Preserve the language specification if present
                    first_newline = code_block.find('\n')
                    lang_spec = code_block[:first_newline] if first_newline != -1 else "```"
                    
                    code_content = code_block[first_newline+1:] if first_newline != -1 else code_block[3:-3]
                    
                    while code_content:
                        chunk_content = code_content[:MAX_LENGTH-8]  # Leave room for ``` markers
                        code_content = code_content[MAX_LENGTH-8:]
                        
                        if chunks:  # Not the first chunk
                            chunks.append(f"```\n{chunk_content}")
                        else:  # First chunk - include language
                            chunks.append(f"{lang_spec}\n{chunk_content}")
                        
                        if not code_content:  # Last chunk
                            chunks[-1] = chunks[-1] + "\n```"
                else:
                    chunks.append(code_block)
            else:
                current_chunk += code_block
            
            continue
        
        # Handle regular text
        if len(current_chunk) >= MAX_LENGTH:
            chunks.append(current_chunk)
            current_chunk = ""
        
        current_chunk += text[i]
        i += 1
    
    if current_chunk:
        chunks.append(current_chunk)
    
    # Send all chunks
    for chunk in chunks:
        await ctx.send(chunk)

if __name__ == "__main__":
    bot.run(TOKEN)
