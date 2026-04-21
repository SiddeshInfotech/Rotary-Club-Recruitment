import React, { useState, useEffect } from "react";
import RecruiterLayout from "../../layouts/RecruiterLayout";
import { Search, Filter, MapPin, Briefcase, Star, ChevronDown } from "lucide-react";
import api from "../../services/api";

export default function CandidateSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                // Try the dashboard candidates endpoint first (your endpoint)
                const res = await api.get('/candidates');
                if (res.data.success || res.data.data) {
                    setCandidates(res.data.data || []);
                }
            } catch (err) {
                console.error("Failed to fetch candidates:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCandidates();
    }, []);

    const filteredCandidates = candidates.filter(c => {
        const name = (c.name || '').toLowerCase();
        const title = (c.title || '').toLowerCase();
        const q = searchQuery.toLowerCase();
        return name.includes(q) || title.includes(q);
    });

    const sortedCandidates = [...filteredCandidates].sort((a, b) => {
        // Primary sort: Premium users first
        if (a.isPremium && !b.isPremium) return -1;
        if (!a.isPremium && b.isPremium) return 1;

        // Secondary sort: EQ score descending
        const scoreA = a.eqScores?.aggregate || a.overallEqScore || 0;
        const scoreB = b.eqScores?.aggregate || b.overallEqScore || 0;
        return scoreB - scoreA;
    });

    return (
        <RecruiterLayout>
            <div className="space-y-6 pb-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1a2b4b] dark:text-white">Candidate Search</h1>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Find the perfect matches based on skills and EQ.</p>
                    </div>
                </div>

                {/* Search Bar and Filters */}
                <div className="bg-white dark:bg-[#131b2f] p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name or role..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                            <span className="hidden sm:inline">Role Filter</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                            <Filter className="w-4 h-4" />
                            <span className="hidden sm:inline">More Filters</span>
                        </button>
                    </div>
                </div>

                {/* Result count */}
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {loading ? 'Loading...' : `${sortedCandidates.length} candidate${sortedCandidates.length !== 1 ? 's' : ''} found`}
                </p>

                {/* Candidate Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-3 text-center py-12 text-slate-500 font-medium">Loading candidates...</div>
                    ) : sortedCandidates.length === 0 ? (
                        <div className="col-span-3 text-center py-12 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
                            <p className="text-slate-500 dark:text-slate-400 font-medium">No candidates found.</p>
                        </div>
                    ) : (
                        sortedCandidates.map(candidate => {
                            const eqScore = candidate.eqScores?.aggregate || candidate.overallEqScore || 0;
                            const avatarUrl = candidate.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=0d1b2a&color=67e8f9`;
                            const isElite = eqScore >= 90;

                            const isPremium = candidate.isPremium;

                            return (
                                <div key={candidate._id} className={`bg-white dark:bg-[#131b2f] rounded-xl border ${isPremium ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.2)] dark:border-yellow-500' : isElite ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.15)] dark:border-amber-500' : 'border-gray-200 dark:border-slate-800 hover:border-cyan-200 dark:hover:border-cyan-800'} p-5 relative overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
                                    
                                    {isPremium && (
                                        <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg shadow-sm z-10 flex items-center gap-1">
                                            <span>⭐ PREMIUM</span>
                                        </div>
                                    )}
                                    {!isPremium && isElite && (
                                        <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg shadow-sm z-10 flex items-center gap-1">
                                            <span>⭐ Top 1% Match</span>
                                        </div>
                                    )}
                                    <div className="flex items-start justify-between mt-2">
                                        <div className="flex gap-4">
                                            <img src={avatarUrl} alt={candidate.name} className="w-14 h-14 rounded-full border-2 border-gray-100 dark:border-slate-700" />
                                            <div>
                                                <h3 className="font-bold text-[#1a2b4b] dark:text-white cursor-pointer hover:text-cyan-600 transition-colors">{candidate.name}</h3>
                                                <p className="text-sm text-gray-600 dark:text-slate-400 font-medium">{candidate.title || 'Candidate'}</p>
                                            </div>
                                        </div>
                                        {eqScore > 0 && (
                                            <div className={`w-[42px] h-[42px] flex flex-col items-center justify-center rounded-full border-[2px] ${isElite ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20' : 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'}`}>
                                                <span className={`text-xs font-bold leading-none ${isElite ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{eqScore}%</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="mt-4 space-y-2">
                                        {candidate.skills && candidate.skills.length > 0 && (
                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
                                                <Briefcase className="w-4 h-4 text-gray-400" />
                                                {candidate.skills.slice(0, 3).join(', ')}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-800 flex gap-2 flex-wrap">
                                        {candidate.skills && candidate.skills.slice(0, 3).map((skill, idx) => (
                                            <span key={idx} className="px-2.5 py-1 text-[11px] font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-md border border-blue-100 dark:border-blue-800">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-5 flex gap-2">
                                        <button className="flex-1 bg-[#1a2b4b] dark:bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#243a5e] dark:hover:bg-blue-500 transition-colors">View Profile</button>
                                        <button className="p-2 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-cyan-600 transition-colors">
                                            <Star className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </RecruiterLayout>
    );
}
