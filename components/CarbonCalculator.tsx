import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Car, Zap, Utensils, ShoppingBag, ArrowRight, ArrowLeft,
    RotateCcw, TrendingUp, Award, AlertTriangle, CheckCircle2,
    Globe, Plane, Thermometer, Wind, Trash2, Leaf
} from 'lucide-react';
import SponsorScreen from './SponsorScreen';
import { addCredits } from '../services/creditService';


interface CalculatorState {
    carKm: number;
    bikeKm: number;
    publicTransportKm: number;
    flightsDomestic: number;
    flightsIntl: number;
    electricityBill: number;
    acHours: number;
    lpgCanisters: number;
    dietType: 'meat-heavy' | 'average' | 'low-meat' | 'vegan';
    plasticUsage: 'high' | 'average' | 'low';
    fashionHabit: 'fast' | 'average' | 'slow';
    recycling: boolean;
}

const CarbonCalculator: React.FC<{ isStandalone?: boolean }> = ({ isStandalone = true }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [showSponsor, setShowSponsor] = useState(false);
    const [data, setData] = useState<CalculatorState>({
        carKm: 50,
        bikeKm: 30,
        publicTransportKm: 0,
        flightsDomestic: 0,
        flightsIntl: 0,
        electricityBill: 500000,
        acHours: 8,
        lpgCanisters: 2,
        dietType: 'average',
        plasticUsage: 'average',
        fashionHabit: 'average',
        recycling: false
    });

    const [emissions, setEmissions] = useState({
        transport: 0,
        energy: 0,
        food: 0,
        lifestyle: 0,
        total: 0
    });

    useEffect(() => {
        // Transport: km/week * 52 weeks
        const transport =
            (data.carKm * 52 * 0.19) +
            (data.bikeKm * 52 * 0.1) +
            (data.publicTransportKm * 52 * 0.04) +
            (data.flightsDomestic * 250) + // per flight avg
            (data.flightsIntl * 1200);

        // Energy: monthly * 12
        // Indon Electricity approx 0.87kg CO2 / kWh. Rp 1544/kWh.
        const energy =
            ((data.electricityBill / 1544) * 0.87 * 12) +
            (data.acHours * 1.2 * 30 * 12) + // AC approx 1.2kg per hour usage
            (data.lpgCanisters * 9 * 12);

        // Food: Multiplier based on habits
        let foodBase = 2100; // Average kg CO2e per year for Indonesian
        if (data.dietType === 'meat-heavy') foodBase = 3200;
        if (data.dietType === 'low-meat') foodBase = 1500;
        if (data.dietType === 'vegan') foodBase = 1100;
        const food = foodBase;

        // Lifestyle & Waste
        let lifestyleBase = 400;
        if (data.fashionHabit === 'fast') lifestyleBase += 400;
        if (data.fashionHabit === 'slow') lifestyleBase -= 200;

        if (data.plasticUsage === 'high') lifestyleBase += 200;
        if (data.plasticUsage === 'low') lifestyleBase -= 100;

        if (data.recycling) lifestyleBase -= 150;

        const total = transport + energy + food + Math.max(50, lifestyleBase);

        setEmissions({
            transport,
            energy,
            food,
            lifestyle: Math.max(50, lifestyleBase),
            total
        });
    }, [data]);

    const steps = [
        {
            title: "Jalur Mobilitas",
            subtitle: "Setiap roda yang berputar meninggalkan jejak gas di atmosfer.",
            icon: <Car size={24} />,
            color: "bg-indigo-500",
            fact: "Satu mobil bensin rata-rata mengeluarkan 190 gram CO2 setiap kilometernya."
        },
        {
            title: "Energi Rumah",
            subtitle: "Listrik kita di Indonesia sebagian besar masih berasal dari pembakaran batu bara.",
            icon: <Zap size={24} />,
            color: "bg-amber-500",
            fact: "AC adalah penyumbang emisi terbesar di rumah tropis karena penggunaan dayanya yang kontinu."
        },
        {
            title: "Piring Makan",
            subtitle: "Apa yang kita makan memiliki sejarah emisi dari ladang hingga ke meja.",
            icon: <Utensils size={24} />,
            color: "bg-emerald-500",
            fact: "Industri daging sapi membutuhkan lahan dan air 10x lebih banyak daripada pangan nabati."
        },
        {
            title: "Konsumsi & Sampah",
            subtitle: "Produksi barang baru menyerap energi Bumi yang sangat besar.",
            icon: <ShoppingBag size={24} />,
            color: "bg-rose-500",
            fact: "Memilah sampah plastik bisa mengurangi kebutuhan produksi plastik baru sebesar 70%."
        }
    ];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            setShowSponsor(true);
        }
    };

    const handleSponsorComplete = async () => {
        setShowSponsor(false);
        setShowResult(true);
        // Update credits (real Firestore sync)
        await addCredits(100, "Audit Jejak Karbon Tahunan");
    };


    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    const getSuggestions = () => {
        const suggestions = [];
        if (emissions.transport > 2500) suggestions.push({ title: "Optimasi Perjalanan", text: "Jejak transportasi Anda tinggi. Coba gabungkan beberapa urusan dalam satu rute atau gunakan transportasi umum 2 hari dalam seminggu." });
        if (data.acHours > 10) suggestions.push({ title: "Manajemen Suhu AC", text: "Atur AC di suhu 24-25°C. Setiap kenaikan 1 derajat menghemat konsumsi listrik hingga 10%." });
        if (data.dietType === 'meat-heavy') suggestions.push({ title: "Meatless Monday", text: "Anda tidak harus jadi vegan, tapi mencoba satu hari tanpa daging dalam seminggu sangat berdampak besar bagi Bumi." });
        if (data.plasticUsage === 'high' || !data.recycling) suggestions.push({ title: "Zero Waste Mindset", text: "Mulai bawa kantong belanja sendiri dan pilah sampah organik untuk dijadikan kompos (Eco-Enzyme)." });

        if (suggestions.length === 0) suggestions.push({ title: "Penerang Galaksi", text: "Gaya hidup Anda sudah sangat selaras dengan alam. Anda adalah inspirasi bagi sekitar!" });
        return suggestions;
    };

    const indonesianAverage = 3500; // Adjusted for better accuracy (approx 3.5 Ton per capita)

    return (
        <div className={`${isStandalone ? 'pt-32 pb-24' : 'pt-0 pb-0'} transition-all duration-700 font-sans relative text-white bg-transparent`}>
            {showSponsor && (
                <SponsorScreen
                    onComplete={handleSponsorComplete}
                />
            )}
            <div className="max-w-7xl mx-auto px-6">
                {!showResult ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Form Section */}
                        <div className="lg:col-span-8 bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] shadow-2xl border border-white/10 overflow-hidden">
                            {/* Stepper Header */}
                            <div className="bg-white/[0.03] p-8 md:p-12 border-b border-white/5">
                                <div className="flex justify-between items-center mb-10 max-w-md mx-auto relative px-4">
                                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/5 -translate-y-1/2 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-rose-500 transition-all duration-1000 ease-out" style={{ width: `${(step / (steps.length - 1)) * 100}%` }}></div>
                                    </div>

                                    {steps.map((s, idx) => (
                                        <div key={idx} className="relative z-10">
                                            <div
                                                onClick={() => idx < step && setStep(idx)}
                                                className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 cursor-pointer ${idx === step ? `${s.color} border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-110` :
                                                    idx < step ? 'bg-white/20 border-white/40 text-white' : 'bg-white/5 border-white/10 text-white/10'
                                                    }`}
                                            >
                                                {React.cloneElement(s.icon as React.ReactElement, { size: 18 })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-center md:text-left space-y-2">
                                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">{steps[step].title}</h2>
                                    <p className="text-white/40 text-sm md:text-lg font-medium italic">{steps[step].subtitle}</p>
                                </div>
                            </div>

                            {/* Form Content */}
                            <div className="p-8 md:p-12 min-h-[450px]">
                                {step === 0 && (
                                    <div className="space-y-10">
                                        {[
                                            { key: 'carKm', label: 'Berapa km Anda naik Mobil seminggu?', icon: <Car />, max: 1000, unit: 'km' },
                                            { key: 'bikeKm', label: 'Berapa km Anda naik Motor seminggu?', icon: <Zap />, max: 1000, unit: 'km' },
                                            { key: 'flightsDomestic', label: 'Penerbangan Domestik (kali/tahun)', icon: <Plane />, max: 50, unit: 'kali' },
                                            { key: 'flightsIntl', label: 'Penerbangan International (kali/tahun)', icon: <Plane />, max: 20, unit: 'kali' }
                                        ].map((item) => (
                                            <div key={item.key} className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2 italic">
                                                        {React.cloneElement(item.icon as React.ReactElement, { size: 14 })} {item.label}
                                                    </label>
                                                    <span className="text-2xl font-black italic tracking-tighter">{data[item.key as keyof CalculatorState]} <span className="text-[10px] opacity-30 uppercase">{item.unit}</span></span>
                                                </div>
                                                <input
                                                    type="range" min="0" max={item.max}
                                                    value={data[item.key as keyof CalculatorState] as number}
                                                    onChange={(e) => setData({ ...data, [item.key]: parseInt(e.target.value) })}
                                                    className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-indigo-500"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {step === 1 && (
                                    <div className="space-y-12">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Tagihan Listrik Bulanan (Rupiah)</label>
                                            <div className="relative group">
                                                <input
                                                    type="number"
                                                    value={data.electricityBill}
                                                    onChange={(e) => setData({ ...data, electricityBill: Math.max(0, parseInt(e.target.value) || 0) })}
                                                    className="w-full bg-white/5 border-2 border-white/5 p-6 rounded-3xl text-3xl font-black focus:border-amber-500 outline-none transition-all tracking-tighter"
                                                />
                                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 font-black italic">IDR / bln</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Durasi Pakai AC (Jam/Hari)</label>
                                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl w-full border border-white/5">
                                                    <button onClick={() => setData({ ...data, acHours: Math.max(0, data.acHours - 1) })} className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 text-xl font-black transition-all">-</button>
                                                    <span className="flex-1 text-center text-2xl font-black italic">{data.acHours} <span className="text-xs opacity-30">jam</span></span>
                                                    <button onClick={() => setData({ ...data, acHours: Math.min(24, data.acHours + 1) })} className="w-12 h-12 rounded-xl bg-amber-500 text-black font-black">+</button>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Penggunaan Gas LPG (Tabung/Bulan)</label>
                                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl w-full border border-white/5">
                                                    <button onClick={() => setData({ ...data, lpgCanisters: Math.max(0, data.lpgCanisters - 1) })} className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 text-xl font-black transition-all">-</button>
                                                    <span className="flex-1 text-center text-2xl font-black italic">{data.lpgCanisters} <span className="text-xs opacity-30">tabung</span></span>
                                                    <button onClick={() => setData({ ...data, lpgCanisters: data.lpgCanisters + 1 })} className="w-12 h-12 rounded-xl bg-amber-500 text-black font-black">+</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[
                                                { id: 'meat-heavy', label: 'Karnivora Setia', desc: 'Daging sapi/kambing hampir setiap hari' },
                                                { id: 'average', label: 'Eksplorasi Rasa', desc: 'Daging, sayur, ikan, ayam seimbang' },
                                                { id: 'low-meat', label: 'Sahabat Sayur', desc: 'Daging hanya sesekali (Vegetarian-ish)' },
                                                { id: 'vegan', label: 'Vegan Murni', desc: 'Sepenuhnya protein nabati' }
                                            ].map((diet) => (
                                                <div
                                                    key={diet.id}
                                                    onClick={() => setData({ ...data, dietType: diet.id as any })}
                                                    className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${data.dietType === diet.id
                                                        ? 'border-emerald-500 bg-emerald-500/10'
                                                        : 'border-white/5 bg-white/5 hover:border-white/10'
                                                        }`}
                                                >
                                                    <h3 className="font-black text-lg tracking-tighter uppercase italic">{diet.label}</h3>
                                                    <p className="text-[10px] font-medium opacity-40 uppercase leading-snug">{diet.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-6 bg-emerald-500/10 rounded-[2rem] border border-emerald-500/20 flex gap-4 items-start">
                                            <Leaf className="text-emerald-400 shrink-0" size={24} />
                                            <p className="text-xs text-white/60 leading-relaxed italic">
                                                Tahukah kamu? Mengurangi konsumsi daging merah 2 hari seminggu bisa memangkas jejak karbon makananmu hingga <span className="text-emerald-400 font-bold">20% dalam setahun</span>.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Intensitas Belanja Pakaian (Fashion)</label>
                                            <div className="flex gap-2">
                                                {[
                                                    { id: 'fast', label: 'Aktif' },
                                                    { id: 'average', label: 'Normal' },
                                                    { id: 'slow', label: 'Jarang' }
                                                ].map((t) => (
                                                    <button
                                                        key={t.id}
                                                        onClick={() => setData({ ...data, fashionHabit: t.id as any })}
                                                        className={`flex-1 py-4 rounded-2xl font-black italic transition-all border-2 ${data.fashionHabit === t.id ? 'bg-rose-500 border-white text-white' : 'bg-white/5 border-white/5 text-white/20'}`}
                                                    >
                                                        {t.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Penggunaan Plastik Sekali Pakai</label>
                                            <div className="flex gap-2">
                                                {[
                                                    { id: 'high', label: 'Sering' },
                                                    { id: 'average', label: 'Sedang' },
                                                    { id: 'low', label: 'Minimal' }
                                                ].map((t) => (
                                                    <button
                                                        key={t.id}
                                                        onClick={() => setData({ ...data, plasticUsage: t.id as any })}
                                                        className={`flex-1 py-4 rounded-2xl font-black italic transition-all border-2 ${data.plasticUsage === t.id ? 'bg-rose-500 border-white text-white' : 'bg-white/5 border-white/5 text-white/20'}`}
                                                    >
                                                        {t.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <label className={`mt-4 p-8 rounded-[2.5rem] border-2 cursor-pointer flex items-center gap-6 transition-all ${data.recycling ? 'border-rose-500 bg-rose-500/10 shadow-lg shadow-rose-500/10' : 'border-white/5 bg-white/5'}`}>
                                            <input type="checkbox" className="hidden" checked={data.recycling} onChange={() => setData({ ...data, recycling: !data.recycling })} />
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${data.recycling ? 'bg-rose-500 border-white' : 'border-white/20'}`}>
                                                {data.recycling && <CheckCircle2 size={24} />}
                                            </div>
                                            <div>
                                                <h3 className="font-black text-xl italic uppercase tracking-tighter">Sudah Memilah Sampah</h3>
                                                <p className="text-[10px] font-medium opacity-30 uppercase">Memisahkan sampah organik & anorganik di rumah.</p>
                                            </div>
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Fact Bar */}
                            <div className="px-8 py-4 bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 flex items-center gap-3">
                                <AlertTriangle size={14} className="text-amber-500" />
                                Wawasan: {steps[step].fact}
                            </div>

                            {/* Action Buttons */}
                            <div className="p-8 border-t border-white/5 flex gap-4">
                                <button
                                    onClick={handleBack}
                                    disabled={step === 0}
                                    className={`flex-1 py-5 rounded-2xl font-black transition-all border-2 flex items-center justify-center gap-2 ${step > 0 ? 'bg-white/5 border-white/10 hover:text-white' : 'opacity-10 grayscale pointer-events-none'}`}
                                >
                                    <ArrowLeft size={20} /> Kembali
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="flex-[2] py-5 rounded-3xl font-black text-xl bg-gradient-to-r from-cyan-600 via-purple-600 to-rose-600 hover:brightness-110 transition-all flex items-center justify-center gap-3 italic uppercase tracking-tighter"
                                >
                                    {step === steps.length - 1 ? 'LIHAT HASIL' : 'LANJUTKAN'} <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Real-time Impact Sidebar */}
                        <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
                            <div className="bg-[#04041a] rounded-[3rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden group">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>

                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-cyan-400 block mb-6">Pamor Kosmik Saat Ini</span>

                                <div className="text-center mb-10">
                                    <div className="flex items-baseline justify-center gap-2">
                                        <span className="text-7xl font-black tracking-tighter text-white">{(emissions.total / 1000).toFixed(2)}</span>
                                        <span className="text-sm font-black text-white/20 uppercase tracking-widest italic leading-none">Ton</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1 italic leading-none">Emisi Karbon Per Tahun</p>
                                </div>

                                <div className="space-y-6">
                                    {[
                                        { l: 'Transport', v: emissions.transport, c: 'bg-indigo-500 shadow-indigo-500/20' },
                                        { l: 'Rumah', v: emissions.energy, c: 'bg-amber-500 shadow-amber-500/20' },
                                        { l: 'Pangan', v: emissions.food, c: 'bg-emerald-500 shadow-emerald-500/20' },
                                        { l: 'Gaya Hidup', v: emissions.lifestyle, c: 'bg-rose-500 shadow-rose-500/20' }
                                    ].map((cat) => (
                                        <div key={cat.l}>
                                            <div className="flex justify-between text-[9px] uppercase font-black mb-2 opacity-40 italic">
                                                <span>{cat.l}</span>
                                                <span>{(cat.v / 1000).toFixed(2)}T</span>
                                            </div>
                                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden flex">
                                                <div className={`${cat.c} h-full transition-all duration-1000 shadow-lg`} style={{ width: `${(cat.v / Math.max(1, emissions.total)) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-10 pt-6 border-t border-white/5 flex gap-4 items-center">
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        <Globe size={20} className="text-cyan-400 animate-pulse" />
                                    </div>
                                    <p className="text-[9px] font-bold leading-relaxed text-white/30 uppercase tracking-widest italic">
                                        Rata-rata warga RI: 3.5 Ton <br />
                                        Target Peradaban: <span className="text-cyan-400 font-black">2.0 Ton</span>
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 bg-gradient-to-br from-indigo-900/40 to-transparent border border-white/5 rounded-[2.5rem] shadow-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <TrendingUp size={18} className="text-indigo-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 italic leading-none">Kesetaraan Dampak</span>
                                </div>
                                <p className="text-sm font-bold italic tracking-tighter text-white/50 leading-tight">
                                    Jejak karbonmu setara dengan menanam <span className="text-white font-black">{Math.ceil(emissions.total / 20)} pohon</span> dewasa untuk menetralisir dampaknya setiap tahun.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* RESULT DASHBOARD */
                    <div className="bg-[#04041a] rounded-[4rem] border border-white/10 shadow-[0_80px_160px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in duration-1000">
                        <div className="bg-white/5 p-12 md:p-20 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-purple-500/5 to-transparent"></div>

                            <div className="relative z-10 space-y-4">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.8em] text-cyan-400 mb-8">Hasil Manifestasi Kosmik</h2>
                                <div className="flex flex-col md:flex-row items-center md:items-baseline justify-center gap-2 md:gap-4">
                                    <span className="text-7xl md:text-[14rem] font-black tracking-tighter text-white leading-none drop-shadow-[0_0_60px_rgba(34,211,238,0.3)]">
                                        {(emissions.total / 1000).toFixed(1)}
                                    </span>
                                    <div className="text-center md:text-left">
                                        <span className="text-2xl md:text-6xl font-black text-cyan-400 block italic leading-none">TON</span>
                                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Karbon / Tahun</span>
                                    </div>
                                </div>

                                <div className="inline-flex items-center gap-3 md:gap-4 px-6 md:px-10 py-4 md:py-5 rounded-full bg-white text-black font-black uppercase tracking-widest text-xs md:text-sm italic shadow-2xl mt-12 hover:scale-105 transition-transform">
                                    {emissions.total < indonesianAverage ? (
                                        <><Award size={20} className="md:w-6 md:h-6" /> Pamor Pelindung Langit</>
                                    ) : (
                                        <><AlertTriangle size={20} className="md:w-6 md:h-6" /> Beban Atmosfer Tinggi</>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 md:p-16 space-y-16">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {getSuggestions().map((sugg, idx) => (
                                    <div key={idx} className="bg-white/[0.03] p-10 rounded-[3rem] border-2 border-white/5 hover:border-cyan-500/30 transition-all group">
                                        <h4 className="font-black text-2xl text-white mb-4 tracking-tighter uppercase italic leading-none group-hover:text-cyan-400 transition-colors">{sugg.title}</h4>
                                        <p className="text-white/40 text-lg leading-relaxed font-bold italic tracking-tighter uppercase">{sugg.text}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-center gap-4">
                                <button
                                    onClick={() => { setShowResult(false); setStep(0); }}
                                    className="px-12 py-7 bg-white/5 text-white font-black text-xl rounded-3xl hover:bg-white/10 transition-all flex items-center justify-center gap-4 uppercase italic tracking-tighter border-2 border-white/10"
                                >
                                    <RotateCcw size={24} /> Hitung Ulang
                                </button>
                                <button
                                    onClick={() => navigate('/credits')}
                                    className="px-12 py-7 bg-white text-black font-black text-xl rounded-3xl shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-4 uppercase italic tracking-tighter"
                                >
                                    <Award size={24} /> Klaim Sertifikat Hijau
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CarbonCalculator;
