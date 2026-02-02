import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Heart, Sparkles, BarChart3, Settings,
    ArrowRight, ShieldCheck, Zap, X, CheckCircle2,
    Mail, Briefcase, Globe
} from 'lucide-react';
import { dbRequestAdvertiserAccount } from '../services/adsManagementService';

const SponsorLanding: React.FC = () => {
    const navigate = useNavigate();
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        brand_name: '',
        email: '',
    });

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
            color: "violet",
            id: "nebula-basic"
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
            popular: true,
            id: "galactic-reach"
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
            color: "amber",
            id: "cosmic-empire"
        }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            console.log("📤 Mengirim request ke Firestore:", {
                ...formData,
                package_type: selectedPackage || 'custom'
            });
            const requestId = await dbRequestAdvertiserAccount({
                ...formData,
                package_type: selectedPackage || 'custom'
            });
            console.log("✅ Request berhasil dibuat dengan ID:", requestId);
            setIsSuccess(true);
            setTimeout(() => {
                setShowRegisterModal(false);
                setIsSuccess(false);
                setFormData({ brand_name: '', email: '' });
            }, 3000);
        } catch (err) {
            console.error("❌ Error saat membuat request:", err);
            alert("Terjadi kesalahan teknis. Sinyal kosmik terganggu: " + (err as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openRegister = (pkgId: string) => {
        setSelectedPackage(pkgId);
        setShowRegisterModal(true);
    };

    return (
        <div className="bg-[#02020a] min-h-screen text-white pt-32 pb-24 overflow-x-hidden relative">
            {/* Background Decorative */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_70%)] pointer-events-none"></div>
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_80%,_#312e81_0%,_transparent_50%)] opacity-30 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header Section */}
                <div className="text-center mb-24 space-y-8">
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
                                <button
                                    onClick={() => openRegister(card.id)}
                                    className={`block w-full py-5 rounded-2xl font-black text-sm uppercase italic tracking-widest text-center transition-all ${card.color === 'violet' ? 'bg-violet-600 hover:bg-violet-500' : card.color === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-amber-600 hover:bg-amber-500'} hover:scale-105 active:scale-95`}
                                >
                                    Daftar Sekarang
                                </button>
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
                            onClick={() => navigate('/login', { state: { role: 'advertiser' } })}
                            className="inline-flex items-center gap-6 bg-white text-[#02020a] font-black px-12 py-8 rounded-[2.5rem] hover:scale-110 transition-all shadow-[0_40px_100px_rgba(255,255,255,0.1)] uppercase tracking-tighter text-2xl italic group"
                        >
                            Masuk Ke Portal <ArrowRight size={32} className="group-hover:translate-x-3 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Registration Modal */}
            {showRegisterModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
                    <div className="bg-[#0A0A15] border border-white/10 w-full max-w-xl rounded-[4rem] p-12 relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        {isSuccess ? (
                            <div className="text-center py-10 space-y-6">
                                <div className="w-24 h-24 bg-emerald-500/20 border-2 border-emerald-500/50 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <CheckCircle2 size={48} className="text-emerald-500" />
                                </div>
                                <h3 className="text-4xl font-black italic uppercase tracking-tighter">Request Terkirim!</h3>
                                <p className="text-white/40 font-bold uppercase tracking-widest text-xs italic">
                                    Tim Admin kami akan segera memverifikasi data brand Anda. <br /> Mohon cek email Anda secara berkala.
                                </p>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => setShowRegisterModal(false)}
                                    className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
                                    title="Close"
                                >
                                    <X size={24} />
                                </button>
                                <div className="mb-10">
                                    <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Request Akses Partner</h3>
                                    <p className="text-xs text-white/40 font-black uppercase tracking-widest italic">Hubungkan Brand Anda ke Ekosistem SampahKu</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="space-y-3">
                                        <label htmlFor="brand_name" className="text-[10px] font-black text-violet-400 uppercase tracking-widest ml-2 italic">Identitas Brand</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                            <input
                                                id="brand_name"
                                                required
                                                type="text"
                                                placeholder="Nama Perusahaan / Brand"
                                                className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-14 py-5 font-bold text-white focus:border-violet-500 outline-none transition-all"
                                                value={formData.brand_name}
                                                onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label htmlFor="email" className="text-[10px] font-black text-violet-400 uppercase tracking-widest ml-2 italic">Saluran Komunikasi (Email)</label>
                                        <div className="relative">
                                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                            <input
                                                id="email"
                                                required
                                                type="email"
                                                placeholder="email@perusahaan.com"
                                                className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-14 py-5 font-bold text-white focus:border-violet-500 outline-none transition-all"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="w-full py-6 bg-violet-600 rounded-3xl font-black uppercase tracking-widest italic text-sm hover:bg-violet-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-violet-900/40"
                                    >
                                        {isSubmitting ? <Zap className="animate-spin" size={18} /> : <>Manifestasi Brand Sekarang <ArrowRight size={18} /></>}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SponsorLanding;
