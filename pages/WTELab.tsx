import React, { useState, useEffect } from 'react';
import {
    Flame, Zap, Atom, Battery, FlaskConical, Droplet, Fuel, Sparkles,
    Binary, ArrowLeft, Thermometer, PlayCircle, Info, Layers, Database,
    Search, Cpu, ArrowRight, ShieldCheck, TrendingUp, Sprout
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { addCredits, isMonthlyActivityCompleted, getMonthlyActivityId, getCurrentMonth } from '../services/creditService';
import SponsorScreen from '../components/SponsorScreen';

interface Step {
    title: string;
    desc: string;
    image?: string;
}

interface WTEMethod {
    id: string;
    title: string;
    projectCode: string;
    description: string;
    fullDetail: {
        overview: string;
        mechanism: string;
        efficiency: string;
        tools: string[];
        materials: string[];
        steps: Step[];
        benefits: string[];
    };
    researchList: string[];
    icon: React.ReactNode;
    color: string;
    stats: { label: string; value: string }[];
    output: string;
}

const wteMethods: WTEMethod[] = [
    {
        id: 'ignis-01',
        projectCode: 'IGNIS-01',
        title: 'Thermal Plastic Cycle',
        description: 'Melalui rekayasa Depolimerisasi Katalitik, rantai karbon plastik dipaksa terputus kembali menjadi bentuk hidrokarbon cair murni.',
        icon: <Flame />,
        color: 'orange',
        stats: [
            { label: 'Efficiency', value: '88.4%' },
            { label: 'Yield', value: '1.2 L/KG' }
        ],
        output: 'Fuel Grade RON 92-95',
        fullDetail: {
            overview: 'Proses Dekomposisi Termal tanpa oksigen untuk mengubah sampah plastik menjadi bahan bakar cair fungsional.',
            mechanism: 'Pyrolysis System',
            efficiency: 'High-Temperature Conversion',
            tools: ['Reactor Vessel', 'Condenser Unit', 'Gas Scrubber', 'Temperature Controller'],
            materials: ['PP/LDPE Plastic Waste', 'Natural Catalyst (Zeolite)', 'Inert Gas (Nitrogen)'],
            steps: [
                { title: 'Pre-Processing', desc: 'Sampah plastik dicuci, dikeringkan, dan dicacah menjadi ukuran 5-10mm untuk luas permukaan maksimal.', image: '/images/wte_ignis_step1.png' },
                { title: 'Thermal Loading', desc: 'Material dimasukkan ke reaktor hampa udara dan dipanaskan hingga suhu 400-500°C.', image: '/images/wte_ignis_step2.png' },
                { title: 'Catalytic Splitting', desc: 'Uap hidrokarbon melewati katalis untuk memecah rantai polimer menjadi fraksi bahan bakar yang lebih pendek.', image: '/images/wte_ignis_step3.png' },
                { title: 'Condensation', desc: 'Uap panas didinginkan secara bertahap untuk menghasilkan bensin, solar, dan wax terpisah.', image: '/images/wte_ignis_step4.png' }
            ],
            benefits: ['Mencegah Plastik ke Laut', 'Sumber Bahan Bakar Lokal', 'Reduksi Volume Sampah 95%']
        },
        researchList: [
            'Limbah Plastik menjadi BBM kendaraan mobil/motor melalui proses Pirolisis.',
            'Limbah Plastik menjadi pengganti bahan konstruksi (Batako/Paving Block).',
            'Limbah Plastik menjadi furniture modular (Furniture Berbasis Daur Ulang).',
            'Limbah Plastik menjadi filamen 3D printing berkualitas tinggi.'
        ]
    },
    {
        id: 'lumos-cell',
        projectCode: 'LUMOS-CELL',
        title: 'Organic Waste Battery',
        description: 'Mengandalkan Aktivasi Karbon Nanopore dari residu pembakaran, dipadukan dengan elektrolit asam dari fermentasi limbah buah.',
        icon: <Battery />,
        color: 'cyan',
        stats: [
            { label: 'Potential', value: '3.7V - 4.2V' },
            { label: 'Life Sync', value: '1200+ Cyc' }
        ],
        output: 'Green Energy Storage',
        fullDetail: {
            overview: 'Teknologi penyimpanan energi yang memanfaatkan biomasa sebagai prekursor karbon aktif untuk elektroda baterai.',
            mechanism: 'Bio-Polymer Electrolyte',
            efficiency: 'Sustainable Circular Power',
            tools: ['Carbonization Kiln', 'Hydraulic Press', 'Ultrasonic Cleaner', 'Cell Tester'],
            materials: ['Coconut Shell Waste', 'Rotten Citrus Fruit (Acid)', 'Zinc/Carbon Rods'],
            steps: [
                { title: 'Carbon Activation', desc: 'Limbah batok kelapa dibakar pada suhu tinggi hingga menjadi karbon berpori nano.', image: '/images/wte_lumos_step1.png' },
                { title: 'Acid Extraction', desc: 'Mengekstrak asam sitrat dari buah-buahan busuk untuk dijadikan media penghantar ion.', image: '/images/wte_lumos_step2.png' },
                { title: 'Electrode Assembly', desc: 'Karbon aktif dicampur dengan perekat alami dan ditekan menjadi lempengan anoda/katoda.', image: '/images/wte_lumos_step3.png' },
                { title: 'Cell Integration', desc: 'Penyusunan komponen ke dalam wadah kedap udara dan pengisian elektrolit organik.', image: '/images/wte_lumos_step4.png' }
            ],
            benefits: ['Tanpa Logam Berat Beracun', 'Material Murah & Melimpah', 'Bisa Didaur Ulang Kembali']
        },
        researchList: [
            'Limbah kulit buah (seperti jeruk/apel) menjadi sumber listrik (Bio-Battery).',
            'Limbah jerami atau rerumputan menjadi BBM cair dan Bio-Ethanol.',
            'Limbah kulit pisang menjadi bahan penyimpan energi untuk lampu LED.',
            'Limbah batang singkong menjadi karbon aktif untuk anoda baterai.'
        ]
    },
    {
        id: 'thermo-core',
        projectCode: 'THERMO-CORE',
        title: 'Thermo-Electric Gen',
        description: 'Memanfaatkan perbedaan suhu dekomposisi organik menggunakan modul semikonduktor (Seebeck Effect).',
        icon: <Thermometer />,
        color: 'yellow',
        stats: [
            { label: 'Δ Temp Req', value: 'Δ 25°C-60°C' },
            { label: 'Recov Rate', value: '18.5%' }
        ],
        output: 'Solid State Micro-Grid',
        fullDetail: {
            overview: 'Memanen sisa energi panas dari proses pengomposan atau insinerasi menjadi aliran listrik statis.',
            mechanism: 'Seebeck Effect Harvesting',
            efficiency: 'Passive Heat Recovery',
            tools: ['TEG Modules', 'Heat Sink', 'Voltage Booster', 'Thermal Paste'],
            materials: ['Organic Compost Heap', 'Aluminum Plates', 'Copper Wiring'],
            steps: [
                { title: 'Heat Sourcing', desc: 'Identifikasi titik panas aktif pada tumpukan kompos yang membusuk (biasanya 55-65°C).', image: '/images/wte_thermo_step1.png' },
                { title: 'TEG Placement', desc: 'Pemasangan modul termoelektrik di antara sumber panas dan pendingin.', image: '/images/wte_thermo_step2.png' },
                { title: 'Differential Management', desc: 'Memastikan perbedaan suhu tetap terjaga untuk aliran elektron yang stabil.', image: '/images/wte_thermo_step3.png' },
                { title: 'Power Regulation', desc: 'Konversi voltase rendah dari modul menjadi tegangan standar menggunakan DC-DC converter.', image: '/images/wte_thermo_step4.png' }
            ],
            benefits: ['Tanpa Bagian Bergerak (Awet)', 'Bekerja 24 Jam Non-Stop', 'Memanfaatkan Panas Buang']
        },
        researchList: [
            'Pemanfaatan panas dekomposisi sampah pasar menjadi energi lampu jalan.',
            'Thermo-Electric Generator pada tungku pembakaran sampah (Insinerator).',
            'Harvesting panas bumi buatan dari tumpukan limbah organik komunal.',
            'Aplikasi modul Peltier pada saluran pembuangan air panas industri.'
        ]
    },
    {
        id: 'mfc-core',
        projectCode: 'MFC-CORE',
        title: 'Microbial Fuel Cell',
        description: 'Menangkap rilis elektron langsung dari proses metabolisme limbah cair oleh koloni bakteri spesifik.',
        icon: <Atom />,
        color: 'purple',
        stats: [
            { label: 'Mechanism', value: 'Extracel' },
            { label: 'Catalyst', value: 'Bio-Enzyme' }
        ],
        output: 'Constant DC Energy',
        fullDetail: {
            overview: 'Sistem bio-elektrokimia yang mengubah energi kimia dalam limbah organik langsung menjadi energi listrik melalui kerja mikroba.',
            mechanism: 'Microbial Respiration',
            efficiency: 'Direct Chemical-to-Electrical',
            tools: ['Bio-Reactor Tank', 'Proton Exchange Membrane', 'Bio-Anode', 'Multi-meter'],
            materials: ['Food Waste Slurry', 'Geobacter Bacteria Culture', 'Graphite Fiber'],
            steps: [
                { title: 'Bio-Inoculation', desc: 'Memasukkan bakteri elektrogenik ke dalam tangki anoda yang berisi limbah cair.', image: '/images/wte_mfc_step1.png' },
                { title: 'Anaerobic Digestion', desc: 'Bakteri memecah molekul organik dan melepaskan elektron sebagai bagian pernapasan.', image: '/images/wte_mfc_step2.png' },
                { title: 'Electron Transfer', desc: 'Elektron ditangkap oleh anoda grafit dan dialirkan melalui sirkuit eksternal menuju katoda.', image: '/images/wte_mfc_step3.png' },
                { title: 'Ion Exchange', desc: 'Proton (H+) melewati membran khusus untuk bergabung dengan oksigen di katoda membentuk air.', image: '/images/wte_mfc_step4.png' }
            ],
            benefits: ['Penjernihan Air Limbah', 'Produksi Listrik Simultan', 'Tanpa Emisi Gas Buang']
        },
        researchList: [
            'Limbah cair rumah tangga (Greywater) menjadi listrik lampu teras.',
            'Microbial Fuel Cell berbasis limbah cair pabrik tahu/tempe.',
            'Baterai Mikroba untuk sensor kelembaban tanah otomatis.',
            'Pengolahan limbah air seni (Urine) menjadi energi listrik darurat.'
        ]
    },
    {
        id: 'anthro-bio',
        projectCode: 'ANTHRO-BIO',
        title: 'Human Bio-Kinetic',
        description: 'Memanfaatkan elemen Piezoelektrik pada infrastruktur publik untuk memanen energi dari langkah kaki.',
        icon: <Zap />,
        color: 'emerald',
        stats: [
            { label: 'Primary Src', value: 'Kinetic' },
            { label: 'Scope', value: 'Smart-Eco' }
        ],
        output: 'Urban Micro-Harvesting',
        fullDetail: {
            overview: 'Mengonversi energi mekanik dari aktivitas manusia di area padat menjadi sumber listrik mikro untuk fasilitas publik.',
            mechanism: 'Piezoelectric Pressure',
            efficiency: 'Human-Actuated Power',
            tools: ['Piezo Sensors', 'Rectifier Circuit', 'Super Capacitor', 'Impact Plate'],
            materials: ['Crystal Quartz Elements', 'Recycled Rubber Mat', 'Micro-Wiring'],
            steps: [
                { title: 'Sensor Grid Layout', desc: 'Penempatan modul piezoelektrik di bawah lantai yang sering dilalui orang (stasiun/trotoar).', image: '/images/wte_anthro_step1.png' },
                { title: 'Kinetic Capture', desc: 'Setiap langkah kaki menghasilkan tekanan yang memicu deformasi kristal dan rilis listrik.', image: '/images/wte_anthro_step2.png' },
                { title: 'Energy Summation', desc: 'Ribuan pulsa listrik kecil dari banyak sensor digabungkan dan diproses.', image: '/images/wte_anthro_step3.png' },
                { title: 'Grid Feeding', desc: 'Energi digunakan untuk menyalakan lampu jalan LED atau sensor IoT kota pintar.', image: '/images/wte_anthro_step4.png' }
            ],
            benefits: ['Edukasi Interaktif', 'Energi Terbarukan di Kota', 'Mendukung Smart City']
        },
        researchList: [
            'Ubin Pintar (Smart Tiles) yang menyalakan lampu lobby gedung.',
            'Trotoar Piezoelektrik pada Jembatan Penyeberangan Orang (JPO).',
            'Pemanenan energi getaran jalan raya untuk sensor lalu lintas.',
            'Gaya tekan kerumunan di stadion menjadi sumber energi papan skor.'
        ]
    },
    {
        id: 'aero-algae',
        projectCode: 'AERO-ALGAE',
        title: 'CO2 Bio-Fixation',
        description: 'Reaktor mikroalga yang menyerap CO2 hasil transformasi limbah dan mengubahnya menjadi Lipid Biomassa.',
        icon: <Droplet />,
        color: 'blue',
        stats: [
            { label: 'Fixation', value: '94.2% CO2' },
            { label: 'Lipid Pot', value: 'Premium' }
        ],
        output: 'Bio-Kerosene / Avtur',
        fullDetail: {
            overview: 'Siklus tertutup yang menangkap emisi karbon dari pembakaran sampah untuk menumbuhkan bahan bakar pesawat masa depan.',
            mechanism: 'Photosynthetic Bio-Reactor',
            efficiency: 'Atmospheric Carbon Sink',
            tools: ['Transparent Bio-Reactors', 'CO2 Injector', 'Centrifuge Divider', 'Oil Extractor'],
            materials: ['Micro-Algae Culture', 'Nutrient Rich Wastewater', 'Sunlight/LED'],
            steps: [
                { title: 'CO2 Sequestration', desc: 'Asap hasil pengolahan sampah dialirkan ke dalam tangki berisi air dan alga.', image: '/images/wte_aero_step1.png' },
                { title: 'Growth Optimization', desc: 'Pemberian cahaya dan nutrisi dari air limbah untuk mempercepat fotosintesis alga.', image: '/images/wte_aero_step2.png' },
                { title: 'Harvesting', desc: 'Alga yang sudah padat dipisahkan dari air menggunakan putaran mesin sentrifugasi.', image: '/images/wte_aero_step3.png' },
                { title: 'Lipid Extraction', desc: 'Dinding sel alga dipecah untuk mengeluarkan minyak nabati yang dimurnikan menjadi bio-avtur.', image: '/images/wte_aero_step4.png' }
            ],
            benefits: ['Net-Zero Emissions', 'Produktivitas Tinggi dibanding Tanaman', 'Tidak Menggunakan Lham Tanam']
        },
        researchList: [
            'Produksi Bio-Avtur untuk bahan bakar pesawat masa depan.',
            'Fasad Gedung berbasis Alga sebagai penyerap polusi kota.',
            'Pemanfaatan emisi pabrik menjadi pakan ternak berbasis alga.',
            'Pengembangan tinta print organik dari pigmen mikroalga.'
        ]
    },
    {
        id: 'agro-fuel',
        projectCode: 'AGRO-FUEL',
        title: 'Lignocellulosic Cycle',
        description: 'Mentransformasi residu pertanian (jerami, sekam) menjadi Bio-Crude Oil melalui pemanasan cepat tanpa oksigen.',
        icon: <Sprout />,
        color: 'lime',
        stats: [
            { label: 'Energy Rec', value: '75%' },
            { label: 'Carbon Sav', value: '82%' }
        ],
        output: 'Bio-Diesel / Ethanol',
        fullDetail: {
            overview: 'Proses termokimia untuk memecah selulosa, hemiselulosa, dan lignin dalam limbah pertanian menjadi minyak nabati mentah yang dapat dimurnikan.',
            mechanism: 'Fast Pyrolysis',
            efficiency: 'High Energy Recovery',
            tools: ['Grinding Mill', 'Flash Reactor', 'Cyclone Separator', 'Fractional Distillation'],
            materials: ['Rice Straw (Jerami)', 'Corn Husks (Kobot Jagung)', 'Heat Carrier (Sand)'],
            steps: [
                { title: 'Size Reduction', desc: 'Jerami dikeringkan hingga kadar air <10% dan dihancurkan menjadi serbuk halus agar reaksi terjadi instan.', image: '/images/wte_agro_step1.png' },
                { title: 'Flash Pyrolysis', desc: 'Serbuk jerami disemprotkan ke reaktor bersuhu 500°C selama kurang dari 2 detik.', image: '/images/wte_agro_step2.png' },
                { title: 'Char Separation', desc: 'Gas panas dipisahkan dari residu padat (bio-char) menggunakan alat separator siklon.', image: '/images/wte_agro_step3.png' },
                { title: 'Condensation', desc: 'Uap didinginkan cepat menjadi Bio-Oil cair yang siap dimurnikan menjadi bbm cair.', image: '/images/wte_agro_step4.png' }
            ],
            benefits: ['Substitusi BBM Fosil', 'Meningkatkan Nilai Limbah Tani', 'Reduksi Emisi Metana Sawah']
        },
        researchList: [
            'Limbah jerami atau rerumputan menjadi BBM cair (Bio-Oil) dan Bio-Ethanol.',
            'Konversi Sekam Padi menjadi briket energi tinggi untuk industri.',
            'Pemanfaatan tongkol jagung menjadi Bio-Kerosene untuk memasak.',
            'Transformasi limbah kelapa sawit menjadi pelumas nabati cair.'
        ]
    }
];

const MethodModal: React.FC<{ method: WTEMethod, onClose: () => void }> = ({ method, onClose }) => {
    return (
        <div className="fixed inset-0 z-[10000] overflow-y-auto px-4 py-12 md:p-12 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl" onClick={onClose}></div>

            <div className="relative bg-[#050510] border-2 border-white/10 rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-[0_0_100px_rgba(139,92,246,0.15)] animate-in fade-in zoom-in slide-in-from-bottom-12 duration-500">
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors z-20 p-2 bg-white/5 rounded-full"
                    title="Tutup Detail Riset"
                >
                    <ArrowLeft className="rotate-90 md:rotate-0 w-6 h-6" />
                </button>

                <div className="p-8 md:p-16 space-y-12">
                    {/* Header */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest italic">
                            Project Development Node: {method.projectCode}
                        </div>
                        <h2 className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none">
                            {method.title}
                        </h2>
                        <div className="p-8 bg-gradient-to-r from-white/[0.03] to-transparent border-l-4 border-[#a78bfa] rounded-r-3xl">
                            <p className="text-xl md:text-2xl text-white/60 font-medium italic tracking-tight leading-relaxed">
                                {method.fullDetail.overview}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Specs & Hardware */}
                        <div className="lg:col-span-4 space-y-10">
                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-[#a78bfa] uppercase tracking-[0.4em] italic flex items-center gap-3">
                                    <Cpu size={16} /> Hardware Matrix
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {method.fullDetail.tools.map((t, i) => (
                                        <span key={i} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-white/50 font-black text-[9px] uppercase tracking-wider">{t}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-[#a78bfa] uppercase tracking-[0.4em] italic flex items-center gap-3">
                                    <Layers size={16} /> Material Inputs
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {method.fullDetail.materials.map((m, i) => (
                                        <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-black text-[9px] uppercase tracking-wider">{m}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                                <h3 className="text-[10px] font-black text-white/20 uppercase tracking-widest">Core Impact</h3>
                                {method.fullDetail.benefits.map((b, i) => (
                                    <div key={i} className="flex items-center gap-3 text-white/70 font-bold italic uppercase text-[10px] tracking-tight">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]"></div> {b}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Implementation Steps with Comic Styling */}
                        <div className="lg:col-span-8 space-y-8">
                            <h3 className="text-xs font-black text-[#a78bfa] uppercase tracking-[0.4em] italic flex items-center gap-3 border-b border-white/5 pb-4">
                                <PlayCircle size={16} /> Execution Protocol
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {method.fullDetail.steps.map((s, i) => (
                                    <div key={i} className="group relative flex flex-col p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all hover:bg-white/[0.04] overflow-hidden">
                                        {/* Comic Panel Header */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-[#a78bfa] flex items-center justify-center text-black font-black italic text-sm shadow-[0_0_15px_rgba(167,139,250,0.4)]">
                                                {i + 1}
                                            </div>
                                            <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] italic">Protocol Phase</span>
                                        </div>

                                        {/* Comic Illustration Placeholder/Frame */}
                                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#0a0a20] border-2 border-white/10 mb-6 group-hover:border-[#a78bfa]/40 transition-all transform group-hover:rotate-1 shadow-inner">
                                            {/* Stylized background grid for comic feel */}
                                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:10px_10px]"></div>

                                            {s.image ? (
                                                <img src={s.image} alt={s.title} className="w-full h-full object-cover mix-blend-lighten opacity-40 group-hover:opacity-80 transition-opacity" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                                                    {/* Scanning Line Animation Effect */}
                                                    <div className="absolute inset-x-0 h-[2px] bg-[#a78bfa]/50 blur-sm animate-[scan_3s_ease-in-out_infinite]"></div>

                                                    <div className="text-center group-hover:scale-110 transition-transform relative z-10">
                                                        <Sparkles className="w-10 h-10 text-[#a78bfa]/40 mx-auto mb-3 animate-pulse" />
                                                        <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.5em] italic">System Schematic</p>
                                                        <div className="mt-2 w-16 h-1 bg-white/5 mx-auto rounded-full overflow-hidden">
                                                            <div className="w-full h-full bg-[#a78bfa]/40 animate-[loading-bar_2s_ease-in-out_infinite]"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Panel Flash Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent"></div>
                                        </div>

                                        <div className="space-y-2 relative z-10">
                                            <h4 className="text-white font-black uppercase italic tracking-tighter text-base group-hover:text-[#a78bfa] transition-colors">{s.title}</h4>
                                            <p className="text-white/40 font-bold text-xs leading-relaxed tracking-tight group-hover:text-white/60 transition-colors">{s.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Research & Applications List */}
                            <div className="p-10 rounded-[3rem] bg-indigo-500/[0.03] border border-indigo-500/10 space-y-8 mt-12">
                                <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em] italic flex items-center gap-3">
                                    <Database size={16} /> Case Studies & Research
                                </h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {method.researchList.map((res, i) => (
                                        <div key={i} className="flex gap-4 items-start group">
                                            <span className="shrink-0 w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-white/40 group-hover:bg-indigo-500 group-hover:text-black transition-all">
                                                {i + 1}
                                            </span>
                                            <p className="text-sm font-bold text-white/50 italic uppercase tracking-tight leading-relaxed group-hover:text-white transition-colors">
                                                {res}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-4">
                            <Info className="text-amber-400" size={24} />
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest max-w-md italic">
                                Semua data riset di atas bersifat edukatif dan sedang dalam tahap pengembangan pilot-project global.
                            </p>
                        </div>
                        <button
                            onClick={async () => {
                                const baseActivityId = `wte_research_${method.id}`;
                                const monthlyActivityId = getMonthlyActivityId(baseActivityId);
                                const success = await addCredits(300, `Mempelajari Riset WTE: ${method.title}`, monthlyActivityId);
                                if (success) {
                                    alert(`Energi Tersinkronisasi! +300 Eco-Credits berhasil ditambahkan.`);
                                }
                                onClose();
                            }}
                            disabled={isMonthlyActivityCompleted(`wte_research_${method.id}`)}
                            className={`w-full md:w-auto px-12 py-5 font-black uppercase italic tracking-[0.2em] rounded-2xl transition-all shadow-[0_0_30px_rgba(167,139,250,0.3)] ${isMonthlyActivityCompleted(`wte_research_${method.id}`)
                                ? 'bg-white/10 text-white/20 cursor-not-allowed border border-white/5'
                                : 'bg-[#a78bfa] text-black hover:scale-105 active:scale-95'
                                }`}
                        >
                            {isMonthlyActivityCompleted(`wte_research_${method.id}`) ? `Selesai Bulan Ini (${getCurrentMonth()})` : 'Selesai Mempelajari (+300)'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const WTELab: React.FC = () => {
    const [selectedMethod, setSelectedMethod] = useState<WTEMethod | null>(null);
    const [showSponsor, setShowSponsor] = useState(false);
    const [pendingMethod, setPendingMethod] = useState<WTEMethod | null>(null);

    useEffect(() => {
        const initCredits = async () => {
            await addCredits(30, "Akses Riset Eksklusif WTE Lab", "wte_lab_first_entry");
        };
        initCredits();
    }, []);

    const handleCardClick = (method: WTEMethod) => {
        setPendingMethod(method);
        setShowSponsor(true);
    };

    const handleSponsorComplete = () => {
        setShowSponsor(false);
        if (pendingMethod) {
            setSelectedMethod(pendingMethod);
        }
    };

    const getColorClass = (color: string) => {
        switch (color) {
            case 'orange': return 'text-orange-500 border-orange-500/30 bg-orange-600/10 hover:border-orange-500/50';
            case 'cyan': return 'text-cyan-400 border-cyan-500/30 bg-cyan-600/10 hover:border-cyan-500/50';
            case 'yellow': return 'text-yellow-500 border-yellow-500/30 bg-yellow-600/10 hover:border-yellow-500/50';
            case 'purple': return 'text-purple-400 border-purple-500/30 bg-purple-600/10 hover:border-purple-500/50';
            case 'emerald': return 'text-emerald-400 border-emerald-500/30 bg-emerald-600/10 hover:border-emerald-500/50';
            case 'blue': return 'text-blue-400 border-blue-500/30 bg-blue-600/10 hover:border-blue-500/50';
            case 'lime': return 'text-lime-400 border-lime-500/30 bg-lime-600/10 hover:border-lime-500/50';
            default: return 'text-white border-white/5 bg-white/5';
        }
    };

    const getIconColor = (color: string) => {
        switch (color) {
            case 'orange': return 'text-orange-500 bg-orange-600/20 border-orange-500/30';
            case 'cyan': return 'text-cyan-400 bg-cyan-600/20 border-cyan-500/30';
            case 'yellow': return 'text-yellow-500 bg-yellow-600/20 border-yellow-500/30';
            case 'purple': return 'text-purple-400 bg-purple-600/20 border-purple-500/30';
            case 'emerald': return 'text-emerald-400 bg-emerald-600/20 border-emerald-500/30';
            case 'blue': return 'text-blue-400 bg-blue-600/20 border-blue-500/30';
            case 'lime': return 'text-lime-400 bg-lime-600/20 border-lime-500/30';
            default: return 'text-white bg-white/10 border-white/10';
        }
    };

    return (
        <div className="min-h-screen bg-[#02020a] pt-32 pb-32 px-6 overflow-hidden relative text-white">
            {/* Cosmic Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_#1e1b4b_0%,_transparent_50%)] pointer-events-none -z-10"></div>
            <div className="fixed bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,_#312e81_0%,_transparent_50%)] opacity-30 pointer-events-none -z-10"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Back Button */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                    <Link to="/wte" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors uppercase font-black text-xs tracking-[0.3em] italic group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Kembali ke Eksplorasi
                    </Link>
                    <div className="flex items-center gap-4 px-6 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-3xl animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest italic text-white/60">Live Research Environment</span>
                    </div>
                </div>

                {/* Header Section */}
                <div className="text-center mb-24 space-y-8">
                    <div className="inline-block px-8 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[#a78bfa] text-[10px] font-black uppercase tracking-[0.5em] backdrop-blur-3xl italic">
                        Advanced Technology Research Matrix
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[1.0] uppercase italic">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] via-purple-400 to-indigo-400 drop-shadow-[0_0_40px_rgba(167,139,250,0.3)]">WTE Laboratory.</span>
                    </h1>
                    <p className="text-white/40 font-bold italic text-lg md:text-xl uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
                        Dekonstruksi materi untuk pembebasan energi <br /> peradaban nol emisi.
                    </p>
                </div>

                {/* Research Matrix Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {wteMethods.map((method) => (
                        <div
                            key={method.id}
                            onClick={() => handleCardClick(method)}
                            className={`group cursor-pointer border-2 rounded-[3.5rem] p-10 space-y-8 relative overflow-hidden transition-all duration-700 hover:-translate-y-4 shadow-2xl flex flex-col justify-between ${getColorClass(method.color)}`}
                        >
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 blur-[80px] rounded-full group-hover:bg-white/10 transition-all duration-700"></div>

                            <div className="space-y-8">
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className={`p-4 rounded-3xl border transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 ${getIconColor(method.color)}`}>
                                        {React.cloneElement(method.icon as React.ReactElement, { size: 32 })}
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] leading-none block mb-2 opacity-50">Project: {method.projectCode}</span>
                                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter group-hover:tracking-normal transition-all">{method.title}</h2>
                                    </div>
                                </div>

                                <p className="text-sm text-white/50 font-medium italic leading-relaxed relative z-10 line-clamp-3">
                                    {method.description}
                                </p>

                                <div className="grid grid-cols-2 gap-4 relative z-10">
                                    {method.stats.map((stat, i) => (
                                        <div key={i} className="p-5 bg-black/40 rounded-[1.8rem] border border-white/5 hover:border-white/10 transition-colors">
                                            <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] block mb-2">{stat.label}</span>
                                            <p className="text-xl font-black text-white italic tracking-tighter">{stat.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/5 relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[9px] font-black text-white/40 uppercase italic tracking-widest">
                                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" /> {method.output}
                                </div>
                                <div className="p-2 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-500">
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Final Closing Section */}
                <section className="text-center pb-20 mt-40">
                    <div className="inline-block p-12 md:p-24 rounded-[4.5rem] bg-indigo-500/10 border border-indigo-500/20 text-white relative group overflow-hidden shadow-3xl">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 via-cyan-500 to-emerald-500"></div>
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full"></div>

                        <div className="relative z-10 space-y-10">
                            <h3 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
                                Dekonstruksi <span className="text-[#a78bfa]">Realitas.</span>
                            </h3>
                            <p className="text-white/40 font-black uppercase italic tracking-[0.3em] max-w-2xl mx-auto leading-relaxed text-sm md:text-lg">
                                Kita Sedang mengembalikan peradaban di mana <br /> <span className="text-white underline decoration-[#a78bfa] decoration-4 underline-offset-8">Sampah saat ini sebenarnya adalah Energi Yang Terkurung.</span>
                            </p>

                            <div className="flex flex-wrap justify-center gap-4 overflow-hidden">
                                {['Pyrolysis V4', 'Carbon-Lab', 'MFC-Grid', 'Seebeck-Node', 'Fixation-Unit', 'Piezo-Urban'].map((tag, i) => (
                                    <span key={i} className="text-[9px] font-black uppercase tracking-[0.4em] bg-white/5 border border-white/10 px-6 py-3 rounded-2xl hover:bg-indigo-500 hover:text-black transition-all cursor-default">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {showSponsor && (
                    <SponsorScreen
                        onComplete={handleSponsorComplete}
                    />
                )}

                {/* Detail Modal */}
                {selectedMethod && (
                    <MethodModal
                        method={selectedMethod}
                        onClose={() => setSelectedMethod(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default WTELab;
