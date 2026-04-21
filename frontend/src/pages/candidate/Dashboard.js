import { useState, useEffect } from "react";
import CandidateLayout from "../../layouts/CandidateLayout";
import ProfileSidebar from "../../components/candidate/ProfileSidebar";
import CreatePostBox from "../../components/candidate/CreatePostBox";
import PostFeed from "../../components/candidate/PostFeed";
import RecommendedMatches from "../../components/cards/JobCard";
import ActiveApplications from "../../components/tables/ApplicationsTables";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { Star, Zap, CheckCircle2 } from "lucide-react";

export default function Dashboard() {
    const { user } = useAuth();
    const firstName = user?.firstName || user?.name?.split(' ')[0] || 'there';

    const [dashboardData, setDashboardData] = useState(null);

    const [jobs, setJobs] = useState([]);
    const [matchScores, setMatchScores] = useState({});
    const [loading, setLoading] = useState(true);

    // Posts state
    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await api.get('/jobs');
                const data = res.data.data || res.data;
                if (Array.isArray(data)) {
                    const topJobs = data.slice(0, 2);
                    setJobs(topJobs);

                    // Get real match scores for these jobs
                    if (topJobs.length > 0) {
                        const ids = topJobs.map(j => j._id).join(',');
                        try {
                            const scoreRes = await api.get(`/candidate-dashboard/match-scores?jobIds=${ids}`);
                            if (scoreRes.data.success) {
                                setMatchScores(scoreRes.data.data);
                            }
                        } catch (scoreErr) {
                            console.error("Failed to fetch match scores:", scoreErr);
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch recommended jobs:", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchDashboardInfo = async () => {
            try {
                const res = await api.get('/candidate-dashboard');
                if (res.data && res.data.success) {
                    setDashboardData(res.data.data);
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

        fetchJobs();
        fetchDashboardInfo();
        fetchPosts();
    }, []);

    const handlePostCreated = (newPost) => {
        // Add the new post to the top of the feed
        setPosts([{ ...newPost, likesCount: 0, commentsCount: 0, isLiked: false, comments: [] }, ...posts]);
    };

    const handleDeletePost = (postId) => {
        setPosts(posts.filter(p => p._id !== postId));
    };

    const isPremium = dashboardData?.isPremium;
    const premiumInsights = dashboardData?.premiumInsights;

    return (
        <CandidateLayout>
            <div className="flex gap-6 items-start">
                {/* Left Sidebar */}
                <ProfileSidebar />

                {/* Main Content */}
                <div className="flex-1 min-w-0">

                    {/* Create Post Box */}
                    <div className="mb-2">
                        <CreatePostBox onPostCreated={handlePostCreated} />
                    </div>

                    {/* Sorting line (like LinkedIn) */}
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
                    {isPremium && premiumInsights && (
                        <div className="mb-12 bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-8 border border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.15)]">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-400/30">
                                    <Zap className="w-6 h-6 text-yellow-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Deep AI EQ Insights</h2>
                                    <p className="text-blue-200 text-sm">Personalized analysis generated by Gemini from your EQ footprint.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                                    <h3 className="text-emerald-400 font-bold mb-4 uppercase tracking-wider text-xs">Top Strengths</h3>
                                    <ul className="space-y-3">
                                        {premiumInsights.strengths?.map((s, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-blue-50">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                                <span>{s}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                                    <h3 className="text-amber-400 font-bold mb-4 uppercase tracking-wider text-xs">Areas of Improvement</h3>
                                    <ul className="space-y-3">
                                        {premiumInsights.weaknesses?.map((w, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-blue-50">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-2"></span>
                                                <span>{w}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                                    <h3 className="text-blue-300 font-bold mb-4 uppercase tracking-wider text-xs">Actionable Recommendations</h3>
                                    <ul className="space-y-3">
                                        {premiumInsights.recommendations?.map((r, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-blue-50">
                                                <Zap className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />
                                                <span>{r}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bottom Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <h3 className="text-sm font-bold tracking-widest text-slate-800 dark:text-slate-200 uppercase">AI RECOMMENDED MATCHES</h3>
                                {jobs.length > 0 && (
                                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase bg-blue-50 dark:bg-blue-900/40 px-3 py-1.5 rounded-md">{jobs.length} AVAILABLE</span>
                                )}
                            </div>
                            <div className="flex flex-col gap-6">
                                {loading ? (
                                    <div className="text-sm text-slate-400 font-medium p-6 text-center">Loading recommendations...</div>
                                ) : jobs.length > 0 ? jobs.map((job) => (
                                    <RecommendedMatches 
                                        key={job._id}
                                        title={job.title}
                                        company={`${job.companyName || job.company || 'Company'} • ${job.type || job.jobType || 'Full-time'} • ${job.location || 'Remote'}`}
                                        match={`${matchScores[job._id] || '—'}%`}
                                        tags={job.skillsRequired?.slice(0, 2) || []}
                                    />
                                )) : (
                                    <div className="text-sm text-slate-400 font-medium p-6 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
                                        No job recommendations available yet.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold tracking-widest text-slate-800 dark:text-slate-200 uppercase mb-8">ACTIVE APPLICATIONS</h3>
                            <div className="flex flex-col gap-0 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                                <ActiveApplications />
                            </div>
                            <button className="w-full mt-6 text-xs font-bold tracking-widest uppercase py-4 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white transition shadow-sm">
                                VIEW ALL HISTORY
                            </button>
                        </div>
                    </div>

                </div>
                {/* End Main Content */}
            </div>
            {/* End Flex Wrapper */}

        </CandidateLayout>
    );
}