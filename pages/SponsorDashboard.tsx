import React, { useState, useEffect } from 'react';
import {
    Megaphone, BarChart3, Activity, Clock, LogOut,
    ArrowUpRight, Layout, Settings, Sparkles,
    Zap, Gem, Shield, ExternalLink, MousePointer2, Eye,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import { getStoredSponsors, addSponsor, SponsorData } from '../services/sponsorServiceFirestore';

const PartnerDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [sponsor, setSponsor] = useState<SponsorData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authSponsorId, setAuthSponsorId] = useState<string | null>(null);

    useEffect(() => {
        const role = localStorage.getItem('auth_role');
        const storedSponsorId = localStorage.getItem('auth_sponsor_id');

        if (role !== 'sponsor' || !storedSponsorId) {
            navigate('/portals');
            return;
        }

        setAuthSponsorId(storedSponsorId);
        fetchSponsorData(storedSponsorId);
    }, [navigate]);

    const fetchSponsorData = async (id: string) => {
        setIsLoading(true);
        try {
            const sponsors = await getStoredSponsors();
            let found = sponsors.find(s => s.id === id);

            if (!found && id === 'master-portal') {
                // AUTO-INITIALIZE for Master Account if missing
                console.log('🚀 Auto-initializing Master Portal...');
                const newMasterSponsor: Omit<SponsorData, 'id'> = {
                    username: 'Partner_Kosmik',
                    password: 'sampahku2026',
                    name: 'Master Partner HQ',
                    tagline: 'Eco-System Leader',
                    message: 'Selamat datang di Ekosistem SampahKu!',
                    mediaType: 'none',
                    mediaUrl: '',
                    linkUrl: '',
                    theme: 'cosmic',
                    plan: 'cosmic',
                    status: 'active',
                    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    createdAt: new Date().toISOString(),
                    maxSlots: 3,
                    stats: { impressions: 0, clicks: 0 }
                };
                // We use a predefined ID for master portal for consistency
                // Note: Firestore addSponsor uses auto-id, but we could use setDoc if we wanted fixed ID.
                // For simplicity, we'll just add it and it will work on next refresh.
                await addSponsor(newMasterSponsor);
                const updatedSponsors = await getStoredSponsors();
                found = updatedSponsors.find(s => s.username === 'Partner_Kosmik');
            }

            if (found) {
                setSponsor(found);
            }
        } catch (err) {
            console.error("Failed to fetch sponsor data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/portals');
    };

    const getPlanIcon = (plan: string) => {
        switch (plan) {
            case 'cosmic': return <Gem className="text-violet-400" size={24} />;
            case 'galactic': return <Zap className="text-blue-400" size={24} />;
            default: return <Sparkles className="text-emerald-400" size={24} />;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#02020a] flex flex-col items-center justify-center">
                <Activity className="w-12 h-12 text-violet-500 animate-spin" />
                <p className="mt-4 text-violet-400 font-black tracking-[0.3em] uppercase text-xs">Propagating Partner Portal...</p>
            </div>
        );
    }

    if (!sponsor) {
        return (
            <div className="min-h-screen bg-[#02020a] flex flex-col items-center justify-center p-6 text-center">
                <Shield className="w-16 h-16 text-rose-500 mb-6 opacity-20" />
                <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Portal Belum Diaktivasi</h2>
                <p className="text-white/40 text-sm max-w-xs mb-8">Akun Anda belum memiliki data kampanye yang terdaftar di Central Command.</p>
                <button onClick={() => navigate('/admin/portal')} className="px-8 py-4 bg-violet-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-violet-500 transition-all">
                    Inisialisasi Kampanye
                </button>
            </div>
        );
    }

    const ctr = sponsor.stats?.impressions ? ((sponsor.stats.clicks / sponsor.stats.impressions) * 100).toFixed(1) : '0';

    return (
        <div className="min-h-screen bg-[#02020a] text-white font-sans flex">
            {/* Sidebar Overlay for Mobile */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden pointer-events-none opacity-0 transition-opacity"></div>

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-[#050510] border-r border-white/5 p-6 hidden lg:flex flex-col z-50">
                <div className="mb-10 px-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-violet-900/40">
                        <Megaphone size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-black italic uppercase tracking-tighter text-lg leading-none">Partner</h1>
                        <span className="text-[8px] font-bold text-violet-400 uppercase tracking-[0.2em]">Galaxy Command</span>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-900/20">
                        <BarChart3 size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Dashboard</span>
                    </button>
                    <button onClick={() => navigate('/admin/portal')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-all">
                        <Layout size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Campaign Editor</span>
                    </button>
                    <button onClick={() => navigate('/pricing')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-all">
                        <Gem size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Upgrade Plan</span>
                    </button>
                </nav>

                <div className="mt-auto pt-6 space-y-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-2">Connected as</p>
                        <p className="text-xs font-bold italic truncate">{sponsor.name}</p>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all border border-rose-500/10">
                        <LogOut size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-6 lg:p-10 pt-24 lg:pt-10">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h2 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter mb-2">
                            Welcome, <span className="text-violet-400">{sponsor.name.split(' ')[0]}</span>.
                        </h2>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Campaign Command Center</span>
                            <div className="h-px w-8 bg-white/10"></div>
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> LIVE
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white/[0.03] p-2 rounded-2xl border border-white/5">
                        <div className="px-4 py-3 flex flex-col items-end">
                            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Current Plan</span>
                            <span className="text-xs font-black italic uppercase text-violet-400">{sponsor.plan}</span>
                        </div>
                        <div className="p-3 bg-violet-600 rounded-xl shadow-lg">
                            {getPlanIcon(sponsor.plan)}
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><Eye size={80} /></div>
                        <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-4">Total Impressions</h3>
                        <div className="flex items-end gap-2">
                            <p className="text-5xl font-black italic tracking-tighter">{sponsor.stats?.impressions || 0}</p>
                            <span className="mb-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">+12%</span>
                        </div>
                        <p className="mt-4 text-[9px] font-bold text-white/20 uppercase tracking-widest italic">Views across all transformation pages</p>
                    </div>

                    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><MousePointer2 size={80} /></div>
                        <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-4">Engagement Clicks</h3>
                        <div className="flex items-end gap-2">
                            <p className="text-5xl font-black italic tracking-tighter">{sponsor.stats?.clicks || 0}</p>
                            <span className="mb-2 text-xs font-bold text-violet-400 uppercase tracking-widest">+5%</span>
                        </div>
                        <p className="mt-4 text-[9px] font-bold text-white/20 uppercase tracking-widest italic">Interactions with your brand link</p>
                    </div>

                    <div className="bg-gradient-to-br from-violet-600/10 to-indigo-900/10 border border-violet-500/20 p-8 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><Activity size={80} /></div>
                        <h3 className="text-[10px] font-black text-violet-300 uppercase tracking-[0.4em] mb-4">Average CTR</h3>
                        <div className="flex items-end gap-2">
                            <p className="text-5xl font-black italic tracking-tighter text-violet-400">{ctr}%</p>
                            <span className="mb-2 text-xs font-bold text-violet-300 uppercase tracking-widest">Optimized</span>
                        </div>
                        <p className="mt-4 text-[9px] font-bold text-violet-300/30 uppercase tracking-widest italic">Click-Through-Rate Performance</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Campaign Status Card */}
                    <div className="bg-[#0A0A15] border border-white/5 rounded-[3rem] p-8 lg:p-10">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                                <Clock size={20} className="text-violet-400" /> Contract Status
                            </h3>
                            <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase text-emerald-400 tracking-widest">
                                Active
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex justify-between items-end border-b border-white/5 pb-6">
                                <div>
                                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Manifestation Date</p>
                                    <p className="font-bold italic">{sponsor.createdAt ? new Date(sponsor.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Expiration Phase</p>
                                    <p className="font-bold italic text-rose-400">{new Date(sponsor.expiryDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Allocation Strategy</p>
                                    <p className="font-bold italic uppercase">{sponsor.plan} Tier Integration</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Exposure Slots</p>
                                    <p className="font-bold italic">{sponsor.maxSlots || 1} Space Port(s)</p>
                                </div>
                            </div>

                            <button onClick={() => navigate('/admin/portal')} className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-3 group">
                                <Settings size={14} className="group-hover:rotate-90 transition-transform" /> Manage Campaign Assets
                            </button>
                        </div>
                    </div>

                    {/* Preview Simulator Card */}
                    <div className="bg-white/5 rounded-[3rem] border border-white/10 p-4 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent pointer-events-none"></div>
                        <div className="relative bg-black/40 rounded-[2.5rem] border border-white/5 h-full overflow-hidden flex flex-col p-8">
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] italic">Manifestation Preview</span>
                                <ExternalLink size={14} className="text-white/20" />
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                                <div className={`inline-flex items-center gap-3 px-6 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 italic font-black uppercase tracking-[0.4em] text-[8px]`}>
                                    Mitra Penjaga Semesta
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-4xl font-black italic uppercase tracking-tighter leading-none">{sponsor.name}</h4>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">{sponsor.tagline}</p>
                                </div>

                                <p className="text-sm font-bold italic text-white/60 max-w-xs px-4">
                                    "{sponsor.message || 'Your brand message will appear here during cosmic transitions.'}"
                                </p>

                                <div className="w-full max-w-[200px] h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="w-2/3 h-full bg-violet-600"></div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5 text-center">
                                <p className="text-[8px] font-black text-white/10 uppercase tracking-widest">Live Transition Interface Simulator v4.0</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Growth Prompt */}
                <div className="mt-12 p-8 rounded-[3rem] bg-gradient-to-r from-violet-900/20 via-indigo-900/10 to-transparent border border-violet-500/10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2">
                        <h4 className="text-xl font-black italic uppercase tracking-tighter">Expand Your Reach to the Cosmos</h4>
                        <p className="text-xs text-white/40 max-w-lg leading-relaxed font-bold">
                            Upgrade to <span className="text-violet-400">Cosmic Tier</span> to unlock high-definition video ads, priority slot allocation, and detailed demographic reporting for your sustainability campaigns.
                        </p>
                    </div>
                    <button onClick={() => navigate('/pricing')} className="px-10 py-5 bg-violet-600 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-violet-500 transition-all shadow-xl shadow-violet-900/40 whitespace-nowrap">
                        Upgrade manifestasi
                    </button>
                </div>
            </main>
        </div>
    );
};

export default PartnerDashboard;
