import React, { useState, useEffect, useRef } from 'react';
import { getStoredSponsors, saveSponsors, SponsorData } from '../services/sponsorService';
import { Save, Plus, Trash2, Layout, Video, Image as ImageIcon, Link as LinkIcon, Eye, ArrowLeft, ShieldCheck, LogOut, UserCheck, BarChart3, PieChart, Activity, MousePointer2, AlertCircle, CheckCircle2, Lock, Key, User, Volume2, VolumeX } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AdminSponsors: React.FC = () => {
    const navigate = useNavigate();
    const [sponsors, setSponsors] = useState<SponsorData[]>(getStoredSponsors());
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [authSponsorId, setAuthSponsorId] = useState<string | null>(null);
    const [view, setView] = useState<'edit' | 'stats'>('edit');
    const [selectedSponsorId, setSelectedSponsorId] = useState<string | null>(null);
    const [filters, setFilters] = useState({ name: '', plan: 'all', status: 'all', date: '' });
    const [imgError, setImgError] = useState<Record<string, boolean>>({});
    const [isMuted, setIsMuted] = useState(false); // Simulator mute control

    useEffect(() => {
        const storedRole = localStorage.getItem('auth_role');
        const storedSponsorId = localStorage.getItem('auth_sponsor_id');

        if (!storedRole) {
            navigate('/portals');
            return;
        }

        setRole(storedRole);
        setAuthSponsorId(storedSponsorId);
        setSponsors(getStoredSponsors());
    }, [navigate]);

    const handleSave = () => {
        setIsSaving(true);
        saveSponsors(sponsors);

        setTimeout(() => {
            setIsSaving(false);
            setSaveStatus('Konfigurasi Berhasil Disimpan!');
            setTimeout(() => setSaveStatus(null), 3000);
        }, 800);
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_role');
        localStorage.removeItem('auth_sponsor_id');
        navigate('/portals');
    };

    const updateSponsor = (id: string, updates: Partial<SponsorData>) => {
        setSponsors(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
        if (updates.mediaUrl || updates.mediaType) {
            setImgError(prev => ({ ...prev, [id]: false }));
        }
    };

    const addSponsor = () => {
        const id = Date.now().toString();
        const newSponsor: SponsorData = {
            id: id,
            username: `user_${id.slice(-4)}`,
            password: 'password123',
            name: 'Nama Brand',
            tagline: 'Brand Tagline',
            message: 'Tulis pesan promosi di sini...',
            mediaType: 'none',
            mediaUrl: '',
            linkUrl: '',
            theme: 'cosmic',
            plan: 'nebula',
            status: 'pending',
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            createdAt: new Date().toISOString().split('T')[0],
            maxSlots: 1,
            stats: { impressions: 0, clicks: 0 }
        };
        setSponsors(prev => [...prev, newSponsor]);
    };

    const deleteSponsor = (id: string) => {
        if (sponsors.length <= 1) return;
        setSponsors(prev => prev.filter(s => s.id !== id));
    };

    // HIGHLY ROBUST MEDIA FORMATTER
    const formatMediaUrl = (url: string, type: 'image' | 'video' | 'none') => {
        if (!url) return "";
        const t = url.trim();

        // 1. YouTube Handling
        const ytReg = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const ytMatch = t.match(ytReg);
        if (ytMatch && ytMatch[2].length === 11) {
            return `https://www.youtube.com/embed/${ytMatch[2]}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${ytMatch[2]}`;
        }

        // 2. Google Drive Handling (Smart Extraction)
        if (t.includes('drive.google.com')) {
            // Extracts ID from /file/d/ID/view, /open?id=ID, /uc?id=ID, etc.
            const idMatch = t.match(/\/d\/([^/|?]+)/) || t.match(/id=([^&]+)/);
            if (idMatch && idMatch[1]) {
                const id = idMatch[1].replace('/view', '');
                // Use uc link for both (reliable for direct embedding with referrer bypass)
                return `https://drive.google.com/uc?export=view&id=${id}`;
            }
        }

        return t;
    };

    const filteredSponsors = sponsors.filter(s => {
        const matchesName = s.name.toLowerCase().includes(filters.name.toLowerCase());
        const matchesPlan = filters.plan === 'all' || s.plan === filters.plan;
        const matchesStatus = filters.status === 'all' || s.status === filters.status;
        const matchesDate = !filters.date || s.createdAt.includes(filters.date);
        return matchesName && matchesPlan && matchesStatus && matchesDate;
    });

    const visibleSponsors = role === 'admin' ? filteredSponsors : filteredSponsors.filter(s => s.id === authSponsorId);
    const totalImpressions = visibleSponsors.reduce((acc, s) => acc + (s?.stats?.impressions || 0), 0);
    const totalClicks = visibleSponsors.reduce((acc, s) => acc + (s?.stats?.clicks || 0), 0);
    const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : '0';

    return (
        <div className="bg-[#02020a] min-h-screen pt-32 pb-20 text-white font-sans selection:bg-violet-500/30 overflow-x-hidden">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_70%)] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <button onClick={() => view === 'stats' ? setView('edit') : navigate('/sponsor/info')} className="inline-flex items-center gap-2 text-violet-400 hover:text-white transition-colors font-black uppercase tracking-widest text-[10px] italic">
                                <ArrowLeft size={14} /> Kembali
                            </button>
                            <span className="w-1 h-1 rounded-full bg-white/20"></span>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-[8px] font-black uppercase tracking-widest italic">
                                <UserCheck size={10} /> {role === 'admin' ? 'Root Access' : 'Partner Access'}
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
                            Control <span className="text-violet-400">Portal.</span>
                            <span className="text-[10px] ml-4 text-white/20">({sponsors.length} Data)</span>
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div className="bg-white/5 p-1 rounded-2xl border border-white/5 flex">
                            <button onClick={() => { setView('edit'); setSelectedSponsorId(null); }} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'edit' ? 'bg-violet-600 text-white' : 'text-white/40 hover:text-white'}`}><Layout size={14} /> Editor</button>
                            <button onClick={() => setView('stats')} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'stats' ? 'bg-violet-600 text-white' : 'text-white/40 hover:text-white'}`}><BarChart3 size={14} /> Statistik</button>
                        </div>
                        {view === 'edit' && (role !== 'admin' || selectedSponsorId) && (
                            <button onClick={handleSave} disabled={isSaving} className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-tighter transition-all shadow-xl active:scale-95 min-w-[180px] ${saveStatus ? 'bg-emerald-500 text-white shadow-emerald-900/40' : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-900/40'}`}>
                                {isSaving ? <span className="animate-pulse">Menghubungkan...</span> : saveStatus ? <><CheckCircle2 size={20} className="animate-in zoom-in" /> Tersimpan</> : <><Save size={20} /> Simpan Perubahan</>}
                            </button>
                        )}
                        <button onClick={handleLogout} className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl hover:bg-rose-500/20 transition-all active:scale-95"><LogOut size={20} /></button>
                    </div>
                </div>

                {view === 'stats' ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-700">
                        <div className="bg-white/[0.03] backdrop-blur-3xl border-2 border-white/5 p-10 rounded-[3rem] shadow-2xl">
                            <Activity className="text-blue-400 mb-6" size={32} />
                            <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.4em] mb-2">Total Impresi</h3>
                            <p className="text-6xl font-black tracking-tighter italic">{totalImpressions}</p>
                        </div>
                        <div className="bg-white/[0.03] backdrop-blur-3xl border-2 border-white/5 p-10 rounded-[3rem] shadow-2xl">
                            <MousePointer2 className="text-violet-400 mb-6" size={32} />
                            <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.4em] mb-2">Total Klik</h3>
                            <p className="text-6xl font-black tracking-tighter italic">{totalClicks}</p>
                        </div>
                        <div className="bg-white/[0.03] backdrop-blur-3xl border-2 border-white/5 p-10 rounded-[3rem] shadow-2xl">
                            <PieChart className="text-emerald-400 mb-6" size={32} />
                            <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.4em] mb-2">AVG CTR</h3>
                            <p className="text-6xl font-black tracking-tighter italic">{avgCTR}%</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {role === 'admin' && !selectedSponsorId && (
                            <div className="animate-in fade-in duration-700 space-y-8">
                                <div className="flex">
                                    <button onClick={addSponsor} className="flex-1 flex items-center justify-center gap-4 py-8 bg-white/5 border-2 border-dashed border-white/10 rounded-[3rem] text-white/20 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/5 transition-all group font-black uppercase tracking-[0.5em] italic text-sm">
                                        <Plus size={24} className="group-hover:rotate-90 transition-transform" /> Tambah Account Partner Baru
                                    </button>
                                </div>
                                <div className="overflow-x-auto bg-white/[0.03] backdrop-blur-3xl border-2 border-white/5 rounded-[2.5rem] shadow-2xl">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="p-6 text-[10px] font-black text-white/40 uppercase tracking-widest text-center w-16">No</th>
                                                <th className="p-6 text-[10px] font-black text-white/40 uppercase tracking-widest">
                                                    <div className="space-y-2">
                                                        <span>Nama Brand</span>
                                                        <input type="text" placeholder="Cari..." value={filters.name} onChange={(e) => setFilters(f => ({ ...f, name: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white outline-none focus:border-violet-500 transition-all font-bold uppercase" />
                                                    </div>
                                                </th>
                                                <th className="p-6 text-[10px] font-black text-white/40 uppercase tracking-widest">
                                                    <div className="space-y-2">
                                                        <span>Level Paket</span>
                                                        <select value={filters.plan} onChange={(e) => setFilters(f => ({ ...f, plan: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white outline-none focus:border-violet-500 cursor-pointer font-bold uppercase">
                                                            <option value="all" className="bg-[#0a0a1a]">Semua</option>
                                                            <option value="nebula" className="bg-[#0a0a1a]">Nebula</option>
                                                            <option value="galactic" className="bg-[#0a0a1a]">Galactic</option>
                                                            <option value="cosmic" className="bg-[#0a0a1a]">Cosmic</option>
                                                        </select>
                                                    </div>
                                                </th>
                                                <th className="p-6 text-[10px] font-black text-white/40 uppercase tracking-widest">
                                                    <div className="space-y-2">
                                                        <span>Status</span>
                                                        <select value={filters.status} onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white outline-none focus:border-violet-500 cursor-pointer font-bold uppercase">
                                                            <option value="all" className="bg-[#0a0a1a]">Semua</option>
                                                            <option value="active" className="bg-[#0a0a1a]">Active</option>
                                                            <option value="pending" className="bg-[#0a0a1a]">Pending</option>
                                                            <option value="expired" className="bg-[#0a0a1a]">Expired</option>
                                                        </select>
                                                    </div>
                                                </th>
                                                <th className="p-6 text-[10px] font-black text-white/40 uppercase tracking-widest">
                                                    <div className="space-y-2">
                                                        <span>Pendaftaran</span>
                                                        <input type="date" value={filters.date} onChange={(e) => setFilters(f => ({ ...f, date: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white outline-none focus:border-violet-500 transition-all font-bold uppercase" />
                                                    </div>
                                                </th>
                                                <th className="p-6 text-[10px] font-black text-white/40 uppercase tracking-widest text-right">Impressions</th>
                                                <th className="p-6 text-[10px] font-black text-white/40 uppercase tracking-widest text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {visibleSponsors.map((s, idx) => (
                                                <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group">
                                                    <td className="p-6 text-center text-xs font-black text-white/20 italic">{idx + 1}</td>
                                                    <td className="p-6">
                                                        <div>
                                                            <div className="font-black italic uppercase tracking-tight text-white group-hover:text-violet-400 transition-colors">{s.name}</div>
                                                            <div className="text-[8px] font-black text-white/20 uppercase tracking-widest">{s.tagline}</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <span className="text-[10px] font-black italic uppercase text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">{s.plan}</span>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className={`inline-flex px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${s.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                            s.status === 'expired' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                                                'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                            }`}>
                                                            {s.status}
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">{s.createdAt}</div>
                                                    </td>
                                                    <td className="p-6 text-right font-black italic text-sm">{s?.stats?.impressions?.toLocaleString() || 0}</td>
                                                    <td className="p-6 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button onClick={() => setSelectedSponsorId(s.id)} className="p-2 bg-violet-600 rounded-lg hover:bg-violet-500 transition-all shadow-lg shadow-violet-900/40 text-white"><Layout size={14} /></button>
                                                            <button onClick={() => deleteSponsor(s.id)} className="p-2 bg-rose-500/10 text-rose-500/40 hover:text-rose-500 rounded-lg transition-all"><Trash2 size={14} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {visibleSponsors.length === 0 && (
                            <div className="py-20 text-center space-y-4 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10 animate-in fade-in duration-1000">
                                <AlertCircle className="mx-auto text-white/10" size={48} />
                                <p className="text-white/20 font-black uppercase tracking-[0.5em] italic text-xs">Belum Ada Data Yang Dapat Ditampilkan</p>
                                <button onClick={() => { localStorage.removeItem('sampahku_active_sponsors'); window.location.reload(); }} className="text-violet-400 font-bold hover:underline py-2">Klik Untuk Force-Load Data Default</button>
                            </div>
                        )}
                        {visibleSponsors.filter(s => !selectedSponsorId || s.id === selectedSponsorId).map((sponsor) => (
                            (role === 'admin' && !selectedSponsorId) ? null : (
                                <div key={sponsor.id} className="bg-white/[0.03] backdrop-blur-3xl border-2 border-white/5 rounded-[3.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom duration-500">
                                    {role === 'admin' && (
                                        <button onClick={() => setSelectedSponsorId(null)} className="absolute top-10 right-12 z-20 flex items-center gap-2 text-white/20 hover:text-white transition-colors text-[8px] font-black uppercase tracking-[0.3em] bg-white/5 px-4 py-2 rounded-full border border-white/10">
                                            <ArrowLeft size={10} /> Tutup Editor
                                        </button>
                                    )}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                                        <div className="space-y-8">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <h3 className="text-xl font-black italic uppercase tracking-widest text-white/20">Akses Slot #{sponsor.id.slice(-4)}</h3>
                                                    <div className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${sponsor.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                        sponsor.status === 'expired' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                                            'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                        }`}>
                                                        {sponsor.status}
                                                    </div>
                                                    <div className="px-4 py-1 rounded-full bg-white/5 text-white/40 border border-white/10 text-[8px] font-black uppercase tracking-widest">
                                                        Plan: {sponsor.plan}
                                                    </div>
                                                </div>
                                                {role === 'admin' && sponsors.length > 1 && (
                                                    <button onClick={() => deleteSponsor(sponsor.id)} className="p-3 text-rose-500/40 hover:text-rose-500 rounded-xl transition-all"><Trash2 size={18} /></button>
                                                )}
                                            </div>

                                            {role === 'admin' && (
                                                <div className="p-8 bg-violet-600/5 border-2 border-violet-500/20 rounded-[2.5rem] space-y-6">
                                                    <div className="flex items-center gap-3">
                                                        <ShieldCheck className="text-violet-400" size={16} />
                                                        <h4 className="text-[10px] font-black text-violet-400 uppercase tracking-widest italic">Kendalikan Kontrak (Admin Only)</h4>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        <div className="space-y-3">
                                                            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">Level Manifestasi</label>
                                                            <select value={sponsor.plan} onChange={(e) => updateSponsor(sponsor.id, { plan: e.target.value as any })} className="w-full bg-[#1a1a2e] border-2 border-white/5 rounded-2xl px-6 py-4 font-bold text-white focus:border-violet-500 outline-none appearance-none cursor-pointer">
                                                                <option value="nebula" className="bg-[#1a1a2e]">Nebula Core (Rp 1.5M)</option>
                                                                <option value="galactic" className="bg-[#1a1a2e]">Galactic Reach (Rp 3.75M)</option>
                                                                <option value="cosmic" className="bg-[#1a1a2e]">Cosmic Empire (Rp 10M)</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">Status Energi</label>
                                                            <select value={sponsor.status} onChange={(e) => updateSponsor(sponsor.id, { status: e.target.value as any })} className="w-full bg-[#1a1a2e] border-2 border-white/5 rounded-2xl px-6 py-4 font-bold text-white focus:border-violet-500 outline-none appearance-none cursor-pointer">
                                                                <option value="active" className="bg-[#1a1a2e]">Active (Tampil)</option>
                                                                <option value="pending" className="bg-[#1a1a2e]">Pending (Review)</option>
                                                                <option value="expired" className="bg-[#1a1a2e]">Expired (Berhenti)</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">Batas Waktu</label>
                                                            <input type="date" value={sponsor.expiryDate} onChange={(e) => updateSponsor(sponsor.id, { expiryDate: e.target.value })} className="w-full bg-[#1a1a2e] border-2 border-white/5 rounded-2xl px-6 py-4 font-bold text-white focus:border-violet-500 outline-none" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Lock className="text-violet-400" size={16} />
                                                    <h4 className="text-[10px] font-black text-white/60 uppercase tracking-widest italic">Pengaturan Keamanan Akun</h4>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">ID Login</label>
                                                        <div className="relative">
                                                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                                            <input type="text" value={sponsor.username} disabled={role !== 'admin'} onChange={(e) => updateSponsor(sponsor.id, { username: e.target.value })} className={`w-full bg-white/5 border-2 border-white/5 rounded-2xl pl-14 pr-6 py-4 font-bold text-white outline-none ${role === 'admin' ? 'focus:border-violet-500' : 'opacity-50 cursor-not-allowed'}`} />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-2">Ganti Kata Sandi</label>
                                                        <div className="relative">
                                                            <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                                            <input type="password" value={sponsor.password} onChange={(e) => updateSponsor(sponsor.id, { password: e.target.value })} className="w-full bg-white/5 border-2 border-white/5 rounded-2xl pl-14 pr-6 py-4 font-bold text-white focus:border-violet-500 outline-none" placeholder="••••••••" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-violet-400 uppercase tracking-widest ml-2 italic">Nama Brand</label>
                                                    <input type="text" value={sponsor.name} onChange={(e) => updateSponsor(sponsor.id, { name: e.target.value })} className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 font-bold text-white focus:border-violet-500 outline-none" />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-violet-400 uppercase tracking-widest ml-2 italic">Tagline</label>
                                                    <input type="text" value={sponsor.tagline} onChange={(e) => updateSponsor(sponsor.id, { tagline: e.target.value })} className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 font-bold text-white focus:border-violet-500 outline-none" />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-violet-400 uppercase tracking-widest ml-2 italic">Media</label>
                                                <div className="relative">
                                                    <select value={sponsor.mediaType} onChange={(e) => updateSponsor(sponsor.id, { mediaType: e.target.value as any })} className="w-full bg-[#1a1a2e] border-2 border-white/5 rounded-2xl px-6 py-4 font-bold text-white focus:border-violet-500 outline-none appearance-none cursor-pointer">
                                                        <option value="none" className="bg-[#1a1a2e]">Teks Saja</option>
                                                        <option value="image" className="bg-[#1a1a2e]">Gambar</option>
                                                        <option value="video" className="bg-[#1a1a2e]">Video</option>
                                                    </select>
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 text-xs">▼</div>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center ml-2">
                                                    <label className="text-[10px] font-black text-violet-400 uppercase tracking-widest italic">URL Aset Media (Google Drive/YouTube/MP4)</label>
                                                    <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">External Host Only</span>
                                                </div>
                                                <input type="text" value={sponsor.mediaUrl} onChange={(e) => updateSponsor(sponsor.id, { mediaUrl: e.target.value })} className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 font-bold text-white focus:border-violet-500 outline-none" placeholder="Paste link video/image di sini..." />

                                                {/* Technical manifestation instructions */}
                                                <div className="mt-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
                                                    <h5 className="text-[9px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                                                        <Activity size={12} className="text-violet-400" /> Manifestation Guide:
                                                    </h5>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1">
                                                            <p className="text-[8px] font-black text-white/30 uppercase tracking-tighter">Video Spec (Cosmic):</p>
                                                            <p className="text-[9px] font-bold italic text-white/60">5-10 Detik | 1080p (16:9) | Max 5MB | Muted Default</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[8px] font-black text-white/30 uppercase tracking-tighter">Image Spec (All):</p>
                                                            <p className="text-[9px] font-bold italic text-white/60">1920x1080px | Max 500KB | WebP Recommended</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-violet-400 uppercase tracking-widest ml-2 italic">Link Call to Action (Kunjungi Situs)</label>
                                                <input type="text" value={sponsor.linkUrl} onChange={(e) => updateSponsor(sponsor.id, { linkUrl: e.target.value })} className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 font-bold text-white focus:border-violet-500 outline-none" placeholder="https://website-anda.com" />
                                            </div>
                                        </div>

                                        {/* PREVIEW SIMULATOR */}
                                        <div className="flex flex-col h-full bg-black/40 rounded-[2.5rem] border-4 border-white/5 p-8 relative overflow-hidden group/sim">
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="flex items-center gap-3">
                                                    <Eye className="text-violet-400 animate-pulse" size={20} />
                                                    <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic">Live Simulator</h4>
                                                </div>
                                                {sponsor.mediaType === 'video' && (
                                                    <button onClick={() => setIsMuted(!isMuted)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-white/40 hover:text-white">
                                                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                                    </button>
                                                )}
                                            </div>

                                            <div className={`p-8 rounded-[2rem] border-2 border-white/5 bg-gradient-to-br ${sponsor.theme === 'forest' ? 'from-emerald-900/20 to-transparent' : 'from-violet-900/20 to-transparent'} min-h-fit flex flex-col`}>
                                                <div className="w-full aspect-[21/9] bg-white/5 rounded-2xl mb-6 overflow-hidden border-2 border-white/10 relative flex items-center justify-center">
                                                    {imgError[sponsor.id] ? (
                                                        <div className="flex flex-col items-center gap-2 text-rose-500 animate-in zoom-in">
                                                            <AlertCircle size={32} />
                                                            <p className="text-[8px] font-black uppercase tracking-widest">Media Tak Terjangkau</p>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {sponsor.mediaType === 'image' && sponsor.mediaUrl ? (
                                                                <img src={formatMediaUrl(sponsor.mediaUrl, 'image')} key={sponsor.mediaUrl} className="w-full h-full object-cover animate-in fade-in duration-700" alt="Pview" referrerPolicy="no-referrer" onError={() => setImgError(prev => ({ ...prev, [sponsor.id]: true }))} />
                                                            ) : sponsor.mediaType === 'video' && sponsor.mediaUrl ? (
                                                                sponsor.mediaUrl.includes('youtube') || sponsor.mediaUrl.includes('youtu.be') ? (
                                                                    <iframe src={formatMediaUrl(sponsor.mediaUrl, 'video')} className="w-full h-full border-0 pointer-events-none opacity-80" allow="autoplay" />
                                                                ) : (
                                                                    <video src={formatMediaUrl(sponsor.mediaUrl, 'video')} key={sponsor.mediaUrl + isMuted} autoPlay loop playsInline muted={isMuted} className="w-full h-full object-cover opacity-80" onError={() => setImgError(prev => ({ ...prev, [sponsor.id]: true }))} />
                                                                )
                                                            ) : (
                                                                <div className="w-full h-full flex flex-col items-center justify-center opacity-10"><ImageIcon size={48} /></div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-3xl font-black italic uppercase mb-2 tracking-tighter leading-tight">{sponsor.name || 'Brand Name'}</h4>
                                                    <p className="text-[8px] font-black opacity-30 italic uppercase tracking-widest">{sponsor.tagline || 'Campaign Tagline'}</p>
                                                </div>
                                                <div className={`mt-8 w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] text-center ${sponsor.theme === 'forest' ? 'bg-emerald-500 shadow-[0_10px_30px_rgba(16,185,129,0.3)]' : 'bg-violet-600 shadow-[0_10px_30px_rgba(139,92,246,0.3)]'}`}>Lanjutkan Perjalanan</div>
                                            </div>
                                            <div className="mt-4 text-[7px] font-bold text-white/10 uppercase text-center tracking-widest">Klik "Simpan" Untuk Mengaktifkan Media Baru</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSponsors;
