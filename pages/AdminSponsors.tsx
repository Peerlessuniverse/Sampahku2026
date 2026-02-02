import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    getStoredSponsors,
    addSponsor as dbAddSponsor,
    updateSponsor as dbUpdateSponsor,
    deleteSponsor as dbDeleteSponsor,
    SponsorData
} from '../services/sponsorServiceFirestore';
import {
    Save, Plus, Trash2, Layout, Eye, ArrowLeft, LogOut,
    BarChart3, PieChart, Activity, MousePointer2,
    AlertCircle, CheckCircle2, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Regex patterns for media URL formatting (extracted to constants for performance)
const GOOGLE_DRIVE_ID_REGEX_1 = /\/d\/([^/]+)/;
const GOOGLE_DRIVE_ID_REGEX_2 = /id=([^&]+)/;
const YOUTUBE_ID_REGEX = /(?:\?v=|\/embed\/|\/watch\?v=|\/shorts\/|youtu.be\/)([^#&?]*)/;

const AdminSponsors: React.FC = () => {
    const navigate = useNavigate();
    const [sponsors, setSponsors] = useState<SponsorData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [authSponsorId, setAuthSponsorId] = useState<string | null>(null);
    const [view, setView] = useState<'edit' | 'stats'>('edit');
    const [selectedSponsorId, setSelectedSponsorId] = useState<string | null>(null);
    const [filterName, setFilterName] = useState('');

    // Fetch sponsors with abort controller support
    const fetchSponsors = useCallback(async (signal?: AbortSignal) => {
        setIsLoading(true);
        try {
            const data = await getStoredSponsors();
            if (!signal?.aborted) {
                setSponsors(data);
            }
        } catch (err) {
            if (!signal?.aborted) {
                console.error("Failed to fetch sponsors:", err);
            }
        } finally {
            if (!signal?.aborted) {
                setIsLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        const storedRole = localStorage.getItem('auth_role');
        const storedSponsorId = localStorage.getItem('auth_sponsor_id');

        if (!storedRole) {
            navigate('/portals');
            return;
        }

        setRole(storedRole);
        setAuthSponsorId(storedSponsorId);

        const controller = new AbortController();
        fetchSponsors(controller.signal);
        return () => controller.abort();
    }, [navigate, fetchSponsors]);

    // Auto-clear save status after 3 seconds
    useEffect(() => {
        if (!saveStatus) return;
        const timer = setTimeout(() => setSaveStatus(null), 3000);
        return () => clearTimeout(timer);
    }, [saveStatus]);

    const handleSave = useCallback(async () => {
        if (!selectedSponsorId && role === 'admin') return;

        setIsSaving(true);
        const targetId = selectedSponsorId || authSponsorId;
        if (!targetId) return;

        const sponsorToUpdate = sponsors.find(s => s.id === targetId);
        if (!sponsorToUpdate) return;

        try {
            // Reset stats upon save as requested by user ("start tracking from 0")
            const updates = {
                ...sponsorToUpdate,
                stats: {
                    impressions: 0,
                    clicks: 0
                }
            };

            await dbUpdateSponsor(targetId, updates);
            setSaveStatus('Portal Berhasil Disinkronisasi!');

            // Optimistic update - update local state without refetching
            setSponsors(prev => prev.map(s => s.id === targetId ? updates : s));
        } catch (err) {
            console.error("Save failed:", err);
            setSaveStatus('Gagal Menyimpan ke Cloud');
            // Revert on error - refetch to get correct state
            fetchSponsors();
        } finally {
            setIsSaving(false);
        }
    }, [selectedSponsorId, role, authSponsorId, sponsors, fetchSponsors]);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('auth_role');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_sponsor_id');
        navigate('/portals');
    }, [navigate]);

    const updateSponsorState = useCallback((id: string, updates: Partial<SponsorData>) => {
        setSponsors(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    }, []);

    const addSponsor = useCallback(async () => {
        const newSponsor: Omit<SponsorData, 'id'> = {
            username: `partner_${Math.random().toString(36).slice(2, 6)}`,
            password: 'password123',
            name: 'New Partner Account',
            tagline: 'Eco-Visionary Brand',
            message: 'Tulis pesan kampanye Anda di sini...',
            mediaType: 'none',
            mediaUrl: '',
            linkUrl: '',
            theme: 'cosmic',
            plan: 'nebula',
            status: 'pending',
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            maxSlots: 1,
            stats: { impressions: 0, clicks: 0 }
        };

        try {
            const newId = await dbAddSponsor(newSponsor);
            // Optimistic update - add to local state without refetching
            setSponsors(prev => [...prev, { ...newSponsor, id: newId }]);
        } catch (err) {
            console.error("Failed to add sponsor:", err);
        }
    }, []);

    const deleteSponsor = useCallback(async (id: string) => {
        if (!window.confirm('Hapus akses partner ini secara permanen?')) return;
        try {
            await dbDeleteSponsor(id);
            // Optimistic update - remove from local state without refetching
            setSponsors(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            console.error("Failed to delete:", err);
            // Revert on error - refetch to get correct state
            fetchSponsors();
        }
    }, [fetchSponsors]);

    const formatMediaUrl = useCallback((url: string) => {
        if (!url) return "";
        if (url.includes('drive.google.com')) {
            const idMatch = url.match(GOOGLE_DRIVE_ID_REGEX_1) || url.match(GOOGLE_DRIVE_ID_REGEX_2);
            if (idMatch) return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
        }
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const ytId = url.match(YOUTUBE_ID_REGEX);
            if (ytId) return `https://www.youtube.com/embed/${ytId[1]}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId[1]}`;
        }
        return url;
    }, []);

    // Memoized computed values to prevent unnecessary recalculations
    const visibleSponsors = useMemo(() =>
        role === 'admin'
            ? sponsors.filter(s => s.name.toLowerCase().includes(filterName.toLowerCase()))
            : sponsors.filter(s => s.id === authSponsorId),
        [role, sponsors, filterName, authSponsorId]
    );

    const statsTarget = useMemo(() =>
        selectedSponsorId
            ? sponsors.find(s => s.id === selectedSponsorId)
            : (role === 'sponsor' ? sponsors.find(s => s.id === authSponsorId) : null),
        [selectedSponsorId, sponsors, role, authSponsorId]
    );

    return (
        <div className="bg-[#02020a] min-h-screen pt-32 pb-20 text-white font-sans selection:bg-violet-500/30">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_70%)] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate(role === 'admin' ? '/central-command/dashboard' : '/partner/dashboard')}
                            className="inline-flex items-center gap-2 text-violet-400 hover:text-white transition-colors font-black uppercase tracking-widest text-[10px] italic"
                        >
                            <ArrowLeft size={14} /> Ke Dashboard Utama
                        </button>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
                            Control <span className="text-violet-400">Portal.</span>
                            <span className="text-[10px] ml-4 text-white/20">({sponsors.length} Active Records)</span>
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div className="bg-white/5 p-1 rounded-2xl border border-white/5 flex">
                            <button onClick={() => setView('edit')} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'edit' ? 'bg-violet-600 text-white' : 'text-white/40 hover:text-white'}`}><Layout size={14} /> Editor</button>
                            <button onClick={() => setView('stats')} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'stats' ? 'bg-violet-600 text-white' : 'text-white/40 hover:text-white'}`}><BarChart3 size={14} /> Statistik</button>
                        </div>
                        {(selectedSponsorId || role === 'sponsor') && (
                            <button onClick={handleSave} disabled={isSaving} className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-tighter transition-all shadow-xl active:scale-95 min-w-[180px] ${saveStatus ? 'bg-emerald-500 text-white shadow-emerald-900/40' : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-900/40'}`}>
                                {isSaving ? <Activity className="animate-spin" size={20} /> : saveStatus ? <CheckCircle2 size={20} /> : <Save size={20} />}
                                {isSaving ? 'Saving...' : saveStatus ? 'Saved' : 'Simpan & Reset Stats'}
                            </button>
                        )}
                        <button onClick={handleLogout} className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl hover:bg-rose-500/20 transition-all active:scale-95"><LogOut size={20} /></button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="py-40 text-center">
                        <Activity className="animate-spin mx-auto text-violet-400 mb-4" size={48} />
                        <p className="text-[10px] font-black uppercase tracking-[1em] text-white/20">Synchronizing with Cloud...</p>
                    </div>
                ) : (
                    <>
                        {view === 'stats' ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-700">
                                <div className="bg-white/[0.03] backdrop-blur-3xl border-2 border-white/5 p-10 rounded-[3rem] shadow-2xl transition-all hover:bg-white/[0.05]">
                                    <Activity className="text-blue-400 mb-6" size={32} />
                                    <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.4em] mb-2">Total Impresi</h3>
                                    <p className="text-6xl font-black tracking-tighter italic">{statsTarget?.stats?.impressions || 0}</p>
                                </div>
                                <div className="bg-white/[0.03] backdrop-blur-3xl border-2 border-white/5 p-10 rounded-[3rem] shadow-2xl transition-all hover:bg-white/[0.05]">
                                    <MousePointer2 className="text-violet-400 mb-6" size={32} />
                                    <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.4em] mb-2">Total Klik</h3>
                                    <p className="text-6xl font-black tracking-tighter italic">{statsTarget?.stats?.clicks || 0}</p>
                                </div>
                                <div className="bg-white/[0.03] backdrop-blur-3xl border-2 border-white/5 p-10 rounded-[3rem] shadow-2xl transition-all hover:bg-white/[0.05]">
                                    <PieChart className="text-emerald-400 mb-6" size={32} />
                                    <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.4em] mb-2">AVG CTR</h3>
                                    <p className="text-6xl font-black tracking-tighter italic">
                                        {statsTarget?.stats?.impressions && statsTarget.stats.impressions > 0
                                            ? ((statsTarget.stats.clicks / statsTarget.stats.impressions) * 100).toFixed(1)
                                            : 0}%
                                    </p>
                                </div>
                                {(!statsTarget) && (
                                    <div className="col-span-full py-20 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                                        <p className="text-white/20 font-black uppercase tracking-widest text-xs">Pilih Partner Untuk Melihat Statistik</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-10">
                                {role === 'admin' && !selectedSponsorId && (
                                    <div className="animate-in fade-in duration-700 space-y-8">
                                        <button onClick={addSponsor} className="w-full flex items-center justify-center gap-4 py-8 bg-white/5 border-2 border-dashed border-white/10 rounded-[3rem] text-white/20 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/5 transition-all group font-black uppercase tracking-[0.5em] italic text-sm">
                                            <Plus size={24} className="group-hover:rotate-90 transition-transform" /> Tambah Account Partner Baru
                                        </button>

                                        <div className="bg-white/[0.03] border-2 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="border-b border-white/10 text-[10px] font-black text-white/40 uppercase tracking-widest">
                                                        <th className="p-6 pl-10">Nama Brand</th>
                                                        <th className="p-6">Plan</th>
                                                        <th className="p-6">Status</th>
                                                        <th className="p-6 text-right">Impresi</th>
                                                        <th className="p-6 text-center pr-10">Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {visibleSponsors.map(s => (
                                                        <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group">
                                                            <td className="p-6 pl-10">
                                                                <div className="font-black italic uppercase text-white group-hover:text-violet-400 transition-colors">{s.name}</div>
                                                                <div className="text-[8px] opacity-20 uppercase font-black">{s.tagline}</div>
                                                            </td>
                                                            <td className="p-6"><span className="text-[10px] font-black uppercase text-violet-400">{s.plan}</span></td>
                                                            <td className="p-6">
                                                                <span className={`text-[8px] font-black px-2 py-1 rounded-full border ${s.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                                                                    {s.status.toUpperCase()}
                                                                </span>
                                                            </td>
                                                            <td className="p-6 text-right font-black italic">{s.stats?.impressions || 0}</td>
                                                            <td className="p-6 text-center pr-10">
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <button onClick={() => setSelectedSponsorId(s.id)} className="p-2 bg-violet-600 rounded-lg text-white hover:bg-violet-500 transition-all"><Layout size={14} /></button>
                                                                    <button onClick={() => deleteSponsor(s.id)} className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500 transition-all"><Trash2 size={14} /></button>
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
                                    <div className="py-32 text-center bg-white/5 rounded-[3.5rem] border-2 border-dashed border-white/10 space-y-6">
                                        <AlertCircle className="mx-auto text-violet-400/20" size={64} />
                                        <p className="text-white/20 font-black uppercase tracking-[0.5em] italic">Belum Ada Partner Yang Terdaftar</p>
                                    </div>
                                )}

                                {visibleSponsors.filter(s => !selectedSponsorId || s.id === selectedSponsorId).map(s => (
                                    (role === 'admin' && !selectedSponsorId) ? null : (
                                        <div key={s.id} className="bg-white/[0.03] backdrop-blur-3xl border-2 border-white/5 rounded-[3.5rem] p-12 shadow-2xl relative animate-in slide-in-from-bottom duration-500">
                                            {role === 'admin' && (
                                                <button onClick={() => setSelectedSponsorId(null)} className="absolute top-10 right-12 text-[8px] font-black uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                                                    ← Tutup Editor
                                                </button>
                                            )}

                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                                <div className="space-y-10">
                                                    <div>
                                                        <h3 className="text-2xl font-black italic uppercase text-white/30 mb-6">Manifestation Form</h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div className="space-y-3">
                                                                <label className="text-[10px] font-black text-violet-400 uppercase tracking-widest ml-2 italic">Nama Brand</label>
                                                                <input type="text" value={s.name} onChange={(e) => updateSponsorState(s.id, { name: e.target.value })} className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 font-bold text-white focus:border-violet-500 outline-none transition-all" />
                                                            </div>
                                                            <div className="space-y-3">
                                                                <label className="text-[10px] font-black text-violet-400 uppercase tracking-widest ml-2 italic">Tagline</label>
                                                                <input type="text" value={s.tagline} onChange={(e) => updateSponsorState(s.id, { tagline: e.target.value })} className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 font-bold text-white focus:border-violet-500 outline-none transition-all" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-violet-400 uppercase tracking-widest ml-2 italic">Pesan Iklan (Muncul Saat Transisi)</label>
                                                        <textarea value={s.message} onChange={(e) => updateSponsorState(s.id, { message: e.target.value })} className="w-full bg-white/5 border-2 border-white/5 rounded-3xl px-6 py-4 font-bold text-white focus:border-violet-500 outline-none h-32 resize-none transition-all" />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-3">
                                                            <label className="text-[10px] font-black text-violet-400 uppercase tracking-widest ml-2 italic">Media Type</label>
                                                            <select value={s.mediaType} onChange={(e) => updateSponsorState(s.id, { mediaType: e.target.value as any })} className="w-full bg-[#11111a] border-2 border-white/5 rounded-2xl px-6 py-4 font-bold text-white outline-none">
                                                                <option value="none">Text Only</option>
                                                                <option value="image">Image Display</option>
                                                                <option value="video">Motion Video</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <label className="text-[10px] font-black text-violet-400 uppercase tracking-widest ml-2 italic">Aset URL (GDrive/Direct/YouTube)</label>
                                                            <input type="text" value={s.mediaUrl} onChange={(e) => updateSponsorState(s.id, { mediaUrl: e.target.value })} className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 font-bold text-white focus:border-violet-500 outline-none transition-all" placeholder="Paste link media..." />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-violet-400 uppercase tracking-widest ml-2 italic">Target Tujuan (Link CTA)</label>
                                                        <input type="text" value={s.linkUrl} onChange={(e) => updateSponsorState(s.id, { linkUrl: e.target.value })} className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 font-bold text-white focus:border-violet-500 outline-none transition-all" placeholder="https://..." />
                                                    </div>

                                                    {role === 'admin' && (
                                                        <div className="p-8 bg-violet-600/5 border-2 border-violet-500/20 rounded-[2.5rem] grid grid-cols-2 gap-6">
                                                            <div className="space-y-3">
                                                                <label className="text-[10px] font-black text-violet-400 uppercase tracking-widest ml-2">Kontrak Plan</label>
                                                                <select value={s.plan} onChange={(e) => updateSponsorState(s.id, { plan: e.target.value as any })} className="w-full bg-violet-950/20 border-2 border-white/5 rounded-2xl px-6 py-3 text-sm font-bold">
                                                                    <option value="nebula">Nebula</option>
                                                                    <option value="galactic">Galactic</option>
                                                                    <option value="cosmic">Cosmic</option>
                                                                </select>
                                                            </div>
                                                            <div className="space-y-3">
                                                                <label className="text-[10px] font-black text-violet-400 uppercase tracking-widest ml-2">Status Akun</label>
                                                                <select value={s.status} onChange={(e) => updateSponsorState(s.id, { status: e.target.value as any })} className="w-full bg-violet-950/20 border-2 border-white/5 rounded-2xl px-6 py-3 text-sm font-bold">
                                                                    <option value="active">Active</option>
                                                                    <option value="pending">Pending</option>
                                                                    <option value="expired">Expired</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-8 flex flex-col justify-center bg-black/40 rounded-[3rem] border-4 border-white/5 p-10 relative overflow-hidden">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <Eye className="text-violet-400" size={20} />
                                                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Live Simulator (Transisi)</h4>
                                                    </div>

                                                    <div className={`p-8 rounded-[2rem] border-2 border-white/5 bg-gradient-to-br ${s.theme === 'forest' ? 'from-emerald-900/20 to-transparent' : 'from-violet-900/20 to-transparent'} min-h-[400px] flex flex-col items-center justify-between text-center`}>
                                                        {s.mediaType !== 'none' && s.mediaUrl ? (
                                                            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 mb-6">
                                                                {s.mediaType === 'image' ? (
                                                                    <img
                                                                        src={formatMediaUrl(s.mediaUrl)}
                                                                        className="w-full h-full object-cover"
                                                                        alt="Preview"
                                                                        loading="lazy"
                                                                    />
                                                                ) : (
                                                                    <iframe
                                                                        src={formatMediaUrl(s.mediaUrl)}
                                                                        className="w-full h-full border-0 pointer-events-none"
                                                                        title="Video Preview"
                                                                        loading="lazy"
                                                                    />
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 opacity-30"><Sparkles size={32} /></div>
                                                        )}

                                                        <div className="space-y-4">
                                                            <h4 className="text-4xl font-black italic uppercase tracking-tighter text-white">{s.name || 'Brand Name'}</h4>
                                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-10">{s.tagline || 'Tagline Iklan Anda'}</p>
                                                            <h5 className="text-xl font-bold italic text-white/80 max-w-xs">{s.message || 'Pesan kampanye Anda akan muncul di sini saat user berpindah halaman.'}</h5>
                                                        </div>

                                                        <div className="w-full pt-10">
                                                            <div className="w-full py-4 bg-white/10 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40">Lanjutkan Perjalanan →</div>
                                                        </div>
                                                    </div>

                                                    <p className="text-center text-[8px] font-bold text-violet-400/40 uppercase tracking-widest">Klik "Simpan" Untuk Reset Stats & Mulai Tracking Baru</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminSponsors;
