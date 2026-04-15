import { useState, useEffect } from "react";
import CandidateLayout from "../../layouts/CandidateLayout";
import { ArrowLeft, Building2, MapPin, Briefcase, Clock, ShieldCheck, Share2, Bookmark, GraduationCap, IndianRupee, Timer, Zap, Code2, Globe } from 'lucide-react'; // Added Globe icon
import { useNavigate, useParams } from 'react-router-dom';
import api from "../../services/api";

export default function JobDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [shared, setShared] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                // Fetch job details
                const res = await api.get(`/jobs/job/${id}`);
                if (res.data.success) {
                    setJob(res.data.data);
                }
                
                // Fetch saved status (ignore error if not logged in or fails)
                try {
                    const savedRes = await api.get(`/jobs/job/${id}/check-saved`);
                    if (savedRes.data.success) {
                        setIsSaved(savedRes.data.isSaved);
                    }
                } catch (e) {
                    console.error("Failed to check saved status:", e);
                }
            } catch (err) {
                console.error("Failed to fetch job:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const timeAgo = (date) => {
        if (!date) return '';
        const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
        let interval = Math.floor(seconds / 86400);
        if (interval >= 1) return interval === 1 ? "1 day ago" : `${interval} days ago`;
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return interval === 1 ? "1 hour ago" : `${interval} hours ago`;
        interval = Math.floor(seconds / 60);
        if (interval >= 1) return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;
        return "Just now";
    };

    const handleSave = async () => {
        try {
            // Optimistic UI update
            setIsSaved(!isSaved);
            
            const res = await api.post(`/jobs/job/${id}/save`);
            if (res.data.success) {
                setIsSaved(res.data.isSaved); // Sync with actual backend state
            } else {
                // Revert on failure
                setIsSaved(!isSaved);
            }
        } catch (error) {
            console.error("Error saving job:", error);
            setIsSaved(!isSaved); // Revert on error
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: job?.title || 'Job Opportunity',
                    text: `Check out this ${job?.title} position at ${job?.companyName || 'this amazing company'}!`,
                    url: window.location.href,
                });
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Error sharing:', error);
                }
            }
        } else {
            // Fallback for browsers that do not support navigator.share
            navigator.clipboard.writeText(window.location.href);
            setShared(true);
            setTimeout(() => setShared(false), 2000);
        }
    };

    if (loading) {
        return (
            <CandidateLayout>
                <div className="flex flex-col items-center justify-center py-32 text-slate-500 font-medium italic space-y-3">
                    <Zap className="w-8 h-8 text-blue-400 animate-pulse" />
                    <span>Analyzing opportunities...</span>
                </div>
            </CandidateLayout>
        );
    }

    if (!job) {
        return (
            <CandidateLayout>
                <div className="text-center py-24 px-6 bg-white dark:bg-[#131b2f] rounded-3xl border border-slate-200 dark:border-[#1e293b]">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">Job Post Has Vanished</h2>
                    <p className="text-slate-600 dark:text-slate-300 mb-8 font-medium max-w-md mx-auto">This position may have been filled, or the recruiter may have retracted the offer.</p>
                    <button onClick={() => navigate('/job-search')} className="bg-slate-900 dark:bg-blue-600 text-white px-8 py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/10 transition hover:scale-105 active:scale-95">Return to Market</button>
                </div>
            </CandidateLayout>
        );
    }

    return (
        <CandidateLayout>
            {/* Back Navigation */}
            <div className="mb-6">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm font-black text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-500 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Search
                </button>
            </div>

            {/* Header / Hero Section */}
            <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-3xl p-8 md:p-10 mb-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl flex items-center justify-center flex-shrink-0 p-4">
                            <Building2 className="w-10 h-10 text-blue-600 dark:text-blue-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-950 dark:text-white tracking-tight mb-2">{job.title}</h1>
                            
                            {/* LOGIC UPDATE: DYNAMIC COMPANY NAME & LINK */}
                            <div className="flex items-center gap-2 mb-4">
                                <p className="text-lg font-bold text-slate-600 dark:text-slate-300">
                                    {job.companyName || "Independent Recruiter"}
                                </p>
                                <ShieldCheck className="w-5 h-5 text-blue-500" />
                                
                                {job.companyWebsite && (
                                    <a 
                                        href={job.companyWebsite.startsWith('http') ? job.companyWebsite : `https://${job.companyWebsite}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md transition ml-2"
                                    >
                                        <Globe className="w-3 h-3" /> Visit Site ↗
                                    </a>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-blue-600" /> {job.locationType === 'Remote' ? 'Remote' : (job.location || 'Location Not Set')}</span>
                                <span className="hidden md:inline text-slate-300 dark:text-slate-600">•</span>
                                <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-blue-600" /> {job.type}</span>
                                <span className="hidden md:inline text-slate-300 dark:text-slate-600">•</span>
                                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-600" /> Posted {timeAgo(job.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto flex-shrink-0">
                        <button 
                            onClick={handleSave}
                            className={`p-3.5 rounded-xl transition border shadow-sm ${isSaved ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700' : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}
                            title={isSaved ? "Saved" : "Save Job"}
                        >
                            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                        <button 
                            onClick={handleShare}
                            className="relative p-3.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition border border-slate-200 dark:border-slate-700 shadow-sm"
                            title="Share Job"
                        >
                            <Share2 className="w-5 h-5" />
                            {shared && (
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white text-[10px] px-2.5 py-1.5 rounded-lg font-black tracking-widest uppercase shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200 whitespace-nowrap z-50">Copied!</span>
                            )}
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3.5 rounded-xl text-xs uppercase tracking-widest font-black transition shadow-lg shadow-blue-500/20 w-full md:w-auto text-center hover:scale-[1.02] active:scale-[0.98]">
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex flex-col lg:flex-row gap-8 pb-10">
                <div className="flex-1 space-y-8">
                    <section className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-3xl p-8 md:p-10 shadow-sm">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">About the Role</h2>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-10">
                            {job.description || "No description provided for this role."}
                        </p>

                        {job.skillsRequired && job.skillsRequired.length > 0 && (
                            <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2 mb-6">
                                    <Code2 className="w-5 h-5 text-blue-600" />
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Expertise Required</h3>
                                </div>
                                <div className="flex flex-wrap gap-2.5">
                                    {job.skillsRequired.map(skill => (
                                        <span key={skill} className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-black transition-all border border-blue-100 dark:border-blue-900/30 hover:bg-blue-600 hover:text-white hover:border-blue-600 cursor-default">
                                            {skill.toUpperCase()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-[380px] flex flex-col gap-8 flex-shrink-0">
                    <div className="bg-slate-950 dark:bg-[#0f172a] border border-slate-800 dark:border-[#1e293b] rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:scale-125 transition-transform duration-1000"></div>
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-8">Position Metrics</h3>
                        
                        <div className="space-y-8">
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                                <IndianRupee className="w-6 h-6 text-blue-500 mt-1" />
                                <div>
                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Salary Range</p>
                                    <p className="text-xl font-black text-white tracking-tight">
                                        {job.salary?.min ? `₹${job.salary.min.toLocaleString()} - ₹${job.salary.max.toLocaleString()}` : "Market Competitive"}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex items-start gap-3.5">
                                    <Briefcase className="w-5 h-5 text-blue-500 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Seniority</p>
                                        <p className="text-sm font-black text-white tracking-tight">{job.experienceLevel || "All Levels"}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3.5">
                                    <Timer className="w-5 h-5 text-blue-500 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Work Shift</p>
                                        <p className="text-sm font-black text-white tracking-tight">{job.shift || "Flexible"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3.5 pt-6 border-t border-slate-800">
                                <GraduationCap className="w-5 h-5 text-blue-500 mt-0.5" />
                                <div>
                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Education Prerequisite</p>
                                    <p className="text-sm font-black text-white tracking-tight">{job.education?.qualification || "Graduate"}</p>
                                    {!job.education?.allowBacklogs && (
                                        <p className="text-[10px] text-red-400 font-extrabold mt-2 uppercase italic leading-tight">* Strict: No active backlogs tolerated.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CandidateLayout>
    );
}