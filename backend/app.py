from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

app = FastAPI()

app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
)

# Load Mistral Model
model_path = "mistralai/Mistral-7B-Instruct-v0.2"
model = AutoModelForCausalLM.from_pretrained(
        model_path,
        device_map='auto',
        torch_dtype=torch.float16
)
tokenizer = AutoTokenizer.from_pretrained(model_path)

class ChatRequest(BaseModel):
    message: str
    history: list = []

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        messages = [{'role': 'user', 'content': request.message}]
        inputs = tokenizer.apply_chat_template(
                messages,
                return_tensor="pt"
                ).to(model.device)

        outputs = model.generate(
                inputs,
                max_new_tokens=500,
                temperature=0.7,
                do_sample=True 
                )

        response = tokenizer.decode(
                outputs[0][len(inputs[0]):],
                skip_special_tokens=True 

                )
        return {
                "response": response,
                "history": request.history + [request.message]
                }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
















