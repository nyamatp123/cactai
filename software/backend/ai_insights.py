import os
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FutureTimeout
from pathlib import Path
from dotenv import load_dotenv
from google import genai

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Change the model here. gemini-3.5-flash-lite has the largest free daily quota.
MODEL = "gemini-3.5-flash-lite"
# The SDK silently retries 429/503 for minutes, so cap the wait ourselves
CHAT_TIMEOUT_SECONDS = 30
_executor = ThreadPoolExecutor(max_workers=4)

INSTRUCTIONS_PATH = Path(__file__).parent / "cactai_instructions.md"
# Offline cactus reference used instead of web search
KNOWLEDGE_PATH = Path(__file__).parent / "knowledge" / "cactus-knowledge-base.md"
CHAT_FALLBACK = "Sorry, I'm having trouble thinking right now. Please try again in a moment."
MAX_HISTORY = 20  # most recent messages sent to Gemini
STATS_MARKER = "[[SHOW_STATS]]"

# App-level rules kept in code (not the instructions file) so the UI keeps working
# whatever gets written there
APP_RULES = f"""
## Reply format (required by the app)

If your reply is about this plant's current condition, health, watering, or
light, end it with {STATS_MARKER} on its own line. The app replaces that with
a small card showing the live readings, so don't repeat every number in your
text. For anything else (general facts, follow-ups, off-topic), leave it out.
"""


def fallback_insight(moisture):
    if moisture >= 80:
        return "Soil is very wet for a cactus. Hold off on watering to avoid root rot."
    if moisture < 20:
        return "Soil is very dry. This is a good time to water your cactus."
    return "Your cactus is in a healthy range."


def get_insight(moisture, lux):
    prompt = (
        f"This is a cactus. Current readings: soil moisture {moisture}% "
        f"(higher means wetter), light {lux} lux. "
        "Cacti prefer soil that dries out between waterings and bright light. "
        "In 1-2 short sentences, say whether this is a healthy zone, "
        "borderline, or concerning, and what to do."
    )
    try:
        interaction = client.interactions.create(
            model=MODEL,
            input=prompt,
        )
        return interaction.output_text
    except Exception as e:
        print("Gemini error:", e)
        return fallback_insight(moisture)   # demo keeps working if the API fails


def load_instructions():
    # Read on every call so edits to the file apply without a restart
    try:
        return INSTRUCTIONS_PATH.read_text(encoding="utf-8")
    except OSError as e:
        print("Could not read instructions file:", e)
        return "You are Cactai, a friendly cactus-care assistant. Keep answers short."


def load_knowledge():
    # Read on every call so edits to the knowledge base apply without a restart
    try:
        return KNOWLEDGE_PATH.read_text(encoding="utf-8")
    except OSError as e:
        print("Could not read knowledge base:", e)
        return ""


def format_context(context):
    lines = [f"- {key}: {value}" for key, value in (context or {}).items() if value is not None]
    if not lines:
        return "No plant data is available right now."
    return "\n".join(lines)


def to_step(role, text):
    step_type = "user_input" if role == "user" else "model_output"
    return {"type": step_type, "content": [{"type": "text", "text": text}]}


def get_chat_reply(message, history, context):
    """Returns {"reply": str, "show_stats": bool}."""
    knowledge = load_knowledge()
    system_instruction = (
        load_instructions()
        + "\n" + APP_RULES
        + ("\n## Cactus knowledge base\n\n"
           "Use this reference for plant facts instead of searching the web. "
           "Match the plant's type to its entry.\n\n" + knowledge if knowledge else "")
        + "\n## Current plant data (from the dashboard)\n\n"
        + format_context(context)
    )
    steps = [to_step(h["role"], h["text"]) for h in history[-MAX_HISTORY:] if h.get("text")]
    steps.append(to_step("user", message))
    future = _executor.submit(
        client.interactions.create,
        model=MODEL,
        system_instruction=system_instruction,
        input=steps,
    )
    try:
        text = future.result(timeout=CHAT_TIMEOUT_SECONDS).output_text or ""
    except FutureTimeout:
        print(f"Gemini chat error: no reply within {CHAT_TIMEOUT_SECONDS}s "
              "(model overloaded or out of quota?)")
        return {"reply": CHAT_FALLBACK, "show_stats": False}
    except Exception as e:
        print("Gemini chat error:", repr(e))
        return {"reply": CHAT_FALLBACK, "show_stats": False}

    show_stats = STATS_MARKER in text
    reply = text.replace(STATS_MARKER, "").strip()
    return {"reply": reply or CHAT_FALLBACK, "show_stats": show_stats}


if __name__ == "__main__":
    print(get_insight(85, 300))