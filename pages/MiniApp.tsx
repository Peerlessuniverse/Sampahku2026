import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Layout,
    Zap,
    Award,
    User,
    Compass,
    ArrowRight,
    Trophy,
    QrCode,
    Sparkles,
    Shield
} from 'lucide-react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth, app } from '../services/firebaseConfig';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getActiveSponsor, trackImpression, SponsorData } from '../services/sponsorServiceFirestore';

const MiniApp: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'unlinked' | 'linked' | 'error'>('loading');
    const [linkCode, setLinkCode] = useState(searchParams.get('code') || '');
    const [userData, setUserData] = useState<any>(null);
    const [isLinking, setIsLinking] = useState(false);
    const [message, setMessage] = useState('');
    const [activeSponsor, setActiveSponsor] = useState<SponsorData | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // 1. Handle Authentication State
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("Authenticated as:", user.uid);
                setIsAuthenticated(true);
                fetchInitialData(user.uid);
            } else {
                signInAnonymously(auth).catch(err => {
                    console.error("Auth Error:", err);
                    setStatus('error');
                });
            }
        });

        // 2. Fetch Sponsor Data independently
        getActiveSponsor().then(sponsor => {
            setActiveSponsor(sponsor);
            if (sponsor?.id) trackImpression(sponsor.id);
        });

        return () => unsubscribe();
    }, []);

    const fetchInitialData = async (uid: string) => {
        try {
            const functions = getFunctions(app, 'us-central1');
            const getUserCredits = httpsCallable(functions, 'getUserCredits');
            const result = await getUserCredits({ uid });
            const data = result.data as any;
            setUserData(data);

            if (linkCode) {
                handleLink(linkCode);
            } else {
                setStatus('linked');
            }
        } catch (err) {
            console.error("Fetch Data Error:", err);
            setStatus('unlinked');
        }
    };

    const handleLink = async (code: string) => {
        if (!isAuthenticated) {
            setMessage("⏳ Menunggu koneksi kosmik...");
            return;
        }

        setIsLinking(true);
        setMessage('');
        try {
            const functions = getFunctions(app, 'us-central1');
            const linkWithCode = httpsCallable(functions, 'linkTelegramWithCode');
            const result = await linkWithCode({ code });
            const data = result.data as any;

            if (data.ok) {
                setMessage('🌌 Akun Kosmik Berhasil Terhubung!');
                setStatus('linked');
                // Refresh data
                fetchInitialData(auth.currentUser!.uid);
            } else {
                setMessage('⚠️ Kode tidak valid atau kedaluwarsa.');
            }
        } catch (err: any) {
            console.error("Link Error Detail:", err);
            // Handle specific firebase error messages
            const errorMsg = err.message || "Gagal menghubungkan";
            setMessage(`❌ Error: ${errorMsg}`);
        } finally {
            setIsLinking(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#02020a] text-white p-6 font-sans selection:bg-violet-500/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse delay-700" />
            </div>

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20 border border-white/10">
                        <Zap className="w-5 h-5 text-white fill-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            SampahKu <span className="text-violet-500">2026</span>
                        </h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium">Mini Portal v1.0</p>
                    </div>
                </div>
                {status === 'linked' && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tight">Connected</span>
                    </div>
                )}
            </header>

            {status === 'loading' ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-4" />
                    <p className="text-xs text-gray-500 uppercase tracking-widest animate-pulse">Sinkronisasi Dimensi...</p>
                </div>
            ) : status === 'unlinked' || status === 'error' ? (
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-violet-900/40 to-indigo-900/40 border border-violet-500/30 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Sparkles className="w-24 h-24 text-white" />
                        </div>
                        <h2 className="text-2xl font-black mb-4 leading-tight">Mulai Perjalanan <br /><span className="text-violet-400">Garda Ekologis</span></h2>
                        <p className="text-gray-300 text-sm leading-relaxed mb-6">
                            Buka potensi penuh SampahKu dengan menghubungkan akun Telegram Anda. Dapatkan EcoCredits gratis setiap hari!
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
                                <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400">
                                    <span className="font-bold underline">1</span>
                                </div>
                                <p className="text-xs text-gray-400">Buka bot <span className="text-white font-semibold">@SampahKosmikBot</span> di Telegram</p>
                            </div>
                            <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
                                <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400">
                                    <span className="font-bold underline">2</span>
                                </div>
                                <p className="text-xs text-gray-400">Ketik command <span className="bg-white/10 px-2 py-0.5 rounded text-white font-mono">/link</span></p>
                            </div>
                            <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
                                <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400">
                                    <span className="font-bold underline">3</span>
                                </div>
                                <p className="text-xs text-gray-400">Masukkan 6-digit kode di bawah ini</p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <input
                                type="text"
                                maxLength={6}
                                placeholder="000000"
                                value={linkCode}
                                className="w-full bg-black/60 border-2 border-white/10 rounded-2xl py-4 px-6 text-center text-2xl font-black tracking-[0.5em] focus:border-violet-500 outline-none transition-all placeholder:text-gray-700"
                                onChange={(e) => {
                                    setLinkCode(e.target.value);
                                    if (e.target.value.length === 6) handleLink(e.target.value);
                                }}
                            />
                            {isLinking && <p className="text-center text-[10px] mt-2 text-violet-400 animate-pulse font-bold tracking-widest uppercase">Memverifikasi Partikel...</p>}
                            {message && <p className={`text-center text-xs mt-3 font-medium ${message.includes('❌') ? 'text-red-400' : 'text-emerald-400'}`}>{message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
                            <Trophy className="w-6 h-6 text-amber-400 mb-2" />
                            <h3 className="text-xs font-bold uppercase tracking-wider mb-1">Rewards</h3>
                            <p className="text-[10px] text-gray-500 leading-tight">Tukarkan poin dengan voucher eksklusif.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
                            <QrCode className="w-6 h-6 text-emerald-400 mb-2" />
                            <h3 className="text-xs font-bold uppercase tracking-wider mb-1">Scanner AI</h3>
                            <p className="text-[10px] text-gray-500 leading-tight">Analisa material sampah secara instan.</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Status Card */}
                    <div className="relative group overflow-hidden bg-gradient-to-br from-violet-600/20 to-indigo-900/30 border border-violet-500/20 rounded-[2.5rem] p-8 backdrop-blur-3xl shadow-2xl shadow-violet-950/20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-violet-500/20 transition-all duration-1000" />

                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-[10px] font-black tracking-[0.3em] uppercase text-violet-400 mb-1">Eco Balance</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-white">{userData?.credits || 0}</span>
                                    <span className="text-xs font-bold text-violet-300 uppercase">Partikel</span>
                                </div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                                <Award className="w-6 h-6 text-amber-400" />
                            </div>
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                        <div className="grid grid-cols-3 gap-2">
                            <div className="text-center">
                                <p className="text-[8px] text-gray-500 uppercase tracking-widest mb-1">Impact</p>
                                <p className="text-sm font-bold text-emerald-400">+{userData?.impact?.toFixed(1) || 0}kg</p>
                            </div>
                            <div className="text-center border-x border-white/5">
                                <p className="text-[8px] text-gray-500 uppercase tracking-widest mb-1">Analyses</p>
                                <p className="text-sm font-bold text-white">{userData?.totalAnalyses || 0}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[8px] text-gray-500 uppercase tracking-widest mb-1">Level</p>
                                <p className="text-sm font-bold text-violet-400">Novice</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Access Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => navigate('/scanner')}
                            className="flex flex-col items-center justify-center gap-3 p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-violet-500/50 transition-all group active:scale-95"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-violet-600/20 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                                <QrCode className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest">Scanner</span>
                        </button>
                        <button
                            onClick={() => navigate('/credits')}
                            className="flex flex-col items-center justify-center gap-3 p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-emerald-500/50 transition-all group active:scale-95"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                <Zap className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest">Rewards</span>
                        </button>
                    </div>

                    {/* Featured Item */}
                    <div className="bg-black/40 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl group cursor-pointer hover:border-white/20 transition-all" onClick={() => navigate('/leaderboard')}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-amber-500" />
                                Hall of Fame
                            </h3>
                            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#02020a] bg-gray-800 flex items-center justify-center overflow-hidden">
                                    <User className="w-4 h-4 text-gray-400" />
                                </div>
                            ))}
                            <div className="w-8 h-8 rounded-full border-2 border-[#02020a] bg-violet-900/40 flex items-center justify-center text-[8px] font-bold">
                                +Real
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-4 leading-relaxed">
                            Lihat peringkat Guardian dengan kontribusi jejak karbon terbesar di semesta SampahKu.
                        </p>
                    </div>

                    {/* Sponsor Banner */}
                    {activeSponsor && (
                        <div className="relative h-40 rounded-[2rem] overflow-hidden group cursor-pointer" onClick={() => activeSponsor.linkUrl && window.open(activeSponsor.linkUrl, '_blank')}>
                            <img
                                src={activeSponsor.mediaUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop"}
                                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-all duration-1000"
                                alt={activeSponsor.name}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 bg-violet-500 text-[8px] font-black uppercase tracking-tighter rounded">
                                        {activeSponsor.plan === 'cosmic' ? 'Cosmic Tier' : activeSponsor.plan === 'galactic' ? 'Galactic Tier' : 'Nebula Tier'}
                                    </span>
                                    <span className="text-[8px] text-gray-400 uppercase tracking-tighter">Sponsored</span>
                                </div>
                                <h4 className="text-base font-black leading-tight mb-1">{activeSponsor.name}</h4>
                                <p className="text-[10px] text-gray-400">{activeSponsor.tagline}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Bottom Safe Area */}
            <div className="h-10" />
        </div>
    );
};

export default MiniApp;
