import React, { useState, useEffect, useRef } from 'react';
import {
    Send, Bot, User, ShieldAlert, Sparkles, Mic, History, Info,
    Paperclip, MoreHorizontal, Activity, Brain, Thermometer,
    Zap, ChevronRight, Share2, CornerDownRight, Phone
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Chat = () => {
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Hello! I am Aura, your student mental health guardian. I am here to support you through academic stress, emotional challenges, or just to listen. How are you feeling right now?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [emergency, setEmergency] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const scrollRef = useRef(null);

    const scrollToBottom = () => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const getBackendUrl = async () => {
        const ports = [8001, 8000];
        for (const port of ports) {
            try {
                const res = await axios.get(`http://localhost:${port}/`);
                if (res.status === 200) return `http://localhost:${port}`;
            } catch (e) { }
        }
        return null;
    };

    const getMockResponse = (text) => {
        const input = text.toLowerCase();
        let response = "I'm listening. Tell me more about that. Processing your thoughts out loud is a great way to gain clarity.";
        let emotion = "calm";
        let sentiment = "NEUTRAL";

        if (input.includes('stress') || input.includes('overwhelmed') || input.includes('pressure')) {
            response = "I understand things feel overwhelming right now. Remember that academic pressure is temporary. Try the 4-7-8 breathing technique.";
            emotion = "stressed";
            sentiment = "NEGATIVE";
        } else if (input.includes('anxious') || input.includes('worry') || input.includes('scared')) {
            response = "It's natural to feel anxious during peak semester. Ground yourself in the present moment. You are safe.";
            emotion = "anxious";
            sentiment = "NEGATIVE";
        } else if (input.includes('sad') || input.includes('lonely') || input.includes('hurt')) {
            response = "I'm sorry you're feeling this way. It's okay to not be okay. Remember you have support nearby.";
            emotion = "sad";
            sentiment = "NEGATIVE";
        } else if (input.includes('happy') || input.includes('good') || input.includes('great')) {
            response = "That's wonderful! Maintaining this positive momentum is key to your cognitive health.";
            emotion = "happy";
            sentiment = "POSITIVE";
        } else if (input.includes('angry') || input.includes('annoyed') || input.includes('mad')) {
            response = "Anger is often a valid response to unfairness. Let's process this constructively together.";
            emotion = "angry";
            sentiment = "NEGATIVE";
        }

        return { response, emotion, sentiment, emoji: emojiMap[emotion] };
    };

    const emojiMap = {
        'sad': '😔',
        'anxious': '😰',
        'happy': '😊',
        'angry': '😡',
        'calm': '😌',
        'stressed': '😓'
    };

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = {
            role: 'user',
            content: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const baseUrl = await getBackendUrl();
            if (baseUrl) {
                const res = await axios.post(`${baseUrl}/chat`, { text: userMsg.content });

                if (res.data.emergency) {
                    setEmergency(res.data);
                    setMessages(prev => {
                        const newMsgs = [...prev];
                        newMsgs[newMsgs.length - 1].emotion = res.data.user_emotion || 'Anxious';
                        return [...newMsgs, {
                            role: 'ai',
                            content: res.data.message,
                            isEmergency: true,
                            emotion: 'Calm',
                            emoji: '😌',
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }];
                    });
                } else {
                    setMessages(prev => {
                        const newMsgs = [...prev];
                        newMsgs[newMsgs.length - 1].emotion = res.data.emotion;
                        newMsgs[newMsgs.length - 1].emoji = res.data.emoji;
                        newMsgs[newMsgs.length - 1].confidence = res.data.confidence;
                        return [...newMsgs, {
                            role: 'ai',
                            content: res.data.response,
                            emotion: res.data.emotion,
                            emoji: res.data.emoji,
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }];
                    });
                    setAnalysis({
                        sentiment: res.data.sentiment,
                        emotion: res.data.emotion,
                        emoji: res.data.emoji,
                        confidence: res.data.confidence,
                        stress: res.data.stress_level
                    });
                }
            } else {
                // Seamlessly switch to mock response if backend is unreachable
                const mock = getMockResponse(userMsg.content);
                setMessages(prev => [...prev, {
                    role: 'ai',
                    content: mock.response,
                    emotion: mock.emotion,
                    emoji: mock.emoji,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            }
        } catch (err) {
            console.error("Chat error:", err);
            const mock = getMockResponse(userMsg.content);
            setMessages(prev => [...prev, {
                role: 'ai',
                content: mock.response,
                emotion: mock.emotion,
                emoji: mock.emoji,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 h-[calc(100vh-160px)] min-h-[700px] relative">
            {/* Ambient Atmosphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

            {/* Left Sidebar: Neural Intelligence */}
            <div className="hidden lg:flex flex-col space-y-8 overflow-y-auto no-scrollbar">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-10 rounded-[3.5rem] relative overflow-hidden group shadow-2xl shadow-emerald-900/5 border border-white"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000">
                        <Brain size={120} />
                    </div>
                    <div className="relative z-10 space-y-10">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-slate-800 tracking-tighter flex items-center gap-3">
                                <Activity size={24} className="text-emerald-500" />
                                Neural Sync
                            </h2>
                            <div className="flex gap-1">
                                {[1, 2, 3].map(i => <div key={i} className="w-1 h-3 bg-emerald-400/30 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />)}
                            </div>
                        </div>

                        {analysis ? (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                        <span>Emotional Valence</span>
                                        <span className="text-emerald-500">{analysis.emotion}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '75%' }}
                                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                        <span>Stress Calibration</span>
                                        <span className="text-orange-500">{analysis.stress}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '40%' }}
                                            className="h-full bg-gradient-to-r from-orange-400 to-rose-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                                        />
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-slate-50">
                                    <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100/50">
                                        <Zap size={18} className="text-indigo-600" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-700">Sentiment: {analysis.sentiment}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 space-y-6">
                                <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto border border-white shadow-inner">
                                    <Info size={32} className="text-slate-200" />
                                </div>
                                <p className="text-sm text-slate-400 font-medium italic leading-relaxed opacity-70 px-6">Establishing link. Your cognitive state will manifest here.</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-10 rounded-[3.5rem] flex-1 bg-white/40"
                >
                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                        <History size={18} className="text-slate-300" />
                        Dynamic Pathways
                    </h2>
                    <div className="space-y-4">
                        {[
                            'Deconstruct my stress',
                            'Visual breathing session',
                            'Analyze my sleep quality',
                            'Academic focus boost'
                        ].map((s, i) => (
                            <button
                                key={s}
                                onClick={() => setInput(s)}
                                className="w-full text-left px-6 py-5 bg-white/60 hover:bg-slate-900 hover:text-white rounded-[1.8rem] text-[11px] font-black uppercase tracking-[0.1em] transition-all hover:-translate-x-2 border border-white/60 active:scale-95 group relative overflow-hidden shadow-sm"
                            >
                                <span className="relative z-10">{s}</span>
                                <ChevronRight size={14} className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Middle: Cinematic Chat Engine */}
            <div className="lg:col-span-3 flex flex-col glass-card rounded-[4rem] overflow-hidden relative border-white shadow-[0_100px_100px_-50px_rgba(0,0,0,0.05)]">
                {/* Emergency Protocol Overlay */}
                <AnimatePresence>
                    {emergency && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-[60] bg-white/80 backdrop-blur-3xl flex items-center justify-center p-12"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 30 }}
                                animate={{ scale: 1, y: 0 }}
                                className="max-w-xl w-full glass-card p-12 rounded-[4.5rem] border-rose-100 shadow-[0_50px_100px_-20px_rgba(244,63,94,0.15)] text-center relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-2 bg-rose-500" />
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                                    transition={{ repeat: Infinity, duration: 4 }}
                                    className="bg-rose-500 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-rose-200"
                                >
                                    <ShieldAlert className="text-white" size={48} />
                                </motion.div>
                                <h2 className="text-4xl font-black text-slate-800 mb-6 tracking-tighter">Verified Care Required</h2>
                                <p className="text-slate-500 mb-12 text-xl leading-[1.8] font-medium italic opacity-80">"{emergency.message}"</p>
                                <div className="grid grid-cols-1 gap-6">
                                    {emergency.resources.map(r => (
                                        <a
                                            key={r.name}
                                            href={`tel:${r.contact}`}
                                            className="flex items-center justify-between bg-slate-50 p-6 rounded-[2rem] hover:bg-rose-500 hover:text-white transition-all border border-slate-100 group shadow-sm active:scale-95"
                                        >
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Human Support</span>
                                                <span className="text-lg font-black">{r.name}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-xl font-black">{r.contact}</span>
                                                <Phone size={24} fill="currentColor" className="opacity-40" />
                                            </div>
                                        </a>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setEmergency(null)}
                                    className="mt-12 text-slate-400 text-[11px] font-black uppercase tracking-[0.4em] hover:text-rose-500 transition-colors"
                                >
                                    Resume Session
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Intelligence Feed Header */}
                <div className="px-12 py-8 bg-white/40 backdrop-blur-3xl border-b border-white flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                                className="absolute -inset-2 bg-gradient-to-tr from-emerald-400 to-indigo-400 rounded-3xl opacity-20 blur-md"
                            />
                            <div className="relative w-16 h-16 bg-slate-900 rounded-[1.8rem] flex items-center justify-center text-white shadow-2xl">
                                <Bot size={32} />
                            </div>
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full shadow-lg" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tighter leading-none mb-2">Aura Intelligence</h3>
                            <div className="flex items-center gap-2">
                                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2 }} className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Neural Uplink Stable</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="w-12 h-12 flex items-center justify-center text-slate-400 hover:bg-white hover:text-emerald-500 hover:shadow-xl hover:shadow-emerald-900/5 rounded-2xl transition-all"><Share2 size={20} /></button>
                        <button className="w-12 h-12 flex items-center justify-center text-slate-400 hover:bg-white hover:text-emerald-500 hover:shadow-xl hover:shadow-emerald-900/5 rounded-2xl transition-all"><MoreHorizontal size={20} /></button>
                    </div>
                </div>

                {/* Cognitive Feed */}
                <div className="flex-1 overflow-y-auto p-12 space-y-12 no-scrollbar">
                    <AnimatePresence initial={false}>
                        {messages.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex items-end gap-5 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`shrink-0 w-10 h-10 rounded-[1.2rem] flex items-center justify-center text-[10px] font-black border-2 border-white shadow-xl ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-emerald-600'}`}>
                                        {m.role === 'user' ? 'ME' : 'AI'}
                                    </div>
                                    <div className="flex flex-col space-y-3">
                                        <div className={`p-8 rounded-[2.5rem] text-lg font-medium leading-[1.7] italic shadow-2xl relative ${m.role === 'user'
                                            ? 'bg-slate-900 text-white rounded-tr-none shadow-indigo-900/10'
                                            : 'bg-white/80 backdrop-blur-xl border border-white text-slate-700 rounded-tl-none shadow-emerald-900/5'
                                            }`}>
                                            {m.role === 'ai' && <CornerDownRight size={24} className="mb-4 text-emerald-500 opacity-30" />}
                                            {m.content}
                                            {m.role === 'ai' && m.emoji && (
                                                <span className="absolute -right-4 -bottom-4 text-3xl drop-shadow-lg">{m.emoji}</span>
                                            )}
                                        </div>
                                        <div className={`flex items-center gap-3 ${m.role === 'user' ? 'flex-row-reverse mr-2' : 'ml-2'}`}>
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                                {m.time} • Secure Sync
                                            </span>
                                            {m.emotion && (
                                                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${m.emotion.toLowerCase() === 'happy' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                    m.emotion.toLowerCase() === 'sad' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                                        m.emotion.toLowerCase() === 'angry' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                                            m.emotion.toLowerCase() === 'anxious' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                                m.emotion.toLowerCase() === 'stressed' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                                                                    'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                                    }`}>
                                                    <div className={`w-1 h-1 rounded-full ${m.emotion.toLowerCase() === 'happy' ? 'bg-emerald-500' :
                                                        m.emotion.toLowerCase() === 'sad' ? 'bg-blue-500' :
                                                            m.emotion.toLowerCase() === 'angry' ? 'bg-rose-500' :
                                                                'bg-indigo-500'
                                                        }`} />
                                                    {m.emotion} {m.confidence ? `• ${m.confidence}%` : ''}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {loading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start items-end gap-5">
                            <div className="shrink-0 w-10 h-10 rounded-[1.2rem] bg-indigo-50 border-2 border-white flex items-center justify-center text-[10px] font-black text-indigo-600 shadow-xl">AI</div>
                            <div className="bg-white/60 p-8 rounded-[2.5rem] rounded-tl-none shadow-xl border border-white">
                                <div className="flex gap-2">
                                    {[1, 2, 3].map(i => <div key={i} className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={scrollRef} />
                </div>

                {/* Input Matrix */}
                <div className="p-10 bg-white/40 border-t border-white">
                    <div className="max-w-5xl mx-auto relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-indigo-400 rounded-[3rem] opacity-0 group-focus-within:opacity-10 blur-xl transition-opacity" />
                        <div className="relative bg-white/80 backdrop-blur-2xl rounded-[3rem] p-3 flex items-center shadow-2xl shadow-indigo-900/5 border-2 border-transparent group-focus-within:border-emerald-500/20 transition-all">
                            <button className="w-14 h-14 flex items-center justify-center text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-[1.8rem] transition-all"><Paperclip size={24} /></button>
                            <form onSubmit={handleSend} className="flex-1 flex items-center gap-4">
                                <input
                                    type="text"
                                    placeholder="Communicate your current cognitive state..."
                                    className="flex-1 bg-transparent px-6 py-4 outline-none font-bold text-slate-700 text-lg placeholder:text-slate-200"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    disabled={loading}
                                />
                                <div className="flex gap-3">
                                    <button type="button" className="w-14 h-14 flex items-center justify-center text-slate-300 hover:bg-slate-50 rounded-2xl transition-colors"><Mic size={24} /></button>
                                    <button
                                        type="submit"
                                        className="h-14 px-10 bg-slate-900 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 disabled:opacity-30 disabled:grayscale transition-all active:scale-95 hover:bg-emerald-600"
                                        disabled={loading || !input.trim()}
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;


