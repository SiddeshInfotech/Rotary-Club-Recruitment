import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import RecruiterLayout from "../../layouts/RecruiterLayout";
import EQProfileCard from "../../components/cards/EQProfileCard";
import api from "../../services/api";
import { Mail, MapPin, Briefcase, ChevronLeft, Download, Check, X, Building, CheckCircle2 } from "lucide-react";

export default function CandidateProfileView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const applicationId = searchParams.get('applicationId');
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(searchParams.get('status') || "Pending");
    const [isActionLoading, setIsActionLoading] = useState(false);

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                const res = await api.get(`/recruiter/candidate/${id}`);
                if (res.data.success) {
                    setCandidate(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch candidate profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCandidate();
    }, [id]);

    if (loading) {
        return (
            <RecruiterLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-gray-500 font-medium">Loading candidate profile...</div>
                </div>
            </RecruiterLayout>
        );
    }

    if (!candidate) {
        return (
            <RecruiterLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                    <div className="text-gray-500 font-medium">Candidate not found</div>
                    <button onClick={() => navigate('/recruiter/search')} className="text-cyan-600 hover:underline">
                        Return to Search
                    </button>
                </div>
            </RecruiterLayout>
        );
    }

    const avatarName = candidate.name ? candidate.name.replace(" ", "+") : "User";
    const avatarUrl = `https://ui-avatars.com/api/?name=${avatarName}&background=0d1b2a&color=67e8f9&size=150`;

    // Calculate overall EQ match
    const aggregateEQ = candidate.eqScores?.aggregate || 0;

    const handleAction = async (actionType) => {
        if (!applicationId) return;
        setIsActionLoading(true);
        try {
            const endpoint = actionType === 'shortlist' ? 'shortlist' : 'reject';
            const res = await api.patch(`/applications/${applicationId}/${endpoint}`);
            if (res.data.success) {
                setStatus(res.data.data.status);
            }
        } catch (error) {
            console.error(`Failed to ${actionType} candidate:`, error);
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <RecruiterLayout>
            <div className="max-w-6xl mx-auto pb-12 space-y-6">
                
                {/* Header Back Button */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Search
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Profile Header Card */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-sm">
                            <img src={avatarUrl} alt={candidate.name} className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-slate-50 dark:border-slate-800 shadow-md" />
                            
                            <div className="flex-1 text-center md:text-left space-y-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{candidate.name}</h1>
                                    <p className="text-lg text-cyan-600 dark:text-cyan-400 font-medium mt-1">
                                        {candidate.currentTitle || "Candidate"}
                                    </p>
                                </div>
                                
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-600 dark:text-slate-400">
                                    <div className="flex items-center">
                                        <Mail className="w-4 h-4 mr-1.5 opacity-70" />
                                        {candidate.email}
                                    </div>
                                    {candidate.location && (
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-1.5 opacity-70" />
                                            {candidate.location}
                                        </div>
                                    )}
                                </div>

                                {candidate.bio && (
                                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mt-4">
                                        {candidate.bio}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Experience Section */}
                        {candidate.experience && candidate.experience.length > 0 && (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center gap-2 mb-6">
                                    <Briefcase className="w-5 h-5 text-slate-400" />
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Experience</h2>
                                </div>
                                <div className="space-y-6">
                                    {candidate.experience.map((exp, idx) => (
                                        <div key={idx} className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700">
                                            <div className="absolute w-3 h-3 bg-cyan-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white dark:ring-slate-900"></div>
                                            <h3 className="font-bold text-slate-900 dark:text-white">{exp.title}</h3>
                                            <p className="text-sm text-cyan-600 dark:text-cyan-400 font-medium mt-0.5">{exp.company}</p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {exp.startDate} - {exp.currentlyWorking ? "Present" : exp.endDate} {exp.duration && `· ${exp.duration}`}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Skills Section */}
                        {candidate.skills && (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Core Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {candidate.skills.split(',').map((skill, idx) => (
                                        <span key={idx} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700">
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - EQ & Actions */}
                    <div className="space-y-6">
                        
                        {/* Action Desk */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Action Desk</h2>
                            
                            <div className="space-y-3">
                                {status === "Shortlisted" ? (
                                    <button disabled className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-xl font-bold">
                                        <CheckCircle2 className="w-5 h-5" />
                                        Shortlisted
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => handleAction('shortlist')}
                                        disabled={isActionLoading || !applicationId || status === "Rejected"}
                                        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-colors shadow-sm ${
                                            status === "Rejected" || !applicationId
                                                ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed"
                                                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                                        }`}
                                    >
                                        <Check className="w-5 h-5" />
                                        Shortlist Candidate
                                    </button>
                                )}
                                
                                <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl font-bold transition-colors opacity-50 cursor-not-allowed">
                                    <Mail className="w-5 h-5" />
                                    Message (Coming Soon)
                                </button>

                                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 mt-3">
                                    {status === "Rejected" ? (
                                        <div className="text-center py-2.5 text-sm font-bold text-red-500 bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-100 dark:border-red-900/30">
                                            Application Rejected
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => handleAction('reject')}
                                            disabled={isActionLoading || !applicationId || status === "Shortlisted"}
                                            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold transition-colors ${
                                                status === "Shortlisted" || !applicationId
                                                    ? "text-slate-400 cursor-not-allowed"
                                                    : "text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                                            }`}
                                        >
                                            <X className="w-5 h-5" />
                                            Reject
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            {candidate.resumeLink && (
                                <a 
                                    href={candidate.resumeLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-6 flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-500/50 transition-colors group cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                                            <Download className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">View Resume</p>
                                            <p className="text-xs text-slate-500">PDF Document</p>
                                        </div>
                                    </div>
                                </a>
                            )}
                        </div>

                        {/* EQ Radar Chart */}
                        {candidate.eqScores && (
                            <div>
                                <EQProfileCard eqScores={candidate.eqScores} />
                            </div>
                        )}
                        
                    </div>
                </div>
            </div>
        </RecruiterLayout>
    );
}
