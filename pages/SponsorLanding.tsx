import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Heart,
    Sparkles,
    BarChart3,
    Settings,
    ArrowRight,
    ShieldCheck,
    Zap,
    Layers,
    Gem,
    Globe
} from 'lucide-react';

const SponsorLanding: React.FC = () => {
    const navigate = useNavigate();

    const rateCards = [
        {
            title: "Nebula Core",
            price: "Rp 1.500.000",
            duration: "30 Hari",
            features: [
                "1 Slot Iklan Utama",
                "Impresi Tak Terbatas",
                "Analisa Statistik Dasar",
                "Prioritas Tampilan Kosmik"
            ],
            color: "violet"
        },
        {
            title: "Galactic Reach",
            price: "Rp 3.750.000",
            duration: "90 Hari",
            features: [
                "2 Slot Iklan Multisensor",
                "Analisa Statistik Mendalam",
                "Targeting Segmentasi Materi",
                "Laporan Dampak Karbon",
                "Prioritas Support 24/7"
            ],
            color: "emerald",
            popular: true
        },
        {
            title: "Cosmic Empire",
            price: "Rp 10.000.000",
            duration: "1 Tahun",
            features: [
                "Semua Fitur Galactic",
                "Custom Theme Branding",
                "Video Background Eksklusif",
                "Verified Partner Badge",
                "Konsultasi Strategi Circular"
            ],
            color: "amber"
        }
    ];

    return (
        <div className="bg-[#02020a] min-h-screen text-white pt-32 pb-24 overflow-x-hidden relative">
            {/* Background Decorative */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_70%)] pointer-events-none"></div>
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_80%,_#312e81_0%,_transparent_50%)] opacity-30 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header Section */}
                <div className="text-center mb-24 space-y-8 animate-in slide-in-from-top duration-1000">
                    <div className="inline-flex items-center justify-center p-6 bg-violet-500/10 rounded-[3rem] border-2 border-violet-500/20 shadow-3xl">
                        <Heart size={48} className="text-violet-400 animate-pulse" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">
                            Selamat Datang, <br /> <span className="text-violet-400">Partner Kami.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/40 font-bold italic uppercase tracking-tighter max-w-3xl mx-auto">
                            Terima kasih telah bergabung dalam misi menjaga keseimbangan kosmos. <br /> Kontribusi Anda adalah energi bagi keberlanjutan.
                        </p>
                    </div>
                </div>

                {/* Info Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32 items-center">
                    <div className="bg-white/[0.03] backdrop-blur-3xl p-10 md:p-16 rounded-[4rem] border-2 border-white/5 space-y-8">
                        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Visi Kolaborasi</h2>
                        <p className="text-xl text-white/60 font-medium italic leading-relaxed uppercase tracking-tighter">
                            "Di SampahKu, kami tidak hanya mengelola limbah, kami mengelola masa depan. Sebagai partner, brand Anda akan menjadi saksi sekaligus penggerak dalam setiap langkah transformasi materi menjadi energi murni."
                        </p>
                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <div className="flex items-center gap-4">
                                <ShieldCheck className="text-emerald-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Verified Support</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Zap className="text-amber-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Instant Sync</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 space-y-4 hover:border-violet-500 transition-all group">
                            <BarChart3 className="text-violet-400 group-hover:scale-110 transition-transform" />
                            <h3 className="font-black uppercase italic text-xl">Pantau Statistik</h3>
                            <p className="text-xs text-white/30 font-bold uppercase italic">Lihat impresi dan klik secara real-time dari setiap interaksi pengguna.</p>
                        </div>
                        <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 space-y-4 hover:border-emerald-500 transition-all group">
                            <Settings className="text-emerald-400 group-hover:scale-110 transition-transform" />
                            <h3 className="font-black uppercase italic text-xl">Kelola Konten</h3>
                            <p className="text-xs text-white/30 font-bold uppercase italic">Unggah aset gambar atau video untuk tampil di momen kritikal pengguna.</p>
                        </div>
                    </div>
                </div>

                {/* Rate Card Section */}
                <div className="mb-32">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter underline decoration-violet-500/30 underline-offset-8">Ecosystem Rate Card</h2>
                        <p className="text-white/40 font-bold italic uppercase tracking-widest text-sm">Pilih slot manifestasi yang sesuai dengan energi brand Anda.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {rateCards.map((card, i) => (
                            <div key={i} className={`relative p-10 rounded-[3.5rem] border-2 bg-white/[0.02] backdrop-blur-3xl transition-all duration-500 hover:-translate-y-4 flex flex-col ${card.popular ? 'border-violet-500 shadow-[0_40px_100px_rgba(139,92,246,0.15)] scale-105 z-10' : 'border-white/5 hover:border-white/20'}`}>
                                {card.popular && (
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-violet-600 rounded-full text-[8px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                        <Sparkles size={12} /> Paling Populer
                                    </div>
                                )}
                                <div className="mb-8">
                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">{card.title}</h3>
                                    <p className="text-xs text-white/30 font-bold uppercase tracking-widest italic">{card.duration}</p>
                                </div>
                                <div className="mb-10">
                                    <span className="text-4xl font-black tracking-tighter">{card.price}</span>
                                </div>
                                <ul className="space-y-4 mb-12 flex-grow">
                                    {card.features.map((f, fi) => (
                                        <li key={fi} className="flex items-center gap-3 text-xs font-bold uppercase italic text-white/60">
                                            <div className={`w-1.5 h-1.5 rounded-full ${card.color === 'violet' ? 'bg-violet-400' : card.color === 'emerald' ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link to="/contact" className={`w-full py-5 rounded-2xl font-black text-sm uppercase italic tracking-widest text-center transition-all ${card.color === 'violet' ? 'bg-violet-600' : card.color === 'emerald' ? 'bg-emerald-600' : 'bg-amber-600'} hover:scale-105 active:scale-95`}>
                                    Hubungi Sales
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Final CTA */}
                <div className="text-center group bg-white/[0.02] border-2 border-white/10 p-16 md:p-24 rounded-[4rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[100px]"></div>
                    <div className="relative z-10 space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">Siap Untuk <br /> <span className="text-violet-400">Masuk Ke Portal Utama?</span></h2>
                            <p className="text-white/40 font-bold italic uppercase tracking-widest max-w-xl mx-auto">
                                Semua pengaturan dan statistik kampanye Anda siap untuk di kelola sekarang.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/login')}
                            className="inline-flex items-center gap-6 bg-white text-[#02020a] font-black px-12 py-8 rounded-[2.5rem] hover:scale-110 transition-all shadow-[0_40px_100px_rgba(255,255,255,0.1)] uppercase tracking-tighter text-2xl italic group"
                        >
                            Masuk Ke Portal <ArrowRight size={32} className="group-hover:translate-x-3 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SponsorLanding;
