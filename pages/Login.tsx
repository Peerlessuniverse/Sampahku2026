import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowRight, Sparkles, AlertCircle, MessageCircle, Send, LayoutDashboard } from 'lucide-react';
import { getStoredSponsors } from '../services/sponsorService';
import { getCurrentUser, getTelegramBotName } from '../services/authService';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Explicit route checks
    const isAdminRoute = location.pathname.includes('/central-command');
    const isLoginRoute = location.pathname === '/login';
    const botName = getTelegramBotName();

    // Set initial role based on specific path
    const [role, setRole] = useState<'admin' | 'partner' | 'user'>(
        isAdminRoute ? 'admin' : (location.state?.activeTab === 'sponsor' ? 'partner' : 'user')
    );

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Clear error when switching roles manually
        setError(null);
    }, [role]);

    useEffect(() => {
        const storedRole = localStorage.getItem('auth_role');
        // Prevent redirect loop, only redirect if NOT on the target dashboard already
        if (storedRole === 'admin' && !location.pathname.startsWith('/central-command/dashboard')) {
            // Uncomment next line if you want auto-redirect
            // navigate('/central-command/dashboard');
        }
    }, [location.pathname]);

    const handleTelegramRedirect = () => {
        window.open(`https://t.me/${botName}?start=login`, '_blank');
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Simulated processing time for the cosmic feel
        setTimeout(() => {
            if (role === 'admin') {
                if (username === 'Uko_Scavengers' && password === '0xB91C3dFc90085E8fb95b6Da478f29D31A1b959E6') {
                    localStorage.setItem('auth_role', 'admin');
                    localStorage.setItem('auth_user_id', 'admin-main');
                    localStorage.setItem('auth_token', 'cosmic_admin_session_' + Date.now());
                    window.location.href = '/central-command/dashboard';
                } else {
                    setError('Kredensial Otoritas Tertinggi tidak valid.');
                }
            } else if (role === 'partner') {
                // Compatibility layer: Check sponsors collection for partners
                const sponsors = getStoredSponsors();
                const isMasterSponsor = username === 'Partner_Kosmik' && password === 'sampahku2026';
                const matchedSponsor = sponsors.find(s => s.username === username && s.password === password);

                if (matchedSponsor || isMasterSponsor) {
                    localStorage.setItem('auth_role', 'advertiser');
                    localStorage.setItem('auth_user_id', matchedSponsor?.id || 'partner-001');
                    localStorage.setItem('auth_partner_id', matchedSponsor?.id || 'partner-001');
                    localStorage.setItem('auth_token', 'partner_session_' + Date.now());
                    navigate('/partner/dashboard');
                } else {
                    setError('ID Partner atau Password salah.');
                }
            }
            setLoading(false);
        }, 1200);
    };

    return (
        <div className="bg-[#02020a] min-h-screen flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_10%,_transparent_70%)] z-0"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,_#312e81_0%,_transparent_60%)] opacity-30 z-0"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-10 space-y-4 animate-in slide-in-from-top duration-700">
                    <div className="inline-flex items-center justify-center p-4 bg-violet-500/10 rounded-3xl border border-violet-500/20 mb-4 shadow-3xl">
                        {role === 'admin' ? <ShieldCheck className="h-10 w-10 text-violet-400" /> : <User className="h-10 w-10 text-blue-400" />}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
                        {role === 'admin' ? (
                            <>Central <span className="text-violet-400">Command</span></>
                        ) : (
                            <>Portal <span className="text-blue-400">Kosmik.</span></>
                        )}
                    </h1>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">
                        {role === 'admin' ? 'Otoritas Pusat SampahKu 2026' : 'Akses Terpadu Garda & Partner'}
                    </p>
                </div>

                <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] border-2 border-white/10 p-8 md:p-12 shadow-[0_60px_120px_rgba(0,0,0,0.8)] animate-in zoom-in duration-1000">

                    {/* ROLE TABS */}
                    <div className="flex bg-white/5 p-1.5 rounded-2xl mb-10 border border-white/5 relative overflow-hidden">
                        <div
                            className={`absolute top-1.5 bottom-1.5 w-[calc(33.33%-4px)] bg-violet-600 rounded-xl transition-all duration-500 ease-out shadow-xl ${role === 'user' ? 'left-1' : role === 'sponsor' ? 'left-[calc(33.33%+1px)]' : 'left-[calc(66.66%+1px)]'
                                }`}
                        ></div>
                        <button
                            onClick={() => setRole('user')}
                            className={`flex-1 py-3 text-[9px] font-black uppercase tracking-tight relative z-10 transition-colors ${role === 'user' ? 'text-white' : 'text-white/30'}`}
                        >
                            Guardian
                        </button>
                        <button
                            onClick={() => setRole('advertiser')}
                            className={`flex-1 py-3 text-[9px] font-black uppercase tracking-tight relative z-10 transition-colors ${role === 'partner' ? 'text-white' : 'text-white/30'}`}
                        >
                            Advertiser
                        </button>
                        <button
                            onClick={() => setRole('admin')}
                            className={`flex-1 py-3 text-[9px] font-black uppercase tracking-tight relative z-10 transition-colors ${role === 'admin' ? 'text-white' : 'text-white/30'}`}
                        >
                            HQ
                        </button>
                    </div>

                    {role === 'user' ? (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="text-center space-y-3">
                                <div className="p-4 bg-blue-500/10 rounded-2xl inline-flex border border-blue-500/20 mb-2">
                                    <MessageCircle className="text-blue-400 w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-black uppercase italic tracking-tight">Otentikasi Telegram</h3>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">
                                    Masuk secara instan tanpa password. Cukup buka portal @{botName}.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-600/10 to-transparent p-8 rounded-[2rem] border border-blue-500/20 text-center space-y-6">
                                <button
                                    onClick={handleTelegramRedirect}
                                    className="w-full group relative overflow-hidden flex items-center justify-center gap-4 py-6 bg-[#24A1DE] hover:bg-[#28b1f5] text-white rounded-2xl font-black text-lg uppercase italic tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_-10px_rgba(36,161,222,0.5)]"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    <Send className="w-6 h-6 fill-white" />
                                    <span>Masuk Telegram</span>
                                </button>
                                <p className="text-[9px] font-bold text-blue-400/60 uppercase tracking-widest">
                                    Aman • Terenkripsi • Terpadu
                                </p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleLogin} className="space-y-6 animate-in slide-in-from-right duration-500">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-violet-400 uppercase tracking-[0.4em] ml-2 italic">
                                    {role === 'admin' ? 'Identitas Otoritas' : 'ID Partner'}
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-violet-400 transition-colors">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-white/5 border-2 border-white/5 rounded-2xl pl-16 pr-6 py-5 font-bold text-white focus:border-violet-500 outline-none transition-all placeholder:text-white/20"
                                        placeholder={role === 'admin' ? "Masukkan ID Otoritas" : "ID Akses Partner"}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-violet-400 uppercase tracking-[0.4em] ml-2 italic">Kode Keamanan</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-violet-400 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/5 border-2 border-white/5 rounded-2xl pl-16 pr-6 py-5 font-bold text-white focus:border-violet-500 outline-none transition-all placeholder:text-white/20"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-bold animate-in shake duration-300">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full group relative flex items-center justify-center gap-4 px-10 py-6 ${role === 'admin' ? 'bg-violet-600 hover:bg-violet-500' : 'bg-emerald-600 hover:bg-emerald-500'} text-white rounded-[2rem] font-black text-xl uppercase italic tracking-tighter transition-all shadow-3xl shadow-violet-900/40 active:scale-95 disabled:opacity-50`}
                            >
                                {loading ? (
                                    <Sparkles className="animate-spin" size={24} />
                                ) : (
                                    <>
                                        {role === 'admin' ? 'Masuk Markas' : 'Akses Dashboard'} <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
            {/* Stardust Texture Override */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        </div>
    );
};

export default Login;
