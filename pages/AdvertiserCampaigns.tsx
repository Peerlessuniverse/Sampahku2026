import React, { useState, useEffect } from 'react';
import {
    Plus, Search, Filter, Megaphone,
    ArrowLeft, Calendar, DollarSign, Target,
    CheckCircle2, Clock, XCircle, AlertCircle,
    ChevronRight, Save, Layout, Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    dbGetAdvertiserCampaigns,
    dbCreateCampaign,
    dbUpdateCampaignStatus,
    dbGetAdvertiserById,
    Advertiser
} from '../services/adsManagementService';

const AdvertiserCampaigns: React.FC = () => {
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<'list' | 'create'>('list');
    const [profile, setProfile] = useState<Advertiser | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        daily_budget: 10,
        total_budget: 300,
        placement_id: 'standard-transition'
    });

    useEffect(() => {
        const advertiserId = localStorage.getItem('auth_advertiser_id');
        if (!advertiserId) {
            navigate('/portals');
            return;
        }
        fetchData(advertiserId);
    }, [navigate]);

    const fetchData = async (id: string) => {
        setIsLoading(true);
        try {
            const advData = await dbGetAdvertiserById(id);
            setProfile(advData);

            if (advData?.status === 'active') {
                const data = await dbGetAdvertiserCampaigns(id);
                setCampaigns(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async () => {
        if (profile?.status !== 'active') return;
        try {
            const advertiserId = localStorage.getItem('auth_advertiser_id');
            if (!advertiserId) return;

            await dbCreateCampaign({
                ...formData,
                advertiser_id: advertiserId,
                status: 'DRAFT',
                created_by: advertiserId
            });

            setView('list');
            fetchData(advertiserId);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmitForReview = async (id: string) => {
        try {
            await dbUpdateCampaignStatus(id, 'SUBMITTED');
            const advertiserId = localStorage.getItem('auth_advertiser_id');
            if (advertiserId) fetchData(advertiserId);
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DRAFT': return 'bg-white/10 text-white/40';
            case 'SUBMITTED': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'APPROVED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'REJECTED': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            case 'ACTIVE': return 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40';
            default: return 'bg-white/5 text-white/20';
        }
    };

    const isAccountLocked = profile?.status !== 'active';

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#02020a] flex items-center justify-center">
                <Clock className="animate-spin text-violet-500" size={48} />
            </div>
        );
    }

    if (isAccountLocked) {
        return (
            <div className="min-h-screen bg-[#02020a] text-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-rose-500/10 border-2 border-rose-500/20 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-rose-900/20">
                    <Lock size={48} className="text-rose-500" />
                </div>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Inventory Locked.</h1>
                <p className="text-white/40 font-bold uppercase tracking-widest text-xs italic max-w-md leading-relaxed">
                    Akses ke manajemen kampanye dibatasi hingga akun Anda divalidasi oleh Admin HQ. <br />Mohon tunggu proses sinkronisasi identitas selesai.
                </p>
                <button onClick={() => navigate('/advertiser/dashboard')} className="mt-10 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center gap-2">
                    <ArrowLeft size={16} /> Kembali ke Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#02020a] text-white p-6 lg:p-12">
            <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                <div className="space-y-4">
                    <button onClick={() => navigate('/advertiser/dashboard')} className="inline-flex items-center gap-2 text-violet-400 hover:text-white transition-colors font-black uppercase tracking-widest text-[10px] italic">
                        <ArrowLeft size={14} /> Back to Hub
                    </button>
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">Campaign <span className="text-violet-400">Inventory.</span></h1>
                </div>
                {view === 'list' && (
                    <button onClick={() => setView('create')} className="px-8 py-4 bg-violet-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-violet-500 transition-all shadow-xl shadow-violet-900/40 flex items-center gap-3">
                        <Plus size={18} /> Manifest New Campaign
                    </button>
                )}
            </header>

            <main className="max-w-7xl mx-auto">
                {view === 'list' ? (
                    <div className="space-y-6">
                        {campaigns.length === 0 ? (
                            <div className="py-40 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.02]">
                                <Megaphone className="mx-auto text-white/10 mb-6" size={64} />
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">No active manifestations found in your sector.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {campaigns.map(c => (
                                    <div key={c.id} className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 hover:bg-white/[0.05] transition-all group">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${getStatusColor(c.status).includes('rose') ? 'bg-rose-600/10 text-rose-400' : 'bg-violet-600/10 text-violet-400'}`}>
                                                <Target size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black italic uppercase tracking-tighter group-hover:text-violet-400 transition-colors">{c.name}</h3>
                                                <div className="flex items-center gap-3 text-[10px] font-black text-white/20 uppercase tracking-widest mt-1">
                                                    <span>{c.start_date} → {c.end_date}</span>
                                                    <span>•</span>
                                                    <span className="text-emerald-400">${c.daily_budget}/DAY</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 w-full lg:w-auto">
                                            <div className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border ${getStatusColor(c.status)}`}>
                                                {c.status}
                                            </div>

                                            {c.status === 'DRAFT' && (
                                                <button
                                                    onClick={() => handleSubmitForReview(c.id)}
                                                    className="px-6 py-2 bg-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40"
                                                >
                                                    Submit Review
                                                </button>
                                            )}

                                            {c.status === 'REJECTED' && (
                                                <div className="group/note relative">
                                                    <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-xl">
                                                        <AlertCircle className="text-rose-500" size={14} />
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-rose-400">Rejected</span>
                                                    </div>
                                                    <div className="absolute bottom-full right-0 mb-4 w-64 p-5 bg-rose-600 rounded-[2rem] text-[11px] font-bold italic text-white opacity-0 group-hover/note:opacity-100 pointer-events-none transition-all shadow-2xl z-20 border border-white/20">
                                                        <div className="text-[8px] uppercase tracking-widest opacity-60 mb-2">HQ Intelligence Report:</div>
                                                        {c.rejection_reason || 'Incomplete manifestation parameters/low quality assets.'}
                                                    </div>
                                                </div>
                                            )}

                                            <button
                                                disabled={c.status === 'SUBMITTED'}
                                                className={`p-3 rounded-xl transition-all ${c.status === 'SUBMITTED' ? 'text-white/10' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}
                                                title={c.status === 'SUBMITTED' ? "Locked during review" : "Edit Phase"}
                                                aria-label="Edit Phase"
                                            >
                                                {c.status === 'SUBMITTED' ? <Lock size={18} /> : <ChevronRight size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white/[0.03] border border-white/5 rounded-[3.5rem] p-12 max-w-4xl mx-auto shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
                        <div className="absolute top-0 right-0 p-12 opacity-5"><Plus size={120} /></div>

                        <div className="mb-12">
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Campaign Configuration</h2>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Initialize your strategic manifestation</p>
                        </div>

                        <div className="space-y-8 relative z-10">
                            <div className="space-y-3">
                                <label htmlFor="campaign-name" className="text-[10px] font-black text-violet-400 uppercase tracking-widest ml-2 italic">Campaign Designation</label>
                                <input
                                    id="campaign-name"
                                    type="text"
                                    placeholder="e.g. Q1 Growth Manifestation"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 font-bold text-white focus:border-violet-500 outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label htmlFor="daily-budget" className="text-[10px] font-black text-violet-400 uppercase tracking-widest ml-2 italic">Daily Budget (USD)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                        <input
                                            id="daily-budget"
                                            type="number"
                                            value={formData.daily_budget}
                                            onChange={(e) => setFormData({ ...formData, daily_budget: Number(e.target.value) })}
                                            className="w-full bg-white/5 border-2 border-white/5 rounded-2xl pl-14 pr-6 py-4 font-bold text-white focus:border-violet-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label htmlFor="total-budget" className="text-[10px] font-black text-violet-400 uppercase tracking-widest ml-2 italic">Total Commitment</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                        <input
                                            id="total-budget"
                                            type="number"
                                            value={formData.total_budget}
                                            onChange={(e) => setFormData({ ...formData, total_budget: Number(e.target.value) })}
                                            className="w-full bg-white/5 border-2 border-white/5 rounded-2xl pl-14 pr-6 py-4 font-bold text-white focus:border-violet-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label htmlFor="start-date" className="text-[10px] font-black text-violet-400 uppercase tracking-widest ml-2 italic">Phase Initialization (Start)</label>
                                    <input
                                        id="start-date"
                                        type="date"
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                        className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 font-bold text-white focus:border-violet-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label htmlFor="end-date" className="text-[10px] font-black text-violet-400 uppercase tracking-widest ml-2 italic">Phase Completion (End)</label>
                                    <input
                                        id="end-date"
                                        type="date"
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                        className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 font-bold text-white focus:border-violet-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="pt-8 flex gap-4">
                                <button
                                    onClick={handleCreate}
                                    className="flex-1 py-5 bg-violet-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-violet-500 transition-all shadow-2xl flex items-center justify-center gap-3"
                                >
                                    <Save size={18} /> Initialize Manifestation
                                </button>
                                <button
                                    onClick={() => setView('list')}
                                    className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] text-white/40 hover:text-white transition-all underline underline-offset-4"
                                >
                                    Abort
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdvertiserCampaigns;
