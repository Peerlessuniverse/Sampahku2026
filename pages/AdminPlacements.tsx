import React, { useState, useEffect } from 'react';
import {
    Activity, Plus, Search, ShieldCheck,
    ArrowLeft, LayoutDashboard, Clock,
    Settings, Trash2, Edit2, Zap, Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dbGetPlacements } from '../services/adsManagementService';

const AdminPlacements: React.FC = () => {
    const navigate = useNavigate();
    const [placements, setPlacements] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPlacements();
    }, []);

    const fetchPlacements = async () => {
        setIsLoading(true);
        try {
            const data = await dbGetPlacements();
            setPlacements(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#02020a] text-white flex">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-[#050510] border-r border-white/5 p-6 flex flex-col z-50">
                <div className="mb-10 px-2 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                        <ShieldCheck size={18} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-black italic uppercase tracking-tighter text-lg leading-none">Admin</h1>
                        <p className="text-[8px] font-bold text-violet-400 uppercase tracking-widest">HQ COMMAND</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    <button onClick={() => navigate('/central-command/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-all">
                        <LayoutDashboard size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Global Overview</span>
                    </button>
                    <button onClick={() => navigate('/admin/review-queue')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-all">
                        <Clock size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Review Queue</span>
                    </button>
                    <button onClick={() => navigate('/admin/partners')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-all">
                        <ShieldCheck size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Advertisers</span>
                    </button>
                    <button onClick={() => navigate('/admin/placements')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-900/20">
                        <Activity size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Placements</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-10">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Inventory Management</h2>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Placement & Pricing Control</p>
                    </div>
                    <button className="px-8 py-4 bg-violet-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-violet-500 transition-all shadow-xl shadow-violet-900/40 flex items-center gap-3">
                        <Plus size={18} /> Add Placement Unit
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                        <Clock className="animate-spin text-violet-500 mx-auto col-span-full" size={48} />
                    ) : placements.length === 0 ? (
                        <div className="col-span-full py-40 text-center border-2 border-dashed border-white/5 rounded-[3rem] text-white/10 uppercase font-black tracking-widest italic">
                            No inventory units mapped in this region.
                        </div>
                    ) : (
                        placements.map(p => (
                            <div key={p.id} className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group hover:bg-white/[0.05] transition-all">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Target size={80} /></div>

                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 rounded-xl bg-violet-600/10 flex items-center justify-center text-violet-400">
                                        <Zap size={24} />
                                    </div>
                                    <div className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${p.is_active ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                                        {p.is_active ? 'ACTIVE' : 'OFFLINE'}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-1">{p.name}</h3>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest italic">{p.location}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                    <div>
                                        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Pricing Model</p>
                                        <p className="text-sm font-black italic text-violet-400">{p.pricing_model}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Base Price</p>
                                        <p className="text-sm font-black italic">${p.base_price}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        title="Edit Placement"
                                        aria-label="Edit Placement"
                                        className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Edit2 size={12} /> Edit
                                    </button>
                                    <button
                                        title="Delete Placement"
                                        aria-label="Delete Placement"
                                        className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminPlacements;
