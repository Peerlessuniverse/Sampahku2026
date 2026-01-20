import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, Loader2, ArrowRight, ExternalLink } from 'lucide-react';
import { getActiveSponsor, trackImpression, trackClick } from '../services/sponsorService';

interface SponsorScreenProps {
    onComplete: () => void;
    message?: string;
    theme?: 'cosmic' | 'forest';
}

const SponsorScreen: React.FC<SponsorScreenProps> = ({
    onComplete,
    message: customMessage,
    theme: customTheme
}) => {
    const [progress, setProgress] = useState(0);
    const [showButton, setShowButton] = useState(false);
    const sponsor = getActiveSponsor();

    const displayTheme = sponsor.theme || customTheme || 'cosmic';
    const displayMessage = customMessage || sponsor.message;
    const isForest = displayTheme === 'forest';

    useEffect(() => {
        if (sponsor?.id) {
            trackImpression(sponsor.id);
        }

        const duration = 2500;
        const interval = 50;
        const step = (interval / duration) * 100;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setShowButton(true);
                    return 100;
                }
                return prev + step;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [sponsor?.id]);

    // Enhanced media formatter for better stability & performance
    const formatMediaUrl = (url: string, type: 'image' | 'video' | 'none') => {
        if (!url) return "";
        const trimmed = url.trim();

        // 1. YouTube Handling
        const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const ytMatch = trimmed.match(ytRegExp);
        if (ytMatch && ytMatch[2].length === 11) {
            return `https://www.youtube.com/embed/${ytMatch[2]}?autoplay=1&controls=0&loop=1&playlist=${ytMatch[2]}`;
        }

        // 2. Google Drive Handling
        if (trimmed.includes('drive.google.com')) {
            const driveIdMatch = trimmed.match(/\/d\/([^/]+)/) || trimmed.match(/id=([^&]+)/);
            if (driveIdMatch && driveIdMatch[1]) {
                const id = driveIdMatch[1];
                // For images, we use the thumbnail API which is much faster & bypasses 100MB virus scan limits
                if (type === 'image') {
                    return `https://drive.google.com/thumbnail?id=${id}&sz=w1920`;
                }
                // For videos, we use the uc export link
                return `https://drive.google.com/uc?export=view&id=${id}`;
            }
        }

        return trimmed;
    };

    const isYouTube = (url: string) => {
        return url?.includes('youtube.com') || url?.includes('youtu.be');
    };

    const finalMediaUrl = formatMediaUrl(sponsor.mediaUrl, sponsor.mediaType);

    return (
        <div className={`fixed inset-0 z-[2000] flex flex-col items-center justify-center overflow-hidden transition-all duration-1000 ${isForest ? 'bg-[#022c22]' : 'bg-[#02020a]'}`}>

            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-20 pointer-events-none ${isForest ? 'bg-[radial-gradient(circle_at_center,_#10b981_0%,_transparent_70%)]' : 'bg-[radial-gradient(circle_at_center,_#8b5cf6_0%,_transparent_70%)]'}`}></div>

            <div className="relative z-10 flex flex-col items-center max-w-2xl px-6 text-center space-y-10">
                <div className="animate-in fade-in slide-in-from-top duration-700">
                    <div className={`inline-flex items-center gap-3 px-6 py-2 rounded-full border backdrop-blur-3xl italic font-black uppercase tracking-[0.4em] text-[10px] ${isForest ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-violet-500/10 border-violet-500/30 text-violet-400'}`}>
                        <ShieldCheck size={14} />
                        Mitra Penjaga Semesta
                    </div>
                </div>

                <div className="w-full relative group animate-in zoom-in duration-1000 delay-200">
                    <div className={`absolute inset-0 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity rounded-full scale-110 ${isForest ? 'bg-emerald-500' : 'bg-violet-600'}`}></div>

                    <div className={`relative w-full aspect-video md:aspect-[21/9] rounded-[3rem] border-4 overflow-hidden shadow-2xl transition-all duration-700 ${isForest ? 'bg-white/5 border-emerald-500/20' : 'bg-white/5 border-violet-500/20'}`}>

                        {sponsor.mediaType === 'video' ? (
                            isYouTube(sponsor.mediaUrl) ? (
                                <iframe
                                    src={finalMediaUrl}
                                    className="w-full h-full border-0 opacity-80 pointer-events-none"
                                    allow="autoplay; encrypted-media"
                                    title="Sponsor Video"
                                />
                            ) : (
                                <video
                                    src={finalMediaUrl}
                                    autoPlay loop playsInline
                                    className="w-full h-full object-cover opacity-80"
                                />
                            )
                        ) : sponsor.mediaType === 'image' ? (
                            <img
                                src={finalMediaUrl}
                                alt={sponsor.name}
                                className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-white/[0.05] to-transparent">
                                <Sparkles className={`w-20 h-20 mb-4 animate-pulse ${isForest ? 'text-emerald-400' : 'text-violet-400'}`} />
                                <h2 className="text-white font-black text-4xl md:text-5xl italic uppercase tracking-tighter leading-none mb-2">{sponsor.name}</h2>
                                <p className={`text-[10px] md:text-xs font-black uppercase tracking-[0.5em] opacity-40 ${isForest ? 'text-emerald-400' : 'text-violet-400'}`}>{sponsor.tagline}</p>
                            </div>
                        )}

                        {sponsor.linkUrl && (
                            <a
                                href={sponsor.linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackClick(sponsor.id)}
                                className="absolute bottom-6 right-8 flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                            >
                                <ExternalLink size={14} /> Kunjungi Situs
                            </a>
                        )}
                    </div>
                </div>

                <div className="space-y-8 w-full animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
                    <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-tight drop-shadow-2xl">{displayMessage}</h3>

                    {!showButton ? (
                        <div className="space-y-6 max-w-md mx-auto">
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div className={`h-full transition-all duration-300 ease-out ${isForest ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'bg-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.5)]'}`} style={{ width: `${progress}%` }}></div>
                            </div>
                            <div className="flex items-center justify-center gap-3 opacity-20">
                                <Loader2 className="w-4 h-4 animate-spin text-white" />
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.6em] italic">Sinkronisasi...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in zoom-in duration-500 max-w-md mx-auto pt-2">
                            <button onClick={onComplete} className={`w-full group relative flex items-center justify-center gap-4 px-10 py-6 rounded-[2rem] font-black text-2xl uppercase italic tracking-tighter transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden ${isForest ? 'bg-emerald-500 text-white shadow-[0_20px_60px_rgba(16,185,129,0.3)]' : 'bg-violet-600 text-white shadow-[0_20px_60px_rgba(139,92,246,0.3)]'}`}>
                                <span className="relative z-10">Lanjutkan</span>
                                <ArrowRight className="relative z-10 group-hover:translate-x-3 transition-transform duration-500" size={32} />
                                <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-30deg] group-hover:left-[150%] transition-all duration-1000"></div>
                            </button>
                        </div>
                    )}
                </div>

                <div className="pt-10 opacity-20">
                    <p className="text-[10px] text-white font-black uppercase tracking-[0.6em] italic leading-relaxed">SampahKu & {sponsor.name} <br /> Berkolaborasi Untuk Alam</p>
                </div>
            </div>
            <div className={`absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay ${isForest ? 'bg-[url("https://www.transparenttextures.com/patterns/carbon-fibre.png")]' : 'bg-[url("https://www.transparenttextures.com/patterns/stardust.png")]'}`}></div>
        </div>
    );
};

export default SponsorScreen;
