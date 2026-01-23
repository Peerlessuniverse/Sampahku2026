import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Coins } from 'lucide-react';
import { getCredits } from '../services/creditService';


const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const [credits, setCredits] = useState(getCredits());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const handleCreditsUpdate = (e: any) => {
      setCredits(e.detail.credits);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('creditsUpdated', handleCreditsUpdate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('creditsUpdated', handleCreditsUpdate);
    };
  }, []);


  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Transformasi', path: '/transformasi' },
    { name: 'AI Scanner', path: '/scanner' },
    { name: 'Hall of Fame', path: '/leaderboard' },
    { name: 'Waste to Energy', path: '/wte' },
  ];

  // Cosmic Glass Navbar - Deep Indigo/Violet Blur
  const navbarClasses = `fixed top-0 w-full z-50 transition-all duration-1000 ease-out border-b ${scrolled
    ? 'bg-[#02020a]/70 backdrop-blur-2xl py-3 border-white/10 shadow-[0_10px_40px_rgba(139,92,246,0.15)]'
    : 'bg-transparent py-4 md:py-7 border-transparent'
    }`;

  const linkClasses = (path: string) => `px-1 py-2 text-[10px] font-bold tracking-widest uppercase transition-all duration-500 relative group ${location.pathname === path
    ? 'text-[#a78bfa]' // Nebula Purple for active
    : 'text-white/60 hover:text-[#818cf8]' // Indigo hover
    }`;

  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
              <div className="p-1 transition-all duration-700 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                <img src="/logo.png" alt="SampahKu Logo" className="h-10 w-auto" />
              </div>
              <span className="font-black text-xl text-white tracking-tight uppercase leading-none hidden sm:block">
                Sampah<span className="text-[#a78bfa]">Ku</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav - Cosmic Aesthetic */}
          <div className="hidden md:flex md:items-center md:space-x-3 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={linkClasses(link.path)}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#a78bfa] to-[#6366f1] transition-all duration-500 origin-left ${location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100 opacity-50'}`}></span>
              </Link>
            ))}

            {/* Eco-Credits Display */}
            <Link to="/credits" className="flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl group hover:border-[#a78bfa]/50 transition-all cursor-pointer">
              <div className="p-1.5 bg-[#a78bfa]/20 rounded-lg text-[#a78bfa] group-hover:scale-110 transition-transform">
                <Coins size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[7px] font-black text-white/20 uppercase tracking-widest leading-none">Eco-Credits</span>
                <span className="text-xs font-black text-white tracking-tight leading-none mt-1">{credits.toLocaleString()}</span>
              </div>
            </Link>
          </div>



          <div className="flex items-center gap-4 md:hidden relative z-50">
            {/* Mobile Credits */}
            <Link to="/credits" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:border-[#a78bfa]/50 transition-colors">
              <Coins size={14} className="text-[#a78bfa]" />
              <span className="text-xs font-black text-white tracking-tighter">{credits.toLocaleString()}</span>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-3 sm:p-4 rounded-2xl text-white bg-white/5 backdrop-blur-md hover:bg-white/10 active:scale-90 transition-all border border-white/10 shadow-lg"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu - Nebula Backdrop */}
      <div className={`md:hidden fixed inset-0 z-40 transition-all duration-700 ease-in-out ${isOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-[#02020a]/98 backdrop-blur-3xl" onClick={() => setIsOpen(false)}></div>
        <div className={`absolute top-0 left-0 right-0 bg-gradient-to-b from-[#0a0a2e] to-[#02020a] border-b border-white/10 shadow-[0_20px_100px_rgba(139,92,246,0.2)] transition-all duration-700 ease-in-out px-8 pt-28 pb-12 ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>

          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-8 py-4 rounded-[2rem] text-lg font-black uppercase tracking-widest transition-all ${location.pathname === link.path
                  ? 'text-[#a78bfa] bg-white/5 shadow-inner'
                  : 'text-white/60 hover:text-[#818cf8] hover:bg-white/5'
                  }`}
              >
                {link.name}
                <div className={`w-3 h-3 rounded-full bg-[#a78bfa] transition-opacity ${location.pathname === link.path ? 'opacity-100' : 'opacity-0'}`}></div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;