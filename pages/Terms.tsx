import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, Cpu, Truck, Copyright, Handshake, Settings } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <div className="bg-[#02020a] min-h-screen pt-32 pb-20 text-white overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_0%,_#1e1b4b_0%,_transparent_70%)] z-0"></div>
      <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,_#312e81_0%,_transparent_60%)] opacity-30 z-0"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-violet-400 hover:text-white transition-colors mb-12 font-black uppercase tracking-widest text-sm group">
          <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" /> Kembali ke Beranda
        </Link>

        <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] border-2 border-white/10 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
          <div className="bg-gradient-to-r from-indigo-600/20 to-violet-600/20 px-8 md:px-16 py-16 border-b border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Scale size={120} />
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase italic">Syarat & Ketentuan</h1>
            <p className="text-violet-400 font-bold tracking-[0.3em] uppercase text-xs">Terakhir diperbarui: 17 Januari 2026</p>
          </div>

          <div className="p-8 md:p-16 space-y-12 text-white/60 leading-relaxed font-medium">
            <section className="space-y-6">
              <div className="flex items-center gap-4 text-white">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                  <Scale size={20} className="text-violet-400" />
                </div>
                <h2 className="text-2xl font-black tracking-tight uppercase italic">1. Persetujuan Pengguna</h2>
              </div>
              <p className="text-lg italic">
                Dengan mengakses dan menggunakan platform SampahKu, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini secara sadar.
                Platform ini dirancang untuk menciptakan harmoni antara aktivitas manusia dan keberlanjutan alam.
              </p>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4 text-white">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                  <Cpu size={20} className="text-violet-400" />
                </div>
                <h2 className="text-2xl font-black tracking-tight uppercase italic">2. Layanan AI & Akurasi</h2>
              </div>
              <div className="bg-violet-500/10 p-8 rounded-3xl border border-violet-500/20 mb-4 shadow-inner">
                <p className="font-black text-violet-400 uppercase tracking-widest text-sm mb-4">Disclaimer Penting:</p>
                <p className="text-lg italic leading-relaxed">
                  Fitur AI Scanner menggunakan teknologi kecerdasan buatan untuk mengidentifikasi jenis sampah.
                  Meskipun kami terus meningkatkan akurasinya, hasil identifikasi mungkin tidak selalu 100% akurat.
                  Kebijaksanaan pengguna tetap diperlukan dalam pemilahan akhir.
                </p>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4 text-white">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                  <Truck size={20} className="text-violet-400" />
                </div>
                <h2 className="text-2xl font-black tracking-tight uppercase italic">3. Layanan Penjemputan</h2>
              </div>
              <p className="text-lg italic">
                Layanan penjemputan sampah (Berlangganan) tunduk pada ketersediaan area geografis di jaringan kami.
                Kami berhak menyesuaikan jadwal demi efisiensi energi dan keseimbangan distribusi materi.
              </p>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4 text-white">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                  <Copyright size={20} className="text-violet-400" />
                </div>
                <h2 className="text-2xl font-black tracking-tight uppercase italic">4. Kekayaan Intelektual</h2>
              </div>
              <p className="text-lg italic">
                Seluruh konten di situs ini, termasuk logo, teks "SampahKu", grafik visual, dan infrastruktur perangkat lunak
                adalah milik SampahKu Network dan dilindungi oleh hukum yang berlaku.
              </p>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4 text-white">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                  <Handshake size={20} className="text-violet-400" />
                </div>
                <h2 className="text-2xl font-black tracking-tight uppercase italic">5. Kemitraan & Sponsor</h2>
              </div>
              <p className="text-lg italic leading-relaxed">
                Situs SampahKu.com menerima sponsor dan kemitraan strategis dari institusi yang memiliki komitmen terhadap kelestarian lingkungan.
                Kami berhak menampilkan materi promosi mitra pada layar transisi layanan kami. Seluruh pendapatan dari kemitraan ini digunakan
                sepenuhnya untuk pengembangan infrastruktur pengelolaan limbah digital kami.
                Silahkan hubungi kami melalui <Link to="/contact" className="text-violet-400 hover:text-white underline underline-offset-4 decoration-violet-500/30">halaman kontak</Link>.
                Setelah kami berikan password, silahkan klik <Link to="/portals" className="text-violet-400 hover:text-white underline underline-offset-4 decoration-violet-500/30">'disini.'</Link> untuk login ke dashboard sponsor.
              </p>
            </section>

            <section className="pt-12 border-t border-white/5 text-center">
              <p className="font-bold text-white/10 uppercase tracking-[0.6em] text-[10px] leading-relaxed">
                Dengan menggunakan layanan kami, Anda menjadi bagian dari kolektif <br />
                yang peduli akan masa depan materi di semesta ini.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;