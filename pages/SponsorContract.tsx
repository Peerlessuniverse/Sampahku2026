import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Scroll, CheckCircle, ArrowRight, Shield } from 'lucide-react';

const SponsorContract: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const pkg = location.state?.package;
    const [agreed, setAgreed] = useState(false);

    if (!pkg) {
        return (
            <div className="min-h-screen bg-[#02020a] flex items-center justify-center text-white">
                <p>Paket tidak ditemukan. Silakan kembali.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#02020a] text-white pt-28 pb-24 px-6 relative overflow-hidden font-sans selection:bg-violet-500/30">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_20%,_#1e1b4b_0%,_transparent_40%)] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10">

                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-full border border-white/10 mb-4 animate-pulse">
                        <Scroll size={32} className="text-violet-400" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">
                        Kontrak <span className="text-violet-400">Ekosistem.</span>
                    </h1>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
                        Perjanjian Kemitraan Digital SampahKu
                    </p>
                </div>

                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 space-y-8">

                    {/* Package Summary */}
                    <div className="flex flex-col md:flex-row justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/5">
                        <div className="text-center md:text-left mb-4 md:mb-0">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-1">Paket Pilihan</span>
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter">{pkg.title}</h2>
                        </div>
                        <div className="text-center md:text-right">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-1">Durasi</span>
                            <p className="font-bold text-white">{pkg.duration}</p>
                        </div>
                        <div className="text-center md:text-right">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-1">Investasi</span>
                            <p className="text-2xl font-black text-emerald-400 italic tracking-tighter">{pkg.price}</p>
                        </div>
                    </div>

                    {/* Contract Content */}
                    <div className="h-96 overflow-y-auto bg-[#0a0a1a] p-6 rounded-xl border border-white/10 text-white/60 text-sm leading-relaxed space-y-4 pr-4 custom-scrollbar">
                        <p className="font-bold text-white uppercase tracking-widest mb-2">Pasal 1: Definisi Kerjasama</p>
                        <p>Pihak SampahKu (Penyedia Platform) dan Mitra (Sponsor) sepakat untuk menjalin kerjasama dalam bentuk penempatan materi promosi dan dukungan ekosistem daur ulang digital.</p>

                        <p className="font-bold text-white uppercase tracking-widest mb-2 mt-6">Pasal 2: Hak & Kewajiban</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Mitra berhak mendapatkan slot iklan sesuai dengan paket {pkg.title} yang dipilih.</li>
                            <li>Mitra berhak mendapatkan laporan statistik bulanan.</li>
                            <li>Penyedia Platform berhak menolak materi yang bertentangan dengan nilai keberlanjutan.</li>
                            <li>Pembayaran bersifat non-refundable setelah masa tayang dimulai.</li>
                        </ul>

                        <p className="font-bold text-white uppercase tracking-widest mb-2 mt-6">Pasal 3: Materi & Konten</p>
                        <p>Segala materi visual dan teks adalah tanggung jawab Mitra. SampahKu berhak melakukan penyesuaian minor untuk estetika antarmuka pengguna tanpa mengubah esensi pesan.</p>

                        <p className="font-bold text-white uppercase tracking-widest mb-2 mt-6">Pasal 4: Pembayaran</p>
                        <p>Aktivasi fitur sponsor akan dilakukan otomatis setelah pelunasan biaya investasi melalui gerbang pembayaran yang ditunjuk.</p>

                        <p className="mt-8 italic opacity-50 text-xs">Dokumen ini dihasilkan secara otomatis oleh sistem Cosmic Legal SampahKu pada {new Date().toLocaleDateString()}.</p>
                    </div>

                    {/* Agreement Checkbox */}
                    <button
                        className="flex items-start gap-4 p-4 bg-violet-500/5 rounded-xl border border-violet-500/10 cursor-pointer w-full text-left hover:bg-violet-500/10 transition-colors"
                        onClick={() => setAgreed(!agreed)}
                        role="checkbox"
                        aria-checked={String(agreed)}
                        aria-label="Saya menyetujui Syarat & Ketentuan Kerjasama"
                    >
                        <div className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${agreed ? 'bg-violet-500 border-violet-500 text-white' : 'border-white/20'}`}>
                            {agreed && <CheckCircle size={14} />}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-white/80">Saya menyetujui Syarat & Ketentuan Kerjasama.</p>
                            <p className="text-xs text-white/40 mt-1">Dengan mencentang ini, Anda mengikat entitas bisnis Anda dalam kontrak digital yang sah.</p>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/sponsor/payment', { state: { package: pkg } })}
                        disabled={!agreed}
                        className={`w-full py-6 rounded-[2rem] font-black uppercase italic tracking-widest text-lg flex items-center justify-center gap-4 transition-all ${agreed
                            ? 'bg-emerald-500 text-[#02020a] hover:bg-emerald-400 hover:scale-105 shadow-2xl shadow-emerald-900/40'
                            : 'bg-white/5 text-white/20 cursor-not-allowed'
                            }`}
                    >
                        <Shield size={20} /> Lanjut ke Administrasi <ArrowRight size={20} />
                    </button>

                </div>
            </div>
        </div>
    );
};

export default SponsorContract;
