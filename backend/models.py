from sqlalchemy import Column, Integer, String, Text, DateTime, Float
import datetime
from database import Base

class Journal(Base):
    __tablename__ = "journals"
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text) # Storing plain text now (no auth simplicity)
    mood = Column(String)
    emotion = Column(String)
    stress_score = Column(Float)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text) # Storing plain text
    role = Column(String) # "user" or "ai"
    sentiment = Column(String)
    emotion = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AppStats(Base):
    __tablename__ = "app_stats"
    id = Column(Integer, primary_key=True, index=True)
    daily_streak = Column(Integer, default=0)
    journal_streak = Column(Integer, default=0)
    exercise_streak = Column(Integer, default=0)
    last_journal_date = Column(DateTime)
    last_exercise_date = Column(DateTime)
