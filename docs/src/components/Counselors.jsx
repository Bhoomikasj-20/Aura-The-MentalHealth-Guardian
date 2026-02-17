import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    MapPin, Phone, Star, Mail, Search, Compass, ExternalLink,
    ShieldAlert, Heart, GraduationCap, ChevronRight, UserCheck,
    MessageCircle, Award, Target, Filter, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Counselors = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedSpecialty, setSelectedSpecialty] = useState('All');

    const specialists = [
        { id: 1, name: 'Dr. Sarah Mitchell', dist: '1.2 km', rate: 4.8, contact: '+91 98765 43210', tags: ['Student Specialist', 'Anxiety'], bio: 'Specializing in academic burnout and student-specific anxiety transitions.', available: true },
        { id: 2, name: 'Arjun Verma', dist: '3.5 km', rate: 4.9, contact: '+91 87654 32109', tags: ['Academic Stress', 'CBT'], bio: 'Cognitive Behavioral Therapy for high-performance students.', available: true },
        { id: 3, name: 'Priya Sharma', dist: '4.1 km', rate: 4.7, contact: '+91 76543 21098', tags: ['Exam Pressure', 'Meditation'], bio: 'Breathwork and meditative approaches to exam season management.', available: false },
        { id: 4, name: 'Dr. Michael Chen', dist: '5.8 km', rate: 4.6, contact: '+91 65432 10987', tags: ['Mindfulness', 'Group Therapy'], bio: 'Fostering community-based healing and group focus sessions.', available: true }
    ];

    const [selectedCounselor, setSelectedCounselor] = useState(null);

    const specialties = ['All', 'Anxiety', 'CBT', 'Academic Stress', 'Mindfulness', 'Exam Pressure'];

    const filteredSpecialists = selectedSpecialty === 'All'
        ? specialists
        : specialists.filter(s => s.tags.includes(selectedSpecialty));

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24 relative">
            {/* Header: Care Authority */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-50 rounded-2xl text-indigo-600 border border-indigo-100"
                    >
                        <GraduationCap size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Grade Care</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl font-black text-slate-800 tracking-tighter"
                    >
                        Clinical <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600">Allies</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-xl font-medium italic opacity-80"
                    >
                        Connect with specialized minds dedicated to your academic & mental resilience.
                    </motion.p>
                </div>

                <div className="flex items-center gap-4 bg-white/50 p-2 rounded-[2.5rem] border border-white">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-200">
                        <UserCheck size={20} />
                    </div>
                    <div className="pr-10">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Verification</p>
                        <p className="text-sm font-black text-slate-800 uppercase tracking-tighter leading-none">Aura Vetted Experts</p>
                    </div>
                </div>
            </div>

            {/* Specialty Ribbon */}
            <div className="flex flex-wrap items-center gap-4 py-4 no-scrollbar overflow-x-auto">
                <div className="p-3 bg-white rounded-2xl border border-slate-100 text-slate-400">
                    <Filter size={20} />
                </div>
                {specialties.map((s, i) => (
                    <button
                        key={s}
                        onClick={() => setSelectedSpecialty(s)}
                        className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border shadow-sm ${selectedSpecialty === s ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl shadow-indigo-100' : 'bg-white text-slate-400 border-slate-50 hover:border-indigo-200 hover:text-indigo-600 shadow-slate-100/50'}`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-8">
                    {/* Search Field */}
                    <div className="relative group">
                        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={24} />
                        <input
                            type="text"
                            placeholder="Locate experts by campus district or clinical focus..."
                            className="w-full pl-20 pr-10 py-7 rounded-[3rem] bg-white border-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] focus:ring-4 focus:ring-emerald-500/5 outline-none font-bold text-slate-700 text-lg transition-all"
                        />
                    </div>

                    <div className="space-y-6">
                        <AnimatePresence mode="popLayout">
                            {filteredSpecialists.map((c, i) => (
                                <motion.div
                                    key={c.name}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="glass-card p-10 rounded-[4rem] group border-2 border-transparent hover:border-emerald-100 hover:shadow-[0_40px_80px_-20px_rgba(16,185,129,0.1)] transition-all bg-white flex flex-col xl:flex-row items-center justify-between gap-12"
                                >
                                    <div className="flex items-start gap-10 flex-1">
                                        <div className="relative">
                                            <div className="bg-gradient-to-br from-emerald-100 to-indigo-100 p-8 rounded-[3rem] text-emerald-600 group-hover:rotate-6 transition-transform duration-700 shadow-inner">
                                                <Compass size={40} />
                                            </div>
                                            {c.available && (
                                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center animate-bounce shadow-lg">
                                                    <div className="w-2 h-2 rounded-full bg-white" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <h3 className="font-black text-3xl text-slate-800 tracking-tighter">{c.name}</h3>
                                                <div className="flex items-center text-amber-500 bg-amber-50 px-3 py-1 rounded-full text-xs font-black">
                                                    <Star size={14} className="mr-1.5 fill-amber-400" />
                                                    {c.rate}
                                                </div>
                                            </div>
                                            <p className="text-slate-500 font-medium italic text-lg leading-relaxed max-w-lg">
                                                "{c.bio}"
                                            </p>
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {c.tags.map(t => (
                                                    <span key={t} className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 bg-indigo-50/50 px-4 py-2 rounded-xl">
                                                        #{t}
                                                    </span>
                                                ))}
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-50 px-4 py-2 rounded-xl flex items-center gap-1.5">
                                                    <MapPin size={12} /> {c.dist}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex xl:flex-col gap-4 w-full xl:w-56">
                                        <a href={`tel:${c.contact}`} className="flex-1 bg-slate-900 text-white py-6 rounded-3xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-200 active:scale-95 group/btn">
                                            <MessageCircle size={22} className="group-hover/btn:rotate-12 transition-transform" />
                                            <span className="font-black text-xs uppercase tracking-widest">Counsel Now</span>
                                        </a>
                                        <button
                                            onClick={() => setSelectedCounselor(c)}
                                            className="flex-1 xl:w-full py-6 bg-white border border-slate-100 rounded-3xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all flex items-center justify-center gap-3"
                                        >
                                            <UserCheck size={20} />
                                            <span className="font-black text-xs uppercase tracking-widest">Profile</span>
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Sidebar: Geographic Hub */}
                <div className="lg:col-span-4 space-y-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card rounded-[4rem] overflow-hidden h-[500px] relative border-none shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] bg-white group"
                    >
                        <div className="absolute inset-0 bg-slate-50 flex items-center justify-center overflow-hidden">
                            {/* Cinematic Map Layer */}
                            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-1000" style={{
                                backgroundImage: 'radial-gradient(#6366f1 2px, transparent 0)',
                                backgroundSize: '40px 40px',
                                maskImage: 'radial-gradient(circle, black, transparent 90%)'
                            }} />
                            <div className="absolute inset-0 opacity-5" style={{
                                backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
                                backgroundSize: '80px 80px'
                            }} />

                            <div className="absolute z-10 flex flex-col items-center">
                                <motion.div
                                    animate={{
                                        y: [0, -20, 0],
                                        scale: [1, 1.1, 1],
                                        boxShadow: ['0 0 0 0px rgba(16,185,129,0.1)', '0 0 0 30px rgba(16,185,129,0)', '0 0 0 0px rgba(16,185,129,0)']
                                    }}
                                    transition={{ repeat: Infinity, duration: 3 }}
                                    className="bg-emerald-500 p-8 rounded-full text-white shadow-2xl relative border-8 border-white"
                                >
                                    <MapPin size={48} fill="currentColor" />
                                </motion.div>
                                <div className="mt-10 space-y-3 text-center">
                                    <p className="font-black text-emerald-800 bg-emerald-50/80 backdrop-blur-md px-8 py-3.5 rounded-[2rem] text-[11px] uppercase tracking-[0.3em] border border-emerald-100">
                                        Live Precision Sync
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Scanning Campus Nodes...</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-8 left-8 right-8 bg-slate-900/90 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/5 shadow-2xl group-hover:translate-y-2 transition-transform">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                                    <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Safe Zone Active</h4>
                                </div>
                                <ArrowUpRight size={18} className="text-slate-500" />
                            </div>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed italic opacity-80 mb-6">
                                Connect with clinical hubs across 12 university districts. All sessions are private and secure.
                            </p>
                            <button
                                onClick={() => {
                                    window.open("https://www.google.com/maps/search/therapist+near+me", "_blank");
                                }}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg"
                            >
                                <Compass size={16} />
                                <span>Live Perspective</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* Crisis Protocol: SOS Design */}
                    <div className="glass-card p-12 rounded-[4rem] bg-gradient-to-br from-red-600 to-red-800 text-white shadow-2xl shadow-red-900/40 relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 p-10 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                            <ShieldAlert size={180} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md">
                                    <ShieldAlert size={32} className="text-red-100" />
                                </div>
                                <h3 className="text-3xl font-black tracking-tighter leading-none">Emergency Protocol</h3>
                            </div>
                            <p className="text-red-100 text-xl font-medium italic mb-12 leading-relaxed opacity-90">
                                If you are in immediate distress, our 24/7 dedicated response unit is available for an instant voice uplink.
                            </p>
                            <motion.button
                                whileHover={{ y: -5, shadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full bg-white text-red-600 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-red-900/20 flex items-center justify-center gap-4 transition-all"
                            >
                                <Phone size={24} fill="currentColor" />
                                <span>Initiate Crisis Link</span>
                            </motion.button>
                        </div>
                    </div>

                    <div className="glass-card p-10 rounded-[3.5rem] bg-indigo-900 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-6 transition-transform">
                            <Award size={100} />
                        </div>
                        <h4 className="text-lg font-black mb-4 tracking-tight">Accreditation</h4>
                        <p className="text-indigo-200 text-sm font-medium italic leading-relaxed opacity-80">
                            Every counselor on Aura is verified through the Central Student Health Board (CSHB).
                        </p>
                    </div>
                </div>
            </div>
            {/* Profile Modal */}
            <AnimatePresence>
                {selectedCounselor && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl"
                        onClick={() => setSelectedCounselor(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-[4rem] p-12 max-w-2xl w-full shadow-2xl relative overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedCounselor(null)}
                                className="absolute top-8 right-8 p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-800 transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="flex items-center gap-8 mb-10">
                                <div className="bg-gradient-to-br from-emerald-100 to-indigo-100 p-8 rounded-[3rem] text-emerald-600">
                                    <Compass size={48} />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black text-slate-800 tracking-tighter mb-2">{selectedCounselor.name}</h2>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center text-amber-500 bg-amber-50 px-3 py-1 rounded-full text-xs font-black">
                                            <Star size={14} className="mr-1.5 fill-amber-400" />
                                            {selectedCounselor.rate}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                            <MapPin size={12} /> {selectedCounselor.dist}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-xl text-slate-500 font-medium italic leading-relaxed mb-10">
                                "{selectedCounselor.bio}"
                            </p>

                            <div className="space-y-6 mb-12">
                                <div className="flex flex-wrap gap-2">
                                    {selectedCounselor.tags.map(t => (
                                        <span key={t} className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 bg-indigo-50 px-5 py-2.5 rounded-xl">
                                            #{t}
                                        </span>
                                    ))}
                                </div>
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
                                            <Phone size={20} />
                                        </div>
                                        <p className="text-sm font-black text-slate-800 tracking-tight">{selectedCounselor.contact}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${selectedCounselor.available ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            {selectedCounselor.available ? 'Currently Active' : 'Offline'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <a
                                    href={`tel:${selectedCounselor.contact}`}
                                    className="bg-slate-900 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all active:scale-95"
                                >
                                    <MessageCircle size={20} />
                                    Book Session
                                </a>
                                <button
                                    onClick={() => window.open(`https://www.google.com/maps/search/therapist+near+me+${encodeURIComponent(selectedCounselor.name)}`, "_blank")}
                                    className="bg-white border border-slate-100 py-6 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:border-indigo-200 hover:text-indigo-600 transition-all active:scale-95 shadow-sm"
                                >
                                    <MapPin size={20} />
                                    Open in Google Maps
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Counselors;

