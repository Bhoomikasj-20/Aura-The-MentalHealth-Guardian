import requests
import os
import logging
from dotenv import load_dotenv

load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

HF_TOKEN = os.getenv("HF_TOKEN", "")
API_URLS = {
    "sentiment": "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
    "emotion": "https://api-inference.huggingface.co/models/SamLowe/roberta-base-go_emotions",
    "chat": "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium"
}

headers = {"Authorization": f"Bearer {HF_TOKEN}"}

def query_hf(api_url, payload):
    if not HF_TOKEN:
        logger.error("HF_TOKEN is missing in environment variables.")
        return None
    
    try:
        payload["options"] = {"wait_for_model": True}
        response = requests.post(api_url, headers=headers, json=payload, timeout=20)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        logger.error(f"HF API Error ({api_url}): {e}")
        return None

def analyze_sentiment(text):
    result = query_hf(API_URLS["sentiment"], {"inputs": text})
    if result and isinstance(result, list) and len(result) > 0:
        data = result[0] if isinstance(result[0], list) else result
        res = sorted(data, key=lambda x: x["score"], reverse=True)
        return res[0]["label"], res[0]["score"]
    
    # Fallback sentiment detection
    pos_words = ["happy", "good", "great", "excellent", "wonderful", "joy", "smile", "calm", "relax"]
    neg_words = ["sad", "angry", "upset", "bad", "terrible", "stress", "anxious", "worry", "deadline"]
    text_low = text.lower()
    if any(w in text_low for w in pos_words): return "POSITIVE", 0.8
    if any(w in text_low for w in neg_words): return "NEGATIVE", 0.8
    return "NEUTRAL", 0.0

def analyze_emotion(text):
    result = query_hf(API_URLS["emotion"], {"inputs": text})
    
    emoji_map = {
        "joy": "😊", "amusement": "😊", "approval": "😌", "caring": "😌",
        "gratitude": "😌", "optimism": "😊", "relief": "😌", "sadness": "😔",
        "disappointment": "😔", "grief": "😔", "remorse": "😔", "fear": "😰",
        "nervousness": "😰", "anger": "😡", "annoyance": "😡", "disapproval": "😡",
        "stress": "😓", "confusion": "😓"
    }
    
    if result and isinstance(result, list) and len(result) > 0:
        data = result[0] if isinstance(result[0], list) else result
        emotions = sorted(data, key=lambda x: x["score"], reverse=True)
        label = emotions[0]["label"]
        confidence = emotions[0]["score"]
        
        cat_map = {
            "joy": "Happy", "amusement": "Happy", "optimism": "Happy",
            "approval": "Calm", "caring": "Calm", "gratitude": "Calm", "relief": "Calm", "pride": "Calm",
            "sadness": "Sad", "disappointment": "Sad", "grief": "Sad", "remorse": "Sad",
            "fear": "Anxious", "nervousness": "Anxious",
            "anger": "Angry", "annoyance": "Angry", "disapproval": "Angry",
            "confusion": "Stressed", "disgust": "Stressed"
        }
        
        category = cat_map.get(label, "Calm")
        emoji = emoji_map.get(label, "😌")
        
        return category, emoji, confidence
    
    # Fallback emotion detection
    text_low = text.lower()
    if any(w in text_low for w in ["happy", "joy", "great", "wonderful"]): return "Happy", "😊", 0.8
    if any(w in text_low for w in ["sad", "lonely", "hurt", "cry"]): return "Sad", "😔", 0.8
    if any(w in text_low for w in ["anxious", "worry", "scared", "fear"]): return "Anxious", "😰", 0.8
    if any(w in text_low for w in ["angry", "mad", "upset", "annoy"]): return "Angry", "😡", 0.8
    if any(w in text_low for w in ["stress", "overwhelmed", "deadline"]): return "Stressed", "😓", 0.8
    
    return "Calm", "😌", 0.0

def detect_emergency(text):
    emergency_keywords = [
        "kill myself", "suicide", "end my life", "hurt myself", "panic attack", 
        "cannot breathe", "die", "hanging", "overdose", "cutting", "harm"
    ]
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in emergency_keywords)

def get_chat_response(text, history=[]):
    # Prepend system instruction for Aura
    system_instruction = "You are Aura, a student mental health guardian. Provide empathetic, actionable support. Detect emotion and suggest practical coping steps. "
    
    # Tailoring context for student mental health
    context = ""
    if any(w in text.lower() for w in ["exam", "grade", "study", "deadline", "test"]):
        context = "Suggest Pomodoro or focus sessions for academic stress. "
    elif any(w in text.lower() for w in ["anxious", "anxiety", "worried", "panic"]):
        context = "Suggest breathing exercises (4-7-8 technique). "
    elif any(w in text.lower() for w in ["sad", "depressed", "lonely"]):
        context = "Suggest journaling or grounding exercises. "
    elif any(w in text.lower() for w in ["angry", "upset", "mad"]):
        context = "Suggest a calm release activity or a short walk. "
    elif any(w in text.lower() for w in ["tired", "burnout", "exhausted"]):
        context = "Advise rest and a digital detox. "

    prompt = f"{system_instruction}{context}User: {text}\nAura:"
    
    past_user = [h["content"] for h in history if h["role"] == "user"][-2:]
    past_ai = [h["content"] for h in history if h["role"] == "ai"][-2:]
    
    payload = {
        "inputs": {
            "past_user_inputs": past_user,
            "generated_responses": past_ai,
            "text": prompt
        },
        "parameters": {
            "max_new_tokens": 150,
            "top_p": 0.95,
            "temperature": 0.8,
            "repetition_penalty": 1.1
        }
    }
    
    result = query_hf(API_URLS["chat"], payload)
    
    if result and isinstance(result, dict) and "generated_text" in result:
        response = result["generated_text"]
        if "Aura:" in response:
            response = response.split("Aura:")[-1].strip()
        return response
    
    # Advanced Fallback logic for student mental health (Offline/API failure)
    fallbacks = [
        "I'm listening closely. Academic life can be a lot to balance, but processing these thoughts is the first step to clarity.",
        "I hear you. Remember that your well-being is just as important as your grades. What's one small thing you can do for yourself right now?",
        "That sounds like a lot to carry. I'm here to listen. Sometimes just getting it out helps release the pressure.",
        "I'm with you. Navigating student life isn't always easy, but you've shown resilience before. Tell me more about what's on your mind.",
        "I'm here. Whether it's study stress or something personal, your feelings are valid. Let's take it one step at a time."
    ]
    
    import random
    # Select fallback based on keywords if possible
    if any(w in text.lower() for w in ["exam", "grade", "study", "deadline", "test"]):
        return "Academic pressure can feel intense. Take a deep breath. You've prepared for challenges like this before, and you can handle this too."
    elif any(w in text.lower() for w in ["anxious", "anxiety", "worried", "panic"]):
        return "I can feel the weight of those worries. Try to focus on your immediate surroundings—what are three things you can see right now?"
    elif any(w in text.lower() for w in ["sad", "depressed", "lonely"]):
        return "I'm sorry things feel heavy right now. It's okay to feel this way. I'm here to sit with you through this."
    elif any(w in text.lower() for w in ["angry", "upset", "mad"]):
        return "It's okay to feel frustrated. Sometimes a quick physical reset—like a short walk or just stretching—can help clear the air."
    
    return random.choice(fallbacks)

