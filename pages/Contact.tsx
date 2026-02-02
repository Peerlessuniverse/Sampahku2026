import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Instagram, Facebook, Music, Feather, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Contact: React.FC = () => {
  const location = useLocation();
  const initialMessage = location.state?.message || '';
  const [formData, setFormData] = useState({ name: '', email: '', message: initialMessage });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setTimeout(() => {
      setSent(true);
    }, 1000);
  };

  return (
    <div className="bg-[#02020a] min-h-screen pt-32 pb-20 text-white overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_0%,_#1e1b4b_0%,_transparent_70%)] z-0"></div>
      <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,_#312e81_0%,_transparent_60%)] opacity-30 z-0"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-violet-400 hover:text-white transition-colors mb-12 font-black uppercase tracking-widest text-sm group">
          <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" /> Kembali ke Beranda
        </Link>

        <div className="text-center mb-20 space-y-6 animate-in slide-in-from-top duration-1000">
          <div className="inline-block px-6 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-black uppercase tracking-[0.5em] backdrop-blur-3xl italic">
            Saluran Manifestasi
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.1] uppercase italic drop-shadow-[0_10px_30px_rgba(139,92,246,0.3)]">
            Hubungi <br /> <span className="text-violet-400 drop-shadow-[0_0_40px_rgba(167,139,250,0.5)]">Kami.</span>
          </h1>
          <p className="text-lg md:text-2xl lg:text-3xl text-white/40 max-w-2xl mx-auto font-bold italic leading-tight uppercase tracking-tighter">
            Punya pertanyaan atau ingin berkolaborasi? <br className="hidden md:block" /> Tim kami siap mendampingi perjalanan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Info Column */}
          <div className="space-y-16 animate-in slide-in-from-left duration-1000">
            <div className="space-y-12">
              <div className="group flex items-start gap-8 p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:border-violet-500/30 transition-all hover:bg-violet-500/5 hover:-translate-y-2">
                <div className="p-6 rounded-2xl bg-violet-600/20 text-violet-400 group-hover:scale-110 transition-transform">
                  <Phone size={32} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-violet-400 uppercase tracking-[0.5em] mb-3 italic">Telepon</h4>
                  <p className="text-3xl font-black text-white italic uppercase tracking-tighter">+62 21 5555 8888</p>
                </div>
              </div>

              <div className="group flex items-start gap-8 p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:border-violet-500/30 transition-all hover:bg-violet-500/5 hover:-translate-y-2">
                <div className="p-6 rounded-2xl bg-violet-600/20 text-violet-400 group-hover:scale-110 transition-transform">
                  <Mail size={32} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-violet-400 uppercase tracking-[0.5em] mb-3 italic">Email</h4>
                  <p className="text-3xl font-black text-white italic uppercase tracking-tighter underline decoration-violet-500/30">semesta@sampahku.net</p>
                </div>
              </div>

              <div className="group flex items-start gap-8 p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:border-violet-500/30 transition-all hover:bg-violet-500/5 hover:-translate-y-2">
                <div className="p-6 rounded-2xl bg-violet-600/20 text-violet-400 group-hover:scale-110 transition-transform">
                  <MapPin size={32} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-violet-400 uppercase tracking-[0.5em] mb-3 italic">Kantor Pusat</h4>
                  <p className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">
                    Jl. Gegerkalong Tengah No. 10 <br /> Bandung. 40142.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8 pl-4">
              <h4 className="text-[10px] font-black text-violet-400 uppercase tracking-[0.5em] italic">Jejak Digital</h4>
              <div className="flex space-x-6">
                {[
                  { Icon: Facebook, label: 'Facebook SampahKu' },
                  { Icon: Instagram, label: 'Instagram SampahKu' },
                  { Icon: Music, label: 'TikTok SampahKu' },
                  { Icon: Feather, label: 'Twitter SampahKu' }
                ].map((item, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label={item.label}
                    className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-violet-600/20 hover:border-violet-500/30 transition-all hover:-translate-y-2"
                  >
                    <item.Icon className="h-8 w-8" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="animate-in slide-in-from-right duration-1000">
            <div className="bg-white/[0.03] backdrop-blur-3xl p-10 md:p-16 rounded-[4rem] border-2 border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
              {sent ? (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-10 animate-in zoom-in duration-500">
                  <div className="w-32 h-32 bg-violet-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_60px_rgba(139,92,246,0.5)]">
                    <Send className="h-16 w-16 text-white" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Pesan Terkirim!</h3>
                    <p className="text-white/40 text-xl font-bold italic uppercase tracking-tighter">Energi Anda telah kami terima. <br /> Kami akan merespon secepat kilat.</p>
                  </div>
                  <button
                    onClick={() => setSent(false)}
                    className="text-violet-400 font-black text-sm uppercase tracking-[0.4em] hover:text-white transition-colors"
                  >
                    Kirim pesan lain →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label htmlFor="name" className="text-[10px] font-black text-violet-400 uppercase tracking-[0.5em] italic ml-2">Nama Eksistensi</label>
                      <input
                        type="text"
                        id="name"
                        required
                        className="w-full bg-white/[0.02] px-8 py-6 rounded-[2rem] border-2 border-white/5 focus:border-violet-500/50 focus:bg-violet-500/5 transition-all outline-none font-bold text-xl uppercase tracking-tighter placeholder:text-white/10"
                        placeholder="Siapa nama Anda?"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-4">
                      <label htmlFor="email" className="text-[10px] font-black text-violet-400 uppercase tracking-[0.5em] italic ml-2">Sinyal Email</label>
                      <input
                        type="email"
                        id="email"
                        required
                        className="w-full bg-white/[0.02] px-8 py-6 rounded-[2rem] border-2 border-white/5 focus:border-violet-500/50 focus:bg-violet-500/5 transition-all outline-none font-bold text-xl uppercase tracking-tighter placeholder:text-white/10"
                        placeholder="contoh@semesta.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-4">
                      <label htmlFor="message" className="text-[10px] font-black text-violet-400 uppercase tracking-[0.5em] italic ml-2">Manifestasi Pesan</label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        className="w-full bg-white/[0.02] px-8 py-6 rounded-[2rem] border-2 border-white/5 focus:border-violet-500/50 focus:bg-violet-500/5 transition-all outline-none font-bold text-xl uppercase tracking-tighter placeholder:text-white/10 resize-none"
                        placeholder="Tuliskan aspirasi Anda di sini..."
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-white text-[#02020a] py-8 rounded-[2rem] font-black text-2xl uppercase italic tracking-tighter hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_60px_rgba(255,255,255,0.1)] flex items-center justify-center gap-4 group"
                  >
                    Transmisikan Pesan <Send className="group-hover:translate-x-3 group-hover:-translate-y-3 transition-transform" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;