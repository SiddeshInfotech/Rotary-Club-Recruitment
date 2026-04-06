import RecruiterLayout from "../../layouts/RecruiterLayout";
import { Briefcase, FileText, Users, TrendingUp, Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RecruiterDashboard() {
    const { user } = useAuth();
    const firstName = user?.firstName || 'there';

    return (
        <RecruiterLayout>
            {/* Hero Header Area (matching candidate exactly) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 mt-4 gap-8">
                <div className="max-w-[700px]">
                    <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4 font-serif">Recruiter Intelligence</h1>
                    <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                        Welcome back, {firstName}. Here is the overview of your active candidates and recent EQ matches across your open roles.
                    </p>
                </div>
                
                <div className="flex gap-6">
                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] px-8 py-6 rounded-2xl flex flex-col items-center justify-center shadow-sm">
                        <span className="text-4xl font-black text-slate-900 dark:text-white leading-none mb-2">12</span>
                        <span className="text-xs uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">NEW MATCHES</span>
                    </div>
                    <Link to="/recruiter/post-job" className="bg-blue-600 dark:bg-blue-500 border border-blue-600 dark:border-blue-500 px-8 py-6 rounded-2xl flex flex-col items-center justify-center shadow-sm hover:opacity-90 transition group cursor-pointer">
                        <Plus className="w-8 h-8 text-white mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs uppercase tracking-widest font-bold text-white">POST A JOB</span>
                    </Link>
                </div>
            </div>

            {/* PIPELINE OVERVIEW */}
            <div className="mb-6 flex items-end justify-between">
                <h3 className="text-sm font-bold tracking-widest text-slate-800 dark:text-slate-200 uppercase">PIPELINE OVERVIEW</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
                {[
                    { label: "Active Jobs", value: "6", highlight: false },
                    { label: "Total Apps", value: "48", highlight: false },
                    { label: "Shortlisted", value: "12", highlight: true },
                    { label: "Avg EQ Match", value: "74%", highlight: false },
                ].map((stat, i) => (
                    <div key={i} className={`bg-white dark:bg-[#131b2f] border ${stat.highlight ? "border-blue-500 dark:border-blue-400" : "border-slate-200 dark:border-[#1e293b]"} px-6 py-8 rounded-2xl flex flex-col shadow-sm`}>
                        <p className="text-xs uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-2">{stat.label}</p>
                        <p className={`text-4xl font-black leading-none ${stat.highlight ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white"}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    <h3 className="text-sm font-bold tracking-widest text-slate-800 dark:text-slate-200 uppercase mb-8">ACTIVE JOB LISTINGS</h3>
                    <div className="flex flex-col gap-4">
                        {[
                            { title: "Senior Product Manager", type: "Full-time · Remote", match: 89 },
                            { title: "UX Designer", type: "Full-time · Hybrid", match: 82 },
                            { title: "Full Stack Developer", type: "Full-time · On-site", match: 76 }
                        ].map((job, idx) => (
                            <Link to="/recruiter/search" key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-blue-500 dark:hover:border-blue-500 transition-colors group block">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{job.title}</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{job.type}</p>
                                    </div>
                                    <div className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg flex flex-col items-center">
                                        <span className="text-blue-600 dark:text-blue-400 font-black text-sm">{job.match}%</span>
                                        <span className="text-[10px] text-blue-500/70 font-bold uppercase tracking-widest">Match</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-4 mb-8">
                        <h3 className="text-sm font-bold tracking-widest text-slate-800 dark:text-slate-200 uppercase">TOP MATCHED CANDIDATES</h3>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase bg-blue-50 dark:bg-blue-900/40 px-3 py-1.5 rounded-md">NEW</span>
                    </div>
                    <div className="flex flex-col gap-4">
                        {[
                            { name: "Sarah Chen", type: "Empathetic Leader", match: 89, avatarName: "Sarah+Chen" },
                            { name: "Marcus Johnson", type: "Strategic Thinker", match: 82, avatarName: "Marcus+Johnson" },
                            { name: "Emily Rodriguez", type: "Creative Innovator", match: 76, avatarName: "Emily+Rodriguez" }
                        ].map((candidate, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                                        <img src={`https://ui-avatars.com/api/?name=${candidate.avatarName}&background=0F172A&color=fff&bold=true`} alt="User" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{candidate.name}</h4>
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1">{candidate.type}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-black text-emerald-500 dark:text-emerald-400">{candidate.match}%</span>
                                    <button className="text-slate-400 hover:text-blue-600 transition-colors">
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 text-xs font-bold tracking-widest uppercase py-4 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white transition shadow-sm">
                        VIEW FULL DIRECTORY
                    </button>
                </div>
            </div>

        </RecruiterLayout>
    );
}
