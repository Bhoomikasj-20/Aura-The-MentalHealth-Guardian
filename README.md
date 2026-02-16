# Aura: Privacy-First Mental Wellness

Aura is a premium, privacy-centric platform designed to help users manage stress, emotions, and mental health through AI-powered conversations, structured journaling, and guided calm.

## Core Philosophy

- **Privacy by Design**: All your personal data (chat, journals) is end-to-end encrypted using a private key generated uniquely for you.
- **No Emojis**: A clean, professional UI using high-quality icons for a calming experience.
- **Local First**: Your data stays under your control.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Recharts, Lucide Icons, Framer Motion.
- **Backend**: FastAPI (Python), SQLAlchemy, JWT Authentication.
- **AI/NLP**: HuggingFace Inference API models for Sentiment, Emotion, and Conversational analysis.
- **Database**: SQLite (Ready for PostgreSQL).

## Features

1. **AI Chatbot**: Empathetic responses with real-time emotion and stress analysis.
2. **Emergency Detection**: Automatic override if extreme distress is detected.
3. **Encrypted Journaling**: A digital sanctuary for your thoughts.
4. **Wellness Dashboard**: Visual trends of your mood and stress levels.
5. **Calm Center**: Breathing exercises and curated audio.
6. **Roots Game**: A virtual plant that grows with your wellness habits.
7. **Care Network**: Find counselors and therapists near you.

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+

### Running the Project

1. **Start Backend**:

   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

2. **Start Frontend**:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Open Browser**:
   Visit `http://localhost:3000`

---

_Created with care for your mental well-being._
