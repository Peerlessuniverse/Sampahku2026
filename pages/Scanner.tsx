import React from 'react';
import { Send, Smartphone, Sparkles, Zap, Brain, Coins, HelpCircle, Camera, ExternalLink, Star } from 'lucide-react';

const Scanner: React.FC = () => {
  const botCommands = [
    {
      command: '/start',
      icon: Zap,
      description: 'Mulai perjalanan kosmik Anda',
      color: 'from-violet-400 to-purple-600'
    },
    {
      command: '/link',
      icon: Smartphone,
      description: 'Hubungkan akun web Anda dengan 6-digit kode',
      color: 'from-blue-400 to-indigo-600'
    },
    {
      command: '/cekpoin',
      icon: Coins,
      description: 'Cek saldo EcoCredits & ranking Anda',
      color: 'from-green-400 to-emerald-600'
    },
    {
      command: '/app',
      icon: ExternalLink,
      description: 'Buka Mini App Portal langsung di Telegram',
      color: 'from-pink-400 to-rose-600'
    }
  ];

  return (
    <div className="min-h-screen bg-[#02020a] text-white pt-32 pb-24 relative overflow-hidden font-sans">

      {/* Cosmic Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-violet-900/20 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[160px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center mb-16 animate-in slide-in-from-top duration-1000">
          <div className="inline-flex items-center justify-center p-4 bg-violet-500/10 rounded-3xl mb-6 backdrop-blur-3xl border-2 border-violet-500/20 shadow-xl shadow-violet-900/20">
            <Sparkles className="h-10 w-10 text-violet-400 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white mb-4 tracking-tighter leading-[0.9] drop-shadow-[0_10px_50px_rgba(139,92,246,0.5)] uppercase italic">
            SampahKosmik Bot 🤖
          </h1>
          <p className="text-xl md:text-2xl font-black tracking-tight leading-tight max-w-3xl mx-auto mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400">
              Integrated Gemini Vision Pro
            </span>
          </p>
          <p className="text-lg md:text-xl text-white/60 font-bold max-w-2xl mx-auto leading-relaxed">
            Scan sampah via Telegram, dapatkan analisis AI instant, dan kumpulkan EcoCredits secara real-time! 🌌
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">

          {/* Left: QR Code */}
          <div className="animate-in slide-in-from-left duration-700">
            <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] border-2 border-white/10 overflow-hidden shadow-2xl p-8 h-full flex flex-col justify-center">
              <div className="flex flex-col items-center justify-center space-y-8">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                    Pintu Gerbang Kosmik
                  </h3>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Scan untuk Memulai Misi</p>
                </div>

                <div className="relative group cursor-pointer">
                  <div className="absolute inset-0 bg-violet-500/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="relative bg-white p-6 rounded-3xl transform group-hover:scale-105 transition-transform duration-500 shadow-2xl">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://t.me/SampahKosmikBot&color=5b21b6`}
                      alt="SampahKosmik Bot QR Code"
                      className="w-52 h-52 md:w-64 md:h-64 object-contain"
                    />
                    <div className="absolute -bottom-4 -right-4 bg-[#24A1DE] text-white p-4 rounded-2xl shadow-xl animate-bounce border-4 border-[#02020a]">
                      <Send size={28} fill="currentColor" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 w-full">
                  <a
                    href="https://t.me/SampahKosmikBot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 bg-[#24A1DE] hover:bg-[#28b1f5] text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-blue-500/20 transform hover:scale-105 active:scale-95 text-lg"
                  >
                    <Smartphone size={24} />
                    Buka Telegram
                    <Sparkles size={20} className="animate-pulse" />
                  </a>
                </div>

                <div className="flex items-center justify-center gap-3 text-white/40">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 border-2 border-[#02020a] flex items-center justify-center text-xs font-black">
                        {i === 1 ? '🌱' : i === 2 ? '♻️' : '🌍'}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Garda Kosmik Aktif</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Bot Commands */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-black text-white mb-8 uppercase tracking-tight flex items-center gap-3">
              <Zap className="text-amber-400 fill-amber-400" />
              Protokol Bot
            </h3>
            <div className="grid gap-4">
              {botCommands.map((cmd, index) => (
                <div
                  key={index}
                  className="bg-white/[0.03] backdrop-blur-3xl rounded-2xl border-2 border-white/10 p-6 hover:border-violet-500/30 hover:bg-white/[0.05] transition-all duration-300 group animate-in slide-in-from-right"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${cmd.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <cmd.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <code className="text-lg font-black text-violet-400 font-mono tracking-tighter">{cmd.command}</code>
                      <p className="text-white/60 font-bold text-sm mt-1 leading-snug">{cmd.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-violet-600/10 border border-violet-500/20 rounded-2xl">
              <h4 className="text-sm font-black uppercase text-violet-400 mb-2 flex items-center gap-2">
                <Brain size={16} />
                AI Vision Protocol
              </h4>
              <p className="text-xs text-gray-500 font-bold leading-relaxed">
                Langsung kirim foto sampah ke chat untuk memulai analisa otomatis tanpa perintah tambahan.
              </p>
            </div>
          </div>

        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/[0.03] backdrop-blur-3xl rounded-3xl border-2 border-white/10 p-8 text-center hover:border-violet-500/30 transition-all duration-300 group">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-black text-white mb-2 uppercase italic tracking-tight">Satelit Vision</h4>
            <p className="text-xs text-white/50 font-bold leading-relaxed">
              Analisa spektrum material dengan akurasi Gemini Vision Pro.
            </p>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-3xl rounded-3xl border-2 border-white/10 p-8 text-center hover:border-emerald-500/30 transition-all duration-300 group">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Coins className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-black text-white mb-2 uppercase italic tracking-tight">Instant Sync</h4>
            <p className="text-xs text-white/50 font-bold leading-relaxed">
              Partikel Energi yang dikumpulkan di Telegram akan langsung masuk ke dompet Anda.
            </p>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-3xl rounded-3xl border-2 border-white/10 p-8 text-center hover:border-pink-500/30 transition-all duration-300 group">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-black text-white mb-2 uppercase italic tracking-tight">AI Advisor</h4>
            <p className="text-xs text-white/50 font-bold leading-relaxed">
              Konsultasi langsung mengenai tata cara daur ulang yang paling puitis dan tepat.
            </p>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-violet-600/10 to-purple-600/10 backdrop-blur-3xl rounded-[3rem] border-2 border-violet-500/20 p-12 inline-block w-full max-w-3xl">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Star className="w-6 h-6 text-amber-400 fill-amber-400 animate-pulse" />
              <Star className="w-10 h-10 text-amber-400 fill-amber-400" />
              <Star className="w-6 h-6 text-amber-400 fill-amber-400 animate-pulse" />
            </div>
            <h4 className="text-3xl font-black text-white mb-4 uppercase italic">Mulai Evolusi Anda</h4>
            <p className="text-white/50 font-bold mb-8 max-w-md mx-auto text-sm leading-relaxed">
              Bergabunglah dengan ribuan Guardian lainnya di seluruh semesta SampahKu.
            </p>
            <a
              href="https://t.me/SampahKosmikBot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl hover:shadow-violet-500/50 transform hover:scale-105 active:scale-95 text-xl italic"
            >
              <Zap className="w-6 h-6" />
              Aktifkan Bot
              <Sparkles className="w-6 h-6 animate-pulse" />
            </a>
          </div>

          <div className="mt-16">
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.5em] mb-4">
              © 2026 SampahKu Cosmic Labs
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Scanner;