import React, { useState } from 'react';
import {
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  Coffee,
  Package,
  Heart,
  Sparkles
} from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/5 py-8 group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left transition-all"
      >
        <span className="font-black text-xl md:text-2xl text-white pr-8 group-hover:text-[#a78bfa] transition-colors tracking-tight uppercase leading-none">{question}</span>
        <div className={`p-4 rounded-2xl bg-white/5 transition-all duration-500 ${isOpen ? 'rotate-180 bg-violet-500/20 text-[#a78bfa]' : 'text-white/20'}`}>
          <ChevronDown className="w-6 h-6" />
        </div>
      </button>
      <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden text-violet-400/60 text-lg md:text-xl leading-relaxed max-w-2xl font-bold italic">
          {answer}
        </div>
      </div>
    </div>
  );
};

const ValueBullet = ({ text }: { text: string }) => (
  <div className="flex items-start gap-6 p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-violet-900/20 hover:border-violet-500/30 transition-all group">
    <div className="bg-[#8b5cf6] p-2 rounded-xl mt-1 shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform">
      <CheckCircle2 className="w-6 h-6 text-white" />
    </div>
    <p className="text-white leading-tight font-black text-xl md:text-2xl tracking-tighter uppercase">{text}</p>
  </div>
);

const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#02020a] text-white selection:bg-violet-500 selection:text-white">
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-48 relative">

        {/* Decorative background nebula elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[160px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[160px] pointer-events-none"></div>

        <div className="grid lg:grid-cols-12 gap-24 md:gap-32 items-start relative z-10">

          {/* Left Column: Copy */}
          <section className="lg:col-span-7 space-y-16">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-violet-500/10 border-2 border-violet-500/20 text-[#a78bfa] text-xs font-black uppercase tracking-[0.4em]">
                Manifestasi Spiritual
              </div>
              <h1 className="text-5xl md:text-[6rem] lg:text-[7rem] font-black text-white leading-[0.9] tracking-tighter drop-shadow-2xl uppercase">
                Menata Rumah, <br /> Menyucikan <br /> <span className="text-[#8b5cf6]">Jiwa.</span>
              </h1>
              <p className="text-2xl md:text-3xl text-white/30 leading-relaxed font-bold max-w-xl italic">
                Sistem pengelolaan materi untuk kedamaian batin. Bersihkan ruangmu, bebaskan kosmosmu.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <ValueBullet text="Ruang Suci Bebas Residu Negatif." />
              <ValueBullet text="Ritual Harian 120 Detik." />
              <ValueBullet text="Koneksi Spiritual dengan Materi." />
              <ValueBullet text="Harmoni Estetika Berkelanjutan." />
            </div>

            <div className="space-y-12 pt-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-10 bg-white/5 p-10 rounded-[3rem] border-2 border-white/10 backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.5em] text-violet-400 font-black">Energi Pertukaran</p>
                  <div className="flex items-baseline gap-2 text-white">
                    <span className="text-6xl md:text-7xl font-black tracking-tighter">Rp49k</span>
                    <span className="opacity-20 font-black text-3xl">.000</span>
                  </div>
                </div>
                <button
                  onClick={() => window.open("https://utas.me/lp/tokosampah/3-hari-menghilangkan-bau-sampah-dapur", "_blank", "noopener,noreferrer")}
                  className="flex-1 bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white px-12 py-8 rounded-[2rem] font-black text-3xl hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all flex items-center justify-center gap-4 group active:scale-[0.98] uppercase tracking-tighter cursor-pointer"
                >
                  Ambil Akses
                  <ArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform" />
                </button>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-start gap-8 text-[11px] font-black text-white/10 uppercase tracking-[0.4em]">
                <span>MANIFESTASI INSTAN</span>
                <span className="hidden sm:block opacity-20">•</span>
                <span>PANDUAN ETERIS</span>
                <span className="hidden sm:block opacity-20">•</span>
                <span>SINYAL KOSMIK</span>
              </div>
            </div>
          </section>

          {/* Right Column: Cosmic Visuals & FAQ */}
          <section className="lg:col-span-5 space-y-20">
            <div className="bg-gradient-to-br from-white/10 to-transparent backdrop-blur-3xl rounded-[4rem] p-12 shadow-[0_60px_100px_rgba(0,0,0,0.8)] border-2 border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 rounded-full -mr-32 -mt-32 blur-[80px] group-hover:scale-150 transition-transform duration-1000"></div>

              <div className="relative z-10 space-y-10">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl rotate-6 group-hover:rotate-0 transition-transform duration-500">
                  <Sparkles className="text-white w-10 h-10" />
                </div>

                <h3 className="text-4xl font-black text-white leading-none tracking-tighter uppercase italic">
                  APA YANG <br /> ANDA <br /> DAPATKAN?
                </h3>

                <ul className="space-y-6">
                  {[
                    "Sistem Wadah Meta-Fisik.",
                    "Kalibrasi Jadwal Harian.",
                    "Teknik Purifikasi Udara.",
                    "Manifestasi Minimalisme."
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-6 text-white font-bold text-xl tracking-tight uppercase">
                      <div className="w-3 h-3 bg-violet-400 rounded-full shadow-[0_0_15px_rgba(167,139,250,1)]"></div>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="pt-10">
                  <div className="flex items-center gap-4 text-sm font-black text-[#a78bfa] bg-violet-500/10 px-8 py-4 rounded-2xl w-fit border-2 border-violet-500/20 shadow-inner tracking-widest uppercase italic">
                    <Coffee className="w-6 h-6" />
                    Waktu Baca: 15 Menit.
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <h4 className="text-3xl font-black text-white uppercase tracking-[0.3em] italic decoration-violet-500 underline underline-offset-[20px] decoration-4">Sinyal Tanya</h4>
              <div className="bg-white/[0.02] rounded-[4rem] p-8 md:p-12 border-2 border-white/5 shadow-2xl">
                <FAQItem
                  question="Ke mana materi pergi?"
                  answer="Material fisik akan didistribusikan ke pusat daur ulang kolektif. Secara spiritual, Anda melepaskan keterikatan negatif pada benda."
                />
                <FAQItem
                  question="Butuh artefak khusus?"
                  answer="Gunakan apa yang ada di semesta kecilmu (rumah). Tidak diperlukan pembelian alat tambahan yang menambah limbah baru."
                />
                <FAQItem
                  question="Jika energi sedang rendah?"
                  answer="Panduan kami memiliki modul 'Low Frequency' untuk hari-hari saat Anda hanya memiliki energi minimal untuk bergerak."
                />
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-48 pt-24 border-t-2 border-white/5 text-center max-w-4xl mx-auto space-y-10">
          <Heart className="w-12 h-12 text-violet-500 mx-auto animate-pulse" />
          <p className="text-3xl md:text-5xl text-white/20 font-bold italic leading-tight tracking-tight uppercase">
            "Satu-satunya sampah sejati adalah pikiran yang tidak selaras dengan semesta."
          </p>
          <div className="flex justify-center items-center gap-6 opacity-5">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Pricing;