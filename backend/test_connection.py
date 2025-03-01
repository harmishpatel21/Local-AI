import os 
import discord 
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')

# set up bot
intents = discord.Intents.default()
intents.message_content = True # Enable message content
intents.members = True 

client = discord.Client(intents=intents)

@client.event
async def on_ready():
    print(f'We have logged in as {client.user}')

@client.event
async def on_message(message):
    # Ignore messages from the bot itself
    if message.author == client.user:
        return 
    
    # respond to ping
    if message.content.startswith('!ping'):
        print(message.content)
        await message.channel.send('Pong!')

# Run the bot
if __name__ == "__main__":
    client.run(TOKEN)