import React, { useState, useEffect } from 'react';
import { Trophy, Star, ShieldCheck, Flame, Zap, ArrowLeft, Loader2, User, Award, Globe, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getGlobalLeaderboard, CreditData } from '../services/dbService';
import { getStoredSponsors, SponsorData } from '../services/sponsorService';

const HallOfFame: React.FC = () => {
    const [guardians, setGuardians] = useState<CreditData[]>([]);
    const [loading, setLoading] = useState(true);
    const sponsors = getStoredSponsors().filter(s => s.status === 'active');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const data = await getGlobalLeaderboard();
                setGuardians(data);
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    const getRankColor = (index: number) => {
        if (index === 0) return 'text-amber-400';
        if (index === 1) return 'text-slate-300';
        if (index === 2) return 'text-amber-600';
        return 'text-white/40';
    };

    const getRankIcon = (index: number) => {
        if (index === 0) return <Trophy className="text-amber-400" size={32} />;
        if (index === 1) return <Award className="text-slate-300" size={28} />;
        if (index === 2) return <Award className="text-amber-600" size={24} />;
        return <span className="text-xl font-black text-white/20">#{index + 1}</span>;
    };

    return (
        <div className="bg-[#02020a] min-h-screen text-white font-sans selection:bg-violet-500/30">

            {/* Hero Section */}
            <section className="relative pt-32 pb-12 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_transparent_70%)] opacity-30"></div>
                <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6 animate-in fade-in slide-in-from-top-12 duration-1000">
                    <div className="inline-flex p-3 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-3xl shadow-2xl">
                        <Star size={32} className="text-amber-400 animate-pulse" />
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase italic leading-none">
                            Cosmic <span className="text-amber-400">Hall of Fame</span>
                        </h1>
                        <p className="text-base md:text-lg text-white/40 font-bold italic uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
                            Apresiasi tertinggi bagi para perintis energi yang menjaga ekosistem semesta.
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 pb-32">

                {/* 1. TOP GUARDIANS (USERS) */}
                <section className="lg:col-span-8 space-y-12">
                    <div className="flex items-center gap-4 mb-8">
                        <ShieldCheck className="text-cyan-400" size={32} />
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Global Guardians</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-cyan-400/30 to-transparent"></div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] rounded-[3rem] border-2 border-dashed border-white/5">
                            <Loader2 size={48} className="text-cyan-400 animate-spin mb-4" />
                            <p className="text-white/30 font-bold uppercase italic tracking-widest">Sinkronisasi Data Galaksi...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {guardians.length > 0 ? guardians.map((guardian, idx) => (
                                <div
                                    key={guardian.uid}
                                    className={`group flex items-center justify-between p-4 md:p-6 rounded-[2rem] bg-white/[0.02] border-2 transition-all duration-500 hover:bg-white/[0.05] hover:-translate-x-2 ${idx === 0 ? 'border-amber-400/20 bg-amber-400/[0.02]' : 'border-white/5'}`}
                                >
                                    <div className="flex items-center gap-4 md:gap-8">
                                        <div className="w-10 flex justify-center">
                                            {getRankIcon(idx)}
                                        </div>
                                        <div className="relative">
                                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 border-white/10 group-hover:border-white/30 transition-colors bg-white/5">
                                                <img src={guardian.photoURL} alt={guardian.displayName} className="w-full h-full object-cover" />
                                            </div>
                                            {idx < 3 && (
                                                <div className="absolute -top-1 -right-1 p-1 bg-[#02020a] border border-white/10 rounded-md shadow-xl">
                                                    <Zap size={10} className={getRankColor(idx)} fill="currentColor" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tight group-hover:text-cyan-400 transition-colors leading-none">
                                                {guardian.displayName}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Globe size={10} className="text-white/20" />
                                                <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Verified Guardian</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl md:text-3xl font-black tracking-tighter italic text-white group-hover:scale-110 transition-transform origin-right">
                                            {guardian.credits.toLocaleString()}
                                        </div>
                                        <div className="text-[8px] font-black text-cyan-400 uppercase tracking-widest mt-1 italic">Eco-Credits</div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-20 bg-white/[0.01] rounded-[3rem] border border-white/5 italic text-white/20 font-bold uppercase tracking-widest">
                                    Belum ada penjaga yang memanifestasikan energinya. <br /> Jadilah yang pertama!
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* 2. CORPORATE PIONEERS (SPONSORS) */}
                <section className="lg:col-span-4 space-y-12">
                    <div className="flex items-center gap-4 mb-8">
                        <Flame className="text-amber-400" size={32} />
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter">Corporate Pioneers</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {sponsors.map((sponsor) => (
                            <div
                                key={sponsor.id}
                                className={`group p-8 rounded-[3rem] bg-white/[0.03] border-2 transition-all duration-500 hover:bg-white/[0.05] ${sponsor.plan === 'cosmic' ? 'border-amber-400/30' : 'border-white/5'}`}
                            >
                                <div className="flex items-center gap-5 mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 overflow-hidden group-hover:border-white/30 transition-all">
                                        {sponsor.mediaUrl && sponsor.mediaType === 'image' ? (
                                            <img src={sponsor.mediaUrl} alt={sponsor.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/20 font-black text-lg">
                                                {sponsor.name[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-black uppercase italic tracking-tighter text-lg leading-none">{sponsor.name}</h4>
                                        <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mt-1">{sponsor.tagline}</p>
                                    </div>
                                </div>
                                <p className="text-sm font-bold italic text-white/40 leading-relaxed mb-6 group-hover:text-white/60 transition-colors uppercase tracking-tight">
                                    "{sponsor.message}"
                                </p>
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/20 border-t border-white/5 pt-4">
                                    <span>Plan: {sponsor.plan}</span>
                                    <Sparkles size={14} className={sponsor.plan === 'cosmic' ? 'text-amber-400' : 'text-white/10'} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-8 rounded-[3rem] bg-gradient-to-br from-violet-600/10 to-transparent border-2 border-white/5 text-center space-y-6">
                        <h4 className="text-lg font-black uppercase italic tracking-tighter">Manifestasikan Brand Anda</h4>
                        <p className="text-xs font-bold text-white/30 italic uppercase tracking-widest">Jangkau ribuan pelindung bumi melalui Hall of Fame kami.</p>
                        <Link
                            to="/sponsor/info"
                            className="block w-full py-4 bg-white text-black font-black uppercase italic tracking-tighter rounded-2xl hover:scale-105 active:scale-95 transition-all text-sm"
                        >
                            Daftar Sekarang
                        </Link>
                    </div>
                </section>
            </div>

        </div>
    );
};

export default HallOfFame;
