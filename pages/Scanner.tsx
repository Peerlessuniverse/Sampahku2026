import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, CheckCircle2, AlertCircle, RefreshCw, X, Sparkles, Leaf, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyzeWasteImage } from '../services/geminiService';
import { addCredits } from '../services/creditService';
import { WasteAnalysis } from '../types';

import SponsorScreen from '../components/SponsorScreen';

const Scanner: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSponsor, setShowSponsor] = useState(false);
  const [result, setResult] = useState<WasteAnalysis | null>(null);
  const [pendingResult, setPendingResult] = useState<WasteAnalysis | null>(null);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      setError("Gagal menganalisa gambar. Pastikan koneksi atau coba gambar lain.");
      setShowSponsor(false);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSponsorComplete = () => {
    setShowSponsor(false);
    if (pendingResult) {
      setResult(pendingResult);
      setVerified(false); // Reset verified state for new result
    }
  };

  const handleVerify = () => {
    if (result && !verified) {
      addCredits(10, `Verifikasi Pemindaian: ${result.materialType}`);
      setVerified(true);
      alert(`Energi Tersinkronisasi! +10 Eco-Credits telah ditambahkan.`);
    }
  };

  const handleReportIncorrect = () => {
    if (result && !verified) {
      addCredits(1, "Kontribusi Koreksi Data AI");
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

      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16 animate-in slide-in-from-top duration-1000">
          <div className="inline-flex items-center justify-center p-6 bg-emerald-500/10 rounded-[3rem] mb-10 backdrop-blur-3xl border-2 border-emerald-500/20 shadow-3xl shadow-emerald-900/20">
            <Leaf className="h-16 w-16 text-[#4ade80] animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tighter leading-[1.1] drop-shadow-[0_10px_30px_rgba(16,185,129,0.3)] uppercase">
            Scanner Sampahku
          </h1>
          <p className="text-lg md:text-2xl lg:text-3xl text-[#4ade80] font-bold max-w-3xl mx-auto italic opacity-90 uppercase tracking-tighter drop-shadow-md">
            Identifikasi jenis sampah berpotensi menggunakan AI Scanner
          </p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[4rem] shadow-[0_60px_120px_rgba(0,0,0,0.8)] border-2 border-white/10 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Input Section */}
            <div className="p-10 md:p-20 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/5 min-h-[400px] lg:min-h-[650px]">
              {!image ? (
                <div
                  className="w-full h-full flex flex-col items-center justify-center border-4 border-dashed border-white/5 rounded-[4rem] bg-white/[0.01] hover:bg-emerald-900/20 hover:border-emerald-500/30 transition-all cursor-pointer group relative overflow-hidden active:scale-[0.98]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="absolute inset-0 bg-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10 flex flex-col items-center text-center px-10">
                    <div className="p-10 bg-gradient-to-br from-emerald-600 to-green-600 text-white rounded-[2.5rem] shadow-2xl shadow-emerald-500/40 mb-10 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                      <Camera size={48} />
                    </div>
                    <p className="text-white text-3xl font-black mb-4 tracking-tighter uppercase leading-none italic">Pindai Objek</p>
                    <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.5em]">Input Gambar Sampah</p>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    title="Unggah Gambar Sampah"
                  />
                </div>
              ) : (
                <div className="relative w-full h-full aspect-square rounded-[3.5rem] overflow-hidden shadow-2xl group border-8 border-white/5 animate-in zoom-in duration-700">
                  <img src={image} alt="Uploaded Material" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button
                      onClick={resetScanner}
                      className="bg-rose-500 text-white px-12 py-5 rounded-3xl font-black text-xl shadow-2xl hover:bg-rose-600 transition-all scale-75 group-hover:scale-100 uppercase tracking-widest"
                    >
                      Hapus Gambar
                    </button>
                  </div>
                  <div className="absolute inset-0 bg-[#064e3b]/80 backdrop-blur-md flex flex-col items-center justify-center">
                    <Loader2 className="h-24 w-24 text-emerald-400 animate-spin mb-6" />
                    <p className="text-emerald-400 font-black tracking-[0.4em] uppercase text-xs">Menganalisa Materi</p>
                  </div>
                </div>
              )}
            </div>

            {/* Result Section */}
            <div className="p-10 md:p-20 bg-emerald-900/5 flex flex-col justify-center min-h-[450px]">
              {(loading || showSponsor) ? (
                <div className="text-center space-y-10">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-emerald-600/20 blur-[80px] animate-pulse rounded-full scale-[2]"></div>
                    <Loader2 className="h-32 w-32 text-emerald-400 animate-spin relative z-10 mx-auto" strokeWidth={3} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-5xl font-black text-white leading-none tracking-tighter uppercase italic">Menganalisa <br /> Sampah...</h3>
                    <p className="text-white/40 font-black uppercase tracking-[0.5em] text-xs">Scanning Nature Database</p>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center space-y-10 animate-in zoom-in duration-500">
                  <div className="p-10 bg-rose-500/10 rounded-[3rem] border-4 border-rose-500/20 shadow-2xl">
                    <AlertCircle size={64} className="text-rose-500 mx-auto mb-8" />
                    <p className="text-white font-black text-2xl leading-tight tracking-tight uppercase">{error}</p>
                  </div>
                  <button
                    onClick={resetScanner}
                    className="w-full py-6 bg-white/5 rounded-2xl font-black text-white hover:bg-white/10 transition-all uppercase tracking-widest border-2 border-white/5"
                  >
                    Ulangi Pemindaian
                  </button>
                </div>
              ) : result ? (
                <div className="animate-in slide-in-from-right duration-700 space-y-12">
                  <div className="flex items-center gap-8 p-10 rounded-[3.5rem] bg-emerald-900/20 border-4 border-emerald-500/20 shadow-3xl">
                    <div className={`p-6 rounded-[2rem] shadow-2xl ${result.isRecyclable ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white' : 'bg-white/5 text-white/20'}`}>
                      {result.isRecyclable ? <CheckCircle2 size={48} /> : <X size={48} />}
                    </div>
                    <div>
                      <h3 className="font-black text-4xl text-white tracking-tighter leading-none mb-2 underline decoration-emerald-500/30 uppercase italic">
                        {result.isRecyclable ? "Dapat Didaur Ulang" : "Sampah Residu"}
                      </h3>
                      <p className="text-xs font-black text-emerald-400 uppercase tracking-[0.4em]">
                        Tingkat Akurasi {(result.confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border-2 border-white/5 space-y-2">
                      <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">Jenis Material</span>
                      <p className="font-black text-3xl text-white tracking-tighter uppercase italic">{result.materialType}</p>
                    </div>

                    <div className="p-10 rounded-[3rem] bg-gradient-to-br from-emerald-900/40 to-transparent border-4 border-emerald-500/10 space-y-4">
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.5em]">Intruksi Pembuangan</span>
                      <p className="text-white text-2xl leading-[1.3] font-black tracking-tight uppercase italic">{result.disposalInstructions}</p>
                    </div>

                    <div className="p-10 rounded-[3rem] bg-gradient-to-br from-violet-900/40 to-transparent border-4 border-violet-500/10 space-y-4">
                      <div className="flex items-center gap-2">
                        <Zap size={16} className="text-violet-400" />
                        <span className="text-[10px] font-black text-violet-400 uppercase tracking-[0.5em]">Potensi Energi</span>
                      </div>
                      <p className="text-white text-2xl leading-[1.3] font-black tracking-tight uppercase italic">{result.energyPotential}</p>
                    </div>
                  </div>

                  <div className="pt-6 space-y-4">
                    {!verified ? (
                      <div className="space-y-4">
                        <button
                          onClick={handleVerify}
                          className="w-full flex items-center justify-center gap-6 bg-[#4ade80] text-black py-7 rounded-[2rem] hover:scale-105 transition-all font-black text-2xl shadow-[0_40px_80px_rgba(74,222,128,0.2)] active:scale-95 group uppercase tracking-tighter"
                        >
                          <CheckCircle2 size={32} />
                          VERIFIKASI & KLAIM POIN
                        </button>

                        <button
                          onClick={handleReportIncorrect}
                          className="w-full py-4 text-white/40 hover:text-rose-400 font-black uppercase tracking-widest text-[10px] italic transition-colors"
                        >
                          Hasil Tidak Sesuai? Coba Pindai Ulang
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={resetScanner}
                        className="w-full flex items-center justify-center gap-6 bg-white text-[#064e3b] py-7 rounded-[2rem] hover:scale-105 hover:bg-emerald-50 transition-all font-black text-2xl shadow-[0_40px_80px_rgba(0,0,0,0.8)] active:scale-95 group uppercase tracking-tighter"
                      >
                        <RefreshCw size={32} className="group-hover:rotate-180 transition-transform duration-700 text-emerald-600" />
                        PINDAI SAMPAH BARU
                      </button>
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
                <div className="text-center space-y-12 py-16 group">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-white/5 flex items-center justify-center mx-auto border-4 border-white/5 animate-float group-hover:scale-110 transition-transform duration-700">
                    <Sparkles size={48} className="text-emerald-400 rotate-12 animate-pulse" />
                  </div>
                  <div className="space-y-4">
                    <p className="text-4xl font-black text-white tracking-tighter uppercase leading-none italic">Menunggu <br /> Input Gambar</p>
                    <p className="text-lg font-bold text-white/30 italic max-w-xs mx-auto uppercase tracking-tighter">Silakan unggah foto sampah Anda melalui modul di samping.</p>
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
            onClick={() => window.open("https://utas.me/lp/tokosampah/3-hari-menghilangkan-bau-sampah-dapur", "_blank", "noopener,noreferrer")}
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