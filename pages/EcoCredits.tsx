import React, { useState, useEffect } from 'react';
import { Coins, ArrowLeft, History, Award, Zap, Gift, ShieldCheck, TrendingUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCredits, getCreditHistory, CreditTransaction } from '../services/creditService';

const EcoCredits: React.FC = () => {
    const [credits, setCredits] = useState(getCredits());
    const [history, setHistory] = useState<CreditTransaction[]>(getCreditHistory());

    useEffect(() => {
        const handleCreditsUpdate = (e: any) => {
            setCredits(e.detail.credits);
            setHistory(getCreditHistory());
        };

        window.addEventListener('creditsUpdated', handleCreditsUpdate);
        return () => window.removeEventListener('creditsUpdated', handleCreditsUpdate);
    }, []);

    const stats = [
        { label: 'Rank', value: 'Guardian I', icon: <ShieldCheck size={20} className="text-cyan-400" /> },
        { label: 'Level', value: '12', icon: <TrendingUp size={20} className="text-violet-400" /> },
        { label: 'Impact', value: '0.4 Ton CO2', icon: <Zap size={20} className="text-amber-400" /> },
    ];

    const rewards = [
        { title: 'Voucher Listrik Pintar', cost: 1000, brand: 'PLN Mobile', icon: <Zap /> },
        { title: 'Diskon Belanja Organik', cost: 500, brand: 'Saka Market', icon: <Gift /> },
        { title: 'Donasi Pohon Bakau', cost: 200, brand: 'Eco-Earth', icon: <Award /> },
    ];

    return (
        <div className="min-h-screen bg-[#02020a] text-white pt-32 pb-24 overflow-hidden relative">
            {/* Cosmic Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_#1e1b4b_0%,_transparent_50%)] opacity-40"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,_#312e81_0%,_transparent_50%)] opacity-20"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
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

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left: Stats & History */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {stats.map((s, i) => (
                                <div key={i} className="bg-white/[0.03] border-2 border-white/5 rounded-[2.5rem] p-6 flex items-center gap-6 hover:border-white/10 transition-all">
                                    <div className="p-3 bg-white/5 rounded-2xl">{s.icon}</div>
                                    <div>
                                        <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] block">{s.label}</span>
                                        <span className="text-lg font-black text-white italic tracking-tighter uppercase">{s.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* History Table */}
                        <div className="bg-white/[0.03] backdrop-blur-3xl border-2 border-white/5 rounded-[3.5rem] p-8 md:p-12 shadow-2xl space-y-8 overflow-hidden">
                            <div className="flex items-center gap-4">
                                <History className="text-violet-400" size={24} />
                                <h2 className="text-2xl font-black italic uppercase tracking-tighter">Riwayat Manifestasi</h2>
                            </div>

                            <div className="space-y-4">
                                {history.length > 0 ? (
                                    history.map((t) => (
                                        <div key={t.id} className="flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                                            <div className="flex items-center gap-6">
                                                <div className={`p-4 rounded-2xl ${t.type === 'earn' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                    {t.type === 'earn' ? <Sparkles size={20} /> : <Gift size={20} />}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-lg italic tracking-tighter uppercase leading-none mb-1">{t.description}</h4>
                                                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{new Date(t.timestamp).toLocaleDateString()} • {new Date(t.timestamp).toLocaleTimeString()}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-2xl font-black italic tracking-tighter ${t.type === 'earn' ? 'text-emerald-400' : 'text-rose-400'}`}>
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

                    {/* Right: Future Rewards/Market */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-gradient-to-br from-violet-900/40 to-indigo-900/20 border-2 border-violet-500/20 rounded-[4rem] p-10 md:p-12 shadow-2xl relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-400/10 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>

                            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-8 relative z-10">Tukar <span className="text-violet-400">Rewards.</span></h2>

                            <div className="space-y-6 relative z-10">
                                {rewards.map((r, i) => (
                                    <div key={i} className="group/item relative">
                                        <div className="absolute inset-0 bg-white/5 scale-x-0 group-hover/item:scale-x-100 origin-left transition-transform duration-500 rounded-3xl -mx-4"></div>
                                        <div className="relative flex items-center justify-between p-4 cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover/item:text-violet-400 transition-colors">
                                                    {React.cloneElement(r.icon as React.ReactElement, { size: 20 })}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-sm italic uppercase tracking-tighter">{r.title}</h4>
                                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">{r.brand}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-sm font-black text-violet-400 italic tracking-tighter">{r.cost} <span className="text-[8px] text-white/20 uppercase tracking-widest">ECO</span></span>
                                                <span className="text-[7px] font-black text-emerald-400 uppercase tracking-widest opacity-0 group-hover/item:opacity-100 transition-opacity">Tukarkan</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-8 mt-4 border-t border-white/10 text-center">
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic mb-6">Partner Merchant Kami</p>
                                    <div className="flex justify-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20"></div>
                                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20"></div>
                                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-emerald-500/10 border-2 border-emerald-500/20 rounded-[3rem] shadow-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <Award size={24} className="text-emerald-400" />
                                <span className="text-xs font-black uppercase tracking-widest text-emerald-400 italic leading-none">Misi Mingguan</span>
                            </div>
                            <p className="text-sm font-bold italic tracking-tighter text-white/50 leading-tight mb-6">
                                Selesaikan <span className="text-white font-black">5x Pemindaian Sampah</span> dalam seminggu untuk bonus 200 Eco-Credits extra!
                            </p>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{ width: '60%' }}></div>
                            </div>
                            <div className="flex justify-between mt-2 text-[8px] font-black text-white/20 uppercase tracking-widest">
                                <span>Progres: 3 / 5</span>
                                <span>60%</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EcoCredits;
