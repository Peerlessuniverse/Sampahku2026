import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Music, Feather, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#02020a] text-white pt-24 pb-12 border-t-4 border-violet-500/10 transition-all duration-1000">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">

          {/* Brand & Cosmic Description */}
          <div className="col-span-1 md:col-span-12 lg:col-span-5 space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-1 group hover:scale-110 transition-transform cursor-pointer">
                <img src="/logo.png" alt="SampahKu Logo" className="h-12 w-auto" />
              </div>
              <span className="font-black text-3xl tracking-tighter uppercase italic">
                Sampah<span className="text-[#a78bfa]">Ku</span>
              </span>
            </div>
            <p className="text-white/30 text-lg md:text-xl font-bold italic leading-relaxed max-w-xl uppercase tracking-tighter">
              Mengelola materi dengan lebih bijak, agar keseimbangan alam terjaga dan masa depan tumbuh selaras.
            </p>

            <div className="flex space-x-6">
              {[{ icon: Facebook, name: 'Facebook' }, { icon: Instagram, name: 'Instagram' }, { icon: Music, name: 'TikTok' }, { icon: Feather, name: 'Thread' }].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  title={social.name}
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#a78bfa] hover:bg-[#8b5cf6]/10 hover:border-[#8b5cf6]/30 transition-all hover:-translate-y-2 shadow-2xl"
                >
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Sitemaps - Cosmic Navigation */}
          <div className="col-span-1 md:col-span-12 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div className="space-y-8">
              <h4 className="text-[10px] font-black text-violet-400 uppercase tracking-[0.5em] italic">Eksplorasi</h4>
              <ul className="space-y-4">
                {[
                  { name: 'Beranda', path: '/' },
                  { name: 'Transformasi', path: '/transformasi' },
                  { name: 'Scanner', path: '/scanner' },
                  { name: 'Waste To Energy', path: '/wte' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-lg font-bold text-white/30 hover:text-white transition-colors italic uppercase tracking-tighter">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-[10px] font-black text-violet-400 uppercase tracking-[0.5em] italic">Privasi</h4>
              <ul className="space-y-4">
                {[
                  { name: 'Term of Service', path: '/terms' },
                  { name: 'Privacy Policy', path: '/privacy' },
                  { name: 'Panduan Fitur', path: '/docs' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-lg font-bold text-white/30 hover:text-white transition-colors italic uppercase tracking-tighter">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-[10px] font-black text-violet-400 uppercase tracking-[0.5em] italic">Koneksi</h4>
              <ul className="space-y-4 text-left">
                <li>
                  <Link to="/contact" className="text-lg font-bold text-white/30 hover:text-white transition-colors italic uppercase tracking-tighter decoration-violet-500/30 underline underline-offset-8">Hubungi Kami</Link>
                </li>
                <li>
                  <Link to="/sponsor/info" className="text-[10px] font-black text-white/20 hover:text-violet-400 transition-colors italic uppercase tracking-[0.2em]">Menjadi Sponsor</Link>
                </li>
                <li className="text-lg font-bold text-white/30 italic uppercase tracking-tighter leading-snug">
                  Jl. Gegerkalong Tengah No. 10 <br /> Bandung. 40142.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Nebula Fade */}
        <div className="border-t-2 border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/10 text-[10px] font-black uppercase tracking-[0.5em] italic">
            &copy; {new Date().getFullYear()} SampahKu Network. Manifested from Stardust.
          </p>
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full animate-ping"></div>
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">Status: Cosmic Balance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;