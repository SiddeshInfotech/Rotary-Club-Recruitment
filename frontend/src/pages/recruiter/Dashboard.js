import RecruiterLayout from "../../layouts/RecruiterLayout";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import api from "../../services/api";

export default function RecruiterDashboard() {
    const { user } = useAuth();
    const firstName = user?.firstName || 'there';

    const [activeJobs, setActiveJobs] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [pipelineStats, setPipelineStats] = useState({
        activeJobs: 0,
        totalApplications: 0,
        shortlisted: 0,
        avgEqMatch: 0
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [jobsRes, statsRes] = await Promise.all([
                    api.get("/dashboard/jobs"),
                    api.get("/dashboard/stats")
                ]);
                
                if (jobsRes.data.success) {
                    setActiveJobs(jobsRes.data.data);
                }
                if (statsRes.data.success) {
                    setPipelineStats(statsRes.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoadingJobs(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Helper to format time ago
    const getTimeAgo = (dateString, objectId) => {
        let date;
        if (dateString) {
            date = new Date(dateString);
        } else if (objectId) {
            // Extract timestamp from MongoDB ObjectId
            date = new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
        } else {
            return '1 day ago'; // Fallback
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
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
                
                {/* Main Content (Left Column) */}
                <div className="flex flex-col gap-10">
                    
                    {/* Welcome Banner */}
                    <div className="bg-[#124a73] rounded-[20px] p-10 text-white shadow-sm flex flex-col gap-6" style={{ background: 'linear-gradient(135deg, #1b283b 0%, #0d62a6 100%)' }}>
                        <div>
                            <h1 className="text-[32px] font-bold mb-4">Welcome back, {firstName}</h1>
                            {/* <p className="text-white/90 text-[17px] max-w-2xl leading-relaxed">
                                Here is the overview of your active candidates and recent EQ matches across your open roles. You have 12 new matches waiting for review.
                            </p>*/}
                        </div>
                        <div className="flex gap-4 mt-2">
                            {/* <Link to="/recruiter/search" className="bg-white text-[#0d62a6] px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-50 transition-colors text-center inline-block">
                                View Matches
                            </Link> */}
                            <Link to="/recruiter/post-job" className="bg-transparent border border-white/30 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-white/10 transition-colors text-center flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" /> Post a Job
                            </Link>
                        </div>
                    </div>

                    {/* Active Job Listings */}
                    <div>
                        <div className="flex justify-between items-center mb-6 px-1">
                            <h2 className="text-[13px] font-bold tracking-widest text-slate-900 dark:text-white uppercase">ACTIVE JOB LISTINGS</h2>
                            <Link to="/recruiter/jobs" className="text-xs font-bold text-[#0070f3] dark:text-[#3b82f6] uppercase tracking-widest hover:underline">
                                VIEW ALL
                            </Link>
                        </div>
                        
                        <div className="flex flex-col gap-6">
                            {loadingJobs ? (
                                <div className="text-center py-10 text-slate-500">Loading active jobs...</div>
                            ) : activeJobs.length === 0 ? (
                                <div className="text-center py-10 text-slate-500">No active jobs found. Post a job to get started!</div>
                            ) : activeJobs.slice(0, 3).map((job) => (
                                <div key={job._id} className="bg-white dark:bg-[#131b2f] rounded-[20px] p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-8">
                                    {/* Header */}
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-5 items-center">
                                            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-[20px] flex items-center justify-center text-[18px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                                                {getInitials(job.title)}
                                            </div>
                                            <div>
                                                <h3 className="text-[22px] font-bold text-slate-900 dark:text-white mb-1">{job.title}</h3>
                                                <p className="text-[15px] text-slate-500 dark:text-slate-400">
                                                    {job.type} · {job.locationType} • Posted {getTimeAgo(job.createdAt, job._id)}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="bg-[#eef5fe] dark:bg-[#0070f3]/10 text-[#0070f3] dark:text-[#3b82f6] text-xs font-bold px-4 py-2 rounded-full tracking-wider uppercase">
                                            {job.status}
                                        </span>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-[11px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">APPLICANT QUALITY</span>
                                            <span className="text-[11px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">{job.topEqMatch}% TOP MATCH</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-8">
                                            <div className="bg-[#0070f3] h-2 rounded-full transition-all duration-1000" style={{ width: `${job.topEqMatch}%` }}></div>
                                        </div>
                                        
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{job.applications} Total Applications</span>
                                            <Link to={`/recruiter/search?jobId=${job._id}`} className="bg-[#eef5fe] dark:bg-[#0070f3]/10 text-[#0070f3] dark:text-[#3b82f6] px-6 py-2.5 rounded-lg font-semibold hover:bg-[#e1edfd] dark:hover:bg-[#0070f3]/20 transition-colors inline-block">
                                                Review Candidates
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Sidebar */}
                <div className="flex flex-col gap-10">
                    
                    {/* Pipeline Overview */}
                    <div className="bg-white dark:bg-[#131b2f] rounded-[20px] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[13px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">PIPELINE OVERVIEW</h2>
                            <span className="text-[32px] text-[#0070f3] dark:text-[#3b82f6]">{pipelineStats.totalApplications}</span>
                        </div>
                        
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">Active Jobs</span>
                                <span className="font-bold text-slate-800 dark:text-white">{pipelineStats.activeJobs}</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-2">
                                <div className="bg-[#0070f3] h-1.5 rounded-full" style={{ width: '100%' }}></div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">Total Apps</span>
                                <span className="font-bold text-slate-800 dark:text-white">{pipelineStats.totalApplications}</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-2">
                                <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">Shortlisted</span>
                                <span className="font-bold text-slate-800 dark:text-white">{pipelineStats.shortlisted}</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-2">
                                <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${pipelineStats.totalApplications > 0 ? (pipelineStats.shortlisted / pipelineStats.totalApplications) * 100 : 0}%` }}></div>
                            </div>
                        </div>

                        <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed mb-6 mt-6 font-medium">
                            Your pipeline is healthy with an average EQ match rate of {pipelineStats.avgEqMatch}% across all positions.
                        </p>

                        <Link to="/recruiter/search" className="text-sm font-bold text-[#0070f3] dark:text-[#3b82f6] hover:underline flex items-center gap-2">
                            View Pipeline Analytics
                            <span className="text-lg leading-none">&rarr;</span>
                        </Link>
                    </div>

                    {/* Top Matches */}
                    <div>
                        <div className="flex items-center gap-3 mb-4 px-1">
                            <h2 className="text-[13px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">TOP MATCHES</h2>
                            <span className="text-[9px] font-bold text-white tracking-widest uppercase bg-[#0070f3] px-2 py-0.5 rounded-md">NEW</span>
                        </div>
                        <div className="flex flex-col gap-3 mb-6">
                            {[
                                { name: "Sarah Chen", type: "Empathetic Leader", match: 89, avatarName: "Sarah+Chen" },
                                { name: "Marcus Johnson", type: "Strategic Thinker", match: 82, avatarName: "Marcus+Johnson" },
                                { name: "Emily Rodriguez", type: "Creative Innovator", match: 76, avatarName: "Emily+Rodriguez" }
                            ].map((candidate, idx) => (
                                <div key={idx} className="bg-white dark:bg-[#131b2f] rounded-[16px] p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                                            <img src={`https://ui-avatars.com/api/?name=${candidate.avatarName}&background=f1f5f9&color=0f172a&bold=true`} alt="User" className="w-full h-full object-cover dark:opacity-80" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[14px] text-slate-900 dark:text-white mb-0.5">{candidate.name}</h3>
                                            <p className="text-[12px] text-slate-500 dark:text-slate-400">{candidate.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-[#0070f3] dark:text-[#3b82f6] text-sm">{candidate.match}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center">
                            <Link to="/recruiter/search" className="text-[11px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase hover:text-slate-800 dark:hover:text-white transition-colors">
                                VIEW FULL DIRECTORY
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </RecruiterLayout>
    );
}
