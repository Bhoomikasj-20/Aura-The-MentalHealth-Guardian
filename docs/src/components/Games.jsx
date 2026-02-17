import React, { useState, useEffect, useCallback } from 'react';
import {
    Leaf, Award, Zap, Heart, Trash2, Hammer, Sparkles,
    ChevronRight, Flower2, Bomb, Target, RefreshCcw,
    Droplets, Sun, Wind, Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Particle = ({ x, y, color }) => (
    <motion.div
        initial={{ x, y, opacity: 1, scale: 1 }}
        animate={{
            x: x + (Math.random() - 0.5) * 200,
            y: y + (Math.random() - 0.5) * 200,
            opacity: 0,
            scale: 0
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute w-2 h-2 rounded-full pointer-events-none z-50"
        style={{ backgroundColor: color }}
    />
);

const Games = () => {
    const [activeGame, setActiveGame] = useState('bubble');
    const [stressLevel, setStressLevel] = useState(85);
    const [score, setScore] = useState(0);
    const [bubbles, setBubbles] = useState([]);
    const [breathingPhase, setBreathingPhase] = useState('Inhale');
    const [timer, setTimer] = useState(0);

    // Bubble Calm Logic
    useEffect(() => {
        if (activeGame !== 'bubble') return;
        const interval = setInterval(() => {
            if (bubbles.length < 15) {
                setBubbles(prev => [...prev, {
                    id: Date.now(),
                    x: Math.random() * 80 + 10,
                    y: 100,
                    size: Math.random() * 40 + 40,
                    color: ['#10b981', '#6366f1', '#f43f5e', '#f59e0b'][Math.floor(Math.random() * 4)]
                }]);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [activeGame, bubbles]);

    const popBubble = (id) => {
        setBubbles(prev => prev.filter(b => b.id !== id));
        setScore(prev => prev + 1);
        setStressLevel(prev => Math.max(10, prev - 1));
        // Soft pop sound effect could be added here if allowed
    };

    // Breathing Logic (4-7-8)
    useEffect(() => {
        if (activeGame !== 'breathing') return;
        let t = 0;
        const interval = setInterval(() => {
            t = (t + 1) % 19;
            if (t < 4) setBreathingPhase('Inhale');
            else if (t < 11) setBreathingPhase('Hold');
            else setBreathingPhase('Exhale');
            setTimer(t);
        }, 1000);
        return () => clearInterval(interval);
    }, [activeGame]);

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20 relative min-h-[800px]">
            <div className="text-center space-y-4">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-5xl font-black text-slate-800 tracking-tighter mb-2">Roots & Release</h1>
                    <p className="text-slate-500 text-lg font-medium italic opacity-80">Interactive sanctuaries for your mental equilibrium.</p>
                </motion.div>
            </div>

            <div className="flex justify-center flex-wrap gap-3">
                <div className="bg-white/40 backdrop-blur-xl p-2 rounded-[2.5rem] border border-white/20 flex flex-wrap space-x-3 shadow-2xl shadow-emerald-900/5">
                    {[
                        { id: 'bubble', label: 'Bubble Calm', icon: <Droplets size={20} /> },
                        { id: 'breathing', label: 'Breathing Orb', icon: <Wind size={20} /> },
                        { id: 'focus', label: 'Focus Tap', icon: <Target size={20} /> }
                    ].map(game => (
                        <button
                            key={game.id}
                            onClick={() => { setActiveGame(game.id); setScore(0); }}
                            className={`px-8 py-4 rounded-[2rem] text-sm font-black transition-all uppercase tracking-widest flex items-center space-x-3 ${activeGame === game.id ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-200' : 'text-slate-400 hover:text-emerald-500 hover:bg-white'}`}
                        >
                            {game.icon}
                            <span>{game.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 h-[600px] glass-card rounded-[4rem] relative overflow-hidden bg-white/30 backdrop-blur-md border border-white shadow-2xl">
                    <AnimatePresence mode="wait">
                        {activeGame === 'bubble' && (
                            <motion.div key="bubble" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                                {bubbles.map(b => (
                                    <motion.div
                                        key={b.id}
                                        initial={{ y: '110%', x: `${b.x}%`, scale: 0.5, opacity: 0 }}
                                        animate={{ y: '-20%', opacity: 1, scale: 1 }}
                                        transition={{ duration: 10, ease: "linear" }}
                                        onClick={() => popBubble(b.id)}
                                        className="absolute rounded-full cursor-pointer flex items-center justify-center shadow-lg backdrop-blur-sm border-2 border-white/30"
                                        style={{ width: b.size, height: b.size, backgroundColor: `${b.color}44` }}
                                    >
                                        <div className="w-1/3 h-1/3 bg-white/40 rounded-full blur-sm -mt-2 -ml-2" />
                                    </motion.div>
                                ))}
                                <div className="absolute top-8 left-8">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Bubbles Popped</p>
                                    <p className="text-4xl font-black text-slate-800">{score}</p>
                                </div>
                            </motion.div>
                        )}

                        {activeGame === 'breathing' && (
                            <motion.div key="breathing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center space-y-12">
                                <div className="relative">
                                    <motion.div
                                        animate={{
                                            scale: breathingPhase === 'Inhale' ? 1.8 : breathingPhase === 'Hold' ? 1.8 : 1,
                                            backgroundColor: breathingPhase === 'Inhale' ? '#10b981' : breathingPhase === 'Hold' ? '#6366f1' : '#f43f5e'
                                        }}
                                        transition={{ duration: breathingPhase === 'Inhale' ? 4 : breathingPhase === 'Hold' ? 7 : 8, ease: "easeInOut" }}
                                        className="w-48 h-48 rounded-full shadow-[0_0_60px_rgba(0,0,0,0.1)] flex items-center justify-center border-8 border-white"
                                    >
                                        <span className="text-white font-black uppercase tracking-widest">{breathingPhase}</span>
                                    </motion.div>
                                    <div className="absolute -inset-12 border border-dashed border-slate-200 rounded-full -z-10 animate-spin-slow" />
                                </div>
                                <div className="text-center space-y-2">
                                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">4-7-8 Cycle</h3>
                                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Standard Stress Neutralization</p>
                                </div>
                            </motion.div>
                        )}

                        {activeGame === 'focus' && (
                            <motion.div key="focus" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center">
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => { setScore(s => s + 1); setStressLevel(l => Math.max(10, l - 0.5)); }}
                                    className="w-64 h-64 bg-slate-900 rounded-[4rem] text-white flex flex-col items-center justify-center gap-4 shadow-2xl group transition-all"
                                >
                                    <Target size={64} className="group-hover:rotate-12 transition-transform" />
                                    <span className="font-black text-xs uppercase tracking-[0.3em]">Synch Tap</span>
                                    <p className="text-4xl font-black">{score}</p>
                                </motion.button>
                                <p className="mt-8 text-slate-500 font-medium italic">Tap in rhythm with your breath.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="space-y-8">
                    <div className="glass-card p-10 rounded-[3.5rem] bg-white border border-white text-center space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-end px-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stress Level</span>
                                <span className="text-2xl font-black text-rose-500">{Math.round(stressLevel)}%</span>
                            </div>
                            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-1">
                                <motion.div
                                    animate={{ width: `${stressLevel}%`, backgroundColor: stressLevel > 60 ? '#f43f5e' : stressLevel > 30 ? '#f59e0b' : '#10b981' }}
                                    className="h-full rounded-full"
                                />
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-3xl">
                            <p className="text-xs text-slate-500 font-bold italic">
                                "Micro-interactions help reset cognitive load during intense focus."
                            </p>
                        </div>
                    </div>

                    <div className="glass-card p-10 rounded-[3.5rem] bg-slate-900 text-white border-none flex flex-col items-center justify-center gap-4">
                        <Award size={48} className="text-yellow-400" />
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resilience Streak</p>
                            <p className="text-3xl font-black">12 Days</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Games;

