from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel, Field

from ai_insights import get_chat_reply

# Login is enforced where main.py includes this router
router = APIRouter()


class ChatTurn(BaseModel):
    role: str  # "user" or "cactai"
    text: str

class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    history: list[ChatTurn] = []
    context: dict[str, Any] | None = None

# Plain def: the Gemini call blocks, so FastAPI runs this in a threadpool
@router.post("/chat")
def chat(req: ChatRequest):
    history = [turn.model_dump() for turn in req.history]
    return get_chat_reply(req.message, history, req.context)
