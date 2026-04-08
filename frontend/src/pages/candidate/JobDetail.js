import { useState, useEffect } from "react";
import CandidateLayout from "../../layouts/CandidateLayout";
import { ArrowLeft, Building2, MapPin, Briefcase, Clock, ShieldCheck, Share2, Bookmark } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from "../../services/api";

export default function JobDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await api.get(`/jobs/job/${id}`);
                if (res.data.success) {
                    setJob(res.data.data);
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
        const diff = Math.floor((Date.now() - new Date(date)) / 86400000);
        if (diff === 0) return 'Today';
        if (diff === 1) return '1 day ago';
        if (diff < 7) return `${diff} days ago`;
        return `${Math.floor(diff / 7)} week(s) ago`;
    };

    if (loading) {
        return (
            <CandidateLayout>
                <div className="flex items-center justify-center py-24 text-slate-500 font-medium">Loading job details...</div>
            </CandidateLayout>
        );
    }

    if (!job) {
        return (
            <CandidateLayout>
                <div className="text-center py-24">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Job Not Found</h2>
                    <p className="text-slate-500 mb-6">This job may have been removed or the link is invalid.</p>
                    <button onClick={() => navigate('/job-search')} className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold">Back to Search</button>
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
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
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
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-10 h-10 text-blue-600 dark:text-blue-500" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{job.title}</h1>
                            </div>
                            <p className="text-lg font-bold text-slate-600 dark:text-slate-300 mb-4 flex items-center gap-2">
                                {job.companyName || job.company || "Company"}
                                <ShieldCheck className="w-5 h-5 text-blue-500" />
                            </p>

                            <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location || 'Remote'}</span>
                                <span className="hidden md:inline text-slate-300 dark:text-slate-600">•</span>
                                <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {job.type || job.jobType || 'Full-time'}</span>
                                <span className="hidden md:inline text-slate-300 dark:text-slate-600">•</span>
                                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Posted {timeAgo(job.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <button className="p-3.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition border border-slate-200 dark:border-slate-700 flex-shrink-0 shadow-sm">
                            <Bookmark className="w-5 h-5" />
                        </button>
                        <button className="p-3.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition border border-slate-200 dark:border-slate-700 flex-shrink-0 shadow-sm">
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest font-black transition shadow-sm w-full md:w-auto text-center">
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Details */}
                <div className="flex-1 space-y-8">
                    {job.description && (
                        <section className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-3xl p-8 shadow-sm">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">About the Role</h2>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                {job.description}
                            </p>
                        </section>
                    )}

                    {job.experienceRequired && (
                        <section className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-3xl p-8 shadow-sm">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">Experience Required</h2>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">{job.experienceRequired}</p>
                        </section>
                    )}
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-[350px] flex flex-col gap-6">
                    <div className="bg-slate-900 dark:bg-[#0f172a] border border-slate-800 dark:border-[#1e293b] rounded-3xl p-8 shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
                        <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-4">Company Overview</h3>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0 p-2">
                                <Building2 className="w-full h-full text-slate-900" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">{job.companyName || job.company || "Company"}</h4>
                            </div>
                        </div>
                        
                        <div className="space-y-4 pt-6 border-t border-slate-800">
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Job Type</p>
                                <p className="text-sm font-bold text-white">{job.type || job.jobType || 'Full-time'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Location</p>
                                <p className="text-sm font-bold text-white">{job.location || 'Remote'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status</p>
                                <p className="text-sm font-bold text-white">{job.status || 'Active'}</p>
                            </div>
                        </div>
                    </div>

                    {job.skillsRequired && job.skillsRequired.length > 0 && (
                        <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-3xl p-8 shadow-sm">
                            <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Required Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {job.skillsRequired.map(skill => (
                                    <span key={skill} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold transition">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </CandidateLayout>
    );
}
