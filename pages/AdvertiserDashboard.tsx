import React, { useState, useEffect } from 'react';
import {
    BarChart3, Target, MousePointer2, Percent,
    ArrowUpRight, Clock, Plus, LayoutDashboard,
    Megaphone, FileText, CreditCard, LogOut,
    AlertCircle, CheckCircle2, ChevronRight, ShieldAlert,
    Zap, ExternalLink, XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    dbGetStats,
    dbGetAdvertiserById,
    dbGetAdvertiserCampaigns,
    Advertiser,
    Campaign
} from '../services/adsManagementService';

const AdvertiserDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<Advertiser | null>(null);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);

    useEffect(() => {
        const role = localStorage.getItem('auth_role');
        if (role !== 'advertiser') {
            navigate('/portals');
            return;
        }
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const advertiserId = localStorage.getItem('auth_advertiser_id');
            if (advertiserId) {
                const advData = await dbGetAdvertiserById(advertiserId);
                setProfile(advData);

                if (advData?.status === 'active') {
                    const [statsData, campaignsData] = await Promise.all([
                        dbGetStats(advertiserId),
                        dbGetAdvertiserCampaigns(advertiserId)
                    ]);
                    setStats(statsData);
                    setCampaigns(campaignsData);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const totalImpressions = stats.reduce((acc, curr) => acc + curr.impressions, 0);
    const totalClicks = stats.reduce((acc, curr) => acc + curr.clicks, 0);
    const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0';
    const totalSpend = stats.reduce((acc, curr) => acc + curr.spend, 0);

    const isLocked = profile?.status !== 'active';
    const rejectedCampaigns = campaigns.filter(c => c.status === 'REJECTED');

    return (
        <div className="min-h-screen bg-[#02020a] text-white flex">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-[#050510] border-r border-white/5 p-6 flex flex-col z-50">
                <div className="mb-10 px-2 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-900/20">
                        <Target size={18} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-black italic uppercase tracking-tighter text-lg leading-none text-white">Advertiser</h1>
                        <p className="text-[8px] font-bold text-violet-400 uppercase tracking-widest">Growth Engine</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    <button onClick={() => navigate('/advertiser/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-900/20">
                        <LayoutDashboard size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Overview</span>
                    </button>
                    <button
                        onClick={() => !isLocked && navigate('/advertiser/campaigns')}
                        disabled={isLocked}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isLocked ? 'text-white/10 cursor-not-allowed' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                    >
                        <Megaphone size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Campaigns</span>
                    </button>
                    <button
                        onClick={() => !isLocked && navigate('/advertiser/reports')}
                        disabled={isLocked}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isLocked ? 'text-white/10 cursor-not-allowed' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                    >
                        <FileText size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Reports</span>
                    </button>
                    <button
                        onClick={() => !isLocked && navigate('/advertiser/billing')}
                        disabled={isLocked}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isLocked ? 'text-white/10 cursor-not-allowed' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                    >
                        <CreditCard size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Billing</span>
                    </button>
                </nav>

                <button onClick={() => { localStorage.clear(); navigate('/portals'); }} className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all border border-rose-500/10 group">
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Sign Out</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-10">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Advertiser Hub</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Performance Insights</span>
                            <div className="h-px w-8 bg-white/10"></div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isLocked ? 'text-amber-400' : 'text-emerald-400'}`}>
                                {isLocked ? 'ACCOUNT PENDING APPROVAL' : 'LIVE FLOW ACTIVE'}
                            </span>
                        </div>
                    </div>
                    {!isLocked && (
                        <button onClick={() => navigate('/advertiser/campaigns')} className="flex items-center gap-2 px-6 py-3 bg-violet-600 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-violet-500 transition-all shadow-lg shadow-violet-900/40">
                            <Plus size={16} /> New Campaign
                        </button>
                    )}
                </header>

                {isLoading ? (
                    <div className="h-[50vh] flex flex-col items-center justify-center">
                        <BarChart3 className="animate-spin text-violet-500 mb-4" size={48} />
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Collecting telemetry...</p>
                    </div>
                ) : isLocked ? (
                    <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700">
                        {/* Status Warning Overlay */}
                        <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/5 border-2 border-amber-500/20 rounded-[4rem] p-16 text-center space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px]"></div>
                            <div className="w-24 h-24 bg-amber-500/10 border-2 border-amber-500/30 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-amber-900/20">
                                <Clock size={48} className="text-amber-400 animate-pulse" />
                            </div>
                            <div className="space-y-4 max-w-2xl mx-auto">
                                <h3 className="text-4xl font-black italic uppercase tracking-tighter">Manifestasi Tertahan</h3>
                                <p className="text-lg text-white/40 font-bold italic uppercase leading-relaxed tracking-tight">
                                    Identitas Brand Anda sedang dalam tahap verifikasi oleh Admin HQ. <br />
                                    Fitur manajemen dan penyiaran iklan akan diaktifkan secara otomatis setelah proses audit selesai.
                                </p>
                            </div>
                            <div className="flex justify-center gap-4">
                                <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60 text-left">
                                        Status: <br /> <span className="text-amber-400 underline underline-offset-4 font-black">Audit In-Progress</span>
                                    </span>
                                </div>
                                <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                                    <ShieldAlert className="text-violet-400" size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60 text-left">
                                        Priority: <br /> <span className="text-white font-black uppercase">Standard Protocol</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-10 animate-in fade-in duration-700">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[2rem] relative overflow-hidden group">
                                <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><BarChart3 size={64} /></div>
                                <h3 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4">Impressions</h3>
                                <p className="text-4xl font-black italic tracking-tighter">{totalImpressions.toLocaleString()}</p>
                                <div className="mt-4 flex items-center text-emerald-400 text-[10px] font-black uppercase italic">
                                    <ArrowUpRight size={12} className="mr-1" /> Stable Telemetry
                                </div>
                            </div>
                            <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[2rem] relative overflow-hidden group">
                                <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><MousePointer2 size={64} /></div>
                                <h3 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4">Clicks</h3>
                                <p className="text-4xl font-black italic tracking-tighter">{totalClicks.toLocaleString()}</p>
                                <div className="mt-4 flex items-center text-violet-400 text-[10px] font-black uppercase italic">
                                    <ArrowUpRight size={12} className="mr-1" /> Engaging Content
                                </div>
                            </div>
                            <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[2rem] relative overflow-hidden group">
                                <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><Percent size={64} /></div>
                                <h3 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4">Avg CTR</h3>
                                <p className="text-4xl font-black italic tracking-tighter">{avgCtr}%</p>
                                <div className="mt-4 flex items-center text-emerald-400 text-[10px] font-black uppercase italic">
                                    Viral Potential
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-violet-600/20 to-indigo-900/10 border border-violet-500/20 p-6 rounded-[2rem] relative overflow-hidden group">
                                <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><CreditCard size={64} /></div>
                                <h3 className="text-[10px] font-black text-violet-300 uppercase tracking-widest mb-4">Total Spend</h3>
                                <p className="text-4xl font-black italic tracking-tighter text-violet-400">${totalSpend.toFixed(2)}</p>
                                <div className="mt-4 flex items-center text-violet-300/50 text-[10px] font-black uppercase italic">
                                    Fueling Impact
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Simple Recent Campaigns Table */}
                            <div className="bg-[#0A0A15] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-xl">
                                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                                    <h3 className="text-xl font-black italic uppercase tracking-tighter ">Recent Manifestations</h3>
                                    <button onClick={() => navigate('/advertiser/campaigns')} className="text-[10px] font-black text-violet-400 uppercase tracking-widest hover:text-white transition-all">View All</button>
                                </div>
                                <div className="p-8 space-y-4">
                                    {campaigns.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-10 text-white/10 italic">
                                            <Megaphone size={32} className="mb-4" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">Initial Manifestation Ready...</p>
                                        </div>
                                    ) : (
                                        campaigns.slice(0, 3).map(c => (
                                            <div key={c.id} onClick={() => navigate('/advertiser/campaigns')} className="flex items-center justify-between p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-violet-500/30 transition-all cursor-pointer group">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black italic text-xs ${c.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-white/20'}`}>
                                                        {c.status.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black italic uppercase group-hover:text-violet-400 transition-colors">{c.name}</h4>
                                                        <p className="text-[9px] text-white/20 font-bold tracking-widest uppercase">{c.status} • {c.start_date}</p>
                                                    </div>
                                                </div>
                                                <ChevronRight size={16} className="text-white/10 group-hover:text-white transition-colors" />
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Notification Hub */}
                            <div className="space-y-6">
                                {rejectedCampaigns.length > 0 && (
                                    <div className="bg-rose-500/10 border-2 border-rose-500/20 rounded-[2.5rem] p-10 flex flex-col items-center text-center space-y-6 animate-pulse">
                                        <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center">
                                            <XCircle size={32} className="text-rose-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-rose-400 mb-2">Attention Required</h3>
                                            <p className="text-xs text-white/60 font-bold uppercase tracking-widest italic mb-6">
                                                Terdapat {rejectedCampaigns.length} kampanye yang memerlukan revisi segera.
                                            </p>
                                            <button
                                                onClick={() => navigate('/advertiser/campaigns')}
                                                className="w-full py-4 bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-rose-400 transition-all shadow-xl shadow-rose-900/40"
                                            >
                                                Fix Manifestation Errors
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center space-y-6 flex-grow">
                                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                        <CheckCircle2 size={32} className="text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Central Systems Nominal</h3>
                                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest italic leading-relaxed">
                                            Ecosystem synchronization complete. <br /> Brand presence is manifesting globally.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdvertiserDashboard;
