import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Flame, Zap, Atom, Battery, FlaskConical, Droplet, Fuel, Sparkles,
    Binary, Lightbulb, Factory, Car, Smartphone, Sun, Wind, Globe, ArrowRight,
    Thermometer, CloudRain, Leaf, Trash2, Recycle, AlertTriangle, RefreshCw
} from 'lucide-react';

import SponsorScreen from '../components/SponsorScreen';

const WTE: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'kebutuhan' | 'jenis' | 'sumber'>('kebutuhan');
    const [showSponsor, setShowSponsor] = useState(false);

    return (
        <div className="min-h-screen bg-[#02020a] pt-32 pb-32 px-6 overflow-hidden relative">
            {/* Cosmic Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_#1e1b4b_0%,_transparent_50%)] pointer-events-none -z-10"></div>
            <div className="fixed bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,_#312e81_0%,_transparent_50%)] opacity-30 pointer-events-none -z-10"></div>

            {/* Electric Sparkle effect */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full animate-pulse delay-700"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="text-center mb-16 space-y-6">
                    <div className="inline-block px-6 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[#a78bfa] text-[10px] font-black uppercase tracking-[0.5em] backdrop-blur-3xl italic">
                        Waste-to-Energy (WTE)
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.1] uppercase italic">
                        Transformasi <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-300 to-cyan-400 drop-shadow-[0_0_40px_rgba(251,191,36,0.3)]">Akhir Energi.</span>
                    </h1>
                    <p className="text-lg md:text-2xl lg:text-3xl text-white/40 max-w-3xl mx-auto font-bold italic leading-tight uppercase tracking-tighter">
                        Mengubah mata rantai limbah menjadi sumber daya <br className="hidden md:block" /> penggerak peradaban masa depan.
                    </p>
                </div>

                {/* Energy Introduction Section (Interactive) */}
                <section className="mb-40">
                    <div className="max-w-5xl mx-auto bg-white/[0.02] border border-white/5 rounded-[4rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
                        <div className="flex flex-col md:flex-row border-b border-white/5">
                            <button
                                onClick={() => setActiveTab('kebutuhan')}
                                className={`flex-1 py-8 px-6 font-black uppercase tracking-widest text-sm transition-all duration-500 flex items-center justify-center gap-3 ${activeTab === 'kebutuhan' ? 'bg-indigo-500 text-white shadow-[0_0_40px_rgba(99,102,241,0.3)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                            >
                                <Globe className="w-5 h-5" /> Kebutuhan
                            </button>
                            <button
                                onClick={() => setActiveTab('jenis')}
                                className={`flex-1 py-8 px-6 font-black uppercase tracking-widest text-sm transition-all duration-500 flex items-center justify-center gap-3 ${activeTab === 'jenis' ? 'bg-cyan-500 text-white shadow-[0_0_40px_rgba(6,182,212,0.3)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                            >
                                <Zap className="w-5 h-5" /> Jenis Energi
                            </button>
                            <button
                                onClick={() => setActiveTab('sumber')}
                                className={`flex-1 py-8 px-6 font-black uppercase tracking-widest text-sm transition-all duration-500 flex items-center justify-center gap-3 ${activeTab === 'sumber' ? 'bg-orange-500 text-white shadow-[0_0_40px_rgba(249,115,22,0.3)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                            >
                                <Factory className="w-5 h-5" /> Sumber Saat Ini
                            </button>
                        </div>

                        <div className="p-12 md:p-20">
                            {activeTab === 'kebutuhan' && (
                                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                        <div className="space-y-8">
                                            <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                                                Nadi Utama <br /> <span className="text-indigo-400">Kehidupan Modern.</span>
                                            </h3>
                                            <p className="text-xl text-white/50 font-medium italic leading-relaxed uppercase tracking-tighter">
                                                Tanpa energi, peradaban kita berhenti. Dari detik pertama kita terbangun hingga dunia digital yang tak pernah tertidur, energi adalah kekuatan yang menggerakkan segalanya.
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-indigo-500/50 transition-colors group">
                                                <Smartphone className="w-10 h-10 text-indigo-400 mb-4 group-hover:scale-110 transition-transform" />
                                                <p className="font-black uppercase italic text-white leading-none">Mobilitas <br />Digital</p>
                                            </div>
                                            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-indigo-500/50 transition-colors group">
                                                <Car className="w-10 h-10 text-indigo-400 mb-4 group-hover:scale-110 transition-transform" />
                                                <p className="font-black uppercase italic text-white leading-none">Transportasi <br />Global</p>
                                            </div>
                                            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-indigo-500/50 transition-colors group">
                                                <Lightbulb className="w-10 h-10 text-indigo-400 mb-4 group-hover:scale-110 transition-transform" />
                                                <p className="font-black uppercase italic text-white leading-none">Cahaya & <br />Hunian</p>
                                            </div>
                                            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-indigo-500/50 transition-colors group">
                                                <Factory className="w-10 h-10 text-indigo-400 mb-4 group-hover:scale-110 transition-transform" />
                                                <p className="font-black uppercase italic text-white leading-none">Industri & <br />Produksi</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'jenis' && (
                                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                        {[
                                            { title: 'Kinetik', desc: 'Energi dari objek yang bergerak.', icon: <Wind /> },
                                            { title: 'Termal', desc: 'Energi panas dari getaran atom.', icon: <Flame /> },
                                            { title: 'Listrik', desc: 'Aliran elektron yang sangat cepat.', icon: <Zap /> },
                                            { title: 'Kimia', desc: 'Energi tersimpan dalam ikatan molekul.', icon: <Atom /> },
                                        ].map((item, idx) => (
                                            <div key={idx} className="p-10 bg-[#0a0a2e]/50 border-2 border-cyan-500/20 rounded-[3rem] text-center space-y-4 hover:border-cyan-500 transition-all group">
                                                <div className="inline-block p-4 bg-cyan-500/10 rounded-2xl text-cyan-400 mb-2 group-hover:rotate-12 transition-transform">
                                                    {item.icon}
                                                </div>
                                                <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">{item.title}</h4>
                                                <p className="text-white/30 font-bold uppercase text-xs italic tracking-widest">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-10 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl text-center">
                                        <p className="text-white font-black italic uppercase tracking-tighter">
                                            Hukum Kekekalan: <span className="text-indigo-400">Energi tidak dapat diciptakan atau dimusnahkan, ia hanya berubah bentuk.</span>
                                        </p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'sumber' && (
                                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                        <div className="relative aspect-video rounded-[3rem] border-4 border-orange-500/30 overflow-hidden group">
                                            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/40 to-black/60 group-hover:opacity-0 transition-opacity z-10"></div>
                                            <img
                                                src="/images/fossil_fuel_source_1768667627944.png"
                                                alt="Traditional Energy Source"
                                                className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                                            />
                                            <div className="absolute bottom-8 left-8 z-20">
                                                <p className="text-xs font-black text-white/50 uppercase tracking-[0.5em] mb-2 leading-none">Traditional Way</p>
                                                <h4 className="text-4xl font-black text-white italic uppercase tracking-tighter drop-shadow-2xl">Fossil Fuels</h4>
                                            </div>
                                        </div>
                                        <div className="space-y-10">
                                            <div className="space-y-4">
                                                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Kondisi <span className="text-orange-500">Saat Ini</span></h3>
                                                <p className="text-lg text-white/40 font-bold italic leading-relaxed uppercase tracking-tighter">
                                                    Sebagian besar energi dunia masih bergantung pada penggalian sisa-sisa kehidupan purba di perut bumi.
                                                </p>
                                            </div>
                                            <div className="space-y-4">
                                                {[
                                                    { name: 'Batubara', level: '70%', width: 'w-[70%]', color: 'bg-orange-600' },
                                                    { name: 'Minyak Bumi', level: '20%', width: 'w-[20%]', color: 'bg-orange-500' },
                                                    { name: 'Energi Baru', level: '10%', width: 'w-[10%]', color: 'bg-indigo-400' },
                                                ].map((bar, i) => (
                                                    <div key={i} className="space-y-2">
                                                        <div className="flex justify-between font-black text-[10px] text-white/40 uppercase tracking-widest italic">
                                                            <span>{bar.name}</span>
                                                            <span>{bar.level}</span>
                                                        </div>
                                                        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                                                            <div className={`${bar.color} ${bar.width} h-full rounded-full transition-all duration-1000`}></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="pt-8 border-t border-white/5 space-y-6">
                                                <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em] italic">
                                                    ⚠️ Dampak Eksploitasi Tanpa Batas:
                                                </p>
                                                <div className="grid grid-cols-1 gap-4">
                                                    <div className="flex items-start gap-4 group/item">
                                                        <div className="p-2 bg-red-500/10 rounded-lg text-red-500 group-hover/item:scale-110 transition-transform">
                                                            <Thermometer className="w-4 h-4" />
                                                        </div>
                                                        <p className="text-xs text-white/40 font-bold italic uppercase tracking-tighter leading-tight">
                                                            <span className="text-white">Krisis Iklim:</span> <br /> Suhu bumi meningkat, memicu cuaca ekstrem dan bencana yang tak terduga.
                                                        </p>
                                                    </div>
                                                    <div className="flex items-start gap-4 group/item">
                                                        <div className="p-2 bg-red-500/10 rounded-lg text-red-500 group-hover/item:scale-110 transition-transform">
                                                            <CloudRain className="w-4 h-4" />
                                                        </div>
                                                        <p className="text-xs text-white/40 font-bold italic uppercase tracking-tighter leading-tight">
                                                            <span className="text-white">Polusi Toksik:</span> <br /> Jutaan ton emisi karbon merusak udara yang kita hirup setiap detik.
                                                        </p>
                                                    </div>
                                                    <div className="flex items-start gap-4 group/item">
                                                        <div className="p-2 bg-red-500/10 rounded-lg text-red-500 group-hover/item:scale-110 transition-transform">
                                                            <Globe className="w-4 h-4" />
                                                        </div>
                                                        <p className="text-xs text-white/40 font-bold italic uppercase tracking-tighter leading-tight">
                                                            <span className="text-white">Kepunahan Massal:</span> <br /> Habitat hancur, ribuan spesies menghilang sebelum sempat kita kenal.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Transition Arrow to Solution */}
                <div className="flex flex-col items-center mb-20 animate-bounce">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[1em] mb-4 italic ml-4">Solusi Masa Depan</p>
                    <ArrowRight className="w-12 h-12 text-white/10 rotate-90" />
                </div>

                {/* New Section: The Universal Transformation Solution */}
                <section className="mb-40 text-center space-y-16">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
                            Energi dari <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Segala Sisi.</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-white/50 font-bold italic uppercase tracking-tighter leading-relaxed">
                            Solusi utama kita sederhana namun revolusioner: <br className="hidden md:block" />
                            <span className="text-white">Mengubah setiap helai limbah menjadi energi pengganti.</span> <br className="hidden md:block" />
                            Dari sisa organik hingga plastik yang paling sulit sekalipun.
                        </p>
                    </div>

                    {/* Universal Transformation Bridge */}
                    <div className="max-w-6xl mx-auto space-y-12">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 px-6">

                            {/* Left Side: All Waste Types */}
                            <div className="flex-1 w-full lg:pt-12">
                                <div className="grid grid-cols-4 gap-4">
                                    {[
                                        { icon: <Leaf />, label: 'Organik', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                                        { icon: <Recycle />, label: 'Anorganik', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                                        { icon: <AlertTriangle />, label: 'B3', color: 'text-orange-400', bg: 'bg-orange-500/10' },
                                        { icon: <Trash2 />, label: 'Residu', color: 'text-slate-400', bg: 'bg-slate-500/10' },
                                    ].map((waste, i) => (
                                        <div key={i} className="flex flex-col items-center gap-3 group">
                                            <div className={`w-full aspect-square rounded-[2rem] ${waste.bg} border-2 border-white/5 flex items-center justify-center ${waste.color} group-hover:scale-110 group-hover:border-white/20 transition-all duration-500 shadow-2xl`}>
                                                {React.cloneElement(waste.icon as React.ReactElement, { size: 32 })}
                                            </div>
                                            <span className="text-[10px] font-black uppercase text-white/40 italic">{waste.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Middle: The Transformation Core */}
                            <div className="shrink-0 flex flex-col items-center justify-center space-y-4">
                                <div className="relative">
                                    {/* Animated Glow Rings */}
                                    <div className="absolute inset-0 bg-cyan-500/20 blur-[40px] animate-pulse rounded-full scale-150"></div>
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white flex items-center justify-center text-[#02020a] shadow-[0_0_60px_rgba(255,255,255,0.4)] animate-spin-slow relative z-10">
                                        <RefreshCw size={48} className="md:w-16 md:h-16" />
                                    </div>

                                    {/* Flow Lines (Desktop) */}
                                    <div className="hidden lg:block absolute top-1/2 left-full w-32 h-1 bg-gradient-to-r from-white to-transparent -translate-y-1/2"></div>
                                    <div className="hidden lg:block absolute top-1/2 right-full w-32 h-1 bg-gradient-to-l from-white to-transparent -translate-y-1/2"></div>
                                </div>
                            </div>

                            {/* Right Side: Manifested Energy */}
                            <div className="flex-1 w-full lg:pt-12">
                                <div className="grid grid-cols-4 gap-4">
                                    {[
                                        { icon: <Zap />, label: 'Listrik', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                                        { icon: <Fuel />, label: 'Biofuel', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                                        { icon: <Flame />, label: 'Thermal', color: 'text-orange-400', bg: 'bg-orange-500/10' },
                                        { icon: <Battery />, label: 'Storage', color: 'text-purple-400', bg: 'bg-purple-500/10' },
                                    ].map((energy, i) => (
                                        <div key={i} className="flex flex-col items-center gap-3 group">
                                            <div className={`w-full aspect-square rounded-[2rem] ${energy.bg} border-2 border-white/5 flex items-center justify-center ${energy.color} group-hover:scale-110 group-hover:border-white/20 transition-all duration-500 shadow-2xl`}>
                                                {React.cloneElement(energy.icon as React.ReactElement, { size: 32 })}
                                            </div>
                                            <span className="text-[10px] font-black uppercase text-white/40 italic">{energy.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Tagline */}
                        <div className="pt-8 text-center">
                            <div className="inline-block px-10 py-6 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl">
                                <p className="text-white font-black italic uppercase tracking-tighter text-lg md:text-xl">
                                    "Tidak ada limbah yang ditinggalkan. <span className="text-cyan-400">Semua Menjadi Energi.</span>"
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* WTE Lab Entrance CTA */}
                <section className="text-center py-20 pb-40">
                    <div className="max-w-3xl mx-auto p-12 rounded-[4rem] bg-gradient-to-b from-white/5 to-transparent border border-white/10 backdrop-blur-3xl relative overflow-hidden group">
                        {/* Decorative background glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="relative z-10 w-full flex justify-center">
                            <button
                                onClick={() => setShowSponsor(true)}
                                className="inline-flex items-center gap-4 px-12 py-5 rounded-full bg-white text-black font-black uppercase tracking-widest hover:bg-cyan-400 hover:scale-110 active:scale-95 transition-all group/btn"
                            >
                                Masuk Ke Lab Energi <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </section>

                {showSponsor && (
                    <SponsorScreen
                        onComplete={() => {
                            setShowSponsor(false);
                            navigate('/wte/lab');
                        }}
                        message="Membuka Akses Laboratorium..."
                        theme="cosmic"
                    />
                )}

                {/* Footer CTA - E-book Hook Section (Mini Version) */}
                <div className="mt-24 text-center max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom duration-1000 px-6 pb-12">
                    {/* Quote about waste and consciousness */}
                    <div className="space-y-4">
                        <p className="text-cyan-400 text-lg md:text-xl font-bold italic uppercase tracking-[0.2em] opacity-40 leading-relaxed md:px-12">
                            "Energi sejati tidak pernah hilang, ia hanya menanti keberanian kita untuk membebaskannya dari tumpukan sisa."
                        </p>
                    </div>

                    {/* Hook Sentence */}
                    <div className="space-y-4">
                        <h4 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase italic leading-tight drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                            Terlalu jelimet dengan sistem pengolahan sampah?
                        </h4>
                        <p className="text-white/30 text-base md:text-xl font-bold italic uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
                            Miliki panduan cepat Eksklusif - <span className="text-cyan-400 font-black">Sistem Sampah Masuk Akal</span> untuk orang sibuk.
                        </p>
                    </div>

                    <div className="flex flex-col items-center">
                        <button
                            onClick={() => window.location.href = "/landing3harisampah.html"}
                            className="inline-flex items-center gap-4 bg-white text-[#02020a] font-black px-10 py-5 rounded-[2rem] hover:scale-105 transition-all shadow-[0_20px_60px_rgba(34,211,238,0.1)] uppercase tracking-tighter text-xl italic group cursor-pointer"
                        >
                            Dapatkan Akses <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WTE;
