import React, { useState, useEffect } from 'react';
import {
    Clock, CheckCircle2, XCircle, Search,
    ArrowLeft, LayoutDashboard, Megaphone,
    ShieldCheck, Activity, Users, FileText,
    LogOut, AlertCircle, Eye, MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dbGetReviewQueue, dbUpdateCampaignStatus, dbGetPartnerRequests } from '../services/adsManagementService';

const AdminReviewQueue: React.FC = () => {
    const navigate = useNavigate();
    const [queue, setQueue] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [partnerRequestsCount, setPartnerRequestsCount] = useState(0);

    useEffect(() => {
        const role = localStorage.getItem('auth_role');
        if (role !== 'admin') {
            navigate('/portals');
            return;
        }
        fetchQueue();
    }, [navigate]);

    const fetchQueue = async () => {
        setIsLoading(true);
        try {
            const [campaignData, partnerData] = await Promise.all([
                dbGetReviewQueue(),
                dbGetPartnerRequests()
            ]);
            setQueue(campaignData);
            setPartnerRequestsCount(partnerData.length);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await dbUpdateCampaignStatus(id, 'APPROVED');
            fetchQueue();
            setSelectedItem(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleReject = async () => {
        if (!rejectReason) return;
        try {
            await dbUpdateCampaignStatus(selectedItem.id, 'REJECTED', rejectReason);
            setShowRejectModal(false);
            setRejectReason('');
            fetchQueue();
            setSelectedItem(null);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-[#02020a] text-white flex">
            {/* Sidebar (Same as AdminDashboard) */}
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
                    <button
                        onClick={() => navigate('/central-command/dashboard')}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <Eye size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Applications</span>
                        </div>
                        {partnerRequestsCount > 0 && (
                            <span className="bg-rose-600 text-[9px] px-1.5 py-0.5 rounded-full font-black animate-pulse text-white">
                                {partnerRequestsCount}
                            </span>
                        )}
                    </button>
                    <button onClick={() => navigate('/admin/review-queue')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-900/20">
                        <Clock size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Review Queue</span>
                    </button>
                    <button onClick={() => navigate('/admin/partners')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-all">
                        <Users size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Advertisers</span>
                    </button>
                    <button onClick={() => navigate('/admin/placements')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-all">
                        <Activity size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Placements</span>
                    </button>
                </nav>

                <button onClick={() => { localStorage.clear(); navigate('/portals'); }} className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all border border-rose-500/10">
                    <LogOut size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Terminate Session</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-10">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Review Queue</h2>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Operational Verification Layer</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 bg-white/5 rounded-full border border-white/5 text-[10px] font-black uppercase text-violet-400 tracking-widest">
                            {queue.length} PENDING CAMPAIGNS
                        </div>
                        {partnerRequestsCount > 0 && (
                            <div className="px-4 py-2 bg-rose-500/10 rounded-full border border-rose-500/20 text-[10px] font-black uppercase text-rose-400 tracking-widest animate-pulse">
                                {partnerRequestsCount} NEW PARTNERS
                            </div>
                        )}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Queue List */}
                    <div className="lg:col-span-1 space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                        {isLoading ? (
                            <Activity className="animate-spin text-violet-500 mx-auto" />
                        ) : queue.length === 0 ? (
                            <div className="py-20 text-center text-white/10 italic">
                                <CheckCircle2 size={48} className="mx-auto mb-4 opacity-10" />
                                <p className="text-[10px] uppercase font-black tracking-widest">All Clear. No pending reviews.</p>
                            </div>
                        ) : (
                            queue.map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedItem(item)}
                                    className={`p-6 rounded-3xl border-2 transition-all cursor-pointer ${selectedItem?.id === item.id ? 'bg-violet-600 border-violet-500 shadow-xl shadow-violet-900/20' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-black italic uppercase text-sm tracking-tight">{item.name}</h4>
                                        <Clock size={14} className="text-white/40" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">Partner: {item.advertiser_id.slice(0, 8)}...</p>
                                    <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-tighter">
                                        <span className="text-blue-400">Budget: ${item.daily_budget}/day</span>
                                        <span className="opacity-40">Submitted Just Now</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Inspection Area */}
                    <div className="lg:col-span-2">
                        {selectedItem ? (
                            <div className="bg-white/[0.03] border border-white/5 rounded-[3.5rem] p-12 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-black italic uppercase tracking-tighter">{selectedItem.name}</h3>
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black uppercase text-blue-400 tracking-widest tracking-widest">SUBMITTED FOR REVIEW</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => handleApprove(selectedItem.id)}
                                            className="px-8 py-4 bg-emerald-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/40 flex items-center gap-2"
                                        >
                                            <CheckCircle2 size={16} /> Approve & Deploy
                                        </button>
                                        <button
                                            onClick={() => setShowRejectModal(true)}
                                            className="px-8 py-4 bg-rose-600/10 border border-rose-600/20 rounded-2xl font-black uppercase tracking-widest text-[10px] text-rose-500 hover:bg-rose-600 hover:text-white transition-all"
                                        >
                                            <XCircle size={16} /> Reject
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-10">
                                    <div className="space-y-8">
                                        <div>
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-4 italic">Campaign Parameters</p>
                                            <div className="space-y-4">
                                                <div className="flex justify-between border-b border-white/5 pb-2">
                                                    <span className="text-xs font-bold text-white/40">Daily Budget</span>
                                                    <span className="text-xs font-black italic">${selectedItem.daily_budget}</span>
                                                </div>
                                                <div className="flex justify-between border-b border-white/5 pb-2">
                                                    <span className="text-xs font-bold text-white/40">Total Commitment</span>
                                                    <span className="text-xs font-black italic">${selectedItem.total_budget}</span>
                                                </div>
                                                <div className="flex justify-between border-b border-white/5 pb-2">
                                                    <span className="text-xs font-bold text-white/40">Schedule</span>
                                                    <span className="text-xs font-black italic">{selectedItem.start_date} → {selectedItem.end_date}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5">
                                            <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-4 italic flex items-center gap-2">
                                                <MessageSquare size={14} /> Creative Content
                                            </p>
                                            <p className="text-sm font-bold italic text-white/80 leading-relaxed">
                                                "{selectedItem.message || 'No brand message provided.'}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 rounded-[2.5rem] border border-white/10 p-4 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#312e81_0%,_transparent_70%)] opacity-30"></div>
                                        <div className="relative h-full flex flex-col items-center justify-center text-center p-8">
                                            <Eye className="text-white/10 mb-6" size={48} />
                                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-2 italic">Creative Preview</p>
                                            <h4 className="text-2xl font-black italic uppercase tracking-tighter mb-4">{selectedItem.name}</h4>
                                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-6">
                                                <div className="w-1/3 h-full bg-violet-600"></div>
                                            </div>
                                            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Asset verification needed via link portal</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center border-2 border-dashed border-white/5 rounded-[3.5rem] py-40">
                                <LayoutDashboard size={64} className="text-white/5 mb-6" />
                                <h3 className="text-2xl font-black italic uppercase text-white/10 tracking-tighter">Selection Required</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/10">Select a submission from the queue to start review</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reject Modal */}
                {showRejectModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
                        <div className="bg-[#0A0A15] border border-white/10 w-full max-w-lg rounded-[3rem] p-10 space-y-8 animate-in zoom-in-95 duration-300">
                            <div>
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Rejection Grounds</h3>
                                <p className="text-xs text-white/40 font-bold uppercase tracking-widest italic">Provide feedback to the Advertiser</p>
                            </div>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Low resolution assets, invalid URL, or budget discrepancy..."
                                className="w-full bg-white/5 border-2 border-white/5 rounded-3xl p-6 font-bold text-white focus:border-rose-500 outline-none h-40 resize-none transition-all placeholder:text-white/10"
                            />
                            <div className="flex gap-4">
                                <button onClick={handleReject} className="flex-1 py-4 bg-rose-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-rose-500 transition-all text-white">Confirm Rejection</button>
                                <button onClick={() => setShowRejectModal(false)} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] text-white/40 hover:text-white transition-all">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminReviewQueue;
