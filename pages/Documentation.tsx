import React from 'react';
import {
    Book,
    Scan,
    Zap,
    Recycle,
    Globe,
    Dna,
    ArrowRight,
    ShieldCheck,
    Sparkles,
    Database,
    Star,
    Flame,
    Droplets,
    Leaf
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getStoredSponsors, SponsorData } from '../services/sponsorService';

const Documentation: React.FC = () => {
    const sections = [
        {
            id: 'scanner',
            title: 'AI Scanner & Identitas Materi',
            icon: <Scan className="w-8 h-8 text-cyan-400" />,
            desc: 'Fitur utama yang menggunakan kecerdasan artifisial Gemini untuk mengidentifikasi jenis sampah melalui kamera atau unggahan foto.',
            features: [
                'Identifikasi Real-time: Kenali jenis sampah dalam hitungan detik.',
                'Klasifikasi Orbit: Menentukan apakah materi termasuk Organik, Anorganik, B3, atau Residu.',
                'Saran Transformasi: Memberikan rekomendasi metode pengolahan yang paling tepat setelah identifikasi.'
            ]
        },
        {
            id: 'transformation',
            title: 'Modul Transformasi Materi',
            icon: <Recycle className="w-8 h-8 text-emerald-400" />,
            desc: 'Panduan langkah-demi-langkah (Execution Protocol) untuk mengubah sampah menjadi sumber daya berharga.',
            features: [
                'Protokol Organik: Metode Takakura, Loseda, Maggot BSF, dan lainnya.',
                'Siklus Anorganik: Panduan Ecobrick, Bank Sampah, dan Kerajinan Daur Ulang.',
                'Penanganan B3: Titik Dropbox E-Waste dan Solidifikasi Medis.',
                'Manajemen Residu: Konversi ke RDF (Refuse Derived Fuel).'
            ]
        },
        {
            id: 'credits',
            title: 'Eco-Credits & Ekonomi Kosmik',
            icon: <Zap className="w-8 h-8 text-yellow-400" />,
            desc: 'Sistem reward berbasis aktivitas (Proof of Action) yang memberikan apresiasi atas kontribusi lingkungan Anda.',
            features: [
                'Sinkronisasi Energi: Dapatkan 25-50 Eco-Credits untuk setiap metode yang dipelajari.',
                'Peringkat Galaksi: Bandingkan kontribusi Anda dengan pengguna lain di leaderboard.',
                'Redeem Rewards: Tukarkan kredit dengan akses eksklusif atau benefit dari partner kami.'
            ]
        },
        {
            id: 'calculator',
            title: 'Kalkulator Jejak Karbon',
            icon: <Globe className="w-8 h-8 text-indigo-400" />,
            desc: 'Alat ukur presisi untuk menghitung distorsi energi (emisi CO2) berdasarkan gaya hidup harian.',
            features: [
                'Parameter Multidimensi: Transportasi, Listrik, Diet, dan Kebiasaan Belanja.',
                'Visualisasi Data: Grafik interaktif yang menunjukkan sumber emisi terbesar Anda.',
                'Rekomendasi Offset: Saran praktis untuk menyeimbangkan kembali jejak karbon Anda.'
            ]
        },
        {
            id: 'wte',
            title: 'WtE Lab (Waste to Energy)',
            icon: <Flame className="w-8 h-8 text-orange-400" />,
            desc: 'Pusat riset dan demonstrasi teknologi masa depan dalam mengubah sampah residu menjadi energi murni.',
            features: [
                'Siklus Termal Plastik: Pembangkitan listrik dari panas pembakaran terkontrol.',
                'Simbiosis Baterai Organik: Pemanfaatan limbah untuk penyimpanan energi.',
                'Microbial Fuel Cell (MFC): Menghasilkan listrik langsung dari aktivitas bakteri pengurai.'
            ]
        },
        {
            id: 'sponsor',
            title: 'Sponsor & Partner Portal',
            icon: <ShieldCheck className="w-8 h-8 text-violet-400" />,
            desc: 'Gerbang khusus bagi entitas bisnis dan organisasi untuk berkontribusi pada skala ekosistem.',
            features: [
                'Ad Transparency: Laporan impresi dan jangkauan kampanye secara real-time.',
                'Brand Manifestation: Penempatan logo dan pesan di momen-momen edukatif.',
                'CSR Integration: Hubungkan aktivitas keberlanjutan brand Anda langsung dengan aksi pengguna.'
            ]
        },
        {
            id: 'tiers',
            title: 'Tingkatan Kemitraan (Sponsorship Tiers)',
            icon: <Star className="w-8 h-8 text-amber-400" />,
            desc: 'Tiga level manifestasi brand untuk menyesuaikan energi dan jangkauan organisasi Anda.',
            features: [
                'Nebula Core: Visibilitas dasar dengan 1 slot iklan statis di momen transisi dan analisis statistik esensial.',
                'Galactic Reach: Multi-slot iklan, targeting iklan berdasarkan kategori sampah, dan laporan dampak lingkungan mendalam.',
                'Cosmic Empire: Kustomisasi tema warna aplikasi, lencana "Verified Partner", background video, dan konsultasi strategi.'
            ]
        }
    ];

    return (
        <div className="bg-[#02020a] min-h-screen text-white font-sans selection:bg-violet-500/30">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-40 pb-24 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_transparent_70%)] opacity-30"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-top-12 duration-1000">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-3xl shadow-2xl">
                            <Book size={48} className="text-violet-400" />
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">
                                Dokumentasi <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Ekosistem.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-white/40 font-bold italic uppercase tracking-widest max-w-3xl mx-auto">
                                Panduan komprehensif untuk menguasai setiap modul dan fitur dalam portal SampahKu 2026.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {sections.map((section, idx) => (
                            <div
                                key={section.id}
                                id={section.id}
                                className="group p-10 md:p-14 rounded-[4rem] bg-white/[0.02] border-2 border-white/5 hover:border-violet-500/30 transition-all duration-700 hover:-translate-y-4 hover:bg-white/[0.04] relative overflow-hidden"
                            >
                                {/* Background Number */}
                                <span className="absolute -right-4 -top-8 text-[12rem] font-black text-white/[0.02] select-none group-hover:text-white/[0.05] transition-colors">
                                    {idx + 1}
                                </span>

                                <div className="relative z-10 space-y-10">
                                    <div className="flex items-center gap-6">
                                        <div className="p-5 bg-white/5 rounded-3xl border border-white/10 group-hover:scale-110 group-hover:bg-violet-500/10 transition-all duration-500 shadow-xl">
                                            {section.icon}
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-none">
                                            {section.title}
                                        </h2>
                                    </div>

                                    <p className="text-lg md:text-xl text-white/60 font-medium italic leading-relaxed tracking-tight group-hover:text-white/80 transition-colors">
                                        {section.desc}
                                    </p>

                                    <ul className="space-y-4">
                                        {section.features.map((feature, i) => (
                                            <li key={i} className="flex gap-4 items-start group/li">
                                                <div className="mt-1.5 w-2 h-2 rounded-full bg-violet-400 group-hover/li:scale-150 transition-transform shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
                                                <span className="text-sm md:text-base font-bold text-white/40 uppercase italic tracking-tighter group-hover/li:text-white transition-colors">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Start / Help Section */}
            <section className="py-32 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="p-12 md:p-24 rounded-[5rem] bg-gradient-to-br from-violet-600/20 to-transparent border-2 border-white/10 text-center space-y-12 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

                        <div className="relative z-10 space-y-6">
                            <Sparkles size={64} className="text-violet-400 mx-auto animate-pulse" />
                            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">
                                Butuh Bantuan <br /> <span className="text-violet-400">Instan?</span>
                            </h2>
                            <p className="text-xl text-white/40 font-bold italic uppercase tracking-wider max-w-xl mx-auto">
                                Tanyakan langsung pada AI Assistant kami untuk panduan penggunaan aplikasi secara real-time.
                            </p>
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-6">
                            <button
                                onClick={() => window.open('https://wa.me/628123456789', '_blank')}
                                className="px-12 py-6 bg-white text-[#02020a] font-black uppercase italic tracking-widest rounded-3xl hover:scale-110 transition-all flex items-center gap-4 shadow-[0_30px_60px_rgba(255,255,255,0.1)] active:scale-95"
                            >
                                Chat Support <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Hall of Fame Section */}
            <section className="py-32 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto space-y-20">
                    <div className="text-center space-y-6">
                        <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">
                            Hall of <span className="text-amber-400">Fame.</span>
                        </h2>
                        <p className="text-xl text-white/30 font-bold italic uppercase tracking-widest max-w-2xl mx-auto">
                            Apresiasi tertinggi bagi para perintis energi yang menjaga kestabilan ekosistem semesta.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {getStoredSponsors().filter(s => s.status === 'active').map((sponsor) => (
                            <div
                                key={sponsor.id}
                                className={`group relative aspect-square rounded-[2rem] bg-white/[0.03] border-2 flex flex-col items-center justify-center p-6 text-center transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.05] ${sponsor.plan === 'cosmic'
                                    ? 'border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.1)]'
                                    : 'border-white/5'
                                    }`}
                            >
                                {sponsor.plan === 'cosmic' && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[7px] font-black uppercase px-3 py-1 rounded-full shadow-lg z-10 flex items-center gap-1">
                                        <Star size={8} fill="currentColor" /> Cosmic Partner
                                    </div>
                                )}

                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/5 mb-4 flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-white/30 transition-colors">
                                    {sponsor.mediaUrl && sponsor.mediaType === 'image' ? (
                                        <img src={sponsor.mediaUrl} alt={sponsor.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                    ) : (
                                        <div className="text-white/20 font-black text-xs uppercase italic drop-shadow-sm">
                                            {sponsor.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                    )}
                                </div>

                                <h4 className="text-xs md:text-sm font-black uppercase italic tracking-tighter text-white/60 group-hover:text-white transition-colors">
                                    {sponsor.name}
                                </h4>
                                <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {sponsor.tagline}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Placeholder for "Your Brand Here" if space exists */}
                    <div className="flex justify-center pt-12">
                        <Link
                            to="/sponsor/info"
                            className="text-amber-400 font-black uppercase italic tracking-[0.3em] text-[10px] hover:text-white transition-colors flex items-center gap-3 group"
                        >
                            Daftarkan Brand Anda Dalam Hall of Fame <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Documentation;
