import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, CheckCircle2, AlertCircle, RefreshCw, X, Sparkles, Leaf, ArrowRight, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { analyzeWasteImage } from '../services/geminiService';
import { addCredits } from '../services/creditService';
import { getCurrentUser, loginWithGoogle, onAuthUIStateChanged } from '../services/authService';
import { WasteAnalysis } from '../types';

import SponsorScreen from '../components/SponsorScreen';

const Scanner: React.FC = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSponsor, setShowSponsor] = useState(false);
  const [result, setResult] = useState<WasteAnalysis | null>(null);
  const [pendingResult, setPendingResult] = useState<WasteAnalysis | null>(null);
  const [verified, setVerified] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [user, setUser] = useState(getCurrentUser());
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthUIStateChanged((newUser) => {
      setUser(newUser ? getCurrentUser() : null);
    });
    return () => unsubscribe();
  }, []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran file terlalu besar. Maksimal 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        handleAnalyze(base64.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (base64Data: string) => {
    setLoading(true);
    setShowSponsor(true);
    setError(null);
    setResult(null);
    setPendingResult(null);
    try {
      const analysis = await analyzeWasteImage(base64Data);
      setPendingResult(analysis);
    } catch (err) {
      const errorMessage = (err as Error).message || "Gagal menganalisa gambar.";
      setError(errorMessage);
      setShowSponsor(false);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSponsorComplete = () => {
    setShowSponsor(false);
  };

  // Efek untuk memindahkan hasil pending ke hasil utama setelah sponsor selesai
  React.useEffect(() => {
    if (!showSponsor && pendingResult) {
      setResult(pendingResult);
      setVerified(false);
      setPendingResult(null); // Clear pending
    }
  }, [showSponsor, pendingResult]);

  const handleVerify = async () => {
    if (result && !verified) {
      if (!user) {
        try {
          const loggedInUser = await loginWithGoogle();
          if (!loggedInUser) return;
          // After successful login, the state will update and they can claim
          return;
        } catch (err) {
          console.error("Login silang gagal:", err);
          return;
        }
      }

      setClaiming(true);
      try {
        await addCredits(10, `Pencapaian: Radar AI mendeteksi ${result.materialType}`);
        setVerified(true);
      } catch (err) {
        console.error(err);
      } finally {
        setClaiming(false);
      }
    }
  };

  const handleStudyAndClaim = async () => {
    if (!result) return;

    // Auto claim points if not verified
    if (!verified) {
      await handleVerify();
    }

    // Navigate to method detail (cleaned for AI potential messiness)
    const rawRoute = (result.transformationRoute || '')
      .replace(/['"]/g, '')
      .trim()
      .toLowerCase();

    // IF AI FAILS TO PROVIDE ROUTE, GO TO LANDING INSTEAD OF GUESSING ORGANIC
    const cleanRoute = ['organic', 'inorganic', 'b3', 'residu'].includes(rawRoute)
      ? rawRoute
      : '';

    navigate(cleanRoute ? `/transformasi/${cleanRoute}` : '/transformasi');
  };

  const handleStudyWTE = async () => {
    if (!result) return;

    // Auto claim points if not verified (using unique ID for WTE study)
    const wteActivityId = `wte_education_${result.materialType}_${Date.now()}`;
    await addCredits(10, `Pakar: Mempelajari Potensi Energi ${result.materialType}`, wteActivityId);

    // Navigate to WTE page
    navigate('/wte');
  };

  const handleReportIncorrect = async () => {
    if (result && !verified) {
      await addCredits(1, "Kontribusi Koreksi Data AI");
      alert("Apresiasi Terkirim! +1 Eco-Credit untuk kontribusi koreksi Anda. Silakan pindai ulang.");
      resetScanner();
    }
  };


  const resetScanner = () => {
    setImage(null);
    setResult(null);
    setPendingResult(null);
    setVerified(false);
    setError(null);
    setShowSponsor(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-[#022c22] text-white pt-32 pb-24 transition-all duration-700">

      {showSponsor && (
        <SponsorScreen
          onComplete={handleSponsorComplete}
          message="Menganalisa Materi..."
          theme="forest"
        />
      )}

      {/* Forest Decorative Blur */}
      <div className="fixed top-0 left-1/4 w-[800px] h-[800px] bg-emerald-900/20 rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[160px] pointer-events-none -z-10"></div>

      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-8 animate-in slide-in-from-top duration-1000">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl mb-4 backdrop-blur-3xl border-2 border-emerald-500/20 shadow-xl shadow-emerald-900/10">
            <Leaf className="h-8 w-8 text-[#4ade80] animate-pulse" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tighter leading-[1.1] drop-shadow-[0_10px_30px_rgba(16,185,129,0.3)] uppercase">
            Scanner Sampahku
          </h1>
          <p className="text-sm md:text-lg text-[#4ade80] font-bold max-w-xl mx-auto italic opacity-90 uppercase tracking-tighter drop-shadow-md">
            Pindai sampah Anda untuk analisis instan
          </p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[2rem] shadow-[0_40px_80px_rgba(0,0,0,0.6)] border-2 border-white/10 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Input Section */}
            <div className="p-6 md:p-10 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/5 bg-black/20 min-h-[400px]">
              {!image ? (
                <div className="w-full h-full flex flex-col gap-6 animate-in fade-in duration-1000">
                  <div className="text-center mb-2">
                    <p className="text-[10px] text-emerald-400/60 font-black uppercase tracking-[0.4em] mb-2 italic">Input Source</p>
                    <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Pilih Jalur <span className="text-emerald-400">Data.</span></h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                    {/* Camera Button */}
                    <button
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.setAttribute('capture', 'environment');
                          fileInputRef.current.click();
                        }
                      }}
                      className="group relative flex flex-col items-center justify-center p-8 rounded-[2rem] bg-white/[0.03] border-2 border-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all active:scale-95 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="p-5 bg-emerald-500 text-black rounded-2xl shadow-xl shadow-emerald-500/20 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                          <Camera size={28} />
                        </div>
                        <p className="text-white font-black uppercase italic tracking-tighter text-sm">Ambil Foto</p>
                        <p className="text-[8px] text-white/30 font-bold uppercase tracking-widest mt-1">Live Scanner</p>
                      </div>
                    </button>

                    {/* Gallery Button */}
                    <button
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.removeAttribute('capture');
                          fileInputRef.current.click();
                        }
                      }}
                      className="group relative flex flex-col items-center justify-center p-8 rounded-[2rem] bg-white/[0.03] border-2 border-white/5 hover:border-blue-500/40 hover:bg-blue-500/10 transition-all active:scale-95 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="p-5 bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-500/20 mb-4 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                          <Upload size={28} />
                        </div>
                        <p className="text-white font-black uppercase italic tracking-tighter text-sm">Buka Galeri</p>
                        <p className="text-[8px] text-white/30 font-bold uppercase tracking-widest mt-1">Upload File</p>
                      </div>
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    title="Unggah Gambar Sampah"
                  />

                  <div className="text-center pt-2">
                    <p className="text-[7px] text-white/20 font-bold uppercase tracking-[0.3em] italic">
                      Format Terdukung: JPG, PNG, WEBP (Max 5MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative w-full max-h-[400px] rounded-2xl overflow-hidden shadow-2xl group border-2 border-white/10 animate-in zoom-in duration-700 flex items-center justify-center bg-black/40">
                  <img src={image} alt="Uploaded Material" className="w-full h-full object-contain opacity-100 group-hover:opacity-40 group-hover:grayscale transition-all duration-1000" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button
                      onClick={resetScanner}
                      className="bg-rose-500 text-white px-6 py-2 rounded-xl font-black text-sm shadow-2xl hover:bg-rose-600 transition-all scale-75 group-hover:scale-100 uppercase tracking-widest"
                    >
                      Hapus
                    </button>
                  </div>
                  {loading && (
                    <div className="absolute inset-0 bg-[#064e3b]/80 backdrop-blur-md flex flex-col items-center justify-center">
                      <Loader2 className="h-10 w-10 text-emerald-400 animate-spin mb-3" />
                      <p className="text-emerald-400 font-black tracking-[0.4em] uppercase text-[8px]">Analisa AI...</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Result Section */}
            <div className="p-6 md:p-8 bg-emerald-900/5 flex flex-col justify-center min-h-[300px]">
              {(loading || showSponsor) ? (
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-emerald-600/20 blur-[40px] animate-pulse rounded-full scale-[1.2]"></div>
                    <Loader2 className="h-16 w-16 text-emerald-400 animate-spin relative z-10 mx-auto" strokeWidth={3} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white leading-none tracking-tighter uppercase italic">Menganalisa...</h3>
                    <p className="text-white/40 font-black uppercase tracking-[0.4em] text-[7px]">Unit Radar Aktif</p>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center space-y-6 animate-in zoom-in duration-500 overflow-y-auto max-h-[500px] p-4">
                  <div className="p-8 bg-rose-500/10 rounded-[3rem] border-4 border-rose-500/20 shadow-2xl">
                    <AlertCircle size={48} className="text-rose-500 mx-auto mb-6" />
                    <p className="text-white font-black text-xl leading-tight tracking-tight uppercase mb-4">{error}</p>
                    {/* Detailed Log display for debugging */}
                    <div className="text-left bg-black/40 rounded-2xl p-4 border border-rose-500/10">
                      <p className="text-[8px] font-black text-rose-400 uppercase tracking-widest mb-2">Diagnostic Log:</p>
                      <pre className="text-[10px] text-white/40 font-mono whitespace-pre-wrap break-all leading-tight">
                        {error.includes('[') ? 'Cek detail di log browser/jaringan' : 'Menghubungi pusat data...'}
                      </pre>
                    </div>
                  </div>
                  <button
                    onClick={resetScanner}
                    className="w-full py-5 bg-white/5 rounded-2xl font-black text-white hover:bg-white/10 transition-all uppercase tracking-widest border-2 border-white/5"
                  >
                    Ulangi Pemindaian
                  </button>
                </div>
              ) : result ? (
                <div className="animate-in slide-in-from-right duration-700 space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-900/30 border border-emerald-500/30">
                    <div className={`p-3 rounded-xl ${result.isRecyclable ? 'bg-emerald-500 text-black' : 'bg-white/5 text-white/20'}`}>
                      {result.isRecyclable ? <CheckCircle2 size={24} /> : <X size={24} />}
                    </div>
                    <div>
                      <h3 className="font-black text-xl text-white tracking-tighter leading-none mb-1 uppercase italic">
                        {result.isRecyclable ? "Dapat Didaur Ulang" : "Sampah Residu"}
                      </h3>
                      <p className="text-[7px] font-black text-emerald-400 uppercase tracking-[0.4em]">
                        Akurasi {(result.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex justify-between items-center group">
                      <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">Material</span>
                      <p className="font-black text-sm text-white uppercase italic group-hover:text-emerald-400 transition-colors">{result.materialType}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-900/20 border border-emerald-500/10">
                      <span className="text-[7px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-1 block">Instruksi</span>
                      <p className="text-white text-[13px] leading-tight font-bold uppercase italic tracking-tight">{result.disposalInstructions}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-violet-900/10 border border-violet-500/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap size={10} className="text-violet-400" />
                        <span className="text-[7px] font-black text-violet-400 uppercase tracking-[0.4em]">Energi</span>
                      </div>
                      <p className="text-white text-[13px] leading-tight font-bold uppercase italic tracking-tight">{result.energyPotential}</p>
                    </div>

                    {result.transformationRoute !== 'none' && (
                      <>
                        <button
                          onClick={handleStudyAndClaim}
                          className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all font-black text-[10px] uppercase tracking-widest text-[#4ade80] group/link"
                        >
                          <Leaf size={14} className="group-hover/link:rotate-12 transition-transform" /> Pelajari Metode Transformasi <ArrowRight size={14} />
                        </button>

                        <button
                          onClick={handleStudyWTE}
                          className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 transition-all font-black text-[10px] uppercase tracking-widest text-orange-400 group/link"
                        >
                          <Zap size={14} className="group-hover/link:scale-125 transition-transform" /> Pelajari Transformasi Energi <ArrowRight size={14} />
                        </button>
                      </>
                    )}
                  </div>

                  <div className="pt-2 space-y-2">
                    {!verified ? (
                      <div className="space-y-2">
                        <button
                          onClick={handleVerify}
                          disabled={claiming}
                          className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl hover:scale-[1.02] transition-all font-black text-lg shadow-lg active:scale-95 group uppercase tracking-tighter disabled:opacity-50 disabled:cursor-not-allowed ${!user
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                            : 'bg-[#4ade80] text-black'
                            }`}
                        >
                          {claiming ? (
                            <Loader2 size={20} className="animate-spin" />
                          ) : !user ? (
                            <Upload size={20} />
                          ) : (
                            <CheckCircle2 size={20} />
                          )}
                          {claiming ? "MENSINKRONKAN..." : !user ? "MASUK & KLAIM POIN" : "KLAIM POIN"}
                        </button>

                        {!user && (
                          <p className="text-[7px] text-white/30 text-center uppercase font-black tracking-[0.2em]">
                            *Data akan disimpan aman di pusat data cloud
                          </p>
                        )}

                        <button
                          onClick={handleReportIncorrect}
                          className="w-full py-1 text-white/20 hover:text-rose-400 font-black uppercase tracking-widest text-[7px] italic transition-colors"
                        >
                          Hasil Salah? Pindai Ulang
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-center flex flex-col items-center gap-2 animate-in zoom-in">
                          <div className="bg-emerald-500 text-black p-2 rounded-full shadow-lg shadow-emerald-500/40">
                            <Sparkles size={16} />
                          </div>
                          <p className="text-emerald-400 font-black text-sm italic uppercase tracking-tighter">Energi Tersinkronisasi!</p>
                          <p className="text-white/40 text-[9px] uppercase font-bold">+10 ECO-CREDITS TERCATAT</p>
                        </div>
                        <button
                          onClick={resetScanner}
                          className="w-full flex items-center justify-center gap-3 bg-white text-[#064e3b] py-4 rounded-xl hover:scale-[1.02] transition-all font-black text-lg shadow-lg active:scale-95 group uppercase tracking-tighter"
                        >
                          <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-700 text-emerald-600" />
                          PINDAI BARU
                        </button>
                      </div>
                    )}

                    {verified && (
                      <div className="text-center space-y-2">
                        <p className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">
                          Siklus Materi Terkonfirmasi
                        </p>
                        <p className="text-white/20 text-[8px] font-bold uppercase tracking-widest leading-none">
                          Terima kasih telah berkontribusi menjaga harmoni alam.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-8 py-10 group">
                  <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mx-auto border-2 border-white/5 animate-float group-hover:scale-110 transition-transform duration-700">
                    <Sparkles size={32} className="text-emerald-400 rotate-12 animate-pulse" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-3xl font-black text-white tracking-tighter uppercase leading-none italic">Menunggu <br /> Input Gambar</p>
                    <p className="text-base font-bold text-white/30 italic max-w-xs mx-auto uppercase tracking-tighter">Silakan unggah foto sampah Anda melalui modul di samping.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA - E-book Hook Section (Mini Version) */}
      <div className="mt-24 text-center max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom duration-1000 px-6 pb-12">
        {/* Quote about waste and consciousness */}
        <div className="space-y-4">
          <p className="text-[#4ade80] text-lg md:text-xl font-bold italic uppercase tracking-[0.2em] opacity-40 leading-relaxed md:px-12">
            "Scanner Sampahku adalah jendela untuk melihat potensi tersembunyi di balik sisa materi yang terabaikan."
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
            className="inline-flex items-center gap-4 bg-white text-[#064e3b] font-black px-10 py-5 rounded-[2rem] hover:scale-105 transition-all shadow-[0_20px_60px_rgba(74,222,128,0.1)] uppercase tracking-tighter text-xl italic group cursor-pointer"
          >
            Dapatkan Akses <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Scanner;