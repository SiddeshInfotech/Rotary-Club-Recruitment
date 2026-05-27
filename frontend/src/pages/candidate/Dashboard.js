import { useState, useEffect } from "react";
import CandidateLayout from "../../layouts/CandidateLayout";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Crown, Zap } from "lucide-react";
import EQProfileCard from "../../components/cards/EQProfileCard";
import CreatePostBox from "../../components/candidate/CreatePostBox";
import PostFeed from "../../components/candidate/PostFeed";
import api from "../../services/api";

export default function Dashboard() {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [savedJobs, setSavedJobs] = useState([]);
    const [activeApps, setActiveApps] = useState([]);
    const [dashboardData, setDashboardData] = useState(null);
    
    // Posts state
    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(true);

    const firstName = user?.firstName || 'Smith';
    const hasEqScores = user?.eqScores && user.eqScores.aggregate > 0;

    useEffect(() => {
        if (!user?._id) return;
        const fetchDashboardData = async () => {
            try {
                const [savedRes, appsRes, dashboardRes] = await Promise.all([
                    api.get('/jobs/saved'),
                    api.get(`/applications?candidateId=${user._id}`),
                    api.get('/candidate-dashboard')
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

                if (dashboardRes.data && dashboardRes.data.success) {
                    setDashboardData(dashboardRes.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
            }
        };

        const fetchPosts = async () => {
            try {
                const res = await api.get('/community');
                if (res.data.success) {
                    setPosts(res.data.data || []);
                }
            } catch (err) {
                console.error("Failed to fetch posts:", err);
            } finally {
                setPostsLoading(false);
            }
        };

        const refreshUserData = async () => {
            try {
                const res = await api.get('/auth/me');
                if (res.data.success && res.data.user) {
                    const latest = res.data.user;
                    updateUser({
                        eqScores: latest.eqScores,
                        technicalScores: latest.technicalScores,
                        lastAssessedAt: latest.lastAssessedAt,
                        lastTechAssessedAt: latest.lastTechAssessedAt,
                    });
                }
            } catch (err) {
                console.error("Failed to refresh user data:", err);
            }
        };

        fetchDashboardData();
        fetchPosts();
        refreshUserData();
    }, [user?._id]);

    const handlePostCreated = (newPost) => {
        setPosts([{ ...newPost, likesCount: 0, commentsCount: 0, isLiked: false, comments: [] }, ...posts]);
    };

    const handleDeletePost = (postId) => {
        setPosts(posts.filter(p => p._id !== postId));
    };

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
                            {!dashboardData?.isPremium ? (
                                <button onClick={() => navigate('/premium/pricing')} className="bg-yellow-400 text-yellow-900 px-6 py-2.5 rounded-lg font-bold hover:bg-yellow-300 transition-colors shadow-sm ml-auto text-center">
                                    Try Premium
                                </button>
                            ) : (
                                <div className="bg-yellow-400 text-yellow-900 px-6 py-2.5 rounded-lg font-bold shadow-sm ml-auto inline-flex items-center gap-2">
                                    <Crown className="w-5 h-5" /> Premium Active
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Create Post */}
                    <div className="mb-2">
                        <CreatePostBox onPostCreated={handlePostCreated} />
                    </div>

                    {/* Sort By */}
                    <div className="flex items-center gap-2 py-3 mb-1">
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                            Sort by: <button className="font-bold text-slate-700 dark:text-slate-300 hover:text-[#0a66c2] dark:hover:text-blue-400 transition-colors">Top</button>
                        </span>
                    </div>

                    {/* Post Feed */}
                    <div className="mb-8">
                        {postsLoading ? (
                            <div className="text-center py-8">
                                <div className="w-8 h-8 border-3 border-slate-200 dark:border-slate-700 border-t-[#0a66c2] rounded-full animate-spin mx-auto" />
                                <p className="text-xs text-slate-400 mt-3 font-medium">Loading feed...</p>
                            </div>
                        ) : (
                            <PostFeed posts={posts} onDeletePost={handleDeletePost} />
                        )}
                    </div>

                    {/* Premium Insights Section (Only for Premium Users) */}
                    {dashboardData?.isPremium && dashboardData?.premiumInsights && (
                        <div className="mb-12 bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-8 border border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.15)]">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-400/30">
                                    <Zap className="w-6 h-6 text-yellow-400" />
                                </div>
                                <div className="text-left">
                                    <h2 className="text-2xl font-bold text-white">Deep AI EQ Insights</h2>
                                    <p className="text-blue-200 text-sm">Personalized analysis generated by Gemini from your EQ footprint.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                                    <h3 className="text-emerald-400 font-bold mb-4 uppercase tracking-wider text-xs text-left">Top Strengths</h3>
                                    <ul className="space-y-3 text-left">
                                        {dashboardData.premiumInsights.strengths?.map((s, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-blue-50">
                                                <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                                <span>{s}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                                    <h3 className="text-amber-400 font-bold mb-4 uppercase tracking-wider text-xs text-left">Areas of Improvement</h3>
                                    <ul className="space-y-3 text-left">
                                        {dashboardData.premiumInsights.weaknesses?.map((w, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-blue-50">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-2"></span>
                                                <span>{w}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                                    <h3 className="text-blue-300 font-bold mb-4 uppercase tracking-wider text-xs text-left">Actionable Recommendations</h3>
                                    <ul className="space-y-3 text-left">
                                        {dashboardData.premiumInsights.recommendations?.map((r, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-blue-50">
                                                <svg className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                                <span>{r}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Right Sidebar */}
                <div className="flex flex-col gap-8">

                    {/* EQ Profile Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-[16px] p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
                        {hasEqScores ? (
                            <>
                                <h2 className="text-[12px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase mb-4 w-full text-left">Your EQ DNA</h2>
                                <EQProfileCard eqScores={user.eqScores} />
                                {(() => {
                                    const cooldownTimestamp = user?.lastAssessedAt || (user?.eqScores?.aggregate ? user?.updatedAt : null);
                                    let cooldownDaysLeft = 0;
                                    if (cooldownTimestamp) {
                                        const cooldownMs = 30 * 24 * 60 * 60 * 1000;
                                        const timeSince = Date.now() - new Date(cooldownTimestamp).getTime();
                                        if (timeSince < cooldownMs) {
                                            cooldownDaysLeft = Math.ceil((cooldownMs - timeSince) / (24 * 60 * 60 * 1000));
                                        }
                                    }
                                    const isOnCooldown = cooldownDaysLeft > 0;
                                    return (
                                        <button 
                                            disabled={isOnCooldown}
                                            className={`mt-4 text-sm font-bold transition-all ${
                                                isOnCooldown 
                                                    ? 'text-slate-400 dark:text-slate-500 cursor-not-allowed' 
                                                    : 'text-[#0070f3] dark:text-blue-400 hover:underline'
                                            }`} 
                                            onClick={() => !isOnCooldown && navigate('/eq-journey')}
                                            title={isOnCooldown ? `Next retake available in ${cooldownDaysLeft} days` : ''}
                                        >
                                            {isOnCooldown ? `Retake available in ${cooldownDaysLeft}d` : 'Retake Assessment (If Eligible)'}
                                        </button>
                                    );
                                })()}
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

                    {/* Technical Assessment Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-[16px] p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
                        <h2 className="text-[12px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase mb-4 w-full text-left">Technical Skills</h2>
                        
                        {!user?.technicalScores?.aggregate ? (
                            <>
                                <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed mb-6 font-medium">
                                    Take the 25-question technical assessment to showcase your hard skills and stand out to top recruiters!
                                </p>
                                <button onClick={() => navigate('/tech-assessment')} className="w-full bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm">
                                    Take Technical Test
                                </button>
                            </>
                        ) : (
                            <div className="w-full flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                                    {user.technicalScores.aggregate}%
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Assessment Complete</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.technicalScores.proficiencyLevel?.replace('_', ' ') || 'Completed'}</p>
                                </div>
                            </div>
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