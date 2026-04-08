import React, { useState, useEffect } from "react";
import CandidateLayout from "../../layouts/CandidateLayout";
import { Users, CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react';
import api from "../../services/api";

export default function Referrals() {
    const [referrals, setReferrals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReferrals = async () => {
            try {
                const res = await api.get('/network/referrals');
                if (res.data.success) {
                    setReferrals(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch referrals:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReferrals();
    }, []);

    const hiredReferrals = referrals.filter(r => r.status === 'Hired').length;
    const inProgressReferrals = referrals.filter(r => r.status === 'Interviewing' || r.status === 'Applied' || r.status === 'Sent' || r.status === 'Viewed').length;

    return (
        <CandidateLayout>
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-8">
                <div className="max-w-[700px]">
                    <h3 className="text-[10px] tracking-widest font-bold text-slate-400 dark:text-slate-500 uppercase mb-3">REFERRAL PORTAL</h3>
                    <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4 font-serif">Referral Tracking</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
                        Manage your network recommendations, track their progress, and build your community reputation score.
                    </p>
                </div>
                
                <div className="flex gap-4">
                    <button className="bg-slate-900 border border-slate-800 dark:bg-slate-800 dark:border-slate-700 text-white rounded-xl py-4 px-8 text-xs uppercase font-bold tracking-widest hover:bg-slate-800 dark:hover:bg-slate-700 transition shadow-sm w-full md:w-auto">
                        REFER CANDIDATE
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] p-6 rounded-2xl flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-3xl font-black text-slate-900 dark:text-white leading-none mb-2">{referrals.length}</p>
                        <p className="text-[10px] tracking-widest font-bold text-slate-400 dark:text-slate-500 uppercase">TOTAL REFERRALS</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>
                
                <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] p-6 rounded-2xl flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-3xl font-black text-slate-900 dark:text-white leading-none mb-2">{inProgressReferrals}</p>
                        <p className="text-[10px] tracking-widest font-bold text-slate-400 dark:text-slate-500 uppercase">IN PROGRESS (INTERVIEW)</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                </div>

                <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] p-6 rounded-2xl flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-3xl font-black text-emerald-600 dark:text-emerald-500 leading-none mb-2">{hiredReferrals}</p>
                        <p className="text-[10px] tracking-widest font-bold text-slate-400 dark:text-slate-500 uppercase">SUCCESSFUL HIRES</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                </div>
            </div>

            {/* Referrals List */}
            <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-2xl shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-sm font-bold tracking-widest text-slate-800 dark:text-slate-200 uppercase">ACTIVE REFERRALS</h3>
                </div>
                
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {loading ? (
                        <div className="px-8 py-10 text-center text-slate-500 font-medium">Loading referrals...</div>
                    ) : referrals.length === 0 ? (
                        <div className="px-8 py-10 text-center text-slate-500 font-medium">You haven't referred anyone yet.</div>
                    ) : (
                        referrals.map((ref) => {
                            const isSuccess = ref.status === 'Hired';
                            const isPending = ref.status === 'Sent' || ref.status === 'Viewed';
                            let color = 'text-blue-600 dark:text-blue-400';
                            let bg = 'bg-blue-50 dark:bg-blue-900/20';
                            
                            if (isSuccess) {
                                color = 'text-emerald-600 dark:text-emerald-400';
                                bg = 'bg-emerald-50 dark:bg-emerald-900/20';
                            } else if (isPending) {
                                color = 'text-amber-600 dark:text-amber-400';
                                bg = 'bg-amber-50 dark:bg-amber-900/20';
                            }

                            return (
                                <div key={ref._id} className="px-8 py-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(ref.referredName || ref.referredEmail)}&background=0F172A&color=fff&bold=true`} alt={ref.referredName} className="w-full h-full object-cover"/>
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 dark:text-white mb-1">{ref.referredName || ref.referredEmail}</p>
                                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{ref.jobTitle || 'General Referral'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-6">
                                        <span className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${color} ${bg}`}>
                                            {ref.status}
                                        </span>
                                        <button className="text-slate-400 hover:text-blue-600 transition">
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </CandidateLayout>
    );
}
