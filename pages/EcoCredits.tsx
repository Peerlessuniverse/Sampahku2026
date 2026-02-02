import React, { useState, useEffect } from 'react';
import { Coins, ArrowLeft, History, Award, Zap, Gift, ShieldCheck, TrendingUp, Sparkles, LogOut, User as UserIcon, Wallet, ShoppingBag, Sprout, Heart, Filter, Clock, Ban } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getCredits, getCreditHistory, CreditTransaction, redeemCredits, syncWithCloud, getDailyAdStats, getRemainingAdsToday, AD_LIMITS } from '../services/creditService';
import { getCurrentUser, logout, isAuthenticated, UserProfile } from '../services/authService';
import SEO from '../components/SEO';

const EcoCredits: React.FC = () => {
    const navigate = useNavigate();
    const [credits, setCredits] = useState(getCredits());
    const [history, setHistory] = useState<CreditTransaction[]>(getCreditHistory());
    const [user, setUser] = useState<UserProfile | null>(getCurrentUser());
    const [redeemResult, setRedeemResult] = useState<string | null>(null);

    const [impact, setImpact] = useState(getCredits() > 0 ? -0.4 : 0); // Simplified mock default, now using real data below

    useEffect(() => {
        const handleCreditsUpdate = (e: any) => {
            setCredits(e.detail.credits);
            if (e.detail.impact !== undefined) setImpact(e.detail.impact);
            setHistory(getCreditHistory());
        };

        // ... (rest of auth update logic) ...


        const handleAuthUpdate = async (e: any) => {
            // ⭐ Get fresh user from localStorage (might be updated!)
            const freshUser = getCurrentUser();
            setUser(freshUser);

            if (freshUser) {
                await syncWithCloud();
                console.log("🔄 User refreshed:", freshUser.displayName);
            }
        };

        window.addEventListener('creditsUpdated', handleCreditsUpdate);
        window.addEventListener('authChanged', handleAuthUpdate);

        // Initial sync if already logged in
        if (isAuthenticated()) {
            syncWithCloud();
        }

        return () => {
            window.removeEventListener('creditsUpdated', handleCreditsUpdate);
            window.removeEventListener('authChanged', handleAuthUpdate);
        };
    }, []);

    const handleRedeem = async (item: any) => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        const code = await redeemCredits(item.cost, item.title);
        if (code) {
            setRedeemResult(code);
        } else {
            alert('Kredit tidak cukup untuk manifestasi ini.');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Level & Rank System Logic
    const calculateLevelAndRank = (currentCredits: number) => {
        // 1 Level = 2000 Points
        const level = Math.floor(currentCredits / 2000) + 1;
        const maxLevel = 100;
        const displayLevel = level > maxLevel ? maxLevel : level;

        let rank = 'Stardust Scout';
        let rankColor = 'text-white/60';

        if (displayLevel >= 100) {
            rank = 'Cosmic Architect';
            rankColor = 'text-fuchsia-400 drop-shadow-[0_0_10px_rgba(232,121,249,0.8)]'; // Glowing Effect
        } else if (displayLevel >= 75) {
            rank = 'Nebula Guardian';
            rankColor = 'text-violet-400';
        } else if (displayLevel >= 50) {
            rank = 'Solar Vanguard';
            rankColor = 'text-amber-400';
        } else if (displayLevel >= 25) {
            rank = 'Aqua Mystic';
            rankColor = 'text-cyan-400';
        } else if (displayLevel >= 10) {
            rank = 'Terra Shaper';
            rankColor = 'text-emerald-400';
        }

        return { level: displayLevel, rank, rankColor };
    };

    const { level, rank, rankColor } = calculateLevelAndRank(credits);

    // Get daily ad stats
    const dailyAdStats = getDailyAdStats();
    const remainingAds = getRemainingAdsToday();

    const stats = [
        {
            label: 'Rank',
            value: user ? rank : 'Guest Entity',
            icon: <ShieldCheck size={20} className={user ? rankColor : "text-gray-500"} />,
            colorClass: user ? rankColor : "text-gray-500"
        },
        {
            label: 'Level',
            value: user ? `${level}` : '0',
            icon: <TrendingUp size={20} className="text-violet-400" />
        },
        {
            label: impact < 0 ? 'Beban Bumi' : 'Kontribusi Oksigen',
            value: `${Math.abs(impact).toFixed(2)} Ton CO2`,
            icon: <Zap size={20} className={impact < 0 ? "text-rose-500" : "text-emerald-400"} />,
            colorClass: impact < 0 ? "text-rose-400" : "text-emerald-400"
        },
        {
            label: 'Iklan Hari Ini',
            value: `${remainingAds}/${AD_LIMITS.MAX_ADS_PER_DAY} Tersedia`,
            icon: remainingAds > 0 ? <Clock size={20} className="text-cyan-400" /> : <Ban size={20} className="text-rose-400" />,
            colorClass: remainingAds > 0 ? "text-cyan-400" : "text-rose-400"
        },
    ];

    const redeemableItems = [
        // ⭐ LOW COST TIER (Easy wins!)
        {
            id: 'ebook-waste',
            title: 'E-Book: Zero Waste Guide',
            cost: 500,
            brand: 'SampahKu Academy',
            icon: <Gift className="text-emerald-400" />,
            category: 'Digital'
        },
        {
            id: 'discount-10',
            title: 'Kupon Diskon 10%',
            cost: 1000,
            brand: 'Partner Stores',
            icon: <Gift className="text-cyan-400" />,
            category: 'Digital'
        },
        {
            id: 'discount-20',
            title: 'Kupon Diskon 20%',
            cost: 3000,
            brand: 'Partner Stores',
            icon: <Gift className="text-violet-400" />,
            category: 'Digital'
        },

        // ⭐ MID TIER (Real engagement required!)
        {
            id: 'seed-tree',
            title: 'Benih Kehidupan (Pohon)',
            cost: 5000,
            brand: 'LindungiHutan',
            icon: <Sprout className="text-emerald-400" />,
            category: 'Environment'
        },
        {
            id: 'donate-food',
            title: 'Supplies Drop (Panti)',
            cost: 10000,
            brand: 'KitaBisa',
            icon: <Heart className="text-rose-400" />,
            category: 'Charity'
        },

        // ⭐ HIGH TIER (Real money - expensive!)
        {
            id: 'ewallet-5k',
            title: 'Saldo E-Wallet Rp 5.000',
            cost: 20000,
            brand: 'GoPay / Dana / OVO',
            icon: <Wallet className="text-cyan-400" />,
            category: 'Finance'
        },
        {
            id: 'ewallet-10k',
            title: 'Saldo E-Wallet Rp 10.000',
            cost: 35000,
            brand: 'GoPay / Dana / OVO',
            icon: <Wallet className="text-cyan-400" />,
            category: 'Finance'
        },
        {
            id: 'pln-20k',
            title: 'Token Listrik Pintar 20k',
            cost: 50000,
            brand: 'PLN Mobile',
            icon: <Zap className="text-amber-400" />,
            category: 'Utility'
        },
        {
            id: 'merch-totebag',
            title: 'Artifact: Tas Daur Ulang',
            cost: 75000,
            brand: 'SampahKu Exclusive',
            icon: <ShoppingBag className="text-violet-400" />,
            category: 'Merchandise'
        },
    ];

    return (
        <div className="min-h-screen bg-[#02020a] text-white pt-32 pb-24 overflow-hidden relative">
            <SEO
                title="Eco Credits"
                description="Lihat saldo energi positifmu dan riwayat kontribusi terhadap ekosistem Bumi."
            />
            {/* Cosmic Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_#1e1b4b_0%,_transparent_50%)] opacity-40"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Auth Bar */}
                <div className="flex justify-end mb-8">
                    {user ? (
                        <Link to="/profile" className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 pr-6 rounded-full group hover:bg-white/[0.08] transition-all cursor-pointer">
                            <div className="relative">
                                <img
                                    src={user.photoURL}
                                    className="w-10 h-10 rounded-full border-2 border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)] object-cover"
                                    alt="Profile"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName}`;
                                    }}
                                />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#02020a] rounded-full"></div>
                            </div>
                            <div className="hidden md:block">
                                <p className="text-[8px] font-black uppercase text-violet-400 tracking-widest leading-none mb-1">Authenticated</p>
                                <p className="text-sm font-black italic uppercase text-white tracking-tighter">{user.displayName}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                title="Keluar dari Dimensi"
                                className="ml-4 p-2 text-white/20 hover:text-rose-500 transition-all hover:scale-110"
                            >
                                <LogOut size={20} />
                            </button>
                        </Link>
                    ) : (
                        <Link to="/login" className="px-8 py-3 bg-violet-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-violet-500 transition-all flex items-center gap-3 shadow-lg shadow-violet-600/20 active:scale-95">
                            <UserIcon size={16} /> Sinkron Akun
                        </Link>
                    )}
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
                    <div className="space-y-4">
                        <Link to="/" className="inline-flex items-center gap-2 text-violet-400 hover:text-white transition-colors font-black uppercase tracking-widest text-[10px] italic">
                            <ArrowLeft size={14} /> Kembali ke Beranda
                        </Link>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
                            Eco <span className="text-violet-400">Credits.</span>
                        </h1>
                        <p className="text-white/40 font-bold italic text-lg max-w-xl">
                            Manifestasi dari setiap kontribusi nyatamu dalam menjaga harmoni ekosistem Bumi.
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-3xl border-2 border-white/5 rounded-[3rem] p-8 md:px-12 md:py-10 flex items-center gap-8 shadow-2xl relative group overflow-hidden">
                        <div className="absolute inset-0 bg-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="p-6 bg-violet-500/20 rounded-[2rem] text-[#a78bfa] relative z-10 animate-float">
                            <Coins size={48} />
                        </div>
                        <div className="relative z-10">
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] block mb-1">Balance</span>
                            <span className="text-5xl md:text-6xl font-black italic tracking-tighter">{credits.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Redeem Success Modal (Overlay) */}
                {redeemResult && (
                    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-500">
                        <div className="max-w-sm w-full bg-[#050510] border-2 border-emerald-500/30 p-10 rounded-[3rem] text-center space-y-8 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
                                <Sparkles size={40} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Redeem Berhasil!</h3>
                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-relaxed">Tunjukkan kode ini ke merchant partner untuk aktivasi energi.</p>
                            </div>
                            <div className="p-6 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl">
                                <span className="text-4xl font-black tracking-[0.2em] text-emerald-400 font-mono italic">{redeemResult}</span>
                            </div>
                            <button
                                onClick={() => setRedeemResult(null)}
                                className="w-full py-4 bg-emerald-500 text-black font-black uppercase italic tracking-widest rounded-2xl hover:bg-emerald-400 transition-all"
                            >
                                Selesai
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Left: Stats & History */}
                    <div className="space-y-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {stats.map((s, i) => (
                                <div key={i} className="bg-white/[0.03] border-2 border-white/5 rounded-[2.5rem] p-6 flex items-center gap-6">
                                    <div className="p-3 bg-white/5 rounded-2xl">{s.icon}</div>
                                    <div>
                                        <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] block">{s.label}</span>
                                        {/* @ts-ignore */}
                                        <span className={`text-lg font-black italic tracking-tighter uppercase ${s.colorClass || 'text-white'}`}>{s.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* History Card */}
                        <div className="bg-white/[0.03] backdrop-blur-3xl border-2 border-white/5 rounded-[3.5rem] p-8 md:p-12 shadow-2xl space-y-8">
                            <div className="flex items-center gap-4">
                                <History className="text-violet-400" size={24} />
                                <h2 className="text-2xl font-black italic uppercase tracking-tighter">Riwayat Manifestasi</h2>
                            </div>

                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar" role="list">
                                {history.length > 0 ? (
                                    history.map((t) => (
                                        <div key={t.id} role="listitem" className="flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04]">
                                            <div className="flex items-center gap-6">
                                                <div className={`p-4 rounded-2xl ${t.type === 'earn' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                    {t.type === 'earn' ? <Sparkles size={20} /> : <Gift size={20} />}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-xs md:text-sm italic tracking-tighter uppercase leading-none mb-1">{t.description}</h4>
                                                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{new Date(t.timestamp).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-xl font-black italic tracking-tighter ${t.type === 'earn' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    {t.type === 'earn' ? '+' : '-'}{t.amount}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 text-center opacity-20 italic">
                                        <Coins size={48} className="mx-auto mb-4" />
                                        <p className="uppercase tracking-[0.5em] text-[10px] font-black">Belum Ada Riwayat Credits</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Marketplace Banner */}
                    <div className="space-y-8">
                        {!user && (
                            <div className="p-8 rounded-[3rem] bg-gradient-to-br from-amber-500/10 to-transparent border-2 border-amber-500/30 space-y-4 animate-pulse">
                                <h4 className="text-amber-400 font-black uppercase italic text-sm">Amankan Kreditmu!</h4>
                                <p className="text-xs font-bold text-white/50 leading-relaxed uppercase tracking-tighter">Masuk ke sistem agar poinmu tidak hilang saat berpindah perangkat.</p>
                                <Link to="/login" className="block text-center py-3 bg-amber-500 text-black font-black rounded-2xl uppercase italic text-[10px] tracking-widest">Connect Now</Link>
                            </div>
                        )}

                        <div className="bg-[#050510] border-2 border-white/5 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 rounded-full blur-[80px] group-hover:bg-violet-600/30 transition-all duration-700"></div>

                            <div className="relative z-10 space-y-8">
                                <div>
                                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-violet-400 border border-white/10">
                                        <ShoppingBag size={32} />
                                    </div>
                                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-2">Market <br /><span className="text-violet-400">Manifestasi.</span></h2>
                                    <p className="text-sm font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                                        Tukarkan energimu dengan Token Listrik, Saldo E-Wallet, atau Kontribusi Lingkungan.
                                    </p>
                                </div>

                                <Link to="/marketplace" className="inline-flex items-center gap-4 px-8 py-4 bg-white text-black rounded-2xl font-black uppercase italic tracking-widest hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                    Buka Market <ArrowLeft className="rotate-180" size={20} />
                                </Link>
                            </div>
                        </div>

                        {/* Sponsor Partner Link */}
                        <div className="text-center">
                            <Link to="/sponsor/info" className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white/60 transition-colors italic">
                                Daftar Menjadi Sponsor Partner →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EcoCredits;
