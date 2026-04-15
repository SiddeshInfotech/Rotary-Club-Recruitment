import { useState, useEffect } from "react";
import CandidateLayout from "../../layouts/CandidateLayout";
import { Briefcase, MapPin, Building2, Clock, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from "../../services/api";

export default function MyJobs() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Saved');

    const tabs = [
        { name: 'Saved', count: jobs.length },
        { name: 'Applied', count: 0 },
        { name: 'Interviews', count: 0 }
    ];

    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                const res = await api.get('/jobs/saved');
                if (res.data.success) {
                    setJobs(res.data.data.reverse()); // Show newest saved first
                }
            } catch (err) {
                console.error("Failed to fetch saved jobs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSavedJobs();
    }, []);

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

    return (
        <CandidateLayout>
            <div className="mb-10">
                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-6 font-serif">My Jobs</h1>
                
                <div className="flex flex-wrap gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === tab.name ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'bg-white dark:bg-[#131b2f] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}
                        >
                            {tab.name}
                            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.name ? 'bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {loading ? (
                    <div className="text-center py-12 text-slate-500 font-medium">Loading saved jobs...</div>
                ) : activeTab !== 'Saved' ? (
                     <div className="text-center py-12 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-white/50 dark:bg-slate-800/10">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-bold tracking-widest uppercase">COMING SOON</p>
                        <p className="text-slate-400 dark:text-slate-500 mt-2 text-sm">You haven't {activeTab.toLowerCase()} any jobs yet.</p>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-white/50 dark:bg-slate-800/10 hover:bg-white dark:hover:bg-slate-800 transition cursor-pointer" onClick={() => navigate('/job-search')}>
                        <Bookmark className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-500 dark:text-slate-400 font-medium">You haven't saved any jobs yet.</p>
                        <p className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-bold">
                            Find opportunities &rarr;
                        </p>
                    </div>
                ) : (
                    jobs.map((job) => (
                        <div key={job._id} className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-6 shadow-sm hover:shadow-md transition group cursor-pointer" onClick={() => navigate(`/job/${job._id}`)}>
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="flex gap-4">
                                    <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Building2 className="w-7 h-7 text-blue-600 dark:text-blue-500" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                             <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{job.title}</h3>
                                             <Bookmark className="w-4 h-4 fill-slate-400 text-slate-400" />
                                        </div>
                                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">{job.companyName || job.company || "—"}</p>
                                        
                                        <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">
                                            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location || 'Remote'}</span>
                                            <span className="text-slate-300 dark:text-slate-600">•</span>
                                            <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {job.type || job.jobType || 'Full-time'}</span>
                                        </div>

                                        {job.skillsRequired && job.skillsRequired.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {job.skillsRequired.slice(0, 4).map((skill, i) => (
                                                    <span key={i} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-md text-[10px] font-bold uppercase tracking-wider">{skill}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-center md:items-end gap-3 flex-shrink-0 w-full md:w-auto mt-4 md:mt-0">
                                    <div className="flex flex-row gap-2 w-full md:w-auto">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); navigate(`/job/${job._id}`); }}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3.5 rounded-xl text-xs uppercase tracking-widest font-black transition flex-1 md:flex-none text-center shadow-lg shadow-blue-500/20"
                                        >
                                            Apply Now
                                        </button>
                                    </div>
                                    <span className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-slate-400 mt-2">
                                        <Clock className="w-3 h-3" /> Posted {timeAgo(job.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </CandidateLayout>
    );
}
