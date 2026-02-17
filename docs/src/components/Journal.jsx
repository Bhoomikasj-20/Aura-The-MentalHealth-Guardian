import React, { useState, useEffect } from 'react';
import {
    Plus, Book, Calendar, Search, Trash2, Edit3, Lock, Mic,
    PieChart, ChevronRight, X, Sparkles, Heart, Quote,
    Cloudy, Sun, Wind, PenTool, Hash, Info
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Journal = () => {
    const [entries, setEntries] = useState([]);
    const [isWriting, setIsWriting] = useState(false);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activePrompt, setActivePrompt] = useState(0);
    const [showSaved, setShowSaved] = useState(false);
    const [mood, setMood] = useState('Calm');
    const [selectedTags, setSelectedTags] = useState([]);
    const [lastSaved, setLastSaved] = useState(null);
    const [showAIPreview, setShowAIPreview] = useState(false);
    const [aiInsight, setAiInsight] = useState(null);

    useEffect(() => {
        if (showAIPreview && content.length > 10) {
            // Simulate AI analysis for preview
            setAiInsight({
                mood: mood,
                sentiment: content.length > 100 ? 'Deeply Reflective' : 'Steady',
                focus: selectedTags.includes('Academic Stress') ? 'High' : 'Normal',
                recommendation: selectedTags.includes('Anxious') ? 'Try the breathing game next.' : 'Keep documenting your evolution.'
            });
        }
    }, [showAIPreview, content, mood, selectedTags]);

    const prompts = [
        "What made your neural pathways fire with joy today?",
        "If your current mood was a weather system, what would it be?",
        "What's one academic challenge you conquered with grace?",
        "Write a letter to your future self about this exact moment.",
        "What sensory detail from today do you want to remember forever?"
    ];
    const moodOptions = [
        { label: 'Happy', emoji: '😊', color: 'bg-emerald-500' },
        { label: 'Sad', emoji: '😔', color: 'bg-blue-500' },
        { label: 'Anxious', emoji: '😰', color: 'bg-amber-500' },
        { label: 'Angry', emoji: '😡', color: 'bg-rose-500' },
        { label: 'Calm', emoji: '😌', color: 'bg-indigo-500' },
        { label: 'Stressed', emoji: '😓', color: 'bg-orange-500' }
    ];

    const toggleTag = (tag) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    // Auto-save logic
    useEffect(() => {
        if (!isWriting || !content.trim()) return;
        const timer = setTimeout(() => {
            handleSave(true);
        }, 10000); // 10s auto-save
        return () => clearTimeout(timer);
    }, [content]);

    useEffect(() => {
        fetchEntries();
    }, []);

    const getBackendUrl = async () => {
        const ports = [8001, 8000];
        for (const port of ports) {
            try {
                await axios.get(`http://localhost:${port}/`).catch(() => { });
                return `http://localhost:${port}`;
            } catch (e) { }
        }
        return null;
    };

    const fetchEntries = async () => {
        const localEntries = JSON.parse(localStorage.getItem('mindease_journals') || '[]');
        try {
            const baseUrl = await getBackendUrl();
            if (baseUrl) {
                const res = await axios.get(`${baseUrl}/journals`);
                setEntries(res.data.length > 0 ? res.data : localEntries);
            } else {
                setEntries(localEntries);
            }
        } catch (err) {
            setEntries(localEntries);
        }
    };

    const handleSave = async (isAuto = false) => {
        if (!content.trim()) return;
        if (!isAuto) setLoading(true);

        const newEntry = {
            id: Date.now(),
            content,
            created_at: new Date().toISOString(),
            mood: mood,
            emotion: mood,
            tags: selectedTags
        };

        try {
            const baseUrl = await getBackendUrl();
            if (baseUrl) {
                const res = await axios.post(`${baseUrl}/journal`, {
                    content,
                    mood,
                    tags: selectedTags
                });
                if (!isAuto) {
                    setContent('');
                    setIsWriting(false);
                    setSelectedTags([]);
                }
                fetchEntries();
            } else {
                const updatedLocal = [newEntry, ...entries];
                localStorage.setItem('mindease_journals', JSON.stringify(updatedLocal));
                setEntries(updatedLocal);
                if (!isAuto) {
                    setContent('');
                    setIsWriting(false);
                    setSelectedTags([]);
                }
            }
            setShowSaved(true);
            setLastSaved(new Date().toLocaleTimeString());
            setTimeout(() => setShowSaved(false), 3000);
        } catch (err) {
            console.error("Save journal error:", err);
        } finally {
            if (!isAuto) setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const updatedLocal = entries.filter(e => e.id !== id);
        localStorage.setItem('mindease_journals', JSON.stringify(updatedLocal));
        setEntries(updatedLocal);
        setSelectedEntry(null);

        try {
            const baseUrl = await getBackendUrl();
            if (baseUrl) {
                await axios.delete(`${baseUrl}/journal/${id}`);
            }
        } catch (err) {
            console.error("Delete journal error:", err);
        }
    };

    const filteredEntries = entries.filter(e =>
        e.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24 relative">
            {/* Ambient Background Element */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -mr-64 -mt-32 pointer-events-none" />

            {/* Saved Notification */}
            <AnimatePresence>
                {showSaved && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className="fixed bottom-12 right-12 z-[110] bg-slate-900 text-white px-8 py-5 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-xl"
                    >
                        <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <p className="font-black text-xs uppercase tracking-widest">Archive Updated</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Reflection Securely Synced</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header: Cinematic Title */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/50 rounded-2xl text-emerald-700"
                    >
                        <Lock size={14} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">End-to-End Encrypted Sanctuary</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl font-black text-slate-800 tracking-tighter"
                    >
                        Cognitive <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600">Archive</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-xl font-medium italic opacity-80"
                    >
                        Deconstruct your day. Document your evolution.
                    </motion.p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search memories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/60 backdrop-blur-xl border border-white/40 pl-16 pr-8 py-5 rounded-[2rem] text-sm font-bold placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-emerald-500/10 w-64 md:w-80 shadow-2xl shadow-indigo-900/5"
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsWriting(true)}
                        className="bg-slate-900 text-white px-10 py-5 rounded-[2.2rem] shadow-2xl shadow-slate-200 flex items-center gap-3 font-black transition-all hover:bg-slate-800"
                    >
                        <Plus size={24} />
                        <span className="text-sm tracking-widest uppercase">New Reflection</span>
                    </motion.button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Timeline: Cinematic Feed */}
                <div className="lg:col-span-8 space-y-10">
                    <AnimatePresence mode="wait">
                        {isWriting && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                                className="glass-card p-12 rounded-[4rem] space-y-10 relative overflow-hidden"
                            >
                                <div className="flex justify-between items-center relative z-10">
                                    <div className="flex items-center gap-5">
                                        <div className="bg-emerald-500 p-4 rounded-3xl text-white shadow-xl shadow-emerald-100">
                                            <PenTool size={28} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-1">Session Active</p>
                                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Writing Draft</h3>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsWriting(false)} className="p-4 bg-slate-50 text-slate-300 hover:text-red-500 rounded-2xl transition-all"><X size={28} /></button>
                                </div>

                                <div className="space-y-6">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">How are you feeling right now?</p>
                                    <div className="flex flex-wrap gap-3">
                                        {moodOptions.map(m => (
                                            <button
                                                key={m.label}
                                                onClick={() => setMood(m.label)}
                                                className={`px-6 py-3 rounded-2xl flex items-center gap-3 transition-all border-2 ${mood === m.label ? `${m.color} text-white border-transparent shadow-lg scale-105` : 'bg-white text-slate-400 border-slate-50 hover:border-emerald-100'}`}
                                            >
                                                <span className="text-xl">{m.emoji}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-50/50 p-10 rounded-[3rem] border border-white relative group">
                                    <div className="absolute top-8 right-8 flex gap-3 items-center">
                                        {lastSaved && <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">Auto-saved at {lastSaved}</span>}
                                        <button
                                            onClick={() => setShowAIPreview(true)}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 flex items-center gap-2 hover:bg-slate-900 transition-all"
                                        >
                                            <Sparkles size={14} /> AI Preview
                                        </button>
                                    </div>
                                    <textarea
                                        className="w-full h-80 bg-transparent outline-none text-2xl leading-relaxed text-slate-700 font-medium italic placeholder:text-slate-200 resize-none"
                                        placeholder={prompts[activePrompt]}
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="space-y-6 mt-6 pt-6 border-t border-slate-100">
                                        <div className="flex flex-wrap gap-2">
                                            {['Deep Reflection', 'Daily Log', 'Gratitude', 'Academic Stress', 'Focus Session'].map(tag => (
                                                <button
                                                    key={tag}
                                                    onClick={() => toggleTag(tag)}
                                                    className={`text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl border transition-all ${selectedTags.includes(tag) ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white text-slate-400 border-slate-100 hover:border-emerald-200 hover:text-emerald-600'}`}
                                                >
                                                    #{tag}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="flex justify-between items-center bg-white/50 p-6 rounded-[2rem] border border-white">
                                            <div className="flex-1 space-y-2">
                                                <div className="flex justify-between items-end mr-6">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{content.split(/\s+/).filter(w => w).length} Words</span>
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{content.length} / 2000 Characters</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 rounded-full mr-6 overflow-hidden">
                                                    <motion.div
                                                        animate={{ width: `${Math.min(100, (content.length / 2000) * 100)}%` }}
                                                        className="h-full bg-indigo-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() => setActivePrompt((activePrompt + 1) % prompts.length)}
                                        className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 hover:translate-x-2 transition-transform"
                                    >
                                        <Sparkles size={16} />
                                        Try Another Prompt
                                    </button>
                                    <button
                                        onClick={() => handleSave()}
                                        disabled={loading || !content.trim()}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-emerald-200 transition-all disabled:opacity-50 active:scale-95 flex items-center gap-3"
                                    >
                                        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Lock size={18} />}
                                        {loading ? 'Synthesizing...' : 'Finalize & Sync'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {filteredEntries.length === 0 && !isWriting ? (
                        <div className="glass-card p-24 rounded-[4rem] text-center bg-white/40 backdrop-blur-3xl border border-white">
                            <motion.div
                                animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 6 }}
                                className="bg-gradient-to-br from-emerald-100 to-indigo-100 w-32 h-32 rounded-[3.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-indigo-900/5"
                            >
                                <Quote className="text-emerald-600" size={56} fill="white" />
                            </motion.div>
                            <h3 className="text-4xl font-black text-slate-800 mb-4 tracking-tighter leading-tight">Your silence has been <br />beautifully documented.</h3>
                            <p className="text-slate-400 text-xl font-medium italic mb-12 max-w-sm mx-auto opacity-70">"The unexamined life is not worth living." - Socrates</p>
                            <button onClick={() => setIsWriting(true)} className="px-12 py-5 bg-white text-emerald-600 border border-emerald-100 rounded-[2rem] font-black uppercase text-sm tracking-widest hover:bg-emerald-50 transition-all">Begin Examination</button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {filteredEntries.map((entry, idx) => (
                                <motion.div
                                    key={entry.id}
                                    layoutId={entry.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                                    onClick={() => setSelectedEntry(entry)}
                                    className="glass-card p-10 rounded-[3.5rem] bg-white group cursor-pointer border-2 border-transparent hover:border-emerald-100 transition-all"
                                >
                                    <div className="flex items-start gap-10">
                                        <div className="hidden md:flex flex-col items-center gap-2 pt-1 border-r border-slate-50 pr-8">
                                            <span className="text-3xl font-black text-slate-800 leading-none">
                                                {new Date(entry.created_at).getDate()}
                                            </span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                {new Date(entry.created_at).toLocaleDateString(undefined, { month: 'short' })}
                                            </span>
                                        </div>
                                        <div className="flex-1 space-y-6">
                                            <div className="flex flex-wrap gap-4">
                                                <span className={`text-[10px] font-black tracking-[0.2em] px-5 py-2 rounded-full uppercase ${entry.mood === 'POSITIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                                    {entry.mood || 'Analytical'}
                                                </span>
                                                <span className="text-[10px] font-black tracking-[0.2em] px-5 py-2 rounded-full uppercase bg-indigo-50 text-indigo-600">
                                                    {entry.emotion || 'Serene'}
                                                </span>
                                            </div>
                                            <p className="text-slate-600 text-2xl leading-[1.6] line-clamp-2 font-medium italic opacity-90 group-hover:opacity-100 transition-opacity">
                                                "{entry.content}"
                                            </p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-3xl text-slate-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:rotate-12 transition-all">
                                            <ChevronRight size={32} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar: Curated Insights */}
                <div className="lg:col-span-4 space-y-12">
                    <div className="glass-card p-12 rounded-[4rem] bg-white shadow-2xl shadow-indigo-900/5">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-4">
                                <Calendar size={28} className="text-emerald-500" />
                                Rhythm
                            </h2>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        </div>
                        <div className="grid grid-cols-7 gap-3 text-center mb-8">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <span key={d} className="text-[10px] font-black text-slate-300 uppercase">{d}</span>)}
                            {Array.from({ length: 31 }).map((_, i) => (
                                <div key={i} className={`aspect-square rounded-2xl flex items-center justify-center text-xs font-black transition-all cursor-help ${i + 1 === new Date().getDate() ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-200 ring-8 ring-emerald-50' : 'hover:bg-slate-50 text-slate-400'}`}>
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-12 rounded-[4rem] bg-slate-900 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                            <PieChart size={140} fill="white" />
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-2xl font-black mb-10 flex items-center gap-4 tracking-tight">
                                <Sparkles size={28} className="text-emerald-400" />
                                Cognition
                            </h2>
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-400">
                                        <span>Consistency</span>
                                        <span className="text-emerald-400">Stable</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div animate={{ width: '92%' }} className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-400">
                                        <span>Emotional Range</span>
                                        <span className="text-indigo-400">Expansive</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div animate={{ width: '74%' }} className="h-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
                                    </div>
                                </div>
                            </div>
                            <p className="mt-12 text-slate-400 text-sm font-medium leading-relaxed italic border-l-2 border-emerald-500/30 pl-6">
                                "Your entries show a marked increase in 'Focus' terminology. Analytical depth is rising."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Insight Preview Modal */}
            <AnimatePresence>
                {showAIPreview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[120] flex items-center justify-center p-8 bg-slate-900/60 backdrop-blur-2xl"
                    >
                        <div className="absolute inset-0" onClick={() => setShowAIPreview(false)} />
                        <motion.div
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 30 }}
                            className="bg-white w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-emerald-500" />
                            <div className="flex items-center gap-4 mb-8">
                                <div className="bg-indigo-100 p-4 rounded-2xl text-indigo-600">
                                    <Sparkles size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">AI Insight Preview</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time cognitive analysis</p>
                                </div>
                            </div>

                            {content.length < 10 ? (
                                <div className="text-center py-10 space-y-4">
                                    <p className="text-slate-400 font-medium italic">Write a bit more to unlock deeper insights.</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Detected Mood</p>
                                            <p className="font-black text-slate-800 text-lg uppercase tracking-tight">{aiInsight?.mood}</p>
                                        </div>
                                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Focus Score</p>
                                            <p className="font-black text-slate-800 text-lg uppercase tracking-tight">{aiInsight?.focus}</p>
                                        </div>
                                    </div>
                                    <div className="p-8 bg-indigo-50 rounded-3xl border border-indigo-100 italic font-medium text-slate-600 leading-relaxed relative">
                                        <div className="absolute -top-4 -left-2 bg-white p-2 rounded-lg shadow-sm border border-indigo-50">
                                            <Quote size={12} className="text-indigo-400" />
                                        </div>
                                        "{aiInsight?.recommendation}"
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => setShowAIPreview(false)}
                                className="w-full mt-10 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-indigo-100"
                            >
                                Continue Writing
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cinematic Entry Modal */}
            <AnimatePresence>
                {selectedEntry && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/60 backdrop-blur-2xl"
                    >
                        <div className="absolute inset-0 cursor-zoom-out" onClick={() => setSelectedEntry(null)} />
                        <motion.div
                            initial={{ scale: 0.9, y: 50, rotateX: 20 }}
                            animate={{ scale: 1, y: 0, rotateX: 0 }}
                            exit={{ scale: 0.9, y: 50, rotateX: 20 }}
                            className="bg-white w-full max-w-5xl rounded-[5rem] relative shadow-[0_100px_100px_-50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row h-[85vh]"
                        >
                            {/* Visual/Mood Side */}
                            <div className={`md:w-1/3 p-16 flex flex-col justify-between text-white relative ${selectedEntry.mood === 'POSITIVE' ? 'bg-gradient-to-br from-emerald-600 to-teal-800' : 'bg-gradient-to-br from-slate-700 to-indigo-950'}`}>
                                <div className="space-y-10 group">
                                    <div className="w-20 h-20 bg-white/10 backdrop-blur-3xl rounded-[2rem] flex items-center justify-center group-hover:rotate-[360deg] transition-transform duration-1000">
                                        <Quote size={40} />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-black uppercase tracking-[0.3em] opacity-60 mb-3">Temporal Tag</p>
                                        <h2 className="text-4xl font-black tracking-tighter leading-none mb-4">
                                            {new Date(selectedEntry.created_at).toLocaleDateString(undefined, { weekday: 'long' })}
                                        </h2>
                                        <p className="text-lg font-black opacity-80 uppercase tracking-widest leading-none">
                                            {new Date(selectedEntry.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-12">
                                    <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem]">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-10 h-10 bg-emerald-400 rounded-full flex items-center justify-center text-emerald-900 font-bold text-xs shadow-xl shadow-emerald-400/20">A+</div>
                                            <p className="text-xs font-black uppercase tracking-widest">Linguistic Scoring</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">Emotion</p>
                                                <p className="font-black text-xl tracking-tight">{selectedEntry.emotion || 'Stoic'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">Stress</p>
                                                <p className="font-black text-xl tracking-tight">Low</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(selectedEntry.id)}
                                        className="w-full py-5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all border border-red-500/20 shadow-xl shadow-red-900/10"
                                    >
                                        Expunge Record
                                    </button>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="flex-1 p-20 flex flex-col h-full bg-slate-50 relative">
                                <button
                                    onClick={() => setSelectedEntry(null)}
                                    className="absolute top-12 right-12 p-5 bg-white text-slate-400 hover:text-slate-900 hover:shadow-2xl hover:shadow-slate-200 rounded-[2rem] transition-all"
                                >
                                    <X size={32} />
                                </button>

                                <div className="flex-1 overflow-y-auto no-scrollbar pt-10">
                                    <div className="relative">
                                        <Quote className="absolute -top-16 -left-16 text-slate-100" size={120} />
                                        <p className="text-4xl text-slate-700 font-medium leading-[1.7] italic relative z-10">
                                            "{selectedEntry.content}"
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-20 border-t border-slate-200 mt-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="flex -space-x-4">
                                                {Array.from({ length: 3 }).map((_, i) => (
                                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 animate-pulse" />
                                                ))}
                                            </div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Cross-correlated with 3 sessions</p>
                                        </div>
                                        <button className="flex items-center gap-3 px-10 py-5 bg-white border border-slate-200 rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white hover:border-emerald-400 transition-all shadow-xl group">
                                            Share Reflection
                                            <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Journal;

