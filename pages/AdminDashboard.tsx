import React, { useState, useEffect } from 'react';
import {
    Users, CreditCard, ShoppingCart, Activity, Shield,
    ChevronRight, ArrowUpRight, LogOut, Clock, Calendar,
    RefreshCcw, Database, ShieldCheck, TrendingUp, AlertCircle,
    Megaphone, Inbox, CheckCircle2, XCircle, Mail, Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    dbInitializeSystem,
    dbGetPartnerRequests,
    dbApprovePartnerRequest,
    dbDeletePartnerRequest,
    PartnerRequest
} from '../services/adsManagementService';
import { logout } from '../services/authService';
import { getStoredSponsors } from '../services/sponsorServiceFirestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'transactions' | 'applications'>('overview');
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCredits: 0,
        totalTransactions: 0,
        activeCampaigns: 0
    });
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [isInitializing, setIsInitializing] = useState(false);
    const [initStatus, setInitStatus] = useState<string | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [partnerRequests, setPartnerRequests] = useState<PartnerRequest[]>([]);

    // SECURITY CHECK: Redirect to login if not authenticated as admin
    useEffect(() => {
        const role = localStorage.getItem('auth_role');
        if (role !== 'admin') {
            navigate('/central-command');
        }
    }, [navigate]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            console.log("🔍 Checking localStorage auth_role:", localStorage.getItem('auth_role'));

            // TRY to fetch Cloud Functions stats (but don't let it block everything)
            try {
                const functions = getFunctions();
                const getAdminStats = httpsCallable(functions, 'getAdminStats');
                const result = await getAdminStats();
                const data = result.data as any;

                setStats({
                    totalUsers: data.totalUsers || 0,
                    totalCredits: data.totalCredits || 0,
                    totalTransactions: data.totalTransactions || 0,
                    activeCampaigns: 0
                });

                setRecentActivity(data.recentActivity || []);
                setUsers(data.recentUsers || []);
                console.log("✅ Cloud Functions stats loaded");
            } catch (statsErr) {
                console.warn("⚠️ Cloud Functions unavailable, using fallback stats:", statsErr);
                // Use fallback/default stats if Cloud Functions fail
                setStats({
                    totalUsers: 0,
                    totalCredits: 0,
                    totalTransactions: 0,
                    activeCampaigns: 0
                });
            }

            // CRITICAL: Always fetch partner applications (independent from Cloud Functions)
            console.log("📥 Fetching advertiser requests...");
            const requests = await dbGetPartnerRequests();
            console.log("✅ Advertiser requests fetched:", requests.length, "items", requests);
            setPartnerRequests(requests);

        } catch (err) {
            console.error("❌ Failed to fetch admin data:", err);
            // Fallback
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/central-command');
    };

    const handleInitializeSystem = async () => {
        setIsInitializing(true);
        try {
            await dbInitializeSystem();
            setInitStatus('SUCCESS: Ads System Initialized.');
            setTimeout(() => setInitStatus(null), 5000);
            fetchData();
        } catch (err: any) {
            setInitStatus('ERROR: ' + err.message);
        } finally {
            setIsInitializing(false);
        }
    };

    const handleApprovePartner = async (id: string) => {
        try {
            await dbApprovePartnerRequest(id);
            alert("✅ Partner Approved & Activated!");
            fetchData();
        } catch (err) {
            console.error(err);
            alert("❌ Failed to approve: " + (err as Error).message);
        }
    };

    const handleDeleteRequest = async (id: string) => {
        const confirmed = window.confirm("⚠️ Hapus pendaftaran ini secara permanen?");
        if (!confirmed) return;

        try {
            await dbDeletePartnerRequest(id);
            console.log("🗑️ Request deleted:", id);
            fetchData(); // Refresh list
        } catch (err) {
            console.error("❌ Failed to delete request:", err);
            alert("❌ Gagal menghapus: " + (err as Error).message);
        }
    };

    return (
        <div className="min-h-screen bg-[#02020a] text-white font-sans flex">

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-[#050510] border-r border-white/5 p-6 hidden lg:flex flex-col z-50">
                <div className="mb-10 px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
                            <ShieldCheck size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-black italic uppercase tracking-tighter text-lg leading-none">SampahKu</h1>
                            <span className="text-[8px] font-bold text-violet-400 uppercase tracking-[0.2em]">Central Command</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/20' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                    >
                        <Shield size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Overview</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === 'applications' ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/20' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Inbox size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Applications</span>
                        </div>
                        {partnerRequests.length > 0 && (
                            <span className="bg-rose-600 text-[9px] px-1.5 py-0.5 rounded-full font-black animate-pulse">
                                {partnerRequests.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'users' ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/20' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                    >
                        <Users size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">User Base</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('transactions')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'transactions' ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/20' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                    >
                        <Activity size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Activity Log</span>
                    </button>

                    <div className="pt-8 pb-2 px-4">
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Management</span>
                    </div>

                    <button
                        onClick={() => navigate('/central-command/sponsors')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-all"
                    >
                        <Calendar size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Sponsors</span>
                    </button>
                    <button
                        onClick={() => navigate('/admin/review-queue')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-all"
                    >
                        <ChevronRight size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Review Queue</span>
                    </button>
                    <button
                        onClick={() => navigate('/admin/partners')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-all"
                    >
                        <Users size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Advertisers</span>
                    </button>
                    <button
                        onClick={() => navigate('/admin/placements')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-all"
                    >
                        <Database size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Placements</span>
                    </button>
                </nav>

                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all mt-auto border border-rose-500/10">
                    <LogOut size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Terminate Session</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-6 lg:p-10 pt-24 lg:pt-10 relative">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h2 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter mb-2">
                            Admin <span className="text-violet-400">HQ.</span>
                        </h2>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Central Command Operating System</span>
                            <div className="h-px w-8 bg-white/10"></div>
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> ENCRYPTED TUNNEL ACTIVE
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleInitializeSystem}
                            disabled={isInitializing}
                            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-white/10 transition-all flex items-center gap-2"
                        >
                            {isInitializing ? <RefreshCcw className="animate-spin" size={12} /> : <Database size={12} />}
                            {initStatus || 'Initialize Ads System'}
                        </button>
                        <button onClick={() => navigate('/admin/review-queue')} className="px-6 py-3 bg-violet-600 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-violet-500 transition-all shadow-lg shadow-violet-900/40 flex items-center gap-2">
                            <ShieldCheck size={12} /> Review Queue
                        </button>
                    </div>
                </header>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-white/20">
                        <Activity className="animate-spin mb-4" size={48} />
                        <p className="text-[10px] font-black uppercase tracking-[0.5em]">Synchronizing Cosmic Grid...</p>
                    </div>
                ) : (
                    <>
                        {activeTab === 'overview' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 relative overflow-hidden group">
                                        <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><Users size={64} /></div>
                                        <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] block mb-2">Total Guardians</span>
                                        <h3 className="text-4xl font-black text-white italic tracking-tighter">{stats.totalUsers}</h3>
                                        <div className="mt-4 flex items-center text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                            <ArrowUpRight size={14} className="mr-1" /> Real-time
                                        </div>
                                    </div>
                                    <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 relative overflow-hidden group">
                                        <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><TrendingUp size={64} /></div>
                                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] block mb-2">Credits Circulating</span>
                                        <h3 className="text-4xl font-black text-white italic tracking-tighter">{stats.totalCredits.toLocaleString()}</h3>
                                        <div className="mt-4 flex items-center text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                            <ArrowUpRight size={14} className="mr-1" /> CP Units
                                        </div>
                                    </div>
                                    <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 relative overflow-hidden group">
                                        <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><Activity size={64} /></div>
                                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] block mb-2">Total Impact</span>
                                        <h3 className="text-4xl font-black text-white italic tracking-tighter">{stats.totalTransactions}</h3>
                                        <div className="mt-4 flex items-center text-white/40 text-xs font-bold uppercase tracking-wider">
                                            <ArrowUpRight size={14} className="mr-1" /> Scans
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => setActiveTab('applications')}
                                        className="p-6 rounded-[2rem] bg-gradient-to-br from-violet-600/20 to-purple-900/10 border border-violet-500/20 relative overflow-hidden group cursor-pointer"
                                    >
                                        <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><Inbox size={64} /></div>
                                        <span className="text-[10px] font-black text-violet-300 uppercase tracking-[0.2em] block mb-2">Partner Applications</span>
                                        <h3 className="text-4xl font-black text-white italic tracking-tighter">{partnerRequests.length}</h3>
                                        <div className="mt-4 flex items-center text-violet-300 text-xs font-bold uppercase tracking-wider">
                                            Pending Requests
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Activity Table */}
                                <div className="rounded-[2.5rem] bg-[#0A0A15] border border-white/5 overflow-hidden shadow-2xl">
                                    <div className="p-8 border-b border-white/5 flex justify-between items-center">
                                        <h3 className="text-xl font-black italic uppercase tracking-tighter">Live Transaction Feed</h3>
                                        <button onClick={() => setActiveTab('transactions')} className="text-xs font-bold text-violet-400 uppercase tracking-widest hover:text-white transition-colors">View All Feed</button>
                                    </div>
                                    <div className="overflow-x-auto min-h-[300px]">
                                        {recentActivity.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center p-20 text-white/10 italic">
                                                <AlertCircle size={48} className="mb-4" />
                                                <p className="text-sm font-black uppercase tracking-widest">Menunggu Transaksi Pertama...</p>
                                            </div>
                                        ) : (
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="border-b border-white/5 text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">
                                                        <th className="p-6 pl-8">Transaction ID</th>
                                                        <th className="p-6">User ID</th>
                                                        <th className="p-6">Action</th>
                                                        <th className="p-6">Amount</th>
                                                        <th className="p-6 text-right pr-8">Age</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {recentActivity.map((t: any) => (
                                                        <tr key={t.id} className="hover:bg-white/[0.02] transition-colors group">
                                                            <td className="p-6 pl-8 font-mono text-xs text-white/30">{t.id.slice(0, 8)}...</td>
                                                            <td className="p-6 text-xs font-bold text-white/70">{t.displayName || 'Anonymous'}</td>
                                                            <td className="p-6 font-bold italic text-white">{t.description || 'Eco Scan'}</td>
                                                            <td className="p-6 font-black italic text-emerald-400">+{t.amount} CP</td>
                                                            <td className="p-6 text-right pr-8 text-xs font-mono text-white/30">Just now</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'applications' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="rounded-[2.5rem] bg-[#0A0A15] border border-white/5 overflow-hidden shadow-2xl p-8">
                                    <div className="flex justify-between items-center mb-10">
                                        <div>
                                            <h3 className="text-2xl font-black italic uppercase tracking-tighter">Partner Entry Portal</h3>
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1">Manual Approval Required for New Manifestations</p>
                                        </div>
                                    </div>

                                    {partnerRequests.length === 0 ? (
                                        <div className="py-32 text-center space-y-4 text-white/10 uppercase tracking-[0.5em] italic border-2 border-dashed border-white/5 rounded-[3rem]">
                                            <Inbox className="mx-auto opacity-20" size={64} />
                                            <p className="text-[12px] font-black">All Transmissions Processed</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-4">
                                            {partnerRequests.map((req) => (
                                                <div key={req.id} className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 hover:bg-white/[0.04] transition-all group">
                                                    <div className="flex items-center gap-8">
                                                        <div className="w-16 h-16 bg-violet-600/10 border border-violet-500/20 rounded-3xl flex items-center justify-center group-hover:bg-violet-600/20 transition-all">
                                                            <Briefcase className="text-violet-400" size={24} />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xl font-black italic uppercase tracking-tighter text-white">{req.brand_name}</h4>
                                                            <div className="flex items-center gap-4 mt-2">
                                                                <span className="flex items-center gap-1.5 text-[10px] font-black text-white/30 uppercase tracking-widest">
                                                                    <Mail size={12} /> {req.email}
                                                                </span>
                                                                <div className="h-1 w-1 bg-white/10 rounded-full"></div>
                                                                <span className="text-[9px] font-black px-2 py-0.5 bg-violet-600/20 text-violet-400 rounded-md border border-violet-500/20 uppercase tracking-widest">
                                                                    Package: {req.package_type}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => handleApprovePartner(req.id)}
                                                            className="px-8 py-4 bg-emerald-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/40 flex items-center gap-2"
                                                        >
                                                            <CheckCircle2 size={16} /> Approve Access
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteRequest(req.id)}
                                                            title="Hapus Pendaftaran"
                                                            aria-label="Hapus Pendaftaran"
                                                            className="p-4 bg-rose-600/10 border border-rose-600/10 rounded-2xl text-rose-500/40 hover:text-rose-500 hover:bg-rose-600/20 transition-all"
                                                        >
                                                            <XCircle size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                                <div className="rounded-[2.5rem] bg-[#0A0A15] border border-white/5 overflow-hidden shadow-2xl p-8">
                                    <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8">Active Guardian Base</h3>
                                    {users.length === 0 ? (
                                        <div className="py-20 text-center space-y-4 text-white/10 uppercase tracking-[0.5em] italic">
                                            <Users className="mx-auto" size={48} />
                                            <p className="text-[10px] font-black">Belum Ada Guardian Terdaftar</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {users.map((u: any) => (
                                                <div key={u.uid} className="p-4 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-4 hover:border-violet-500/50 transition-colors">
                                                    <img src={u.photoURL} className="w-12 h-12 rounded-xl bg-black object-cover" alt={u.displayName} />
                                                    <div>
                                                        <h4 className="font-bold text-white line-clamp-1">{u.displayName}</h4>
                                                        <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-wider font-black">
                                                            <span className="text-emerald-400">{u.credits} CP</span> • <span>RANK #{u.rank || '-'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'transactions' && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <div className="rounded-[2.5rem] bg-[#0A0A15] border border-white/5 overflow-hidden shadow-2xl">
                                    <div className="p-8 border-b border-white/5">
                                        <h3 className="text-xl font-black italic uppercase tracking-tighter">Infinite Activity Stream</h3>
                                    </div>
                                    <div className="p-20 text-center text-white/10 italic uppercase tracking-widest font-black">
                                        <p>Stream Active... Menunggu Event Baru</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
