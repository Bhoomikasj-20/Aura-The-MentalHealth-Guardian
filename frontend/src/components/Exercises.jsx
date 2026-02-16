import React, { useState, useEffect, useRef } from 'react';
import {
    Play, Pause, RotateCcw, Wind, Headphones, Music,
    Volume2, Sparkles, ChevronRight, SkipBack, SkipForward,
    Heart, ListMusic, Waves, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Exercises = () => {
    const [activeTab, setActiveTab] = useState('breathing');
    const [breathState, setBreathState] = useState('Ready'); // Inhale, Hold, Exhale, Reset
    const [timer, setTimer] = useState(0);
    const [isBreathActive, setIsBreathActive] = useState(false);
    const [cycle, setCycle] = useState(0);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(0);
    const [audioProgress, setAudioProgress] = useState(0);
    const audioRef = useRef(null);

    const tracks = [
        { title: 'Alpha Waves (Deep Study)', length: '45:00', tag: 'Concentration', youtubeId: 'WPni755-Krg' },
        { title: 'Forest Rain (Theta)', length: '20:30', tag: 'Deep Sleep', youtubeId: 'mPZkdNFkNps' },
        { title: 'Tibetan Bowls (432Hz)', length: '15:00', tag: 'Meditation', youtubeId: 'zM30m_kI578' },
        { title: 'Celestial Focus', length: '60:00', tag: 'Focus', youtubeId: 'vPhg6sc1Mk4' },
        { title: 'Soft Piano (Studying)', length: '60:00', tag: 'Study', youtubeId: 'M_yo73_S8rE' }
    ];

    // Breathing Logic
    useEffect(() => {
        let interval = null;
        if (isBreathActive) {
            interval = setInterval(() => {
                setTimer(t => t + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isBreathActive]);

    useEffect(() => {
        if (!isBreathActive) return;

        const cycleTime = timer % 16;
        if (cycleTime < 4) setBreathState('Inhale');
        else if (cycleTime < 8) setBreathState('Hold');
        else if (cycleTime < 12) setBreathState('Exhale');
        else setBreathState('Reset');

        if (cycleTime === 0 && timer > 0) setCycle(c => c + 1);
    }, [timer, isBreathActive]);

    const resetBreathing = () => {
        setIsBreathActive(false);
        setTimer(0);
        setCycle(0);
        setBreathState('Ready');
    };

    // YouTube Player Logic
    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const nextTrack = () => {
        setCurrentTrack((prev) => (prev + 1) % tracks.length);
        setIsPlaying(true);
    };

    const prevTrack = () => {
        setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
        setIsPlaying(true);
    };

    const handleTrackEnd = () => {
        nextTrack();
    };

    useEffect(() => {
        if (isPlaying) {
            let interval = setInterval(() => {
                setAudioProgress(prev => (prev + 0.1) % 100);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isPlaying]);

    useEffect(() => {
        if (isPlaying && audioRef.current) {
            audioRef.current.play();
        }
    }, [currentTrack]);

    const updateProgress = () => {
        // Handled by interval for youtube mock progress
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20 relative">
            {isPlaying && (
                <iframe
                    width="0"
                    height="0"
                    src={`https://www.youtube.com/embed/${tracks[currentTrack].youtubeId}?autoplay=1&enablejsapi=1`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="hidden"
                ></iframe>
            )}

            <div className="text-center space-y-6">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-5xl font-black text-slate-800 tracking-tighter mb-2">Sonic Sanctuary</h1>
                    <p className="text-slate-500 text-lg font-medium italic opacity-80">Sync your physiology with guided atmospheric resonance.</p>
                </motion.div>
            </div>

            <div className="flex justify-center">
                <div className="bg-white/40 backdrop-blur-xl p-2 rounded-[2.5rem] border border-white/20 flex space-x-3 shadow-2xl shadow-indigo-900/5">
                    <button
                        onClick={() => setActiveTab('breathing')}
                        className={`px-10 py-4 rounded-[2rem] text-sm font-black transition-all uppercase tracking-widest flex items-center space-x-3 ${activeTab === 'breathing' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-200' : 'text-slate-400 hover:text-emerald-500 hover:bg-white'}`}
                    >
                        <Wind size={20} />
                        <span>Respiration</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('audio')}
                        className={`px-10 py-4 rounded-[2rem] text-sm font-black transition-all uppercase tracking-widest flex items-center space-x-3 ${activeTab === 'audio' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'text-slate-400 hover:text-indigo-600 hover:bg-white'}`}
                    >
                        <Music size={20} />
                        <span>Atmospheres</span>
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'breathing' ? (
                    <motion.div
                        key="breathing"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-card p-16 rounded-[4rem] flex flex-col items-center justify-center space-y-16"
                    >
                        <div className="relative">
                            {/* Visualizer Circle */}
                            <motion.div
                                animate={{
                                    scale: breathState === 'Inhale' ? 1.4 : breathState === 'Hold' ? 1.4 : 1,
                                    backgroundColor: breathState === 'Inhale' ? '#10b981' : breathState === 'Hold' ? '#34d399' : '#f8fafc'
                                }}
                                transition={{ duration: 4, ease: "easeInOut" }}
                                className="w-80 h-80 rounded-[4rem] flex items-center justify-center relative shadow-2xl overflow-hidden border-8 border-white group"
                            >
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent animate-pulse" />
                                </div>
                                <div className="text-center z-10">
                                    <motion.p
                                        key={breathState}
                                        initial={{ opacity: 0.2, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`text-5xl font-black ${breathState === 'Inhale' || breathState === 'Hold' ? 'text-white' : 'text-emerald-600'}`}
                                    >
                                        {breathState}
                                    </motion.p>
                                    <div className="flex items-center justify-center gap-2 mt-4">
                                        <Waves size={16} className={breathState === 'Inhale' || breathState === 'Hold' ? 'text-emerald-100' : 'text-emerald-300'} />
                                        <p className={`text-[11px] font-black uppercase tracking-[0.2em] ${breathState === 'Inhale' || breathState === 'Hold' ? 'text-emerald-100' : 'text-emerald-300'}`}>Cycle {cycle}</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Progress Ring */}
                            <svg className="absolute -top-6 -left-6 w-[21rem] h-[21rem] -rotate-90 pointer-events-none opacity-20 group-hover:opacity-100 transition-opacity duration-1000">
                                <circle cx="168" cy="168" r="160" fill="transparent" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="1005" />
                                <motion.circle
                                    cx="168" cy="168" r="160"
                                    fill="transparent"
                                    stroke="#10b981"
                                    strokeWidth="6"
                                    strokeDasharray="1005"
                                    strokeDashoffset={1005 - (1005 * (timer % 16) / 16)}
                                    className="transition-all"
                                />
                            </svg>
                        </div>

                        <div className="flex items-center gap-12">
                            <motion.button
                                whileHover={{ rotate: -180, scale: 1.1 }}
                                onClick={resetBreathing}
                                className="p-6 bg-slate-50 text-slate-400 rounded-3xl hover:bg-white hover:shadow-xl transition-all border border-slate-100"
                            >
                                <RotateCcw size={28} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsBreathActive(!isBreathActive)}
                                className={`p-10 rounded-[3rem] shadow-2xl transition-all flex items-center justify-center ${isBreathActive ? 'bg-slate-900 text-white shadow-slate-200' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-200'}`}
                            >
                                {isBreathActive ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" className="ml-2" />}
                            </motion.button>
                            <div className="p-6 bg-emerald-50 text-emerald-600 rounded-3xl border border-emerald-100 shadow-inner">
                                <Activity size={28} />
                            </div>
                        </div>

                        <div className="max-w-md w-full bg-slate-50/50 p-10 rounded-[3rem] border border-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5"><Sparkles size={80} /></div>
                            <h3 className="font-black text-slate-800 text-2xl mb-3 tracking-tight">Box Breathing</h3>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium italic opacity-80">
                                The Navy SEAL technique for immediate anxiety suppression. <br />
                                <span className="text-emerald-600 font-bold not-italic">4s Inhale • 4s Hold • 4s Exhale • 4s Reset</span>
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="audio"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        className="grid grid-cols-1 lg:grid-cols-5 gap-10"
                    >
                        <div className="lg:col-span-3 space-y-8">
                            <div className="glass-card p-12 rounded-[4rem] relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-slate-100/20">
                                    <motion.div className="h-full bg-indigo-500" style={{ width: `${audioProgress}%` }} />
                                </div>
                                <div className="flex items-center justify-between mb-16 px-2">
                                    <div className="flex items-center gap-5">
                                        <div className="bg-indigo-600 p-4 rounded-3xl text-white shadow-xl shadow-indigo-100 group-hover:rotate-12 transition-transform duration-700">
                                            <Headphones size={32} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Now Resonating</p>
                                            <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{tracks[currentTrack].title}</h3>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                                        <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Lossless Buffer</span>
                                    </div>
                                </div>

                                {/* Animated Visualizer */}
                                <div className="h-32 flex items-center justify-center gap-1.5 mb-16">
                                    {Array.from({ length: 40 }).map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{
                                                height: isPlaying ? [20, Math.random() * 80 + 20, 20] : 10,
                                                opacity: isPlaying ? [0.3, 1, 0.3] : 0.1
                                            }}
                                            transition={{ repeat: Infinity, duration: 1 + Math.random(), ease: "easeInOut" }}
                                            className="w-1.5 bg-gradient-to-t from-indigo-500 to-emerald-400 rounded-full"
                                        />
                                    ))}
                                </div>

                                <div className="flex flex-col items-center gap-10">
                                    <div className="flex items-center gap-8">
                                        <button onClick={prevTrack} className="p-4 text-slate-400 hover:text-indigo-600 transition-colors"><SkipBack size={28} fill="currentColor" /></button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={togglePlay}
                                            className="w-24 h-24 bg-indigo-600 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-200 active:bg-indigo-700 transition-colors"
                                        >
                                            {isPlaying ? <Pause size={36} fill="white" /> : <Play size={36} fill="white" className="ml-1" />}
                                        </motion.button>
                                        <button onClick={nextTrack} className="p-4 text-slate-400 hover:text-indigo-600 transition-colors"><SkipForward size={28} fill="currentColor" /></button>
                                    </div>
                                    <div className="flex items-center gap-6 w-full max-w-sm">
                                        <Volume2 size={20} className="text-slate-300" />
                                        <div className="flex-1 h-2 bg-slate-100 rounded-full relative overflow-hidden">
                                            <div className="absolute h-full bg-indigo-200" style={{ width: '70%' }} />
                                            <div className="absolute right-0 top-0 h-full w-2 bg-indigo-600 rounded-full" style={{ right: '30%' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="glass-card p-8 rounded-[3rem] bg-indigo-900 border-none text-white relative overflow-hidden group cursor-pointer hover:shadow-indigo-500/20 transition-all">
                                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-150 transition-transform duration-700"><Activity size={80} /></div>
                                    <h4 className="font-black text-lg mb-2">Sleep Hygiene</h4>
                                    <p className="text-xs text-indigo-300 font-bold italic opacity-80">Delta-wave landscapes for restorative rest.</p>
                                </div>
                                <div className="glass-card p-8 rounded-[3rem] bg-emerald-600 border-none text-white relative overflow-hidden group cursor-pointer hover:shadow-emerald-500/20 transition-all">
                                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-150 transition-transform duration-700"><Wind size={80} /></div>
                                    <h4 className="font-black text-lg mb-2">Alpha Focus</h4>
                                    <p className="text-xs text-emerald-200 font-bold italic opacity-80">Binaural beats for high-retention studying.</p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-8">
                            <div className="glass-card p-10 rounded-[3.5rem] bg-white">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center justify-between">
                                    <span>Atmospheric Palette</span>
                                    <ListMusic size={16} />
                                </h4>
                                <div className="space-y-4 max-h-[500px] overflow-y-auto no-scrollbar">
                                    {tracks.map((track, i) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ x: 10 }}
                                            onClick={() => {
                                                setCurrentTrack(i);
                                                setIsPlaying(true);
                                            }}
                                            className={`p-5 rounded-[2.5rem] transition-all cursor-pointer flex items-center justify-between group border-2 ${currentTrack === i ? 'bg-indigo-50 border-indigo-100 shadow-xl shadow-indigo-900/5' : 'bg-slate-50 border-transparent hover:bg-white hover:border-slate-100'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-2xl transition-all ${currentTrack === i ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 group-hover:bg-indigo-500 group-hover:text-white group-hover:rotate-6'}`}>
                                                    <Play size={16} fill="currentColor" />
                                                </div>
                                                <div>
                                                    <p className={`font-black text-sm tracking-tight ${currentTrack === i ? 'text-indigo-900' : 'text-slate-700'}`}>{track.title}</p>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${currentTrack === i ? 'text-indigo-400' : 'text-slate-400'}`}>{track.tag}</span>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400">{track.length}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-card p-10 rounded-[3.5rem] bg-gradient-to-br from-slate-800 to-slate-900 text-white border-none relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700"><Heart size={100} fill="white" /></div>
                                <h4 className="text-2xl font-black mb-4 tracking-tighter">Personal Vault</h4>
                                <p className="text-slate-400 text-sm font-bold italic mb-10 leading-relaxed opacity-80">Access your collection of liked frequencies and saved breathing cycles.</p>
                                <button
                                    onClick={() => window.open("https://open.spotify.com", "_blank")}
                                    className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-white py-5 rounded-[2rem] font-bold text-sm tracking-widest uppercase transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                                >
                                    Connect Spotify
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Exercises;

