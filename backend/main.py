from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
from datetime import datetime

import models, database, nlp

# Ensure tables are created
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Aura API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Aura API is running"}

# Global Stats Helper
def get_app_stats(db: Session):
    stats = db.query(models.AppStats).first()
    if not stats:
        stats = models.AppStats(daily_streak=1, journal_streak=0, exercise_streak=0)
        db.add(stats)
        db.commit()
        db.refresh(stats)
    return stats

@app.post("/chat")
def chat(payload: dict = Body(...), db: Session = Depends(database.get_db)):
    text = payload.get("text")
    
    if nlp.detect_emergency(text):
        return {
            "emergency": True,
            "message": "It sounds like you are going through a very difficult time. Please reach out to someone you trust or a professional. Help is available.",
            "resources": [
                {"name": "Aasra (India)", "contact": "9820466726"},
                {"name": "Vandrevala Foundation", "contact": "9999666555"},
                {"name": "SNEHA", "contact": "044-24640050"}
            ]
        }
    
    sentiment_label, sentiment_score = nlp.analyze_sentiment(text)
    emotion_cat, emotion_emoji, emotion_conf = nlp.analyze_emotion(text)
    
    # Get history (last 5)
    history = db.query(models.ChatMessage).order_by(models.ChatMessage.created_at.desc()).limit(5).all()
    history_serializable = []
    for m in reversed(history):
        history_serializable.append({"role": m.role, "content": m.content})
    
    ai_response = nlp.get_chat_response(text, history_serializable)
    
    # Save messages
    user_msg = models.ChatMessage(
        content=text,
        role="user",
        sentiment=sentiment_label,
        emotion=f"{emotion_cat} {emotion_emoji}"
    )
    ai_msg = models.ChatMessage(
        content=ai_response,
        role="ai"
    )
    db.add(user_msg)
    db.add(ai_msg)
    db.commit()
    
    return {
        "response": ai_response,
        "sentiment": sentiment_label,
        "emotion": emotion_cat,
        "emoji": emotion_emoji,
        "confidence": round(emotion_conf * 100, 1),
        "stress_level": "High" if emotion_cat in ["Angry", "Anxious", "Stressed"] else "Medium" if emotion_cat == "Sad" else "Low"
    }

@app.post("/journal")
def create_journal(payload: dict = Body(...), db: Session = Depends(database.get_db)):
    content = payload.get("content")
    
    sentiment_label, _ = nlp.analyze_sentiment(content)
    emotion_cat, emotion_emoji, emotion_conf = nlp.analyze_emotion(content)
    
    # Simple stress score calculation
    stress_score = 30.0
    if emotion_cat == "Angry": stress_score += 40
    if emotion_cat == "Anxious": stress_score += 50
    if sentiment_label == "NEGATIVE": stress_score += 20
    stress_score = min(100.0, stress_score)
    
    new_journal = models.Journal(
        content=content,
        mood=sentiment_label,
        emotion=f"{emotion_cat} {emotion_emoji}",
        stress_score=stress_score
    )
    
    # Update streaks
    stats = get_app_stats(db)
    stats.journal_streak += 1
    stats.last_journal_date = datetime.utcnow()
    
    db.add(new_journal)
    db.commit()
    
    return {
        "message": "Journal entry saved", 
        "analysis": {
            "mood": sentiment_label, 
            "emotion": emotion_cat,
            "emoji": emotion_emoji,
            "stress": stress_score
        }
    }

@app.get("/journals")
def get_journals(db: Session = Depends(database.get_db)):
    journals = db.query(models.Journal).order_by(models.Journal.created_at.desc()).all()
    return journals

@app.delete("/journal/{journal_id}")
def delete_journal(journal_id: int, db: Session = Depends(database.get_db)):
    journal = db.query(models.Journal).filter(models.Journal.id == journal_id).first()
    if not journal:
        raise HTTPException(status_code=404, detail="Journal not found")
    db.delete(journal)
    db.commit()
    return {"message": "Journal deleted"}

@app.get("/stats")
def get_stats(db: Session = Depends(database.get_db)):
    stats = get_app_stats(db)
    journals = db.query(models.Journal).all()
    
    mood_distribution = {}
    stress_trends = []
    for j in journals:
        mood_distribution[j.emotion] = mood_distribution.get(j.emotion, 0) + 1
        stress_trends.append({"date": j.created_at.strftime("%Y-%m-%d"), "stress": j.stress_score})
    
    return {
        "streaks": {
            "daily": stats.daily_streak,
            "journal": stats.journal_streak,
            "exercise": stats.exercise_streak
        },
        "mood_distribution": mood_distribution,
        "stress_trends": stress_trends[-7:] # Last 7 entries
    }
