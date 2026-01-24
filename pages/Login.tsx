import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { getStoredSponsors } from '../services/sponsorService';
import { getCurrentUser, loginWithGoogle } from '../services/authService';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState<'admin' | 'sponsor' | 'user'>('user');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Auto-redirect if already logged in
    React.useEffect(() => {
        const currentUser = getCurrentUser();
        const storedRole = localStorage.getItem('auth_role');
        if (currentUser || storedRole) {
            navigate(storedRole === 'admin' || storedRole === 'sponsor' ? '/admin/portal' : '/credits');
        }
    }, [navigate]);

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await loginWithGoogle();
            navigate('/credits');
        } catch (e) {
            setError('Gagal masuk dengan Google.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Simulated Authentication Logic
        setTimeout(() => {
            if (role === 'admin') {
                // Root admin remains with hardcoded credentials for simplicity in this demo
                if (username === 'Uko_Scavengers' && password === '0xB91C3dFc90085E8fb95b6Da478f29D31A1b959E6') {
                    localStorage.setItem('auth_role', 'admin');
                    navigate('/admin/portal');
                } else {
                    setError('Kredensial Admin tidak valid.');
                }
            } else if (role === 'sponsor') {
                // Dynamic Sponsor Authentication
                const sponsors = getStoredSponsors();
                const matchedSponsor = sponsors.find(s => s.username === username && s.password === password);

                if (matchedSponsor) {
                    localStorage.setItem('auth_role', 'sponsor');
                    localStorage.setItem('auth_sponsor_id', matchedSponsor.id);
                    navigate('/admin/portal');
                } else {
                    setError('ID Sponsor atau Password salah.');
                }
            }
            setLoading(false);
        }, 1200);
    };

    return (
        <div className="bg-[#02020a] min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_70%)] z-0"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,_#312e81_0%,_transparent_60%)] opacity-30 z-0"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-10 space-y-4 animate-in slide-in-from-top duration-700">
                    <div className="inline-flex items-center justify-center p-4 bg-violet-500/10 rounded-3xl border border-violet-500/20 mb-4 shadow-3xl">
                        <ShieldCheck className="h-10 w-10 text-violet-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
                        Portal <span className="text-violet-400">Masuk.</span>
                    </h1>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Verifikasi Akses Keamanan SampahKu</p>
                </div>

                <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] border-2 border-white/10 p-8 md:p-12 shadow-[0_60px_120px_rgba(0,0,0,0.8)] animate-in zoom-in duration-1000">
                    <div className="flex bg-white/5 p-1.5 rounded-2xl mb-10 border border-white/5 relative overflow-hidden">
                        <div
                            className={`absolute top-1.5 bottom-1.5 w-[calc(33.33%-6px)] bg-violet-600 rounded-xl transition-all duration-500 ease-out shadow-xl ${role === 'admin' ? 'left-1.5' : role === 'sponsor' ? 'left-[calc(33.33%+1.5px)]' : 'left-[calc(66.66%+1.5px)]'}`}
                        ></div>
                        <button
                            onClick={() => setRole('admin')}
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest relative z-10 transition-colors ${role === 'admin' ? 'text-white' : 'text-white/30'}`}
                        >
                            Pusat
                        </button>
                        <button
                            onClick={() => setRole('sponsor')}
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest relative z-10 transition-colors ${role === 'sponsor' ? 'text-white' : 'text-white/30'}`}
                        >
                            Partner
                        </button>
                        <button
                            onClick={() => setRole('user')}
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest relative z-10 transition-colors ${role === 'user' ? 'text-white' : 'text-white/30'}`}
                        >
                            User
                        </button>
                    </div>

                    {role === 'user' ? (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-black uppercase italic tracking-tight">Halo, Cosmic Guardian!</h3>
                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Sinkronkan Kreditmu Agar Tidak Hilang Di Stardust.</p>
                            </div>
                            <button
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-4 py-6 bg-white text-[#02020a] rounded-[2rem] font-black text-lg uppercase italic tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl disabled:opacity-50"
                            >
                                {loading ? <Sparkles className="animate-spin" /> : (
                                    <>
                                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="G" />
                                        Masuk Dengan Google
                                    </>
                                )}
                            </button>
                            <div className="relative pt-4">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                                <div className="relative flex justify-center"><span className="bg-[#02020a] px-4 text-[8px] font-black text-white/20 uppercase tracking-[0.5em]">Atau Masuk Portal Lainnya Di Atas</span></div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleLogin} className="space-y-6 animate-in slide-in-from-right duration-500">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-violet-400 uppercase tracking-[0.4em] ml-2 italic">Username</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-violet-400 transition-colors">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-white/5 border-2 border-white/5 rounded-2xl pl-16 pr-6 py-5 font-bold text-white focus:border-violet-500 outline-none transition-all placeholder:text-white/10"
                                        placeholder={role === 'admin' ? "ID Admin" : "ID Partner"}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-violet-400 uppercase tracking-[0.4em] ml-2 italic">Password</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-violet-400 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/5 border-2 border-white/5 rounded-2xl pl-16 pr-6 py-5 font-bold text-white focus:border-violet-500 outline-none transition-all placeholder:text-white/10"
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
                                className="w-full group relative flex items-center justify-center gap-4 px-10 py-6 bg-violet-600 hover:bg-violet-500 text-white rounded-[2rem] font-black text-xl uppercase italic tracking-tighter transition-all shadow-3xl shadow-violet-900/40 active:scale-95 disabled:opacity-50"
                            >
                                {loading ? (
                                    <Sparkles className="animate-spin" size={24} />
                                ) : (
                                    <>
                                        Akses Portal <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        </div>
    );
};

export default Login;
