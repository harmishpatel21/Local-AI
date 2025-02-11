from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
# from langchain_community.llms import Ollama
import logging 

from langchain_ollama import ChatOllama
from langchain.schema import HumanMessage, AIMessage, SystemMessage
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder, HumanMessagePromptTemplate


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

PROMPT_TEMPLATE = ChatPromptTemplate.from_messages([
    SystemMessage(content = "You are a helpful assistant."),
    MessagesPlaceholder(variable_name="history"),
    HumanMessagePromptTemplate.from_template("{input}")
])

# llm = Ollama(
#     model="deepseek-r1:8b",
#     num_gpu=1
# )

class ChatRequest(BaseModel):
    message: str
    history: list = []

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        history_message = []
        for msg in request.history:
            if msg['role'] == 'user':
                history_message.append(HumanMessage(content=msg['content']))
            else:
                history_message.append(AIMessage(content=msg['content']))

        # history_message.append(HumanMessage(content=request.message))

        chat = ChatOllama(model='deepseek-r1:8b', num_gpu=1)
        chain = PROMPT_TEMPLATE | chat 

        async def generate():
            full_response = ""
            async for chunk in chain.astream({
                "input": request.message,
                "history": history_message
            }):
                if chunk.content:
                    full_response += chunk.content
                    yield chunk.content

        return StreamingResponse(
            generate(),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-cache"}
        )
    
    except Exception as e:
        logging.error(f"Chat error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating response: {str(e)}"
        )    

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
    
