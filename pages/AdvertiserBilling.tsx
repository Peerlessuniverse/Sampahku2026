import React, { useState } from 'react';
import {
    CreditCard, Download, ExternalLink,
    ArrowLeft, History, Zap, Shield, HelpCircle,
    CheckCircle2, DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdvertiserBilling: React.FC = () => {
    const navigate = useNavigate();

    // Mock Billing Data
    const invoices = [
        { id: 'INV-2026-001', period: 'Jan 2026', amount: 152.40, status: 'PAID', date: '2026-01-15' },
        { id: 'INV-2026-002', period: 'Dec 2025', amount: 210.15, status: 'PAID', date: '2025-12-15' },
        { id: 'INV-2026-003', period: 'Nov 2025', amount: 98.20, status: 'PAID', date: '2025-11-15' },
    ];

    const currentBalance = 42.50;

    return (
        <div className="min-h-screen bg-[#02020a] text-white p-6 lg:p-12">
            <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                <div className="space-y-4">
                    <button onClick={() => navigate('/advertiser/dashboard')} className="inline-flex items-center gap-2 text-violet-400 hover:text-white transition-colors font-black uppercase tracking-widest text-[10px] italic">
                        <ArrowLeft size={14} /> Back to Hub
                    </button>
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">Financial <span className="text-violet-400">Ledger.</span></h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Balance Card */}
                    <div className="lg:col-span-1 bg-gradient-to-br from-violet-600 to-indigo-900 p-10 rounded-[3rem] shadow-2xl shadow-violet-900/40 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><Zap size={100} /></div>
                        <h3 className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em] mb-6">Manifestation Credit</h3>
                        <div className="flex items-start gap-1">
                            <span className="text-2xl font-black opacity-40 mt-2">$</span>
                            <p className="text-7xl font-black italic tracking-tighter mb-4">{currentBalance.toFixed(2)}</p>
                        </div>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-8">Pending next billing cycle: Feb 15, 2026</p>
                        <button className="w-full py-5 bg-white text-violet-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-violet-100 transition-all">
                            Add Credit Manifest
                        </button>
                    </div>

                    {/* Invoice History */}
                    <div className="lg:col-span-2 bg-[#0A0A15] border border-white/5 rounded-[3rem] p-10">
                        <div className="flex items-center gap-4 mb-10">
                            <History className="text-violet-400" size={24} />
                            <h3 className="text-xl font-black italic uppercase tracking-tighter">Billing History</h3>
                        </div>

                        <div className="space-y-4">
                            {invoices.map(inv => (
                                <div key={inv.id} className="group flex flex-col md:flex-row items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-violet-500/30 transition-all gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-black italic uppercase tracking-tight">{inv.period} Usage</h4>
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{inv.id}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-10">
                                        <div className="text-right">
                                            <p className="text-lg font-black italic tracking-tighter">${inv.amount.toFixed(2)}</p>
                                            <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">TRANSACTION SUCCESS</p>
                                        </div>
                                        <button
                                            title="Download Invoice"
                                            aria-label="Download Invoice"
                                            className="p-4 bg-white/5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
                                        >
                                            <Download size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Billing Methods */}
                <div className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="p-5 bg-violet-600/10 rounded-2xl border border-violet-500/20">
                            <CreditCard size={32} className="text-violet-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black italic uppercase tracking-tighter">Primary Manifest Method</h3>
                            <p className="text-xs font-bold text-white/40 italic">Visa ending in •••• 8842 (Expires 12/28)</p>
                        </div>
                    </div>
                    <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-black uppercase tracking-widest text-[10px] text-white/40 hover:text-white transition-all underline underline-offset-4">
                        Update Strategy
                    </button>
                </div>
            </main>
        </div>
    );
};

export default AdvertiserBilling;
