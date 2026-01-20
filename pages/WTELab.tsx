import React from 'react';
import {
    Flame, Zap, Atom, Battery, FlaskConical, Droplet, Fuel, Sparkles,
    Binary, ArrowLeft, Thermometer
} from 'lucide-react';
import { Link } from 'react-router-dom';

const WTELab: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#02020a] pt-32 pb-32 px-6 overflow-hidden relative text-white">
            {/* Cosmic Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_#1e1b4b_0%,_transparent_50%)] pointer-events-none -z-10"></div>
            <div className="fixed bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,_#312e81_0%,_transparent_50%)] opacity-30 pointer-events-none -z-10"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Back Button */}
                <Link to="/wte" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors uppercase font-black text-xs tracking-[0.3em] italic mb-12 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Kembali ke Eksplorasi
                </Link>

                {/* Header Section */}
                <div className="text-center mb-24 space-y-6">
                    <div className="inline-block px-6 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.5em] backdrop-blur-3xl italic">
                        Advanced Technology Research Matrix
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.1] uppercase italic">
                        Laboratorium <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-400 drop-shadow-[0_0_40px_rgba(34,211,238,0.3)]">Metode Energi.</span>
                    </h1>
                </div>

                {/* Research Matrix Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

                    {/* 1. IGNIS-01 (Plastic to Fuel) */}
                    <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group hover:border-orange-500/30 transition-all duration-500 shadow-2xl flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 blur-[60px] rounded-full group-hover:bg-orange-600/20 transition-all"></div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="p-3 bg-orange-600/20 rounded-2xl border border-orange-500/30">
                                    <Flame className="w-6 h-6 text-orange-500" />
                                </div>
                                <div>
                                    <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest leading-none block mb-1">Project: IGNIS-01</span>
                                    <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Thermal Plastic Cycle</h2>
                                </div>
                            </div>

                            <p className="text-sm text-white/50 italic leading-relaxed relative z-10">
                                Melalui rekayasa <span className="text-orange-400 font-black">Depolimerisasi Katalitik</span>, rantai karbon plastik dipaksa terputus kembali menjadi bentuk hidrokarbon cair murni dalam reaktor vakum.
                            </p>

                            <div className="grid grid-cols-2 gap-3 relative z-10">
                                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                    <span className="text-[8px] font-bold text-orange-400 uppercase tracking-widest block mb-1">Efficiency</span>
                                    <p className="text-lg font-black text-white italic tracking-tighter">88.4%</p>
                                </div>
                                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                    <span className="text-[8px] font-bold text-orange-400 uppercase tracking-widest block mb-1">Yield</span>
                                    <p className="text-lg font-black text-white italic tracking-tighter">1.2 L/KG</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 relative z-10">
                            <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase italic">
                                <Sparkles className="w-3 h-3 text-orange-500" /> Output: Fuel Grade RON 92-95
                            </div>
                        </div>
                    </div>

                    {/* 2. LUMOS-CELL (Organic Battery) */}
                    <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-500 shadow-2xl flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/10 blur-[60px] rounded-full group-hover:bg-cyan-600/20 transition-all"></div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="p-3 bg-cyan-600/20 rounded-2xl border border-cyan-500/30">
                                    <Battery className="w-6 h-6 text-cyan-400" />
                                </div>
                                <div>
                                    <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest leading-none block mb-1">Project: LUMOS-CELL</span>
                                    <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Organic Waste Battery</h2>
                                </div>
                            </div>

                            <p className="text-sm text-white/50 italic leading-relaxed relative z-10">
                                Mengandalkan <span className="text-cyan-400 font-black italic">Aktivasi Karbon Nanopore</span> dari residu pembakaran, dipadukan dengan elektrolit asam dari fermentasi limbah buah busuk.
                            </p>

                            <div className="grid grid-cols-2 gap-3 relative z-10">
                                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                    <span className="text-[8px] font-bold text-cyan-400 uppercase tracking-widest block mb-1">Potential</span>
                                    <p className="text-lg font-black text-white italic tracking-tighter">3.7V - 4.2V</p>
                                </div>
                                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                    <span className="text-[8px] font-bold text-cyan-400 uppercase tracking-widest block mb-1">Life Sync</span>
                                    <p className="text-lg font-black text-white italic tracking-tighter">1200+ Cyc</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 relative z-10">
                            <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase italic">
                                <Zap className="w-3 h-3 text-yellow-400" /> Output: Green Energy Storage
                            </div>
                        </div>
                    </div>

                    {/* 3. THERMO-CORE (TEG) */}
                    <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group hover:border-yellow-500/30 transition-all duration-500 shadow-2xl flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-600/10 blur-[60px] rounded-full group-hover:bg-yellow-600/20 transition-all"></div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="p-3 bg-yellow-600/20 rounded-2xl border border-yellow-500/30">
                                    <Thermometer className="w-6 h-6 text-yellow-500" />
                                </div>
                                <div>
                                    <span className="text-[8px] font-black text-yellow-500 uppercase tracking-widest leading-none block mb-1">Project: THERMO-CORE</span>
                                    <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Thermo-Electric Gen</h2>
                                </div>
                            </div>

                            <p className="text-sm text-white/50 italic leading-relaxed relative z-10">
                                Memanfaatkan perbedaan suhu dekomposisi organik menggunakan modul semikonduktor. Energi panas dikonversi menjadi listrik melalui fenomena <span className="text-yellow-400 font-black">Seebeck Effect</span>.
                            </p>

                            <div className="grid grid-cols-2 gap-3 relative z-10">
                                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                    <span className="text-[8px] font-bold text-yellow-400 uppercase tracking-widest block mb-1">Δ Temp Req</span>
                                    <p className="text-lg font-black text-white italic tracking-tighter">Δ 25°C-60°C</p>
                                </div>
                                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                    <span className="text-[8px] font-bold text-yellow-400 uppercase tracking-widest block mb-1">Recov Rate</span>
                                    <p className="text-lg font-black text-white italic tracking-tighter">18.5%</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 relative z-10">
                            <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase italic">
                                <Binary className="w-3 h-3 text-yellow-500" /> Output: Solid State Micro-Grid
                            </div>
                        </div>
                    </div>

                    {/* 4. MFC-CORE (Microbial Fuel Cell) */}
                    <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-500 shadow-2xl flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-[60px] rounded-full group-hover:bg-purple-600/20 transition-all"></div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="p-3 bg-purple-600/20 rounded-2xl border border-purple-500/30">
                                    <Atom className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest leading-none block mb-1">Project: MFC-CORE</span>
                                    <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Microbial Fuel Cell</h2>
                                </div>
                            </div>

                            <p className="text-sm text-white/50 italic leading-relaxed relative z-10">
                                Sistem ini menangkap rilis elektron langsung dari proses metabolisme limbah cair oleh koloni bakteri spesifik seperti <span className="text-purple-400 italic">Geobacter</span> tanpa pembakaran.
                            </p>

                            <div className="grid grid-cols-2 gap-3 relative z-10">
                                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                    <span className="text-[8px] font-bold text-purple-400 uppercase tracking-widest block mb-1">Mechanism</span>
                                    <p className="text-lg font-black text-white italic tracking-tighter">Extracel</p>
                                </div>
                                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                    <span className="text-[8px] font-bold text-purple-400 uppercase tracking-widest block mb-1">Catalyst</span>
                                    <p className="text-lg font-black text-white italic tracking-tighter">Bio-Enzyme</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 relative z-10">
                            <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase italic">
                                <FlaskConical className="w-3 h-3 text-purple-500" /> Output: Constant DC Energy
                            </div>
                        </div>
                    </div>

                    {/* 5. ANTHRO-BIO (Human Kinetic) */}
                    <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-500 shadow-2xl flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 blur-[60px] rounded-full group-hover:bg-emerald-600/20 transition-all"></div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="p-3 bg-emerald-600/20 rounded-2xl border border-emerald-500/30">
                                    <Zap className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest leading-none block mb-1">Project: ANTHRO-BIO</span>
                                    <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Human Bio-Kinetic</h2>
                                </div>
                            </div>

                            <p className="text-sm text-white/50 italic leading-relaxed relative z-10">
                                Memanfaatkan elemen <span className="text-emerald-400 font-black">Piezoelektrik</span> pada infrastruktur publik untuk memanen energi dari tekanan langkah kaki dan radiasi panas tubuh dalam ekosistem urban.
                            </p>

                            <div className="grid grid-cols-2 gap-3 relative z-10">
                                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                    <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">Primary Src</span>
                                    <p className="text-lg font-black text-white italic tracking-tighter">Kinetic</p>
                                </div>
                                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                    <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">Scope</span>
                                    <p className="text-lg font-black text-white italic tracking-tighter">Smart-Eco</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 relative z-10">
                            <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase italic">
                                <Zap className="w-3 h-3 text-emerald-400" /> Output: Urban Micro-Harvesting
                            </div>
                        </div>
                    </div>

                    {/* 6. AERO-ALGAE (CO2 Bio-Fixation) */}
                    <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500 shadow-2xl flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[60px] rounded-full group-hover:bg-blue-600/20 transition-all"></div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="p-3 bg-blue-600/20 rounded-2xl border border-blue-500/30">
                                    <Droplet className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest leading-none block mb-1">Project: AERO-ALGAE</span>
                                    <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">CO2 Bio-Fixation</h2>
                                </div>
                            </div>

                            <p className="text-sm text-white/50 italic leading-relaxed relative z-10">
                                Reaktor mikroalga yang menyerap CO2 hasil transformasi limbah dan mengubahnya menjadi <span className="text-blue-400 font-bold italic">Lipid Biomassa</span> untuk bahan bakar Bio-Avtur tingkat tinggi.
                            </p>

                            <div className="grid grid-cols-2 gap-3 relative z-10">
                                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                    <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest block mb-1">Fixation</span>
                                    <p className="text-lg font-black text-white italic tracking-tighter">94.2% CO2</p>
                                </div>
                                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                    <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest block mb-1">Lipid Pot</span>
                                    <p className="text-lg font-black text-white italic tracking-tighter">Premium</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 relative z-10">
                            <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase italic">
                                <Fuel className="w-3 h-3 text-blue-400" /> Output: Bio-Kerosene / Avtur
                            </div>
                        </div>
                    </div>

                </div>

                {/* Final Closing Section */}
                <section className="text-center pb-20 mt-32">
                    <div className="inline-block p-12 md:p-20 rounded-[4rem] bg-white text-black relative group overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.1)]">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-cyan-500 to-emerald-500"></div>

                        <div className="relative z-10 space-y-8">
                            <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
                                Mulai <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-cyan-500 to-emerald-500">Transformasi.</span>
                            </h3>
                            <p className="text-black/40 font-black uppercase italic tracking-widest max-w-xl mx-auto leading-relaxed text-sm md:text-lg">
                                Laboratorium ini adalah berdasarkan riset yang sudah beredar dalam jurnal-jurnal ilmiah, kita sedang mengembalikan peradaban di mana <span className="text-black underline decoration-indigo-500 decoration-4">Sampah saat ini sebenarnya adalah Sumber Daya yang penuh Potensi.</span>
                            </p>

                            <div className="flex flex-wrap justify-center gap-3 overflow-hidden opacity-50">
                                {['Pyrolysis V4', 'Carbon-Lab', 'MFC-Grid', 'Seebeck-Node', 'Fixation-Unit'].map((tag, i) => (
                                    <span key={i} className="text-[10px] font-black uppercase tracking-widest border border-black/10 px-4 py-2 rounded-full">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default WTELab;
