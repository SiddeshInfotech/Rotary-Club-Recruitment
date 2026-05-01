import { useState, useEffect } from "react";
import CandidateLayout from "../../layouts/CandidateLayout";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import EQProfileCard from "../../components/cards/EQProfileCard";
import api from "../../services/api";

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [savedJobs, setSavedJobs] = useState([]);
    const [activeApps, setActiveApps] = useState([]);
    const firstName = user?.firstName || 'Smith';
    const lastName = user?.lastName || 'Patel';
    const fullName = `${firstName} ${lastName}`;
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    const hasEqScores = user?.eqScores && user.eqScores.aggregate > 0;

    useEffect(() => {
        if (!user?._id) return;
        const fetchDashboardData = async () => {
            try {
                const [savedRes, appsRes] = await Promise.all([
                    api.get('/jobs/saved'),
                    api.get(`/applications?candidateId=${user._id}`)
                ]);
                
                if (savedRes.data && savedRes.data.success) {
                    setSavedJobs(savedRes.data.data.reverse());
                }
                
                if (appsRes.data && appsRes.data.success) {
                    const uniqueAppsMap = new Map();
                    appsRes.data.data.forEach(app => {
                        const jId = app.jobId?._id || app.jobId?.toString() || app.jobId;
                        if (jId && !uniqueAppsMap.has(jId) && app.status !== 'Rejected') {
                            uniqueAppsMap.set(jId, app);
                        }
                    });
                    
                    const activeAppsList = Array.from(uniqueAppsMap.values())
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                        
                    setActiveApps(activeAppsList);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
            }
        };
        fetchDashboardData();
    }, [user]);

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
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

                {/* Main Content (Left Column) - Posts Feed */}
                <div className="flex flex-col gap-6">

                    {/* Welcome Banner */}
                    <div className="bg-[#124a73] rounded-[20px] p-10 text-white shadow-sm flex flex-col gap-6" style={{ background: 'linear-gradient(135deg, #1b283b 0%, #0d62a6 100%)' }}>
                        <div>
                            <h1 className="text-[32px] font-bold mb-4">Welcome back, {firstName}</h1>
                        </div>
                        <div className="flex gap-4 mt-2">
                            {/* <button className="bg-transparent border border-white/30 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                                Update Resume
                            </button> */}
                            <button className="bg-yellow-400 text-yellow-900 px-6 py-2.5 rounded-lg font-bold hover:bg-yellow-300 transition-colors shadow-sm ml-auto">
                                Try Premium
                            </button>
                        </div>
                    </div>

                    {/* Create Post */}
                    <div className="bg-white dark:bg-slate-900 rounded-[12px] p-5 shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="flex gap-4 mb-4">
                            <div className="w-12 h-12 bg-[#0d2a45] rounded-full flex items-center justify-center text-white font-semibold text-lg shrink-0">
                                {initials}
                            </div>
                            <button className="flex-1 text-left bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-full px-5 text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                                Start a post
                            </button>
                        </div>
                        <div className="flex justify-around items-center pt-2">
                            <button className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                Video
                            </button>
                            <button className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                Photo
                            </button>
                            <button className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm">
                                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                                Write article
                            </button>
                        </div>
                    </div>

                    {/* Sort By */}
                    <div className="flex justify-end items-center px-1 border-t border-slate-200 dark:border-slate-800 pt-4 mt-2">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Sort by: <strong className="text-slate-800 dark:text-slate-200">Top</strong></span>
                    </div>

                    {/* Feed Post */}
                    <div className="bg-white dark:bg-slate-900 rounded-[12px] p-5 shadow-sm border border-slate-200 dark:border-slate-800">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-3 items-center">
                                <div className="w-12 h-12 bg-[#0d2a45] rounded-full flex items-center justify-center text-white font-semibold text-lg shrink-0">
                                    {initials}
                                </div>
                                <div>
                                    <h3 className="font-bold text-[16px] text-slate-900 dark:text-white leading-tight">{fullName}</h3>
                                    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">1d • 🌍</p>
                                </div>
                            </div>
                            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
                            </button>
                        </div>

                        {/* Repost info */}
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                            Reposted from {fullName}:
                        </div>

                        {/* Content */}
                        <p className="text-[15px] text-slate-800 dark:text-slate-200 mb-4">
                            What's Up???
                        </p>

                        {/* Image */}
                        <div className="w-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
                            {/* Placeholder for the large image in the user's screenshot */}
                            <img src="https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=1200&q=80" alt="Post attachment" className="w-full h-auto object-cover max-h-[500px]" />
                        </div>
                    </div>

                </div>

                {/* Right Sidebar */}
                <div className="flex flex-col gap-8">

                    {/* EQ Profile Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-[16px] p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
                        {hasEqScores ? (
                            <>
                                <h2 className="text-[12px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase mb-4 w-full text-left">Your EQ DNA</h2>
                                <EQProfileCard eqScores={user.eqScores} />
                                <button className="mt-4 text-sm font-bold text-[#0070f3] dark:text-blue-400 hover:underline" onClick={() => navigate('/eq-assessment')}>
                                    Retake Assessment (If Eligible)
                                </button>
                            </>
                        ) : (
                            <>
                                <h2 className="text-[14px] font-black tracking-tight text-slate-900 dark:text-white mb-2">Unlock Your True Potential</h2>
                                <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed mb-6 font-medium">
                                    Take our scientifically-backed EQ Assessment to map your 8 core emotional dimensions and stand out to top recruiters!
                                </p>
                                <button onClick={() => navigate('/eq-assessment')} className="w-full bg-[#0070f3] text-white py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
                                    Take EQ Assessment
                                </button>
                            </>
                        )}
                    </div>

                    {/* Saved Opportunities */}
                    <div>
                        <h2 className="text-[12px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase mb-4 px-1">SAVED OPPORTUNITIES</h2>
                        <div className="flex flex-col gap-3 mb-5">
                            {savedJobs.length > 0 ? (
                                savedJobs.slice(0, 3).map((job) => (
                                    <div key={job._id} className="bg-white dark:bg-slate-900 rounded-[12px] p-4 shadow-sm border border-slate-200 dark:border-slate-800 flex justify-between items-center cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors" onClick={() => navigate('/my-jobs')}>
                                        <div>
                                            <h3 className="font-bold text-[14px] text-slate-900 dark:text-white mb-0.5">{job.title}</h3>
                                            <p className="text-[12px] text-slate-500 dark:text-slate-400">{job.companyName || job.company}</p>
                                        </div>
                                        <button className="text-[#0070f3] dark:text-blue-400 p-1 hover:opacity-80">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path></svg>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-[12px] bg-slate-50 dark:bg-slate-900/50">
                                    <p className="text-[12px] text-slate-500 dark:text-slate-400">No saved opportunities yet.</p>
                                </div>
                            )}
                        </div>

                        {savedJobs.length > 0 && (
                            <div className="text-center">
                                <button onClick={() => navigate('/my-jobs')} className="text-[11px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                                    MANAGE ALL SAVED ({savedJobs.length})
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Active Applications */}
                    <div>
                        <div className="flex justify-between items-center mb-4 px-1">
                            <h2 className="text-[12px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">ACTIVE APPLICATIONS</h2>
                            <button onClick={() => navigate('/my-jobs')} className="text-[10px] font-bold text-[#0070f3] dark:text-blue-400 uppercase tracking-widest hover:underline">
                                VIEW ALL
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {activeApps.length > 0 ? (
                                activeApps.slice(0, 2).map((app) => {
                                    const job = app.jobId;
                                    if (!job) return null;
                                    const companyName = job.companyName || job.company || "Company";
                                    const isShortlisted = app.status === 'Shortlisted';
                                    
                                    return (
                                        <div key={app._id} className="bg-white dark:bg-slate-900 rounded-[16px] p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col gap-6 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors" onClick={() => navigate(`/job/${job._id}`)}>
                                            {/* Header */}
                                            <div className="flex justify-between items-start">
                                                <div className="flex gap-4 items-center">
                                                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-[12px] flex items-center justify-center text-[9px] font-bold text-slate-400 dark:text-slate-500 tracking-wider overflow-hidden">
                                                        {companyName.substring(0, 6).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-0.5 line-clamp-1">{job.title}</h3>
                                                        <p className="text-[12px] text-slate-500 dark:text-slate-400 line-clamp-1">{companyName} • Applied {timeAgo(app.createdAt)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Badge */}
                                            <div>
                                                <span className={`${isShortlisted ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-[#eef5fe] dark:bg-[#0070f3]/10 text-[#0070f3] dark:text-blue-400'} text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wider uppercase inline-flex items-center gap-1.5`}>
                                                    {isShortlisted && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                                                    {app.status || 'APPLIED'}
                                                </span>
                                            </div>

                                            {/* Status */}
                                            <div>
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">STATUS</span>
                                                    <span className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">{isShortlisted ? 'STEP 2 OF 3' : 'STEP 1 OF 3'}</span>
                                                </div>
                                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-5 overflow-hidden">
                                                    <div className={`${isShortlisted ? 'bg-emerald-500' : 'bg-[#0070f3] dark:bg-blue-500'} h-1.5 rounded-full transition-all duration-1000`} style={{ width: isShortlisted ? '66%' : '33%' }}></div>
                                                </div>

                                                <button className={`w-full ${isShortlisted ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40' : 'bg-[#eef5fe] text-[#0070f3] hover:bg-[#e1edfd] dark:bg-[#0070f3]/10 dark:text-blue-400 dark:hover:bg-[#0070f3]/20'} py-2 rounded-lg text-sm font-semibold transition-colors`} onClick={(e) => { e.stopPropagation(); navigate(`/job/${job._id}`); }}>
                                                    {isShortlisted ? 'Prepare for Interview' : 'View Application'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-[16px] bg-slate-50 dark:bg-slate-900/50">
                                    <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mb-2">No active applications found.</p>
                                    <button onClick={() => navigate('/job-search')} className="text-[#0070f3] dark:text-blue-400 text-sm font-bold hover:underline">
                                        Find jobs to apply for &rarr;
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </CandidateLayout>
    );
}