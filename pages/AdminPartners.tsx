import React, { useState, useEffect } from 'react';
import {
    Users, Search, Filter, ShieldCheck,
    ArrowLeft, LayoutDashboard, Clock,
    ChevronRight, MoreVertical, CheckCircle2,
    XCircle, Mail, DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

const AdminPartners: React.FC = () => {
    const navigate = useNavigate();
    const [partners, setAdvertisers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAdvertisers();
    }, []);

    const fetchAdvertisers = async () => {
        setIsLoading(true);
        try {
            // This is a simplified fetch, normally we'd have an partners collection
            const q = query(collection(db, 'partners'), orderBy('name', 'asc'));
            const snap = await getDocs(q);
            setAdvertisers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#02020a] text-white flex">
            {/* Sidebar (Standard Admin) */}
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
                    <button onClick={() => navigate('/admin/partners')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-900/20">
                        <Users size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Advertisers</span>
                    </button>
                    <button onClick={() => navigate('/admin/placements')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-all">
                        <ShieldCheck size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Placements</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-10">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Advertiser Management</h2>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Partner Ecosystem Oversight</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white/5 border border-white/5 rounded-2xl px-6 py-3 flex items-center gap-3">
                            <Search size={16} className="text-white/20" />
                            <input type="text" placeholder="Search brands..." className="bg-transparent border-none outline-none font-bold text-sm placeholder:text-white/10" />
                        </div>
                    </div>
                </header>

                <div className="bg-[#0A0A15] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 text-[10px] font-black text-white/30 uppercase tracking-[0.3em] bg-white/[0.01]">
                                <th className="p-8">Advertiser / Brand</th>
                                <th className="p-8">Status</th>
                                <th className="p-8">Active Campaigns</th>
                                <th className="p-8">Balance</th>
                                <th className="p-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr><td colSpan={5} className="p-20 text-center"><Clock className="animate-spin inline text-violet-500" /></td></tr>
                            ) : partners.length === 0 ? (
                                <tr><td colSpan={5} className="p-20 text-center text-white/10 font-black uppercase tracking-widest">No active partners found.</td></tr>
                            ) : (
                                partners.map(adv => (
                                    <tr key={adv.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center text-violet-400 font-black italic">
                                                    {adv.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-black italic uppercase text-sm tracking-tight group-hover:text-violet-400 transition-colors">{adv.name}</h4>
                                                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-2">
                                                        <Mail size={10} /> {adv.email || adv.id.slice(0, 12)}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${adv.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${adv.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                                {adv.status}
                                            </div>
                                        </td>
                                        <td className="p-8 font-black italic text-xl">
                                            {adv.active_campaigns || 0}
                                        </td>
                                        <td className="p-8 font-mono text-sm font-bold text-violet-400">
                                            ${(adv.balance || 0).toLocaleString()}
                                        </td>
                                        <td className="p-8 text-right">
                                            <button
                                                title="Partner Options"
                                                aria-label="Partner Options"
                                                className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-white transition-all"
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminPartners;
