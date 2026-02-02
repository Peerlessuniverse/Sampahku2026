import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Filter, Wallet, Zap, Sprout, Heart, Search, ArrowRight, Sparkles } from 'lucide-react';
import { getCredits, redeemCredits, syncWithCloud } from '../services/creditService';
import { isAuthenticated, getCurrentUser } from '../services/authService';
import SEO from '../components/SEO';

const Marketplace: React.FC = () => {
    const navigate = useNavigate();
    const [credits, setCredits] = useState(getCredits());
    const [user] = useState(getCurrentUser());
    const [redeemResult, setRedeemResult] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const handleCreditsUpdate = (e: any) => {
            setCredits(e.detail.credits);
        };
        window.addEventListener('creditsUpdated', handleCreditsUpdate);

        // Initial sync
        if (isAuthenticated()) syncWithCloud();

        return () => window.removeEventListener('creditsUpdated', handleCreditsUpdate);
    }, []);

    const handleRedeem = async (item: any) => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        const confirmRedeem = window.confirm(`Tukarkan ${item.cost} poin untuk ${item.title}?`);
        if (!confirmRedeem) return;

        const code = await redeemCredits(item.cost, item.title);
        if (code) {
            setRedeemResult(code);
        } else {
            alert('Saldo energi tidak mencukupi untuk manifestasi ini.');
        }
    };

    // Rewards Data - In a real app, this would be fetched from a backend
    const rewards = [
        {
            id: 'ewallet-10k',
            title: 'Saldo E-Wallet Rp 10.000',
            cost: 10000,
            brand: 'GoPay / Dana / OVO',
            icon: <Wallet className="text-cyan-400" />,
            category: 'Finance',
            description: 'Konversi energimu menjadi saldo digital.'
        },
        {
            id: 'pln-20k',
            title: 'Token Listrik Pintar 20k',
            cost: 20000,
            brand: 'PLN Mobile',
            icon: <Zap className="text-amber-400" />,
            category: 'Utility',
            description: 'Terangi rumahmu dengan energi daur ulang.'
        },
        {
            id: 'merch-totebag',
            title: 'Artifact: Tas Daur Ulang',
            cost: 45000,
            brand: 'SampahKu Exclusive',
            icon: <ShoppingBag className="text-violet-400" />,
            category: 'Merchandise',
            description: 'Tas belanja eksklusif dari material daur ulang.'
        },
        {
            id: 'seed-tree',
            title: 'Benih Kehidupan (Pohon)',
            cost: 5000,
            brand: 'LindungiHutan',
            icon: <Sprout className="text-emerald-400" />,
            category: 'Environment',
            description: 'Tanam satu kebaikan untuk bumi.'
        },
        {
            id: 'donate-food',
            title: 'Supplies Drop (Panti)',
            cost: 25000,
            brand: 'KitaBisa',
            icon: <Heart className="text-rose-400" />,
            category: 'Charity',
            description: 'Berbagi kebahagiaan dengan mereka yang membutuhkan.'
        },
        // Additional Items for Full Marketplace Feel
        {
            id: 'data-package',
            title: 'Data Internet 5GB',
            cost: 15000,
            brand: 'All Operators',
            icon: <Zap className="text-blue-400" />,
            category: 'Utility',
            description: 'Koneksi tanpa batas untuk belajar.'
        },
        {
            id: 'coffee-voucher',
            title: 'Voucher Kopi Kenangan',
            cost: 18000,
            brand: 'Kopi Kenangan',
            icon: <ShoppingBag className="text-orange-400" />,
            category: 'Lifestyle',
            description: 'Nikmati segelas kopi dari hasil pilah sampah.'
        }
    ];

    const categories = ['All', 'Finance', 'Utility', 'Environment', 'Charity', 'Merchandise', 'Lifestyle'];

    const filteredRewards = rewards.filter(r => {
        const matchesFilter = activeFilter === 'All' || r.category === activeFilter;
        const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.brand.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#02020a] text-white pt-28 pb-24 relative overflow-hidden font-sans selection:bg-violet-500/30">
            <SEO
                title="Marketplace Energi"
                description="Tukarkan Eco-Credits dengan token listrik, voucher e-wallet, atau donasi lingkungan."
            />
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_20%,_#1e1b4b_0%,_transparent_40%)] pointer-events-none"></div>
            <div className="fixed bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_90%_80%,_#312e81_0%,_transparent_40%)] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
                    <div className="space-y-4">
                        <Link to="/credits" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
                            ← Kembali ke Wallet
                        </Link>
                        <div>
                            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-2">
                                Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Manifestasi.</span>
                            </h1>
                            <p className="text-white/40 max-w-xl font-bold italic tracking-wide">
                                Pusat penukaran energi positif. Item dan nilai tukar diatur secara dinamis oleh Pusat Komando berdasarkan keseimbangan ekosistem.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] flex items-center gap-6">
                        <div className="text-right">
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] block">Saldo Aktif</span>
                            <span className="text-3xl font-black italic tracking-tighter text-emerald-400">{credits.toLocaleString()} pts</span>
                        </div>
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                            <Sparkles size={24} />
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="sticky top-24 z-30 bg-[#02020a]/80 backdrop-blur-xl border-y border-white/5 py-4 mb-10 -mx-6 px-6 md:mx-0 md:rounded-full md:border md:px-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveFilter(cat)}
                                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeFilter === cat
                                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40'
                                        : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                            <input
                                type="text"
                                placeholder="Cari reward..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-xs font-bold text-white focus:outline-none focus:border-violet-500 transition-colors placeholder:text-white/20 uppercase tracking-widest"
                            />
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRewards.map((item, idx) => (
                        <div key={item.id} className="group relative bg-[#0a0a1a] border border-white/5 rounded-[2.5rem] p-6 hover:border-violet-500/30 hover:bg-white/[0.02] transition-all duration-300 flex flex-col h-full">
                            <div className="absolute top-6 right-6">
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/20 bg-white/5 px-3 py-1 rounded-full">{item.category}</span>
                            </div>

                            <div className="mb-8 p-6 bg-black/20 rounded-[2rem] w-20 h-20 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-500">
                                {React.cloneElement(item.icon as React.ReactElement<any>, { size: 32 })}
                            </div>

                            <div className="flex-grow space-y-2 mb-8">
                                <h3 className="text-xl font-black italic uppercase tracking-tighter leading-tight group-hover:text-violet-400 transition-colors">{item.title}</h3>
                                <p className="text-[10px] text-white/50 font-bold uppercase tracking-wide">{item.brand}</p>
                                <p className="text-sm text-white/60 leading-relaxed font-medium line-clamp-2">{item.description}</p>
                            </div>

                            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Nilai Tukar</p>
                                    <p className="text-2xl font-black italic tracking-tighter">{item.cost.toLocaleString()} <span className="text-xs font-normal opacity-50">pts</span></p>
                                </div>
                                <button
                                    onClick={() => handleRedeem(item)}
                                    disabled={credits < item.cost}
                                    title={`Tukarkan ${item.title}`}
                                    aria-label={`Tukarkan ${item.title} seharga ${item.cost} poin`}
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${credits >= item.cost
                                        ? 'bg-white text-black hover:bg-violet-400 hover:scale-110 shadow-lg shadow-white/10'
                                        : 'bg-white/5 text-white/20 cursor-not-allowed'
                                        }`}
                                >
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredRewards.length === 0 && (
                    <div className="text-center py-20">
                        <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search size={32} className="text-white/20" />
                        </div>
                        <h3 className="text-xl font-black uppercase italic tracking-wider text-white/40">Item Tidak Ditemukan</h3>
                        <p className="text-[10px] uppercase tracking-widest text-white/20 mt-2">Coba kata kunci lain atau kategori berbeda</p>
                    </div>
                )}

            </div>

            {/* Redeem Success Modal */}
            {redeemResult && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-500">
                    <div className="max-w-sm w-full bg-[#050510] border-2 border-emerald-500/30 p-10 rounded-[3rem] text-center space-y-8 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
                        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
                            <Sparkles size={40} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Redeem Berhasil!</h3>
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-relaxed">Tunjukkan kode ini ke merchant partner atau simpan di dompet digitalmu.</p>
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
        </div>
    );
};

export default Marketplace;
