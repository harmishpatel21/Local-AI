import os 
from dotenv import load_dotenv
from pathlib import Path 

def get_hf_token():
    env_path = Path(__file__).parent / ".env"
    load_dotenv(env_path)

    token = os.getenv("HUGGINGFACE_TOKEN")
    if not token:
        raise ValueError(
                "Huggingface token not found"
                )
    return token 

