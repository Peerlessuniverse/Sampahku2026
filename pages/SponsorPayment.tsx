import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, ArrowRight, CheckCircle, Loader } from 'lucide-react';
import { processPayment } from '../services/sponsorService';

const SponsorPayment: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const pkg = location.state?.package;

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        contactName: '',
        email: '',
        phone: ''
    });

    if (!pkg) {
        return (
            <div className="min-h-screen bg-[#02020a] flex items-center justify-center text-white">
                <div className="text-center">
                    <p className="mb-4">Data paket tidak valid.</p>
                    <button
                        onClick={() => navigate('/sponsor')}
                        className="text-violet-400 hover:text-violet-300 underline"
                    >
                        Kembali ke Halaman Sponsor
                    </button>
                </div>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await processPayment({
                ...formData,
                packageTitle: pkg.title,
                amount: pkg.price
            });

            if (result.success) {
                // Simulate success delay slightly for UX
                setTimeout(() => {
                    navigate('/login', {
                        state: {
                            role: 'sponsor',
                            tab: 'partner'
                        }
                    });
                }, 1000);
            }
        } catch (error) {
            console.error('Payment failed', error);
            alert('Pembayaran gagal. Silakan coba lagi.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#02020a] text-white pt-28 pb-24 px-6 relative overflow-hidden font-sans selection:bg-violet-500/30">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_90%_10%,_#064e3b_0%,_transparent_40%)] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Left Column: Order Summary */}
                <div className="space-y-6">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sticky top-28">
                        <div className="flex items-center gap-3 mb-6 opacity-50">
                            <CreditCard size={20} />
                            <span className="text-xs font-black uppercase tracking-widest">Rincian Investasi</span>
                        </div>

                        <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">{pkg.title}</h2>
                        <div className="text-emerald-400 text-4xl font-black tracking-tighter mb-8">{pkg.price}</div>

                        <div className="space-y-4 text-sm text-white/70 border-t border-white/10 pt-6">
                            <div className="flex justify-between">
                                <span>Durasi Tayang</span>
                                <span className="font-bold text-white">{pkg.duration}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Slot Iklan</span>
                                <span className="font-bold text-white">Prioritas</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Platform Fee</span>
                                <span className="font-bold text-white">Rp 0</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10">
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Total</span>
                                <span className="text-emerald-400">{pkg.price}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Payment Form */}
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-full text-emerald-400 mb-4 border border-emerald-500/20">
                            <Lock size={20} />
                        </div>
                        <h3 className="text-2xl font-bold">Data Penagihan</h3>
                        <p className="text-white/40 text-sm mt-1">Lengkapi data untuk menyelesaikan kontrak.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label htmlFor="companyName" className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Nama Perusahaan / Brand</label>
                            <input
                                type="text"
                                id="companyName"
                                name="companyName"
                                required
                                value={formData.companyName}
                                onChange={handleInputChange}
                                className="w-full bg-[#0a0a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-white/20"
                                placeholder="Contoh: PT. Hijau Lestari"
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="contactName" className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Nama Penanggung Jawab</label>
                            <input
                                type="text"
                                id="contactName"
                                name="contactName"
                                required
                                value={formData.contactName}
                                onChange={handleInputChange}
                                className="w-full bg-[#0a0a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-white/20"
                                placeholder="Nama Lengkap"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0a0a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-white/20"
                                    placeholder="email@perusahaan.com"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">WhatsApp</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#0a0a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-white/20"
                                    placeholder="0812..."
                                />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full group bg-emerald-500 hover:bg-emerald-400 text-[#02020a] font-black h-14 rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <Loader className="animate-spin" />
                                ) : (
                                    <>
                                        <span>Proses Pembayaran</span>
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[10px] text-white/30 mt-4 uppercase tracking-widest">
                                Secured by Utas.co.id Gateway
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SponsorPayment;
