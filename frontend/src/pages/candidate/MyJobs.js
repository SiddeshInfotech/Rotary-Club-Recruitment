import { useState, useEffect } from "react";
import CandidateLayout from "../../layouts/CandidateLayout";
import { Briefcase, MapPin, Building2, Clock, Bookmark, CheckCircle, Video, Phone, Calendar, CheckCircle2, X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function MyJobs() {
    const navigate = useNavigate();
    const [savedJobs, setSavedJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Saved');
    const { user } = useAuth();

    useEffect(() => {
        const fetchAllData = async () => {
            if (!user?._id) return;
            setLoading(true);
            try {
                const [savedRes, appliedRes, interviewsRes] = await Promise.all([
                    api.get('/jobs/saved'),
                    api.get(`/applications?candidateId=${user._id}`),
                    api.get('/interviews')
                ]);
                
                if (savedRes.data.success) {
                    setSavedJobs(savedRes.data.data.reverse());
                }
                if (appliedRes.data.success) {
                    // Application API returns populated jobId. We keep the whole application object
                    const uniqueAppsMap = new Map();
                    appliedRes.data.data.forEach(app => {
                        const jId = app.jobId?._id || app.jobId?.toString() || app.jobId;
                        if (jId && !uniqueAppsMap.has(jId)) {
                            uniqueAppsMap.set(jId, app);
                        }
                    });
                    setAppliedJobs(Array.from(uniqueAppsMap.values()));
                }
                if (interviewsRes.data.success) {
                    setInterviews(interviewsRes.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch jobs and interviews:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [user]);

    const tabs = [
        { name: 'Saved', count: savedJobs.length },
        { name: 'Applied', count: appliedJobs.length },
        { name: 'Interviews', count: interviews.length }
    ];

    const currentList = activeTab === 'Saved' ? savedJobs : activeTab === 'Applied' ? appliedJobs : [];

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
                    <div className="text-center py-12 text-slate-500 font-medium">Loading details...</div>
                ) : activeTab === 'Interviews' ? (
                    interviews.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-white/50 dark:bg-slate-800/10">
                            <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-655 mx-auto mb-4" />
                            <p className="text-slate-500 dark:text-slate-400 font-medium">No interviews scheduled yet.</p>
                            <p className="text-xs text-slate-400 mt-2">When a recruiter schedules a round, it will appear here.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {interviews.map((interview) => {
                                const dateStr = interview.date ? new Date(interview.date).toLocaleDateString("en-US", {
                                    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                                }) : "Pending";
                                
                                return (
                                    <div key={interview._id} className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start gap-4 mb-4">
                                                <div>
                                                    <span className="px-2.5 py-1 rounded bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 text-[10px] font-bold uppercase tracking-wider border border-violet-100 dark:border-violet-900/30">
                                                        {interview.round}
                                                    </span>
                                                    <h3 className="text-lg font-black text-slate-900 dark:text-white mt-2 leading-tight">{interview.jobTitle || interview.job?.title || "Role"}</h3>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wide font-semibold">{interview.recruiter?.name || "EQ Hire Recruiter"}</p>
                                                </div>
                                                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase border ${
                                                    interview.status === "Scheduled" 
                                                        ? "bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30" 
                                                        : interview.status === "Completed"
                                                        ? "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30"
                                                        : "bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                                                }`}>
                                                    {interview.status}
                                                </span>
                                            </div>

                                            <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                                                <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-350">
                                                    <Calendar className="w-4 h-4 text-slate-455" />
                                                    <span className="font-semibold">{dateStr}</span>
                                                </div>
                                                <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-350">
                                                    <Clock className="w-4 h-4 text-slate-455" />
                                                    <span className="font-semibold">{interview.time}</span>
                                                </div>
                                                <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-350">
                                                    {interview.type === "Video" ? <Video className="w-4 h-4 text-slate-455" /> : <Phone className="w-4 h-4 text-slate-455" />}
                                                    <span className="font-semibold">{interview.type === "Video" ? "Video Conference" : interview.type}</span>
                                                </div>
                                            </div>

                                            {interview.notes && (
                                                <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-pink-50/50 dark:from-indigo-900/10 dark:via-purple-900/5 dark:to-pink-900/10 border border-indigo-100/50 dark:border-indigo-800/30 shadow-sm relative overflow-hidden">
                                                    {/* Decorative element */}
                                                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 rounded-l-2xl"></div>
                                                    
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                                                        <h4 className="font-black text-[10px] uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                                                            Instructions & Notes
                                                        </h4>
                                                    </div>
                                                    
                                                    <div className="bg-white/60 dark:bg-slate-900/40 rounded-xl p-4 border border-white dark:border-slate-800 shadow-sm backdrop-blur-sm">
                                                        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                                                            {interview.notes}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {interview.status === "Scheduled" && interview.meetingLink && (
                                            <div className="mt-6">
                                                <a 
                                                    href={interview.meetingLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-blue-500/20 text-center"
                                                >
                                                    <Video className="w-4 h-4" /> Join Video Call
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )
                ) : currentList.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-white/50 dark:bg-slate-800/10 hover:bg-white dark:hover:bg-slate-800 transition cursor-pointer" onClick={() => navigate('/job-search')}>
                        <Bookmark className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-500 dark:text-slate-400 font-medium">You haven't {activeTab.toLowerCase()} any jobs yet.</p>
                        <p className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-bold">
                            Find opportunities &rarr;
                        </p>
                    </div>
                ) : (
                    currentList.map((item) => {
                        const isAppliedTab = activeTab === 'Applied';
                        const job = isAppliedTab ? item.jobId : item;
                        if (!job) return null;

                        const status = item.status || "Applied";

                        // Stage Timeline Config
                        const stages = [
                            { name: "Applied", active: true },
                            { name: "Shortlisted", active: ["Shortlisted", "Interview Scheduled", "Offer Extended", "Hired"].includes(status) },
                            { name: "Interviewing", active: ["Interview Scheduled", "Offer Extended", "Hired"].includes(status) },
                            { name: "Decision", active: ["Offer Extended", "Hired", "Rejected"].includes(status) }
                        ];

                        return (
                        <div key={job._id || item._id} className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-6 shadow-sm hover:shadow-md transition group cursor-pointer" onClick={() => navigate(`/job/${job._id}`)}>
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="flex gap-4 flex-grow">
                                    <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Building2 className="w-7 h-7 text-blue-600 dark:text-blue-500" />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                             <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{job.title}</h3>
                                             {!isAppliedTab && <Bookmark className="w-4 h-4 fill-slate-400 text-slate-400" />}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 mt-1.5 uppercase tracking-wider">
                                            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location || 'Remote'}</span>
                                            <span className="text-slate-300 dark:text-slate-600">•</span>
                                            <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {job.type || job.jobType || 'Full-time'}</span>
                                        </div>

                                        {(job.companyName || job.company) && (
                                            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-slate-400" /> {job.companyName || job.company}
                                            </p>
                                        )}

                                        {job.description ? (
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 md:pr-10 leading-relaxed font-medium">
                                                {job.description}
                                            </p>
                                        ) : (
                                            <div className="mb-4"></div>
                                        )}

                                        {job.skillsRequired && job.skillsRequired.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-auto">
                                                {job.skillsRequired.slice(0, 4).map((skill, i) => (
                                                    <span key={i} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-md text-[10px] font-bold uppercase tracking-wider">{skill}</span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Visual Progress Timeline for Applied Jobs */}
                                        {isAppliedTab && (
                                            <div className="mt-6 border-t border-slate-100 dark:border-slate-800/60 pt-4 max-w-lg">
                                                <p className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Application stage</p>
                                                <div className="flex items-center justify-between relative pl-2 pr-2">
                                                    {/* Background Connecting Line */}
                                                    <div className="absolute top-[9px] left-4 right-4 h-0.5 bg-slate-200 dark:bg-slate-800 -z-10"></div>
                                                    
                                                    {/* Colored Connecting Line */}
                                                    {(() => {
                                                        const activeCount = stages.filter(s => s.active).length;
                                                        const pct = activeCount === 1 ? 0 : activeCount === 2 ? 33 : activeCount === 3 ? 66 : 100;
                                                        return (
                                                            <div className="absolute top-[9px] left-4 h-0.5 bg-emerald-500 -z-10 transition-all duration-500" style={{ width: `calc(${pct}% - 8px)` }}></div>
                                                        );
                                                    })()}

                                                    {stages.map((stage, idx) => {
                                                        const isActive = stage.active;
                                                        const isRejected = stage.name === "Decision" && status === "Rejected";
                                                        const isHired = stage.name === "Decision" && ["Offer Extended", "Hired"].includes(status);
                                                        
                                                        let nodeStyle = isActive ? "bg-emerald-500 ring-emerald-100 dark:ring-emerald-950/40" : "bg-slate-200 dark:bg-slate-800 ring-slate-100 dark:ring-slate-850/50";
                                                        if (isRejected) {
                                                            nodeStyle = "bg-red-500 ring-red-100 dark:ring-red-950/40";
                                                        }
                                                        
                                                        return (
                                                            <div key={idx} className="flex flex-col items-center z-10">
                                                                <div className={`w-5 h-5 rounded-full ${nodeStyle} ring-4 flex items-center justify-center transition-all duration-300`}>
                                                                    {isActive && !isRejected ? (
                                                                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                                                    ) : isRejected ? (
                                                                        <X className="w-3.5 h-3.5 text-white" />
                                                                    ) : null}
                                                                </div>
                                                                <span className={`text-[9px] font-black uppercase tracking-wider mt-2 ${isActive ? isRejected ? "text-red-500" : isHired ? "text-emerald-500" : "text-slate-800 dark:text-slate-200" : "text-slate-400"}`}>
                                                                    {stage.name === "Decision" && isRejected ? "Rejected" : stage.name === "Decision" && isHired ? "Offered" : stage.name}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-center md:items-end gap-3 flex-shrink-0 w-full md:w-auto mt-4 md:mt-0">
                                    <div className="flex flex-row gap-2 w-full md:w-auto">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); navigate(`/job/${job._id}`); }}
                                            className={
                                                isAppliedTab
                                                ? "bg-emerald-500 text-white px-10 py-3.5 rounded-xl text-xs uppercase tracking-widest font-black transition flex-1 md:flex-none text-center shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer hover:bg-emerald-600"
                                                : "bg-blue-600 hover:bg-blue-700 text-white px-10 py-3.5 rounded-xl text-xs uppercase tracking-widest font-black transition flex-1 md:flex-none text-center shadow-lg shadow-blue-500/20"
                                            }
                                        >
                                            {isAppliedTab ? (
                                                <><CheckCircle className="w-4 h-4" /> Applied</>
                                            ) : 'Apply Now'}
                                        </button>
                                    </div>
                                    
                                    {isAppliedTab ? (
                                        <div className="flex flex-col items-center md:items-end w-full">
                                            {(() => {
                                                const statusConfig = {
                                                    "Applied": { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-600 dark:text-blue-400", border: "border-blue-100 dark:border-blue-800" },
                                                    "Shortlisted": { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-100 dark:border-emerald-800" },
                                                    "Interview Scheduled": { bg: "bg-violet-50 dark:bg-violet-900/20", text: "text-violet-650 dark:text-violet-400", border: "border-violet-100 dark:border-violet-800" },
                                                    "Offer Extended": { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-100 dark:border-emerald-850" },
                                                    "Hired": { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
                                                    "Rejected": { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-650 dark:text-red-400", border: "border-red-100 dark:border-red-800" }
                                                };
                                                const config = statusConfig[status] || statusConfig["Applied"];
                                                return (
                                                    <span className={`${config.bg} ${config.text} ${config.border} px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 w-max mt-3 mb-2 justify-center shadow-sm border`}>
                                                        {status === "Interview Scheduled" ? `Interviewing: ${item.currentRound || "Scheduled"}` : `Status: ${status}`}
                                                    </span>
                                                );
                                            })()}
                                            <span className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-slate-400">
                                                <Clock className="w-3 h-3" /> Applied {timeAgo(item.createdAt)}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-slate-400 mt-2">
                                            <Clock className="w-3 h-3" /> Posted {timeAgo(job.createdAt)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        );
                    })
                )}
            </div>
        </CandidateLayout>
    );
}
