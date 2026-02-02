import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Leaf, Recycle, AlertTriangle, Trash2, Sparkles, ArrowRight } from 'lucide-react';
import SponsorScreen from '../components/SponsorScreen';
import SEO from '../components/SEO';

const TransformationLanding: React.FC = () => {
  const navigate = useNavigate();
  const [showTransition, setShowTransition] = useState(false);
  const [targetPath, setTargetPath] = useState('');

  const handleStartTransition = (path: string) => {
    setTargetPath(path);
    setShowTransition(true);
  };

  const handleTransitionComplete = () => {
    setShowTransition(false);
    navigate(targetPath);
  };

  const categories = [
    {
      id: 'organik',
      title: 'Daur Organik',
      description: 'Material alami yang dapat kembali menyatu dengan tanah dan kehidupan.',
      icon: <Leaf className="w-24 h-24 text-white" />,
      image: '/images/organic_transformation_landing_1768667578094.png',
      path: '/transformasi/organic',
      theme: {
        border: 'border-emerald-500/30',
        glow: 'group-hover:shadow-[0_40px_80px_rgba(16,185,129,0.3)]',
        accent: 'bg-emerald-600'
      }
    },
    {
      id: 'anorganik',
      title: 'Siklus Anorganik',
      description: 'Material padat hasil olahan manusia yang menunggu untuk dicipta kembali.',
      icon: <Recycle className="w-24 h-24 text-white" />,
      image: '/images/inorganic_transformation_landing_1768667593705.png',
      path: '/transformasi/inorganic',
      theme: {
        border: 'border-green-500/30',
        glow: 'group-hover:shadow-[0_40px_80px_rgba(34,197,94,0.3)]',
        accent: 'bg-green-600'
      }
    },
    {
      id: 'b3',
      title: 'Limbah Khusus',
      description: 'Bahan berbahaya yang memerlukan penanganan khusus demi keamanan lingkungan.',
      icon: <AlertTriangle className="w-24 h-24 text-white" />,
      image: '/images/b3_transformation_landing_1768667612319.png',
      path: '/transformasi/b3',
      theme: {
        border: 'border-lime-500/30',
        glow: 'group-hover:shadow-[0_40px_80px_rgba(132,204,22,0.3)]',
        accent: 'bg-lime-600'
      }
    },
    {
      id: 'residu',
      title: 'Material Residu',
      description: 'Sisa pembuangan akhir yang akan diproses menjadi energi alternatif.',
      icon: <Trash2 className="w-24 h-24 text-white" />,
      image: '/images/residue_transformation_landing_1768667627944.png',
      path: '/transformasi/residu',
      theme: {
        border: 'border-teal-500/30',
        glow: 'group-hover:shadow-[0_40px_80px_rgba(20,184,166,0.3)]',
        accent: 'bg-teal-700'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-[#022c22] pt-32 pb-32 px-6 overflow-hidden">
      <SEO
        title="Transformasi Sampah"
        description="Jelajahi metode pengolahan limbah organik, anorganik, B3, dan residu. Ubah masalah menjadi solusi berkelanjutan."
      />

      {showTransition && (
        <SponsorScreen
          onComplete={handleTransitionComplete}
          message="Mensinkronisasi Elemen Alam..."
          theme="forest"
        />
      )}

      {/* Forest Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_#064e3b_0%,_transparent_50%)] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,_#14532d_0%,_transparent_50%)] opacity-30 pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24 space-y-6">
          <div className="inline-block px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#4ade80] text-[10px] font-black uppercase tracking-[0.5em] backdrop-blur-3xl italic">
            Panduan Transformasi Alam
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.1] uppercase italic drop-shadow-[0_10px_30px_rgba(16,185,129,0.3)]">
            Siklus <br /> <span className="text-[#4ade80] drop-shadow-[0_0_40px_rgba(74,222,128,0.5)]">Kehidupan.</span>
          </h1>
          <p className="text-lg md:text-2xl lg:text-3xl text-white/40 max-w-3xl mx-auto font-bold italic leading-tight uppercase tracking-tighter">
            Pahami bagaimana material kembali <br className="hidden md:block" /> menjadi manfaat dalam keselarasan ekosistem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
          {categories.map((item) => (
            <div
              key={item.id}
              onClick={() => handleStartTransition(item.path)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === 'Enter') handleStartTransition(item.path) }}
              aria-label={`Lihat detail transformasi ${item.title}`}
              className="group cursor-pointer flex flex-col items-center text-center space-y-8 outline-none focus:ring-4 focus:ring-emerald-500/50 rounded-[4rem]"
            >
              {/* Forest Card Container */}
              <div className={`relative w-full h-80 md:h-[500px] rounded-[4rem] overflow-hidden border-4 ${item.theme.border} bg-[#064e3b]/20 transition-all duration-1000 group-hover:-translate-y-6 ${item.theme.glow} shadow-3xl`}>
                {/* Image Background */}
                <div className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-110">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-20 group-hover:opacity-60 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#022c22] via-transparent to-transparent"></div>
                </div>

                {/* Icon Layer */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-10 space-y-6">
                  <div className={`p-8 rounded-[3rem] ${item.theme.accent} shadow-2xl transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 group-hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]`}>
                    {item.icon}
                  </div>
                </div>

                {/* Sparkle Overlay */}
                <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <Sparkles className="text-[#4ade80] h-10 w-10 animate-pulse" />
                </div>
              </div>

              {/* Info Layer */}
              <div className="space-y-4 px-6">
                <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase group-hover:text-[#4ade80] transition-colors leading-none italic">
                  {item.title}
                </h3>
                <p className="text-white/20 text-lg md:text-xl font-bold italic max-w-md mx-auto leading-tight uppercase tracking-tighter">
                  {item.description}
                </p>
                <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.5em] italic">Eksplorasi →</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA - E-book Hook Section (Mini Version) */}
        <div className="mt-24 text-center max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom duration-1000 px-6 pb-12">
          {/* Quote about waste and consciousness */}
          <div className="space-y-4">
            <p className="text-[#4ade80] text-lg md:text-xl font-bold italic uppercase tracking-[0.2em] opacity-40 leading-relaxed md:px-12">
              "Pahami setiap elemen, karena di sanalah rahasia keselarasan alam semesta tersimpan."
            </p>
          </div>

          {/* Hook Sentence */}
          <div className="space-y-4">
            <h4 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase italic leading-tight drop-shadow-[0_0_20px_rgba(74,222,128,0.3)]">
              Terlalu jelimet dengan sistem pengolahan sampah?
            </h4>
            <p className="text-white/30 text-base md:text-xl font-bold italic uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
              Miliki panduan cepat Eksklusif - <span className="text-[#4ade80] font-black">Sistem Sampah Masuk Akal</span> untuk orang sibuk.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={() => window.location.href = "/landing3harisampah.html"}
              className="inline-flex items-center gap-4 bg-white text-[#022c22] font-black px-10 py-5 rounded-[2rem] hover:scale-105 transition-all shadow-[0_20px_60px_rgba(74,222,128,0.1)] uppercase tracking-tighter text-xl italic group cursor-pointer"
            >
              Dapatkan Akses <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransformationLanding;
