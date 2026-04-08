import React, { useState, useEffect } from "react";
import CandidateLayout from "../../layouts/CandidateLayout";
import { ChevronDown, Search, Users } from 'lucide-react';
import api from "../../services/api";

export default function Matches() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Fetching all jobs to treat as 'Matches' locally or from a recommendation endpoint if we had one.
                // Reusing GET /api/jobs for now and picking top ones.
                const res = await api.get('/jobs');
                if (res.data.success || Array.isArray(res.data.data) || Array.isArray(res.data)) {
                    let jobsList = Array.isArray(res.data) ? res.data : (res.data.data || []);
                    // Filter to pretend they are high resonance matches
                    setJobs(jobsList.slice(0, 5));
                }
            } catch (err) {
                console.error("Failed to fetch matches", err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    return (
        <CandidateLayout>
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
                <div className="max-w-[700px]">
                    <h3 className="text-[10px] tracking-widest font-bold text-slate-400 dark:text-slate-500 uppercase mb-3">CURATED OPPORTUNITIES</h3>
                    <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4 font-serif">Curated Matches</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
                        Intelligent matching based on cognitive resonance and community prestige within the Rotary, Lions, and BNI ecosystems.
                    </p>
                </div>
                
                <div className="flex gap-4">
                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] px-6 py-4 rounded-2xl flex flex-col items-center justify-center shadow-sm">
                        <span className="text-3xl font-black text-slate-900 dark:text-white leading-none mb-2">{jobs.length}</span>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">AVAILABLE MATCHES</span>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full">
                <div className="flex-1 min-w-[200px] relative">
                    <select className="w-full appearance-none bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] text-sm font-semibold text-slate-700 dark:text-slate-300 py-3.5 pl-5 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm cursor-pointer transition">
                        <option>All Communities</option>
                        <option>Rotary Club</option>
                        <option>Lions Club</option>
                        <option>BNI Network</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="flex-1 min-w-[200px] relative">
                    <select className="w-full appearance-none bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] text-sm font-semibold text-slate-700 dark:text-slate-300 py-3.5 pl-5 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm cursor-pointer transition">
                        <option>Industry Focus</option>
                        <option>Technology</option>
                        <option>Finance</option>
                        <option>Operations</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="flex-1 min-w-[200px] relative">
                    <select className="w-full appearance-none bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] text-sm font-semibold text-slate-700 dark:text-slate-300 py-3.5 pl-5 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm cursor-pointer transition">
                        <option>Global Location</option>
                        <option>EMEA</option>
                        <option>North America</option>
                        <option>Remote</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <button className="bg-slate-900 border border-slate-800 dark:bg-slate-800 dark:border-slate-700 text-white rounded-xl py-3.5 px-8 text-xs uppercase font-bold tracking-widest hover:bg-slate-800 dark:hover:bg-slate-700 transition shadow-sm w-full md:w-auto">
                    APPLY
                </button>
            </div>

            {/* Grid Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {loading ? (
                    <div className="col-span-1 lg:col-span-2 text-center py-12 text-slate-500">Finding your perfect matches...</div>
                ) : jobs.length === 0 ? (
                    <div className="col-span-1 lg:col-span-2 text-center py-12 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl text-slate-500">No high-resonance matches found at this time.</div>
                ) : (
                    jobs.map(job => {
                        const resonance = Math.floor(Math.random() * 15 + 80); // Simulate resonance
                        return (
                        <div key={job._id} className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-8 flex flex-col justify-between shadow-sm dark:shadow-none hover:shadow-md transition">
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 text-slate-600 dark:text-slate-400">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-1">{job.companyName || job.company}</p>
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none">{job.title}</h3>
                                        </div>
                                    </div>
                                    {/* Circular Rate */}
                                    <div className="relative w-14 h-14 flex-shrink-0">
                                        <svg viewBox="0 0 36 36" className="w-full h-full text-blue-600 drop-shadow-sm">
                                            <path className="text-slate-200 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                            <path className="text-blue-600 dark:text-blue-500" strokeDasharray={`${resonance}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                                            <span className="text-sm font-bold text-slate-900 dark:text-white leading-none">{resonance}%</span>
                                            <span className="text-[6px] tracking-widest font-black uppercase text-slate-400 dark:text-slate-500 scale-75 leading-none">RESONANCE</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-6 line-clamp-2">
                                    {job.description || "Looking for a leader with high empathic intelligence to bridge goals with scalability."}
                                </p>

                                <div className="flex gap-2 mb-8 flex-wrap">
                                    <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400">{job.location || 'REMOTE'}</span>
                                    <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400">{job.salary || 'COMPETITIVE'}</span>
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-[#0b1121] border border-slate-100 dark:border-[#1e293b] p-4 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex-shrink-0 overflow-hidden">
                                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(job.contactEmail || 'HR')}&background=0F172A&color=fff&bold=true`} alt="HR" className="w-full h-full object-cover"/>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-900 dark:text-white leading-tight">{job.contactEmail || 'Hiring Team'}</p>
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Talent Acquisition</p>
                                    </div>
                                </div>
                                <button className="bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-200 dark:hover:bg-cyan-900/60 px-5 py-2.5 rounded-lg text-[10px] uppercase tracking-widest font-bold transition">
                                    ENGAGE
                                </button>
                            </div>
                        </div>
                    )})
                )}

                {/* Premium Spotlight Card */}
                <div className="bg-slate-900 dark:bg-[#0f172a] border border-slate-800 dark:border-[#1e293b] rounded-2xl p-10 flex flex-col justify-between shadow-lg relative overflow-hidden group">
                    {/* Background faint glow / shape */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 dark:bg-blue-600/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
                    
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-4">PREMIUM SPOTLIGHT</p>
                        <h3 className="text-3xl font-black text-white leading-none mb-6 font-serif">Curated Board <br/>Member Search</h3>
                        
                        <p className="text-sm text-slate-300 leading-relaxed font-medium mb-10 max-w-md">
                            Your EQ profile suggests a strong fit for Non-Executive Director roles within the Lions Foundation.
                        </p>
                    </div>

                    <button className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-4 rounded-xl text-xs uppercase tracking-widest font-black transition shadow-sm w-max">
                        VIEW INVITATION
                    </button>
                </div>
            </div>
        </CandidateLayout>
    );
}
