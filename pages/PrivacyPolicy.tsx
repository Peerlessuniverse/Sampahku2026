import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, FileText, Share2, Settings } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-[#02020a] min-h-screen pt-32 pb-20 text-white overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_70%)] z-0"></div>
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,_#312e81_0%,_transparent_60%)] opacity-30 z-0"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-violet-400 hover:text-white transition-colors mb-12 font-black uppercase tracking-widest text-sm group">
          <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" /> Kembali ke Beranda
        </Link>

        <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] border-2 border-white/10 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
          <div className="bg-gradient-to-r from-violet-600/20 to-indigo-600/20 px-8 md:px-16 py-16 border-b border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Shield size={120} />
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase italic">Kebijakan Privasi</h1>
            <p className="text-violet-400 font-bold tracking-[0.3em] uppercase text-xs">Terakhir diperbarui: 17 Januari 2026</p>
          </div>

          <div className="p-8 md:p-16 space-y-12 text-white/60 leading-relaxed font-medium">
            <section className="space-y-6">
              <div className="flex items-center gap-4 text-white">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                  <FileText size={20} className="text-violet-400" />
                </div>
                <h2 className="text-2xl font-black tracking-tight uppercase italic">1. Pendahuluan</h2>
              </div>
              <p className="text-lg italic">
                Selamat datang di SampahKu. Kami menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi Anda.
                Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat menggunakan
                layanan kami, termasuk fitur AI Scanner dan Kalkulator Jejak Karbon.
              </p>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4 text-white">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                  <Lock size={20} className="text-violet-400" />
                </div>
                <h2 className="text-2xl font-black tracking-tight uppercase italic">2. Data yang Kami Kumpulkan</h2>
              </div>
              <ul className="space-y-4">
                <li className="bg-white/5 p-6 rounded-2xl border border-white/5">
                  <strong className="text-violet-400 uppercase tracking-wider block mb-2">Informasi Identitas</strong>
                  Nama, alamat email, dan nomor telepon saat Anda mendaftar atau menghubungi kami secara sukarela.
                </li>
                <li className="bg-white/5 p-6 rounded-2xl border border-white/5">
                  <strong className="text-violet-400 uppercase tracking-wider block mb-2">Data Gambar</strong>
                  Foto sampah yang Anda unggah untuk fitur AI Scanner. Foto ini diproses secara anonim untuk identifikasi material.
                </li>
                <li className="bg-white/5 p-6 rounded-2xl border border-white/5">
                  <strong className="text-violet-400 uppercase tracking-wider block mb-2">Data Aktivitas</strong>
                  Informasi masukan pada kalkulator karbon (listrik, transportasi) untuk menghitung estimasi dampak lingkungan Anda.
                </li>
              </ul>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4 text-white">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                  <Eye size={20} className="text-violet-400" />
                </div>
                <h2 className="text-2xl font-black tracking-tight uppercase italic">3. Penggunaan Data</h2>
              </div>
              <p className="text-lg italic">Kami menggunakan data Anda secara bijaksana untuk:</p>
              <ul className="list-disc pl-6 space-y-3 marker:text-violet-500">
                <li>Menyediakan layanan pengelolaan sampah yang dipersonalisasi.</li>
                <li>Meningkatkan akurasi algoritma AI kami melalui pembelajaran mesin yang aman.</li>
                <li>Memberikan laporan jejak karbon yang akurat bagi perjalanan keberlanjutan Anda.</li>
              </ul>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4 text-white">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                  <Share2 size={20} className="text-violet-400" />
                </div>
                <h2 className="text-2xl font-black tracking-tight uppercase italic">4. Kemitraan & Sponsor</h2>
              </div>
              <p className="text-lg italic leading-relaxed">
                SampahKu bekerja sama dengan berbagai mitra dan sponsor yang memiliki visi yang sama dalam menjaga kelestarian bumi.
                Platform kami menampilkan informasi dari mitra terpilih melalui layar "Mitra Penjaga Semesta" untuk mendukung operational
                dan pengembangan teknologi keberlanjutan kami secara gratis bagi pengguna.
                Silahkan hubungi kami melalui <Link to="/contact" className="text-violet-400 hover:text-white underline underline-offset-4 decoration-violet-500/30">halaman kontak</Link>.
                Setelah kami berikan password, silahkan klik <Link to="/portals" className="text-violet-400 hover:text-white underline underline-offset-4 decoration-violet-500/30">'disini.'</Link> untuk login ke dashboard sponsor.
              </p>
            </section>

            <section className="pt-12 border-t border-white/5 text-center">
              <p className="text-center font-bold text-white/20 uppercase tracking-[0.5em] text-xs">
                Jika Anda memiliki pertanyaan, silakan hubungi kami melalui <br />
                <Link to="/contact" className="text-violet-400 hover:text-white underline underline-offset-8 decoration-violet-500/30">Halaman Kontak Kami</Link>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;