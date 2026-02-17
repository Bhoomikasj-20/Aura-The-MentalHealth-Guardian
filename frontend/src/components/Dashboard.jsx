import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import {
    Activity, Thermometer, Moon, Zap, Sparkles, TrendingUp,
    Calendar, Clock, LayoutDashboard, Target, Flame, ChevronRight,
    ArrowUpRight, Brain, Coffee, Sun, Wind
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const StatCard = ({ label, value, icon: Icon, color, delay, onClick }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        whileHover={{ y: -8, scale: 1.02 }}
        onClick={onClick}
        className="glass-card p-8 rounded-[3rem] relative overflow-hidden group cursor-pointer"
    >
        <div className={`absolute -right-6 -bottom-6 w-32 h-32 bg-${color}-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />

        <div className="flex flex-col h-full justify-between gap-6 relative z-10">
            <div className={`w-14 h-14 bg-${color}-500/10 rounded-2xl flex items-center justify-center text-${color}-600`}>
                <Icon size={28} />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
                <div className="flex items-end gap-2">
                    <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{value}</h3>
                    <div className="flex items-center text-emerald-500 font-bold text-[10px] pb-1">
                        <ArrowUpRight size={12} />
                        <span>High</span>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
);

const FALLBACK_DATA = {
    streaks: { daily: 12, journal: 8, exercise: 5 },
    mood_distribution: { 'calm': 5, 'joy': 3, 'focus': 2 },
    stress_trends: [
        { date: 'Mon', stress: 45 },
        { date: 'Tue', stress: 52 },
        { date: 'Wed', stress: 38 },
        { date: 'Thu', stress: 65 },
        { date: 'Fri', stress: 48 },
        { date: 'Sat', stress: 35 },
        { date: 'Sun', stress: 42 }
    ]
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [greeting, setGreeting] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        const fetchData = async () => {
            try {
                // Try 8001 first (common for this project setup)
                const res = await axios.get('http://localhost:8001/stats');
                setData(res.data);
            } catch (err) {
                console.error("Dashboard fetch error (8001):", err);
                try {
                    const res = await axios.get('http://localhost:8000/stats');
                    setData(res.data);
                } catch (err2) {
                    console.error("Dashboard fetch error (8000):", err2);
                    setData(FALLBACK_DATA);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[70vh] gap-8">
            <div className="relative">
                <div className="w-24 h-24 border-b-4 border-emerald-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="text-emerald-500 animate-pulse" size={32} />
                </div>
            </div>
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Syncing Your Aura</h2>
                <p className="text-slate-400 font-medium italic">Constructing your mental sanctuary...</p>
            </div>
        </div>
    );

    const safeData = data || FALLBACK_DATA;


    const moodData = Object.entries(safeData.mood_distribution).map(([name, value]) => ({ name: name || 'neutral', value }));
    const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#ec4899'];

    return (
        <div className="space-y-12 pb-24">
            {/* Top Bar: Hero Branding */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                <div className="space-y-2">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 text-emerald-600 mb-4"
                    >
                        <LayoutDashboard size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Guardian Control</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl font-black text-slate-800 tracking-tighter leading-none"
                    >
                        {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600">Scholar</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-xl font-medium italic opacity-80"
                    >
                        Your cognitive load is currently <span className="text-emerald-600 font-bold not-italic">Balanced</span>.
                    </motion.p>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="glass-card !bg-white/80 p-5 rounded-3xl border-emerald-100 flex items-center gap-4">
                        <div className="bg-amber-100 p-3 rounded-2xl text-amber-600"><Flame size={24} /></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Streak</p>
                            <p className="text-lg font-black text-slate-800">12 Days Active</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions / Featured Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <StatCard label="Stress Amplitude" value="Minimal" icon={Thermometer} color="emerald" delay={0.1} onClick={() => navigate('/counselors')} />
                <StatCard label="Cognitive Flow" value="4.8 hrs" icon={Activity} color="indigo" delay={0.2} onClick={() => navigate('/exercises')} />
                <StatCard label="Circadian Health" value="Stable" icon={Moon} color="blue" delay={0.3} />
                <StatCard label="Resilience Score" value="92/100" icon={Brain} color="amber" delay={0.4} onClick={() => navigate('/games')} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Main Activity Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="xl:col-span-2 glass-card p-12 rounded-[4rem] bg-white relative overflow-hidden"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                                <TrendingUp className="text-emerald-500" />
                                Mindfulness Equilibrium
                            </h2>
                            <p className="text-slate-400 font-medium text-sm">Real-time stress analysis across multiple study nodes.</p>
                        </div>
                        <div className="flex gap-3 bg-slate-50 p-2 rounded-2xl">
                            <button className="px-5 py-2.5 bg-white text-slate-800 text-xs font-black rounded-xl shadow-sm border border-slate-100 uppercase tracking-widest">7 Days</button>
                            <button className="px-5 py-2.5 text-slate-400 text-xs font-black rounded-xl hover:bg-white transition-all uppercase tracking-widest">30 Days</button>
                        </div>
                    </div>

                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={safeData.stress_trends}>
                                <defs>
                                    <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                    dy={15}
                                />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '24px',
                                        border: 'none',
                                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)',
                                        padding: '16px'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="stress"
                                    stroke="#10b981"
                                    strokeWidth={5}
                                    fillOpacity={1}
                                    fill="url(#colorWave)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Emotional Distribution */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-12 rounded-[4rem] bg-white flex flex-col items-center border-none shadow-2xl shadow-indigo-900/5"
                >
                    <div className="w-full mb-10 text-center">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Emotional Resonance</h2>
                        <p className="text-xs text-slate-400 uppercase font-black tracking-widest font-mono">Dominant Mood Partitioning</p>
                    </div>

                    <div className="h-64 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={moodData.length > 0 ? moodData : [{ name: 'none', value: 1 }]}
                                    innerRadius={75}
                                    outerRadius={105}
                                    paddingAngle={10}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {moodData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={12} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <Sparkles className="text-indigo-400 mx-auto mb-1 animate-pulse" size={20} />
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Aura Core</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full space-y-4 mt-12 bg-slate-50/50 p-8 rounded-[3rem]">
                        {moodData.map((m, i) => (
                            <div key={m.name} className="flex items-center justify-between group cursor-help transition-all hover:translate-x-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full ring-4 ring-white" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="text-xs font-black text-slate-600 capitalize tracking-tight">{m.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(m.value / 10) * 100}%` }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: COLORS[i % COLORS.length] }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400">{m.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* AI Actionable Insights */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-16 rounded-[4.5rem] bg-slate-900 border-none relative overflow-hidden group shadow-[0_45px_90px_-20px_rgba(0,0,0,0.4)]"
            >
                {/* Background Blobs for SaaS feel */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:bg-emerald-500/20 transition-all duration-1000" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -ml-48 -mb-48" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">
                    <div className="lg:col-span-3 space-y-10">
                        <div className="inline-flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 px-5 py-2.5 rounded-2xl text-emerald-400">
                            <Brain size={20} />
                            <span className="text-[11px] font-black uppercase tracking-[0.3em]">Cognitive Intelligence Reports</span>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-5xl font-black text-white tracking-tighter leading-[1.1]">
                                Optimized study patterns detected for <span className="text-emerald-400 italic">Analytical Chemistry</span>.
                            </h2>
                            <p className="text-slate-400 text-xl font-medium leading-relaxed italic opacity-80 max-w-2xl">
                                "Your focus sessions are 24% more efficient between 9 AM and 11 AM.
                                We've correlated this with your 'Nurture' game activity. Maintaining this morning ritual can prevent burnout this week."
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-6 pt-6">
                            <button
                                onClick={() => navigate('/exercises')}
                                className="bg-emerald-500 text-white px-10 py-5 rounded-[2rem] font-black text-sm tracking-widest uppercase hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-900/20 active:scale-95 flex items-center gap-3"
                            >
                                <span>Initiate Flow Ritual</span>
                                <ChevronRight size={18} />
                            </button>
                            <button
                                onClick={() => window.location.href = '#'}
                                className="bg-white/5 text-white border border-white/10 px-10 py-5 rounded-[2rem] font-black text-sm tracking-widest uppercase hover:bg-white/10 transition-all"
                            >
                                View Full Report
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-2 grid grid-cols-1 gap-6">
                        {[
                            { title: 'Morning Hydration', icon: Coffee, desc: 'Correlated with 15% better focus' },
                            { title: 'Screen Hiatus', icon: Sun, desc: 'Recommended every 45 mins' },
                            { title: 'Focus Breath', icon: Wind, desc: 'Reduces cortisol by 12%' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ x: -10 }}
                                className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] flex items-center gap-6 group hover:border-emerald-500/40 transition-all"
                            >
                                <div className="bg-white/5 p-4 rounded-2xl text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                    <item.icon size={28} />
                                </div>
                                <div>
                                    <h4 className="font-black text-white tracking-tight">{item.title}</h4>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;

