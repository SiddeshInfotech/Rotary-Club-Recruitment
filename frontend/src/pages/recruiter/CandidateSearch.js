import React, { useState, useEffect } from "react";
import RecruiterLayout from "../../layouts/RecruiterLayout";
import { Search, Filter, MapPin, Briefcase, Star, ChevronDown, CheckCircle, Target, Sparkles } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function CandidateSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState("All Roles");
    const [minMatchScore, setMinMatchScore] = useState(0);
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);
    const [showMoreFiltersDropdown, setShowMoreFiltersDropdown] = useState(false);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const jobId = searchParams.get("jobId");
    
    const [applications, setApplications] = useState([]);
    const [allJobs, setAllJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const closeDropdowns = (e) => {
            if (!e.target.closest('.filter-dropdown')) {
                setShowRoleDropdown(false);
                setShowMoreFiltersDropdown(false);
            }
        };
        document.addEventListener('click', closeDropdowns);
        return () => document.removeEventListener('click', closeDropdowns);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = jobId ? `/applications?jobId=${jobId}` : `/applications`;
                const [appRes, jobsRes] = await Promise.all([
                    api.get(url),
                    api.get("/dashboard/jobs?status=All")
                ]).catch(err => {
                    console.error("Error fetching data parallelly", err);
                    return [null, null]; // Provide fallback so we can still try to handle what we can
                });
                
                if (appRes && appRes.data.success) {
                    setApplications(appRes.data.data);
                } else if (!appRes) { // fallback
                     const fallbackRes = await api.get(url);
                     if (fallbackRes.data.success) setApplications(fallbackRes.data.data);
                }

                if (jobsRes && jobsRes.data.success) {
                    setAllJobs(jobsRes.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch applications and jobs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [jobId]);

    // Extract unique roles from applications AND recruiter's posted jobs
    const applicationRoles = applications.map(app => app.jobId?.title);
    const postedRoles = allJobs.map(job => job.title);
    const uniqueRoles = ["All Roles", ...new Set([...applicationRoles, ...postedRoles].filter(Boolean))];

    // Filter Candidates based on Search, Role, and Match Score
    const filteredCandidates = applications.filter(app => {
        const candidateName = app.candidateId?.name || "";
        const role = app.jobId?.title || "";
        const skills = app.candidateId?.skills || [];
        
        // 1. Text Search
        const matchesSearch = 
               candidateName.toLowerCase().includes(searchQuery.toLowerCase()) || 
               role.toLowerCase().includes(searchQuery.toLowerCase()) ||
               skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

        // 2. Role Filter
        const matchesRole = selectedRole === "All Roles" || role === selectedRole;

        // 3. Match Score Filter
        const matchScore = app.eqMatchScore !== undefined ? app.eqMatchScore : -1;
        const matchesScore = minMatchScore === 0 || matchScore >= minMatchScore;

        return matchesSearch && matchesRole && matchesScore;
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
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, role, or keyword..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3 filter-dropdown relative">
                        {/* Role Filter Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setShowRoleDropdown(!showRoleDropdown); setShowMoreFiltersDropdown(false); }}
                                className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${selectedRole !== "All Roles" ? 'bg-cyan-50 border-cyan-200 text-cyan-700 dark:bg-cyan-900/20 dark:border-cyan-800 dark:text-cyan-400' : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                            >
                                <span className="hidden sm:inline whitespace-nowrap">{selectedRole === "All Roles" ? "Role Filter" : selectedRole}</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            {showRoleDropdown && (
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 py-2 z-50">
                                    {uniqueRoles.map(role => (
                                        <button 
                                            key={role}
                                            onClick={() => { setSelectedRole(role); setShowRoleDropdown(false); }}
                                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${selectedRole === role ? "font-bold text-cyan-600 dark:text-cyan-400" : "text-gray-700 dark:text-slate-300"}`}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* More Filters Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setShowMoreFiltersDropdown(!showMoreFiltersDropdown); setShowRoleDropdown(false); }}
                                className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${minMatchScore > 0 ? 'bg-cyan-50 border-cyan-200 text-cyan-700 dark:bg-cyan-900/20 dark:border-cyan-800 dark:text-cyan-400' : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                            >
                                <Filter className="w-4 h-4" />
                                <span className="hidden sm:inline whitespace-nowrap">More Filters {minMatchScore > 0 && `(>${minMatchScore}%)`}</span>
                            </button>
                            {showMoreFiltersDropdown && (
                                <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 p-4 z-50 space-y-4">
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Minimum Match Score</h4>
                                        <div className="space-y-1.5">
                                            {[0, 50, 70, 80, 90].map(score => (
                                                <button 
                                                    key={score}
                                                    onClick={() => { setMinMatchScore(score); setShowMoreFiltersDropdown(false); }}
                                                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${minMatchScore === score ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 font-bold" : "text-gray-700 dark:text-slate-300"}`}
                                                >
                                                    {score === 0 ? "Any Score" : `> ${score}% Match`}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Candidate Grid */}
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading candidates...</div>
                ) : filteredCandidates.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800">
                        No candidates found for this job yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCandidates.map(app => {
                            const candidate = app.candidateId;
                            const job = app.jobId;
                            if (!candidate || !job) return null;
                            const avatarName = candidate.name ? candidate.name.replace(" ", "+") : "User";
                            const avatarUrl = `https://ui-avatars.com/api/?name=${avatarName}&background=0d1b2a&color=67e8f9`;
                            
                                            const isMatchScoreValid = app.eqMatchScore !== undefined && app.eqMatchScore >= 0;
                                            
                                            return (
                                                <div key={app._id} className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 flex flex-col hover:shadow-lg hover:border-cyan-200 dark:hover:border-cyan-500/50 hover:-translate-y-1 transition-all duration-300">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex gap-4">
                                                            <img src={avatarUrl} alt={candidate.name} className="w-14 h-14 rounded-full border-2 border-gray-100" />
                                                            <div>
                                                                <h3 className="font-bold text-[#1a2b4b] dark:text-white cursor-pointer hover:text-cyan-600 transition-colors">{candidate.name || "Unknown Candidate"}</h3>
                                                                <p className="text-sm text-gray-600 dark:text-slate-400 font-medium line-clamp-1">Applied: {job.title}</p>
                                                            </div>
                                                        </div>
                                                        <div className={`w-[42px] h-[42px] flex flex-col items-center justify-center rounded-full border-[2px] shrink-0 shadow-sm ${
                                                            isMatchScoreValid 
                                                                ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-400/10" 
                                                                : "border-slate-300 bg-slate-50 dark:bg-slate-850"
                                                        }`} title={isMatchScoreValid ? "Total Fit Score" : "Not fully assessed"}>
                                                            <span className={`text-xs font-bold leading-none ${
                                                                isMatchScoreValid ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"
                                                            }`}>{isMatchScoreValid ? `${app.eqMatchScore}%` : "N/A"}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* AI Insights Section */}
                                                    <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-4 mb-4 flex-1 border border-blue-100/50 dark:border-blue-800/30">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Sparkles className="w-4 h-4 text-blue-500" />
                                                            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">AI Match Insights</span>
                                                        </div>
                                                        
                                                        <div className="flex gap-4 mb-3">
                                                            <div className="flex-1 bg-white dark:bg-slate-800 rounded p-2 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
                                                                <Target className="w-4 h-4 text-slate-400 mb-1" />
                                                                <span className="text-[10px] uppercase font-bold text-slate-500">Tech Fit</span>
                                                                <span className="text-lg font-black text-slate-700 dark:text-white">
                                                                    {app.technicalScore !== undefined && app.technicalScore >= 0 ? `${app.technicalScore}%` : "N/A"}
                                                                </span>
                                                            </div>
                                                            <div className="flex-1 bg-white dark:bg-slate-800 rounded p-2 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
                                                                <CheckCircle className="w-4 h-4 text-purple-400 mb-1" />
                                                                <span className="text-[10px] uppercase font-bold text-slate-500">EQ Fit</span>
                                                                <span className="text-lg font-black text-slate-700 dark:text-white">
                                                                    {app.eqScore !== undefined && app.eqScore >= 0 ? `${app.eqScore}%` : "N/A"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        
                                                        <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed italic">
                                                            "{app.matchReasoning || "Waiting for AI evaluation..."}"
                                                        </p>
                                                    </div>

                                    <div className="mt-auto flex gap-2">
                                        <button 
                                            onClick={() => navigate(`/recruiter/candidate/${candidate._id}?applicationId=${app._id}&status=${app.status || 'Pending'}`)}
                                            className="flex-1 bg-[#1a2b4b] dark:bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#243a5e] dark:hover:bg-blue-700 transition-colors shadow-sm"
                                        >
                                            View Full Profile
                                        </button>
                                        <button className="p-2 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors bg-white dark:bg-transparent shadow-sm">
                                            <Star className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </RecruiterLayout>
    );
}
