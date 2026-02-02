import React, { useState, useEffect } from 'react';
import {
    Download, Calendar, BarChart3, TrendingUp,
    ArrowLeft, PieChart, Activity, FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dbGetStats } from '../services/adsManagementService';

const PartnerReports: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const data = await dbGetStats();
            setStats(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const exportToCSV = () => {
        const headers = ['Date', 'Impressions', 'Clicks', 'CTR', 'Spend'];
        const rows = stats.map(s => [
            s.date,
            s.impressions,
            s.clicks,
            ((s.clicks / s.impressions) * 100).toFixed(2) + '%',
            '$' + s.spend
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `sampahku_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="min-h-screen bg-[#02020a] text-white p-6 lg:p-12">
            <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                <div className="space-y-4">
                    <button onClick={() => navigate('/partner/dashboard')} className="inline-flex items-center gap-2 text-violet-400 hover:text-white transition-colors font-black uppercase tracking-widest text-[10px] italic">
                        <ArrowLeft size={14} /> Back to Hub
                    </button>
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">Statistical <span className="text-violet-400">Reports.</span></h1>
                </div>
                <button
                    onClick={exportToCSV}
                    className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center gap-3"
                >
                    <Download size={18} /> Export CSV Datastream
                </button>
            </header>

            <main className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 gap-10">
                    {/* Main Analytics Table */}
                    <div className="bg-[#0A0A15] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in duration-700">
                        <div className="p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <Activity className="text-violet-400" size={24} />
                                <h3 className="text-xl font-black italic uppercase tracking-tighter">Daily Performance Metrics</h3>
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2 border border-white/5">
                                <Calendar size={14} className="text-white/20" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Last 30 Dynamic Cycles</span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5 text-[10px] font-black text-white/30 uppercase tracking-[0.3em] bg-white/[0.01]">
                                        <th className="p-8">Phase Date</th>
                                        <th className="p-8">Impressions</th>
                                        <th className="p-8">Engagement</th>
                                        <th className="p-8">CTR %</th>
                                        <th className="p-8 text-right">Spend Allocation</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {stats.map((s, idx) => (
                                        <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="p-8 font-mono text-sm text-white/40 group-hover:text-white transition-colors">{s.date}</td>
                                            <td className="p-8 font-black italic text-xl tracking-tighter">{s.impressions.toLocaleString()}</td>
                                            <td className="p-8 font-black italic text-xl tracking-tighter text-violet-400">{s.clicks}</td>
                                            <td className="p-8 font-bold text-sm text-emerald-400 italic">
                                                {((s.clicks / s.impressions) * 100).toFixed(2)}%
                                            </td>
                                            <td className="p-8 text-right font-mono text-white/40 font-bold">
                                                ${s.spend.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {stats.length === 0 && !isLoading && (
                            <div className="py-20 text-center text-white/10 italic font-black uppercase tracking-widest">
                                <BarChart3 className="mx-auto mb-4 opacity-5" size={48} />
                                No telemetry detected in this sector.
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PartnerReports;
