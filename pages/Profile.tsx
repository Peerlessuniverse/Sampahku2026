import React, { useState, useEffect } from 'react';
import {
    User, Award, Zap, ShieldCheck, TrendingUp, History,
    Settings, LogOut, ChevronRight, Star, Leaf, Globe,
    MapPin, Calendar, Mail, Edit3, Camera
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout, UserProfile as UserProfileType } from '../services/authService';
import { getUserCredits, getUserHistory, CreditData, Transaction } from '../services/dbService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserProfileType | null>(getCurrentUser());
    const [dbData, setDbData] = useState<CreditData | null>(null);
    const [history, setHistory] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const credits = await getUserCredits(user.uid);
                const txHistory = await getUserHistory(user.uid);
                setDbData(credits);
                setHistory(txHistory);
            } catch (error) {
                console.error("Failed to fetch profile data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const badges = [
        { id: 1, name: 'Stardust Scout', icon: <Star size={24} />, unlocked: true, desc: 'Memulai perjalanan kosmik' },
        { id: 2, name: 'Nebula Guardian', icon: <ShieldCheck size={24} />, unlocked: (dbData?.credits || 0) >= 100, desc: 'Punya 100+ Eco-Credits' },
        { id: 3, name: 'Eco Alchemist', icon: <Zap size={24} />, unlocked: history.length >= 5, desc: 'Melakukan 5+ aktivitas' },
        { id: 4, name: 'Planetary Hero', icon: <Globe size={24} />, unlocked: (dbData?.credits || 0) >= 1000, desc: 'Punya 1000+ Eco-Credits' },
    ];

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#02020a] text-white selection:bg-violet-500/30">
            <Navbar />

            <main className="pt-32 pb-24 px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Hero Profile Header */}
                    <section className="relative mb-12">
                        <div className="h-48 md:h-64 rounded-[3rem] bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-rose-900/40 border border-white/10 overflow-hidden relative">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#02020a]/80"></div>
                        </div>

                        <div className="max-w-6xl mx-auto px-10 -mt-24 md:-mt-32 flex flex-col md:flex-row items-end gap-8 relative z-10">
                            <div className="relative group">
                                <div className="w-40 h-40 md:w-52 md:h-52 rounded-[2.5rem] border-4 border-[#02020a] bg-white/5 overflow-hidden shadow-2xl relative">
                                    <img
                                        src={user.photoURL}
                                        className="w-full h-full object-cover"
                                        alt={user.displayName}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName}`;
                                        }}
                                    />
                                </div>
                                <button
                                    className="absolute bottom-4 right-4 p-3 bg-violet-600 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all text-white border-2 border-[#02020a]"
                                    title="Ubah Foto Profil"
                                >
                                    <Camera size={18} />
                                </button>
                            </div>

                            <div className="flex-1 pb-4 text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                                    <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">{user.displayName}</h1>
                                    <span className="inline-flex px-4 py-1.5 bg-violet-500/10 border border-violet-500/30 rounded-full text-[10px] font-black uppercase text-violet-400 tracking-widest self-center md:self-auto">
                                        Verified Guardian
                                    </span>
                                </div>
                                <div className="flex flex-wrap justify-center md:justify-start gap-6 text-white/40 text-xs font-bold uppercase tracking-widest italic">
                                    <div className="flex items-center gap-2"><Mail size={14} /> {user.email}</div>
                                    <div className="flex items-center gap-2"><Calendar size={14} /> Joined {new Date(user.createdAt).toLocaleDateString()}</div>
                                </div>
                            </div>

                            <div className="pb-4 flex gap-4">
                                <button
                                    className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-white/60 hover:text-white"
                                    title="Pengaturan Akun"
                                >
                                    <Settings size={20} />
                                </button>
                                <button onClick={handleLogout} className="px-8 py-4 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-2xl font-black uppercase italic tracking-tighter hover:bg-rose-500 hover:text-black transition-all">
                                    Logout
                                </button>
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Sidebar Stats */}
                        <aside className="lg:col-span-4 space-y-8">
                            <div className="p-10 rounded-[3.5rem] bg-white/[0.02] border-2 border-white/5 space-y-10">
                                <div>
                                    <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-6">Cosmic Energy</h3>
                                    <div className="flex items-end gap-3 mb-2">
                                        <span className="text-6xl font-black italic tracking-tighter leading-none">{dbData?.credits.toLocaleString() || 0}</span>
                                        <span className="text-sm font-black text-violet-400 uppercase tracking-widest pb-1">Credits</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 w-[45%]" />
                                    </div>
                                    <p className="mt-4 text-[10px] font-bold text-white/20 uppercase tracking-widest italic">450 points more to Level 16</p>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Global Rank</span>
                                        <p className="text-2xl font-black italic tracking-tighter text-amber-500">#42</p>
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Earth Impact</span>
                                        <p className="text-2xl font-black italic tracking-tighter text-emerald-400">0.4 Ton</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 rounded-[3.5rem] bg-gradient-to-br from-violet-600/10 to-transparent border-2 border-white/5">
                                <div className="flex items-center gap-4 mb-8">
                                    <Award className="text-amber-400" />
                                    <h3 className="font-black italic uppercase tracking-tighter text-xl">Achievements</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {badges.map(badge => (
                                        <div key={badge.id} className={`group p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${badge.unlocked ? 'bg-white/5 border-violet-500/20' : 'bg-white/[0.01] border-white/5 opacity-40 grayscale'}`}>
                                            <div className={`p-4 rounded-2xl ${badge.unlocked ? 'bg-violet-500/10 text-violet-400 group-hover:scale-110' : 'bg-white/5 text-white/10'} transition-all`}>
                                                {badge.icon}
                                            </div>
                                            <span className="text-[8px] font-black uppercase tracking-widest text-center">{badge.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* Main Interaction Area */}
                        <div className="lg:col-span-8 space-y-8">

                            {/* Global Action Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                                <div className="p-8 rounded-[3rem] bg-[#a78bfa] text-[#02020a] group cursor-pointer hover:scale-[1.02] transition-all">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="p-4 bg-black/10 rounded-2xl"><TrendingUp size={24} /></div>
                                        <ChevronRight size={24} />
                                    </div>
                                    <h4 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Tingkatkan Impact</h4>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Selesaikan protokol transformasi organik</p>
                                </div>
                                <div className="p-8 rounded-[3rem] bg-white/[0.03] border-2 border-white/5 group cursor-pointer hover:border-violet-500/30 transition-all">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="p-4 bg-violet-500/10 text-violet-400 rounded-2xl"><Leaf size={24} /></div>
                                        <ChevronRight size={24} className="text-white/20" />
                                    </div>
                                    <h4 className="text-2xl font-black italic uppercase tracking-tighter mb-2 text-white">Market Manifestasi</h4>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Tukarkan kredit dengan benefit nyata</p>
                                </div>
                            </div>

                            {/* Recent Activity Timeline */}
                            <div className="p-10 md:p-14 rounded-[4rem] bg-white/[0.02] border-2 border-white/5">
                                <div className="flex items-center justify-between mb-12">
                                    <div className="flex items-center gap-4">
                                        <History className="text-violet-400" size={24} />
                                        <h3 className="text-2xl font-black italic uppercase tracking-tighter">Timeline Energi</h3>
                                    </div>
                                    <button className="text-[10px] font-black uppercase text-violet-400 tracking-widest hover:text-white transition-colors">See All</button>
                                </div>

                                <div className="space-y-6 relative before:absolute before:left-[27px] before:top-4 before:bottom-4 before:w-px before:bg-white/5">
                                    {history.length > 0 ? history.slice(0, 5).map((t, idx) => (
                                        <div key={idx} className="flex gap-8 group">
                                            <div className={`mt-1 w-14 h-14 rounded-2xl border-2 flex items-center justify-center relative z-10 transition-all group-hover:scale-110 ${t.amount > 0 ? 'bg-[#02020a] border-emerald-500/20 text-emerald-400' : 'bg-[#02020a] border-rose-500/20 text-rose-400'}`}>
                                                {t.amount > 0 ? <Plus size={18} /> : <Minus size={18} />}
                                            </div>
                                            <div className="flex-1 pb-6 border-b border-white/5 group-last:border-none">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-black italic uppercase text-sm tracking-tight">{t.description}</h4>
                                                    <span className="text-[10px] font-bold text-white/20 uppercase">{new Date(t.timestamp).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest italic">{t.amount > 0 ? 'Energy Gained' : 'Energy Manifested'}: {Math.abs(t.amount)} ECO</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="py-20 text-center opacity-20 italic">
                                            <p className="uppercase tracking-[0.5em] text-[10px] font-black">Belum Ada Jejak Aktivitas</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

const Plus = ({ size }: { size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const Minus = ({ size }: { size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>;

export default Profile;
