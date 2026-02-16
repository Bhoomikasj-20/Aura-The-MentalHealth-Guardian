import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import {
    MessageSquare, Book, BarChart3, Wind, Leaf, Users, Shield,
    Flame, Target, Menu, X, LayoutDashboard, Compass, Settings,
    LogOut, HelpCircle, Heart, Bell, Activity, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Chat from './components/Chat';
import Journal from './components/Journal';
import Dashboard from './components/Dashboard';
import Exercises from './components/Exercises';
import Games from './components/Games';
import Counselors from './components/Counselors';

const NavItem = ({ to, icon: Icon, label, onClick }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            onClick={onClick}
            className={`flex items-center space-x-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group relative ${isActive
                ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-200/50'
                : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'
                }`}
        >
            <Icon size={20} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-3'}`} />
            <span className={`font-bold tracking-tight ${isActive ? 'text-white' : 'text-slate-600'}`}>{label}</span>
            {isActive && (
                <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-emerald-500 rounded-2xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
        </Link>
    );
};

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="flex min-h-screen relative">
            {/* Animated Background Layers */}
            <div className="aura-bg">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
            </div>

            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex flex-col w-80 h-screen sticky top-0 bg-white/40 backdrop-blur-3xl border-r border-white/20 p-10 z-40 overflow-y-auto no-scrollbar shadow-[20px_0_50px_rgba(0,0,0,0.02)]">
                <div className="flex items-center space-x-4 mb-16 px-2">
                    <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                        className="bg-slate-900 p-3 rounded-[1.4rem] shadow-2xl relative group"
                    >
                        <div className="absolute inset-0 bg-emerald-500 rounded-[1.4rem] blur-lg opacity-0 group-hover:opacity-40 transition-opacity" />
                        <Shield className="text-white relative z-10" size={28} />
                    </motion.div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tighter leading-none">Aura</h1>
                        <div className="flex items-center gap-1.5 mt-1.5">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            <p className="text-[9px] uppercase font-black text-emerald-600 tracking-[0.3em] opacity-80">Guardian Interface</p>
                        </div>
                    </div>
                </div>

                <div className="mb-12 px-2">
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.4em] mb-6 opacity-50">Strategic Center</p>
                    <nav className="space-y-3">
                        <NavItem to="/dashboard" icon={LayoutDashboard} label="Neural Overview" />
                        <NavItem to="/chat" icon={MessageSquare} label="Aura Intelligence" />
                        <NavItem to="/journal" icon={Book} label="Cognitive Journal" />
                    </nav>
                </div>

                <div className="mb-12 px-2">
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.4em] mb-6 opacity-50">Equilibrium Mods</p>
                    <nav className="space-y-3">
                        <NavItem to="/exercises" icon={Wind} label="Calm Precision" />
                        <NavItem to="/games" icon={Leaf} label="Roots & Release" />
                        <NavItem to="/counselors" icon={Users} label="Verified Experts" />
                    </nav>
                </div>

                <div className="mt-auto space-y-8">
                    <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border border-white/10">
                        <div className="absolute -top-10 -right-10 p-4 opacity-[0.05] group-hover:rotate-12 transition-transform duration-1000 scale-150">
                            <Activity size={100} fill="white" />
                        </div>
                        <div className="relative z-10 flex flex-col">
                            <div className="flex items-center space-x-2 mb-4 bg-emerald-500/10 self-start px-3 py-1 rounded-full border border-emerald-500/20">
                                <Zap size={12} className="text-emerald-400 fill-emerald-400" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Peak Resilience</span>
                            </div>
                            <h4 className="text-lg font-black tracking-tight mb-1">8 Day Sequence</h4>
                            <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-5">You are currently outperforming <span className="text-white font-bold text-emerald-400 text-xs">88%</span> of peer group stability metrics.</p>
                            <button className="w-full bg-white text-slate-900 hover:bg-emerald-400 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95">
                                Performance Hub
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-4 py-2 bg-white/40 rounded-[1.8rem] border border-white">
                        <button className="p-2 text-slate-400 hover:text-slate-800 transition-colors"><Settings size={20} /></button>
                        <div className="h-4 w-px bg-slate-200" />
                        <button className="p-2 text-slate-400 hover:text-slate-800 transition-colors"><HelpCircle size={20} /></button>
                        <div className="h-4 w-px bg-slate-200" />
                        <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><LogOut size={20} /></button>
                    </div>
                </div>
            </aside>


            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-xl border-b border-white/20 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Shield className="text-emerald-500" size={24} />
                    <h1 className="text-xl font-black text-slate-800 tracking-tighter">Aura</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="text-slate-600 relative">
                        <Bell size={22} />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button onClick={() => setIsSidebarOpen(true)} className="p-1 text-slate-800">
                        <Menu size={26} />
                    </button>
                </div>
            </header>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white/90 backdrop-blur-2xl z-[70] p-8 lg:hidden flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex items-center space-x-3">
                                    <Shield className="text-emerald-500" size={30} />
                                    <h1 className="text-2xl font-black text-slate-800 tracking-tighter">Aura</h1>
                                </div>
                                <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400">
                                    <X size={26} />
                                </button>
                            </div>
                            <nav className="space-y-4 flex-1">
                                <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={() => setIsSidebarOpen(false)} />
                                <NavItem to="/chat" icon={MessageSquare} label="Aura AI" onClick={() => setIsSidebarOpen(false)} />
                                <NavItem to="/journal" icon={Book} label="Journal" onClick={() => setIsSidebarOpen(false)} />
                                <NavItem to="/exercises" icon={Wind} label="Calm Center" onClick={() => setIsSidebarOpen(false)} />
                                <NavItem to="/games" icon={Leaf} label="Roots & Release" onClick={() => setIsSidebarOpen(false)} />
                                <NavItem to="/counselors" icon={Users} label="Care Experts" onClick={() => setIsSidebarOpen(false)} />
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 w-full pt-24 lg:pt-0 min-h-screen">
                <div className="max-w-[1600px] mx-auto p-6 md:p-12 lg:p-16">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
                            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/exercises" element={<Exercises />} />
                    <Route path="/games" element={<Games />} />
                    <Route path="/counselors" element={<Counselors />} />
                    <Route path="/counselors/:id" element={<Counselors />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;


