import { useState, useEffect } from "react";
import CandidateLayout from "../../layouts/CandidateLayout";

import RecommendedMatches from "../../components/cards/JobCard";
import ActiveApplications from "../../components/tables/ApplicationsTables";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function Dashboard() {
    const { user } = useAuth();
    const firstName = user?.firstName || user?.name?.split(' ')[0] || 'there';

    const [jobs, setJobs] = useState([]);
    const [matchScores, setMatchScores] = useState({});
    const [loading, setLoading] = useState(true);

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

        fetchJobs();
    }, []);

    return (
        <CandidateLayout>
            
            {/* Hero Header Area */}
            <div className="mb-12 mt-4">
                <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4 font-serif">Action Hub</h1>
                <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-[700px]">
                    Welcome back, {firstName}. Manage your active applications, browse AI-matched opportunities, and prepare for your next steps.
                </p>
            </div>

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

        </CandidateLayout>
    );
}