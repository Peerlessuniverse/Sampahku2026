import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home as HomeIcon, Factory, Wheat, Cross, Monitor, CloudRain,
  Shirt, HelpCircle, Cloud, ArrowRight, X, Leaf, Recycle,
  AlertTriangle, Trash2, Loader2, RefreshCw, Globe
} from 'lucide-react';
import createGlobe from 'cobe';
import CarbonCalculator from '../components/CarbonCalculator';
import SponsorScreen from '../components/SponsorScreen';
import SEO from '../components/SEO';

// Data Structures
interface WasteSource {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
  isCarbon?: boolean;
}

interface WasteType {
  id: string;
  label: string;
  icon: React.ReactNode;
  examples: string;
  route: string;
  color: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSource, setSelectedSource] = useState<WasteSource | null>(null);
  const [selectedWasteType, setSelectedWasteType] = useState<WasteType | null>(null);
  const [showTransition, setShowTransition] = useState(false);
  const [targetPath, setTargetPath] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    let width = 0;

    if (!canvasRef.current) return;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener('resize', onResize);
    onResize();

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      scale: 1.1,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.05, 0.05, 0.2], // Deep Cosmic Indigo
      markerColor: [0.65, 0.55, 1], // Violet Markers
      glowColor: [0.4, 0.2, 0.8], // Nebula Purple Glow
      offset: [0, 0],
      markers: [
        { location: [-6.2088, 106.8456], size: 0.1 }, // Jakarta
        { location: [-7.2575, 112.7521], size: 0.05 }, // Surabaya
        { location: [-6.9175, 107.6191], size: 0.05 }, // Bandung
        { location: [1.3521, 103.8198], size: 0.03 }, // Singapore
        { location: [35.6762, 139.6503], size: 0.03 }, // Tokyo
        { location: [51.5074, -0.1278], size: 0.03 }, // London
      ],
      onRender: (state) => {
        state.phi = phi;
        phi -= 0.003;
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Memoized Waste Sources to prevent re-creation on every render
  const wasteSources: WasteSource[] = React.useMemo(() => [
    { id: 'household', icon: <HomeIcon size={24} />, label: 'Rumah Tangga', description: 'Sampah yang dihasilkan dari aktivitas sehari-hari di rumah.', color: 'bg-violet-100 text-violet-900 font-black' },
    { id: 'industry', icon: <Factory size={24} />, label: 'Industri', description: 'Limbah hasil proses produksi pabrik dan manufaktur.', color: 'bg-indigo-100 text-indigo-900 font-black' },
    { id: 'agriculture', icon: <Wheat size={24} />, label: 'Pertanian', description: 'Sisa panen, kotoran ternak, dan limbah pertanian lainnya.', color: 'bg-blue-100 text-blue-900 font-black' },
    { id: 'medical', icon: <Cross size={24} />, label: 'Medis', description: 'Limbah dari fasilitas kesehatan, memerlukan penanganan khusus.', color: 'bg-rose-100 text-rose-900 font-black' },
    { id: 'ewaste', icon: <Monitor size={24} />, label: 'Elektronik', description: 'Barang elektronik bekas yang mengandung bahan berbahaya.', color: 'bg-cyan-100 text-cyan-900 font-black' },
    { id: 'disaster', icon: <CloudRain size={24} />, label: 'Bencana', description: 'Puing dan sampah yang timbul akibat bencana alam.', color: 'bg-amber-100 text-amber-900 font-black' },
    { id: 'special', icon: <Shirt size={24} />, label: 'Khusus', description: 'Tekstil, kosmetik, dan barang lain yang sulit didaur ulang.', color: 'bg-purple-100 text-purple-900 font-black' },
    { id: 'other', icon: <HelpCircle size={24} />, label: 'Lainnya', description: 'Jenis sampah yang tidak masuk kategori umum.', color: 'bg-slate-100 text-slate-900 font-black' },
    { id: 'carbon', icon: <Cloud size={24} />, label: 'Jejak Karbon', description: 'Emisi gas rumah kaca yang dihasilkan dari aktivitas kita.', color: 'bg-[#a78bfa] text-[#02020a] font-black', isCarbon: true },
  ], []);

  const wasteTypes: WasteType[] = React.useMemo(() => [
    { id: 'organic', label: 'Organik', icon: <Leaf size={24} />, examples: 'Sisa makanan, daun, ampas kopi', route: '/transformasi/organic', color: 'bg-violet-50 text-violet-800 border-violet-200' },
    { id: 'inorganic', label: 'Anorganik', icon: <Recycle size={24} />, examples: 'Botol plastik, kaleng, kaca', route: '/transformasi/inorganic', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
    { id: 'b3', label: 'B3', icon: <AlertTriangle size={24} />, examples: 'Baterai, oli, obat kadaluarsa', route: '/transformasi/b3', color: 'bg-rose-50 text-rose-800 border-rose-200' },
    { id: 'residue', label: 'Residu', icon: <Trash2 size={24} />, examples: 'Popok, pembalut, puntung rokok', route: '/transformasi/residu', color: 'bg-slate-50 text-slate-800 border-slate-200' },
  ], []);

  const handleSourceClick = (source: WasteSource) => {
    if (source.isCarbon) {
      document.getElementById('carbon-calculator')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setSelectedSource(source);
    setSelectedWasteType(null);
    setProcessing(false);
    setShowResult(false);
  };

  const handleStartTransition = (path: string) => {
    setTargetPath(path);
    setShowTransition(true);
  };

  const handleTransitionComplete = () => {
    setShowTransition(false);
    navigate(targetPath);
  };

  const handleTypeClick = (type: WasteType) => {
    setSelectedWasteType(type);
    setProcessing(true);
    setShowResult(false);
    setTimeout(() => {
      setProcessing(false);
      setShowResult(true);
    }, 2000);
  };

  const closeModal = () => {
    setSelectedSource(null);
  };


  return (
    <div className="flex flex-col min-h-screen bg-[#02020a] text-white overflow-x-hidden">
      <SEO
        title="Home"
        description="SampahKu 2026 - Platform manajemen limbah futuristik yang mengubah sampah menjadi energi dan harmoni universal."
      />
      {showTransition && (
        <SponsorScreen
          onComplete={handleTransitionComplete}
          message="Membuka Dimensi Koleksi..."
          theme="cosmic"
        />
      )}

      {/* Hero Section - Cosmic Nebula Theme */}
      <section className="relative min-h-screen flex flex-col items-center justify-start pt-36 md:pt-48 pb-40 md:pb-60 overflow-hidden px-6">

        {/* Background Gradients & Stars */}
        <div className="absolute inset-0 bg-[#02020a] z-0"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_70%)] z-0"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,_#312e81_0%,_transparent_60%)] opacity-30 z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_#4c1d95_0%,_transparent_80%)] opacity-20 z-0 animate-pulse"></div>

        {/* Floating Stars Effect (Simulated with div circles) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white opacity-20 animate-pulse"
              style={{
                width: Math.random() * 4 + 'px',
                height: Math.random() * 4 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5 + 's',
                animationDuration: (Math.random() * 3 + 2) + 's'
              }}
            />
          ))}
        </div>

        {/* Texts - High Contrast Cosmic */}
        <div className="text-center z-20 mb-8 md:mb-16 animate-float relative">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tighter leading-[1.1] drop-shadow-[0_10px_30px_rgba(139,92,246,0.3)]">
            Mengolah Limbah, <br className="hidden md:block" /> Menata Jiwa
          </h1>
          <p className="text-lg md:text-2xl lg:text-3xl text-[#a78bfa] font-bold tracking-wide max-w-3xl mx-auto drop-shadow-md">
            Menyalakan Kesadaran, Mengurangi Beban, <br className="md:hidden" /> Menciptakan Peluang Keberlanjutan
          </p>
        </div>

        {/* 3D Cosmic Earth & Orbit System */}
        <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[480px] md:h-[480px] lg:w-[550px] lg:h-[550px] z-10 flex items-center justify-center mt-8 md:mt-16 transition-all">

          {/* Earth Canvas */}
          <div className="absolute inset-0 z-10">
            <canvas
              ref={canvasRef}
              className="opacity-100 hover:scale-110 transition-transform duration-1000 w-full h-full"
            />
          </div>

          {/* Orbit Container */}
          <div className="absolute w-[130%] h-[130%] animate-spin-slow rounded-full pointer-events-none">
            {wasteSources.map((source, index) => {
              const angle = (index / wasteSources.length) * 2 * Math.PI;
              const radius = 45;
              const top = 50 + radius * Math.sin(angle);
              const left = 50 + radius * Math.cos(angle);

              return (
                <button
                  key={source.id}
                  onClick={() => handleSourceClick(source)}
                  aria-label={`Lihat detail sampah ${source.label}`}
                  title={`Detail ${source.label}`}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 md:w-24 md:h-24 bg-white/5 backdrop-blur-3xl border-2 border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center text-white hover:bg-[#8b5cf6] hover:border-[#a78bfa] hover:scale-125 transition-all duration-500 shadow-[0_20px_60px_rgba(0,0,0,0.6)] pointer-events-auto cursor-pointer group z-20"
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                  }}
                >
                  <div className="animate-reverse-spin scale-90 md:scale-125">
                    {source.icon}
                  </div>
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-[#02020a] text-[10px] md:text-xs font-black px-4 py-2 rounded-xl -bottom-12 whitespace-nowrap pointer-events-none border-2 border-[#a78bfa] shadow-2xl translate-y-2 group-hover:translate-y-0 uppercase">
                    {source.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal Overlay - Cosmic Theme */}
      {selectedSource && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-6" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300"></div>

          <div
            className="relative bg-[#02020a] text-white rounded-t-[2.5rem] md:rounded-[4rem] w-full max-w-2xl overflow-hidden animate-in slide-in-from-bottom duration-500 md:animate-float border-t-8 border-[#8b5cf6] shadow-[0_0_100px_rgba(139,92,246,0.3)] mb-0 md:mb-0 max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`p-6 md:p-12 border-b border-white/5 flex justify-between items-start bg-gradient-to-br from-violet-900/20 to-transparent`}>
              <div className="flex items-center gap-4 md:gap-6">
                <div className="p-4 md:p-5 bg-white/5 rounded-2xl md:rounded-3xl shadow-xl border border-white/10 flex-shrink-0">
                  <div className="text-[#a78bfa] scale-90 md:scale-100">{selectedSource.icon}</div>
                </div>
                <div>
                  <h2 className="text-2xl md:text-4xl font-black tracking-tighter leading-none mb-1 md:mb-2 uppercase">{selectedSource.label}</h2>
                  <p className="text-[10px] md:text-sm font-bold opacity-60 leading-relaxed max-w-[180px] md:max-w-none">{selectedSource.description}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                aria-label="Tutup Modal"
                title="Tutup"
                className="p-3 md:p-4 rounded-full bg-white/5 hover:bg-white/10 transition-all text-white active:scale-90 border border-white/10"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-12 overflow-y-auto custom-scrollbar max-h-[calc(92vh-120px)]">
              {selectedSource.isCarbon ? (
                <div className="text-center py-4 md:py-12">
                  <div className="relative inline-block mb-6 md:mb-10">
                    <div className="absolute inset-0 bg-violet-600/20 blur-[40px] md:blur-[60px] animate-pulse rounded-full scale-150"></div>
                    <Cloud className="w-20 h-20 md:w-32 md:h-32 text-violet-400 mx-auto relative z-10 animate-float" />
                  </div>
                  <h3 className="text-2xl md:text-4xl font-black mb-3 md:mb-4 uppercase tracking-tighter">Hitung Jejak Karbon</h3>
                  <p className="text-base md:text-lg opacity-40 mb-8 md:mb-12 font-medium max-w-xs md:max-w-md mx-auto italic leading-tight">
                    Setiap langkah di semesta ini meninggalkan jejak. Mari audit dampak kosmikmu hari ini.
                  </p>
                  <button
                    onClick={() => {
                      closeModal();
                      document.getElementById('carbon-calculator')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    aria-label="Mulai hitung jejak karbon sekarang"
                    className="w-full md:w-auto inline-flex items-center justify-center gap-3 md:gap-4 bg-[#8b5cf6] text-white px-8 md:px-12 py-5 md:py-6 rounded-2xl md:rounded-[2rem] text-xl md:text-2xl font-black hover:bg-violet-500 transition shadow-[0_20px_50px_rgba(139,92,246,0.4)] active:scale-95 uppercase tracking-tighter"
                  >
                    Mulai Sekarang
                    <ArrowRight size={24} className="md:w-7 md:h-7" />
                  </button>
                </div>
              ) : (
                <>
                  {!processing && !showResult && (
                    <>
                      <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-[0.5em] mb-8">Pilih Jalur Manifestasi</h3>
                      <div className="grid grid-cols-1 gap-4 md:gap-5">
                        {wasteTypes.map((type) => (
                          <div
                            key={type.id}
                            onClick={() => handleTypeClick(type)}
                            className={`p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] cursor-pointer bg-white/5 border-2 border-white/5 hover:border-[#8b5cf6]/30 hover:bg-violet-900/10 transition-all flex items-center gap-5 md:gap-8 group relative overflow-hidden active:scale-[0.98] shadow-inner`}
                          >
                            <div className="bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl group-hover:rotate-12 transition-transform relative z-10 scale-110 md:scale-125 border border-white/10 text-[#a78bfa]">
                              {React.cloneElement(type.icon as React.ReactElement, { size: 28 })}
                            </div>
                            <div className="relative z-10 flex-1">
                              <h4 className="font-black text-xl md:text-2xl tracking-tighter mb-0 md:mb-1 uppercase">{type.label}</h4>
                              <p className="text-[10px] md:text-sm opacity-50 font-bold italic line-clamp-1">{type.examples}</p>
                            </div>
                            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-violet-600/5 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
                            <ArrowRight className="text-white/10 group-hover:text-[#a78bfa] group-hover:translate-x-3 transition-all scale-75 md:scale-100" size={32} />
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {processing && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                      <div className="relative mb-10">
                        <div className="absolute inset-0 bg-violet-500/10 blur-[60px] rounded-full scale-[2] animate-pulse"></div>
                        <Loader2 className="w-24 h-24 text-[#a78bfa] animate-spin relative z-10" />
                      </div>
                      <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter">Mensinkronisasi Energi...</h3>
                      <p className="text-xs font-black opacity-40 uppercase tracking-[0.4em]">Processing Nebula Data</p>
                    </div>
                  )}

                  {showResult && selectedWasteType && (
                    <div className="text-center py-4 md:py-6 animate-in zoom-in duration-500">
                      <div className={`inline-block p-8 md:p-10 rounded-3xl md:rounded-[3rem] mb-6 md:mb-10 bg-white/5 border-4 border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.3)]`}>
                        <div className="text-[#a78bfa] transform scale-125 md:scale-150">{selectedWasteType.icon}</div>
                      </div>
                      <h3 className="text-2xl md:text-4xl font-black mb-2 md:mb-3 tracking-tighter uppercase">Harmoni Keberlanjutan</h3>
                      <p className="text-sm md:text-lg opacity-40 mb-8 md:mb-12 font-medium italic leading-tight">
                        Material <span className="font-black text-[#a78bfa] underline underline-offset-8 decoration-violet-500/30">{selectedWasteType.label}</span> adalah bagian dari siklus energi yang suci.
                      </p>

                      <div className="bg-white/5 p-6 md:p-10 rounded-3xl md:rounded-[3rem] mb-8 md:mb-12 text-left border-2 border-white/5 shadow-inner backdrop-blur-xl">
                        <h4 className="font-black text-[8px] md:text-[10px] text-violet-400/40 uppercase tracking-[0.4em] mb-4 md:mb-6">Pesan Alam:</h4>
                        <p className="text-white font-black text-lg md:text-2xl leading-tight tracking-tight uppercase italic">
                          {selectedWasteType.id === 'organic' && "Kembalikan ke tanah untuk melahirkan kehidupan baru melalui kompos alami."}
                          {selectedWasteType.id === 'inorganic' && "Redistribusi material melalui bank sampah untuk reinkarnasi industri yang cerdas."}
                          {selectedWasteType.id === 'b3' && "Gunakan perlindungan khusus. Material ini memerlukan ritual pengelolaan profesional."}
                          {selectedWasteType.id === 'residue' && "Minimalkan residu. Material ini akan diproses menjadi energi murni (RDF)."}
                        </p>
                      </div>

                      <div className="flex flex-col gap-4">
                        <button
                          onClick={() => handleStartTransition(selectedWasteType.route)}
                          className="w-full px-8 md:px-10 py-5 md:py-7 bg-[#8b5cf6] text-white font-black text-xl md:text-2xl rounded-2xl md:rounded-[2rem] hover:bg-violet-500 shadow-2xl shadow-violet-500/20 transition-all flex items-center justify-center gap-3 md:gap-4 active:scale-95 uppercase tracking-tighter"
                        >
                          Eksplorasi Metode
                          <ArrowRight size={24} className="md:w-7 md:h-7" />
                        </button>
                        <button
                          onClick={() => { setShowResult(false); setSelectedWasteType(null); }}
                          className="w-full px-8 md:px-10 py-3 md:py-5 text-white/20 font-black text-sm md:text-lg rounded-xl hover:text-white transition-colors uppercase tracking-[0.3em]"
                        >
                          Kembali ke Orbit
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Carbon Calculator Section - Replaces Physics Section */}
      <section id="carbon-calculator" className="bg-[#050510] py-24 md:py-32 relative z-10 text-white rounded-t-[4rem] md:rounded-t-[8rem] -mt-10 md:-mt-20 border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_#1e1b4b_0%,_transparent_50%)] opacity-40"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-20 animate-in slide-in-from-top duration-1000">
            <div className="inline-flex items-center justify-center p-6 bg-violet-500/10 rounded-[3rem] mb-12 backdrop-blur-3xl border-2 border-violet-500/20 shadow-3xl">
              <Globe size={48} className="text-[#a78bfa] animate-spin-slow" />
            </div>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-[1.1] tracking-tighter uppercase drop-shadow-[0_10px_30px_rgba(139,92,246,0.2)]">
              Hitung Jejak Karbonmu
            </h3>
            <div className="space-y-4">
              <p className="text-xl md:text-2xl text-[#a78bfa] font-black italic tracking-wide">
                Bukan lagi tentang <span className="text-[#1d9371]">'HIJAU'</span>, tetapi tentang <span className="text-[#d516ec]">PARADIGMA</span>.
              </p>
              <p className="text-lg md:text-xl text-white/50 leading-relaxed font-bold italic max-w-3xl mx-auto">
                Ukur seberapa besar distorsi energimu terhadap kestabilan lingkungan melalui jejak karbon,
                berdasarkan prinsip mekanika universal: Energi tidak hilang, ia hanya berpindah dan berubah wujud.
              </p>
            </div>
          </div>

          <CarbonCalculator isStandalone={false} />
        </div>
      </section>

      {/* Action CTA - Cosmic Deep Space */}
      <section className="bg-[#02020a] py-32 md:py-56 text-center relative overflow-hidden px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_transparent_70%)] opacity-80"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-10 tracking-tighter leading-[1.1] drop-shadow-[0_20px_60px_rgba(139,92,246,0.4)] uppercase">
            Menyatu Dengan <span className="text-[#a78bfa]">Alam</span>
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-white/40 mb-12 max-w-3xl mx-auto font-bold italic leading-relaxed">
            "Keberlanjutan adalah cara kita merawat kehidupan, sebagai bentuk rasa syukur atas keberadaan kita."
          </p>

          {/* E-book Hook Section */}
          <div className="mb-16 animate-in fade-in zoom-in duration-1000 delay-300">
            <h4 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tighter uppercase italic drop-shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              Terlalu sibuk untuk memilah sampah di dapur?
            </h4>
            <p className="text-white/60 text-lg md:text-xl font-bold italic uppercase tracking-widest max-w-2xl mx-auto leading-relaxed mb-10">
              Miliki panduan cepat Eksklusif - <span className="text-[#a78bfa] font-black">Sistem Sampah Masuk Akal</span> untuk orang sibuk.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <button
                onClick={() => window.location.href = "/landing3harisampah.html"}
                aria-label="Dapatkan akses panduan sistem sampah masuk akal"
                className="px-12 py-5 bg-white text-[#1a1b4b] rounded-[2rem] font-black text-xl hover:scale-110 active:scale-95 transition-all shadow-3xl shadow-violet-500/20 uppercase tracking-tighter italic cursor-pointer"
              >
                Dapatkan Akses
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;