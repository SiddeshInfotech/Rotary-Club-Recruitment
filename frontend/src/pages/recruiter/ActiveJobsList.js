import React, { useState, useEffect, useCallback } from "react";
import RecruiterLayout from "../../layouts/RecruiterLayout";
import { Link } from "react-router-dom";
import { Plus, Edit2, PauseCircle, XCircle, Lightbulb, PlayCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function ActiveJobsList() {
    const [activeJobs, setActiveJobs] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [activeTab, setActiveTab] = useState("Active");

    const fetchJobsList = useCallback(async () => {
        try {
            const jobsRes = await api.get(`/dashboard/jobs?status=${activeTab}`);
            if (jobsRes.data.success) {
                setActiveJobs(jobsRes.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch jobs:", error);
        }
    }, [activeTab]);

    useEffect(() => {
        const loadInitialJobs = async () => {
            setLoadingJobs(true);
            await fetchJobsList();
            setLoadingJobs(false);
        };
        loadInitialJobs();
    }, [fetchJobsList]);

    const handlePauseJob = async (jobId) => {
        try {
            const res = await api.patch(`/jobs/${jobId}/pause`);
            if (res.data.success) {
                await fetchJobsList();
            } else {
                alert("Failed: " + res.data.message);
            }
        } catch (error) {
            console.error("Failed to pause job:", error);
            alert("Failed to pause job. " + (error.response?.data?.message || error.message));
        }
    };

    const handleCloseJob = async (jobId) => {
        if (!window.confirm("Are you sure you want to close this job?")) return;
        
        try {
            const res = await api.put(`/jobs/${jobId}`, { status: "Closed" });
            if (res.data.success) {
                await fetchJobsList();
            } else {
                alert("Failed: " + res.data.message);
            }
        } catch (error) {
            console.error("Failed to close job:", error);
            alert("Failed to close job. " + (error.response?.data?.message || error.message));
        }
    };

    // Helper to format time ago
    const getTimeAgo = (dateString, objectId) => {
        let date;
        if (dateString) {
            date = new Date(dateString);
        } else if (objectId) {
            date = new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
        } else {
            return '1 day ago';
        }

        const diffInSeconds = Math.floor((new Date() - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        
        const diffMinutes = Math.floor(diffInSeconds / 60);
        if (diffMinutes < 60) return `${diffMinutes} min${diffMinutes > 1 ? 's' : ''} ago`;
        
        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
        
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 14) return '1 week ago';
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 60) return '1 month ago';
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    // Helper to get initials (Prioritizes Job Title so each job looks unique!)
    const getInitials = (title) => {
        const text = title || "Job";
        const words = text.split(' ').filter(w => w.length > 0);
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return text.substring(0, 2).toUpperCase();
    };

    return (
        <RecruiterLayout>
            <div className="flex flex-col gap-8 max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="flex justify-between items-center bg-white dark:bg-[#131b2f] rounded-[20px] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                    <div>
                        <h1 className="text-[28px] font-bold text-slate-900 dark:text-white mb-2">Job Listings</h1>
                        <p className="text-[15px] text-slate-500 dark:text-slate-400">
                            Manage your {activeJobs.length} {activeTab.toLowerCase()} open roles and review their performance.
                        </p>
                    </div>
                    <div className="hidden md:flex items-center gap-3 bg-[#eef5fe] dark:bg-[#0070f3]/10 px-5 py-3 rounded-xl border border-[#0070f3]/10">
                        <div className="bg-[#0070f3] text-white p-2 rounded-lg shadow-sm">
                            <Lightbulb className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold tracking-widest text-[#0070f3] dark:text-[#3b82f6] uppercase mb-0.5">Quick Tip</p>
                            <p className="text-[13px] text-slate-700 dark:text-slate-300 font-medium">Teams with high EQ match see 40% higher retention.</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-slate-200 dark:border-slate-800 px-2">
                    {["Active", "Paused", "Closed"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 px-2 text-[13px] font-bold tracking-widest uppercase transition-colors relative ${activeTab === tab ? 'text-[#0070f3] dark:text-[#3b82f6]' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0070f3] dark:bg-[#3b82f6] rounded-t-full"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Job List */}
                <div className="flex flex-col gap-6">
                    {loadingJobs ? (
                        <div className="text-center py-16 text-slate-500 font-medium">Loading {activeTab.toLowerCase()} jobs...</div>
                    ) : activeJobs.length === 0 ? (
                        <div className="text-center py-16 bg-white dark:bg-[#131b2f] rounded-[20px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-2">
                                <Plus className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No {activeTab.toLowerCase()} jobs found</h3>
                            <p className="text-slate-500">You don't have any {activeTab.toLowerCase()} job listings right now.</p>
                            {activeTab === "Active" && (
                                <Link to="/recruiter/post-job" className="text-[#0070f3] font-semibold hover:underline mt-2">
                                    Create your first listing &rarr;
                                </Link>
                            )}
                        </div>
                    ) : (
                        activeJobs.map((job) => (
                            <div key={job._id} className="bg-white dark:bg-[#131b2f] rounded-[20px] p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-8 justify-between hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                                
                                {/* Left Side: Details */}
                                <div className="flex-1">
                                    <div className="flex gap-5 items-center mb-6">
                                        <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-[20px] flex items-center justify-center text-[18px] font-bold text-slate-400 dark:text-slate-500 tracking-wider flex-shrink-0">
                                            {getInitials(job.title)}
                                        </div>
                                        <div>
                                            <h3 className="text-[22px] font-bold text-slate-900 dark:text-white mb-1">{job.title}</h3>
                                            <p className="text-[15px] text-slate-500 dark:text-slate-400">
                                                {job.type} · {job.locationType} • Posted {getTimeAgo(job.createdAt, job._id)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stats line */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                            <div className="text-[11px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase mb-1">Status</div>
                                            <div className="font-bold text-[#0070f3] dark:text-[#3b82f6]">{job.status}</div>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                            <div className="text-[11px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase mb-1">Applications</div>
                                            <div className="font-bold text-slate-900 dark:text-white">{job.applications}</div>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 col-span-2">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="text-[11px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">Top EQ Match</div>
                                                <div className="text-[11px] font-bold text-slate-900 dark:text-white">{job.topEqMatch}%</div>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                                                <div className="bg-[#0070f3] h-1.5 rounded-full transition-all duration-1000" style={{ width: `${job.topEqMatch}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Actions */}
                                <div className="flex flex-col gap-3 min-w-[200px] justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-8">
                                    <Link to={`/recruiter/search?jobId=${job._id}`} className="bg-[#eef5fe] dark:bg-[#0070f3]/10 text-[#0070f3] dark:text-[#3b82f6] px-6 py-3 rounded-lg font-semibold hover:bg-[#e1edfd] dark:hover:bg-[#0070f3]/20 transition-colors text-center w-full">
                                        Review Candidates
                                    </Link>
                                    
                                    {job.status !== "Closed" && (
                                        <div className="grid grid-cols-3 gap-2 mt-2">
                                            <Link to={`/recruiter/edit-job/${job._id}`} className="flex flex-col items-center justify-center p-2 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors" title="Edit Job">
                                                <Edit2 className="w-4 h-4 mb-1" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Edit</span>
                                            </Link>
                                            
                                            {job.status === "Paused" ? (
                                                <button onClick={() => handlePauseJob(job._id)} className="flex flex-col items-center justify-center p-2 rounded-lg text-slate-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 transition-colors" title="Resume Job">
                                                    <PlayCircle className="w-4 h-4 mb-1" />
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Resume</span>
                                                </button>
                                            ) : (
                                                <button onClick={() => handlePauseJob(job._id)} className="flex flex-col items-center justify-center p-2 rounded-lg text-slate-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 transition-colors" title="Pause Job">
                                                    <PauseCircle className="w-4 h-4 mb-1" />
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Pause</span>
                                                </button>
                                            )}

                                            <button onClick={() => handleCloseJob(job._id)} className="flex flex-col items-center justify-center p-2 rounded-lg text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors" title="Close Job">
                                                <XCircle className="w-4 h-4 mb-1" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Close</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                            </div>
                        ))
                    )}
                </div>
            </div>
        </RecruiterLayout>
    );
}
