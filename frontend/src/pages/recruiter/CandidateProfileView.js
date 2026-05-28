import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import RecruiterLayout from "../../layouts/RecruiterLayout";
import api from "../../services/api";
import { Mail, MapPin, Briefcase, ChevronLeft, Download, Check, X, CheckCircle2, Award, Cpu, Sparkles, Target, Phone, Code2, Calendar } from "lucide-react";
import EQRadarChart from "../../components/profile/EQRadarChart";
import TechRadarChart from "../../components/profile/TechRadarChart";
import TraitBar from "../../components/profile/TraitBar";
import StatChip from "../../components/profile/StatChip";

const techDimensionLabels = {
    fundamentals: { label: 'Fundamentals', desc: 'Core concepts & syntax' },
    architecture: { label: 'Architecture', desc: 'System design & patterns' },
    debugging: { label: 'Debugging', desc: 'Bug identification & fixing' },
    bestPractices: { label: 'Best Practices', desc: 'Idiomatic & secure code' },
    tooling: { label: 'Tooling', desc: 'Dev tools & CI/CD' },
};

const getProficiencyColor = (level) => {
    switch(level) {
        case 'expert': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
        case 'advanced': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
        case 'intermediate': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
        default: return 'text-slate-500 bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800';
    }
};

export default function CandidateProfileView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const applicationId = searchParams.get('applicationId');
    const [candidate, setCandidate] = useState(null);
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(searchParams.get('status') || "Pending");
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(applicationId ? "job-fit-analysis" : "overview");
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [scheduleDate, setScheduleDate] = useState("");
    const [scheduleTime, setScheduleTime] = useState("");
    const [scheduleType, setScheduleType] = useState("Video");
    const [scheduleRound, setScheduleRound] = useState("Technical Round 1");
    const [scheduleNotes, setScheduleNotes] = useState("");
    const [scheduleMeetingLink, setScheduleMeetingLink] = useState("");
    const [isScheduling, setIsScheduling] = useState(false);

    const handleScheduleSubmit = async (e) => {
        e.preventDefault();
        if (!scheduleDate || !scheduleTime) return;
        setIsScheduling(true);
        try {
            const res = await api.post("/interviews", {
                candidate: candidate._id,
                candidateName: candidate.name,
                candidateEmail: candidate.email,
                job: application?.jobId?._id,
                jobTitle: application?.jobId?.title || "Job Role",
                date: scheduleDate,
                time: scheduleTime,
                type: scheduleType,
                round: scheduleRound,
                notes: scheduleNotes,
                meetingLink: scheduleMeetingLink,
                recruiter: application?.jobId?.recruiter
            });
            if (res.data.success) {
                setStatus("Interview Scheduled");
                setShowScheduleModal(false);
                setScheduleNotes("");
                setScheduleMeetingLink("");
            }
        } catch (error) {
            console.error("Failed to schedule interview:", error);
            alert("Failed to schedule interview. Please try again.");
        } finally {
            setIsScheduling(false);
        }
    };

    useEffect(() => {
        const fetchCandidateAndApplication = async () => {
            try {
                const res = await api.get(`/recruiter/candidate/${id}`);
                if (res.data.success) {
                    setCandidate(res.data.data);
                }
                if (applicationId) {
                    const appRes = await api.get(`/applications/${applicationId}`);
                    if (appRes.data.success) {
                        setApplication(appRes.data.data);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch candidate profile or application:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCandidateAndApplication();
    }, [id, applicationId]);

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

    // Dynamic mapping for EQ scores
    const dynamicEqScores = candidate.eqScores ? {
        Leadership: candidate.eqScores.leadership || 0,
        Loyalty: candidate.eqScores.loyalty || 0,
        Adaptability: candidate.eqScores.adaptability || 0,
        "Growth Mindset": candidate.eqScores.growthMindset || 0,
        Reliability: candidate.eqScores.reliability || 0,
        Teamwork: candidate.eqScores.teamwork || 0,
        Collaboration: candidate.eqScores.collaboration || 0,
        "Problem Solving": candidate.eqScores.problemSolving || 0,
    } : {
        Leadership: 0, Loyalty: 0, Adaptability: 0, "Growth Mindset": 0,
        Reliability: 0, Teamwork: 0, Collaboration: 0, "Problem Solving": 0
    };

    // Calculate EQ Top and Lowest Attributes
    let topAttribute = "Pending";
    let lowestAttribute = "Pending";
    if (candidate.eqScores) {
        let maxScore = -1;
        let minScore = 999;
        Object.entries(dynamicEqScores).forEach(([trait, score]) => {
            if (score > maxScore) {
                maxScore = score;
                topAttribute = trait;
            }
            if (score < minScore) {
                minScore = score;
                lowestAttribute = trait;
            }
        });
    }

    const strongTraitCount = candidate.eqScores
        ? Object.entries(dynamicEqScores).filter(([_, score]) => score >= 70).length
        : 0;

    let lastTestedLabel = "Pending";
    const assessedTimestamp = candidate.lastAssessedAt || (candidate.eqScores?.aggregate ? candidate.updatedAt : null);
    if (candidate.eqScores?.aggregate && assessedTimestamp) {
        const diffMs = Date.now() - new Date(assessedTimestamp).getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffMins < 5) lastTestedLabel = "Just Now";
        else if (diffMins < 60) lastTestedLabel = `${diffMins}m ago`;
        else if (diffHours < 24) lastTestedLabel = `${diffHours}h ago`;
        else if (diffDays < 7) lastTestedLabel = `${diffDays}d ago`;
        else lastTestedLabel = new Date(assessedTimestamp).toLocaleDateString();
    }

    const dynamicEqMetrics = [
        { label: "Top Attribute",  value: topAttribute },
        { label: "Strong Traits",  value: candidate.eqScores?.aggregate ? `${strongTraitCount}/8 Above 70` : "Pending" },
        { label: "Growth Area",    value: lowestAttribute },
        { label: "Last Tested",    value: lastTestedLabel },
    ];

    const hasTakenTest = !!candidate.eqScores?.aggregate && candidate.eqScores.aggregate > 0;
    const hasTakenTechTest = !!candidate.technicalScores?.aggregate && candidate.technicalScores.aggregate > 0;

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

    // Helper to calculate skill match gap
    const getSkillAnalysis = () => {
        if (!candidate || !application || !application.jobId) return { matching: [], missing: [] };
        
        // Clean candidate skills
        const candidateSkillsList = candidate.skills 
            ? candidate.skills.split(',').map(s => s.trim().toLowerCase()) 
            : [];
            
        // Clean job required skills
        const requiredSkillsList = application.jobId.skillsRequired || [];
        
        const matching = [];
        const missing = [];
        
        requiredSkillsList.forEach(skill => {
            const cleanSkill = skill.trim();
            const lowerSkill = cleanSkill.toLowerCase();
            
            // Check if any candidate skill matches/contains the required skill
            const isMatch = candidateSkillsList.some(candSkill => 
                candSkill.includes(lowerSkill) || lowerSkill.includes(candSkill)
            );
            
            if (isMatch) {
                matching.push(cleanSkill);
            } else {
                missing.push(cleanSkill);
            }
        });
        
        return { matching, missing };
    };

    const { matching: matchingSkills, missing: missingSkills } = getSkillAnalysis();

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
                                    <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{candidate.name}</h1>
                                        {candidate.eqScores?.aggregate >= 90 && (
                                            <span className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                                                <Award className="w-3 h-3" /> Elite EQ
                                            </span>
                                        )}
                                    </div>
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

                        {/* Tabs Navigation */}
                        <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800">
                            {(() => {
                                const tabsList = [];
                                if (applicationId && application) {
                                    tabsList.push("Job Fit Analysis");
                                }
                                tabsList.push("Overview", "EQ Details", "Tech Details");
                                return tabsList.map((tab) => {
                                    const key = tab.toLowerCase().replace(/ /g, "-");
                                    const active = activeTab === key || (tab === "Overview" && activeTab === "overview");
                                    return (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(key)}
                                            className={`pb-3 px-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${
                                                active
                                                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                                                    : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                            }`}
                                        >
                                            {tab}
                                        </button>
                                    );
                                });
                            })()}
                        </div>

                        {/* Tabs Content */}
                        <div className="space-y-6">
                            {activeTab === "overview" && (
                                <>
                                    {/* EQ Intelligence DNA Card */}
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                                        <div className="flex items-end justify-between mb-6">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-1">
                                                    EQ Intelligence DNA
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    {hasTakenTest ? "Based on candidate's latest assessment" : "Waiting for assessment..."}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-4xl font-black text-slate-900 dark:text-white leading-none">
                                                    {hasTakenTest ? candidate.eqScores.aggregate : "???"}
                                                </p>
                                                <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mt-1">
                                                    AGGREGATE EQ SCORE
                                                </p>
                                            </div>
                                        </div>

                                        {!hasTakenTest ? (
                                            <div className="flex flex-col items-center justify-center h-[260px] w-full text-center bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                                                <Target className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-3" />
                                                <h3 className="text-md font-bold text-slate-700 dark:text-slate-300 mb-1">Cognitive Profile Locked</h3>
                                                <p className="text-xs font-medium text-slate-500 max-w-sm">
                                                    Candidate has not yet completed the AI-driven EQ Assessment.
                                                </p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center justify-center h-[280px] w-full">
                                                    <EQRadarChart scores={dynamicEqScores} />
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                                                    {dynamicEqMetrics.map((m) => (
                                                        <StatChip key={m.label} label={m.label} value={m.value} />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Technical Proficiency DNA Card */}
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                                        <div className="flex items-end justify-between mb-6">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-1">
                                                    Technical Proficiency DNA
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    {hasTakenTechTest ? "Based on candidate's technical assessment" : "Waiting for assessment..."}
                                                </p>
                                            </div>
                                            {hasTakenTechTest && (
                                                <div className="text-right">
                                                    <p className="text-4xl font-black text-slate-900 dark:text-white leading-none">
                                                        {candidate.technicalScores.aggregate}
                                                    </p>
                                                    <div className="flex items-center justify-end gap-2 mt-1">
                                                        <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${getProficiencyColor(candidate.technicalScores.proficiencyLevel)}`}>
                                                            {candidate.technicalScores.proficiencyLevel?.replace('_', ' ') || 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {!hasTakenTechTest ? (
                                            <div className="flex flex-col items-center justify-center h-[260px] w-full text-center bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                                                <Code2 className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-3" />
                                                <h3 className="text-md font-bold text-slate-700 dark:text-slate-300 mb-1">Technical Profile Locked</h3>
                                                <p className="text-xs font-medium text-slate-500 max-w-sm">
                                                    Candidate has not yet completed the AI-driven Technical Assessment.
                                                </p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center justify-center h-[280px] w-full">
                                                    <TechRadarChart scores={candidate.technicalScores} />
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                                                    {(() => {
                                                        const scores = candidate.technicalScores;
                                                        const dims = Object.entries(techDimensionLabels);
                                                        const sorted = dims.sort((a, b) => (scores[b[0]] || 0) - (scores[a[0]] || 0));
                                                        const topSkill = sorted[0];
                                                        const growthArea = sorted[sorted.length - 1];

                                                        let lastTechTestedLabel = "Pending";
                                                        const techAssessedTimestamp = candidate.lastTechAssessedAt || (scores.aggregate ? candidate.updatedAt : null);
                                                        if (scores.aggregate && techAssessedTimestamp) {
                                                            const diffMs = Date.now() - new Date(techAssessedTimestamp).getTime();
                                                            const diffMins = Math.floor(diffMs / 60000);
                                                            const diffHours = Math.floor(diffMs / 3600000);
                                                            const diffDays = Math.floor(diffMs / 86400000);
                                                            if (diffMins < 5) lastTechTestedLabel = "Just Now";
                                                            else if (diffMins < 60) lastTechTestedLabel = `${diffMins}m ago`;
                                                            else if (diffHours < 24) lastTechTestedLabel = `${diffHours}h ago`;
                                                            else if (diffDays < 7) lastTechTestedLabel = `${diffDays}d ago`;
                                                            else lastTechTestedLabel = new Date(techAssessedTimestamp).toLocaleDateString();
                                                        }

                                                        const dynamicTechMetrics = [
                                                            { label: "Top Skill", value: topSkill[1].label },
                                                            { label: "Proficiency", value: scores.proficiencyLevel ? scores.proficiencyLevel.charAt(0).toUpperCase() + scores.proficiencyLevel.slice(1).replace('_', ' ') : "N/A" },
                                                            { label: "Growth Area", value: growthArea[1].label },
                                                            { label: "Last Tested", value: lastTechTestedLabel },
                                                        ];
                                                        return dynamicTechMetrics.map((m) => (
                                                            <StatChip key={m.label} label={m.label} value={m.value} />
                                                        ));
                                                    })()}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}

                            {activeTab === "eq-details" && (
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-6">
                                        Trait Breakdown
                                    </p>
                                    {!hasTakenTest ? (
                                        <div className="text-center py-10">
                                            <p className="text-slate-500 text-sm font-medium">Trait Breakdown is locked until candidate completes the EQ Assessment.</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-4">
                                            {Object.entries(dynamicEqScores).map(([trait, score]) => (
                                                <TraitBar key={trait} trait={trait} score={score} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "tech-details" && (
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <p className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200">
                                            Technical Dimension Breakdown
                                        </p>
                                        {hasTakenTechTest && (
                                            <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded border ${getProficiencyColor(candidate.technicalScores.proficiencyLevel)}`}>
                                                {candidate.technicalScores.proficiencyLevel?.replace('_', ' ')}
                                            </span>
                                        )}
                                    </div>
                                    {!hasTakenTechTest ? (
                                        <div className="text-center py-10">
                                            <Code2 className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                                            <p className="text-slate-500 text-sm font-medium">Technical Breakdown is locked until candidate completes the Technical Assessment.</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-5">
                                            {Object.entries(techDimensionLabels).map(([key, dim]) => {
                                                const score = candidate.technicalScores[key] || 0;
                                                const color = score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-blue-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500';
                                                const textColor = score >= 80 ? 'text-emerald-600 dark:text-emerald-400' : score >= 60 ? 'text-blue-600 dark:text-blue-400' : score >= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-450';
                                                const level = score >= 90 ? 'Expert' : score >= 70 ? 'Advanced' : score >= 45 ? 'Intermediate' : 'Beginner';
                                                return (
                                                    <div key={key} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div>
                                                                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{dim.label}</span>
                                                                <span className="text-[11px] text-slate-400 ml-2 font-medium">{dim.desc}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className={`text-[10px] font-bold uppercase tracking-wider ${textColor}`}>{level}</span>
                                                                <span className="text-sm font-black text-slate-900 dark:text-white">{score}%</span>
                                                            </div>
                                                        </div>
                                                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                                            <div className={`h-full rounded-full transition-all duration-1000 ${color}`} style={{ width: `${score}%` }}></div>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {/* Overall Score Card */}
                                            <div className="mt-2 p-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <Cpu className="w-6 h-6 text-emerald-200" />
                                                    <div>
                                                        <p className="text-xs font-bold uppercase tracking-widest text-emerald-200">Overall Technical Score</p>
                                                        <p className="text-xs text-emerald-100 mt-0.5 capitalize">Proficiency: {candidate.technicalScores.proficiencyLevel?.replace('_', ' ')}</p>
                                                    </div>
                                                </div>
                                                <p className="text-4xl font-black">{candidate.technicalScores.aggregate}<span className="text-lg text-emerald-200">%</span></p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "job-fit-analysis" && application && (
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Job Fit & Gap Analysis</h3>
                                            <p className="text-xs text-slate-500 mt-0.5">Applied Role: <span className="font-semibold text-cyan-600 dark:text-cyan-400">{application.jobId?.title}</span></p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-100 dark:border-blue-800/30">
                                                Weighted Fit: {application.eqMatchScore}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Scores Overview Card */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                                            <Target className="w-5 h-5 text-slate-400 mb-1.5" />
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">Tech Fit Score</span>
                                            <span className="text-2xl font-black text-slate-800 dark:text-white mt-1">
                                                {application.technicalScore >= 0 ? `${application.technicalScore}%` : "N/A"}
                                            </span>
                                            <p className="text-[10px] text-slate-400 mt-1 max-w-[180px]">
                                                Candidate's technical test score scaled by alignment factor.
                                            </p>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                                            <CheckCircle2 className="w-5 h-5 text-purple-400 mb-1.5" />
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">EQ Fit Score</span>
                                            <span className="text-2xl font-black text-slate-800 dark:text-white mt-1">
                                                {application.eqScore >= 0 ? `${application.eqScore}%` : "N/A"}
                                            </span>
                                            <p className="text-[10px] text-slate-400 mt-1 max-w-[180px]">
                                                Candidate's verified emotional intelligence aggregate score.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Skill Comparison Matrix */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Skill Comparison Matrix</h4>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Left Column: Matching Skills */}
                                            <div className="p-5 bg-emerald-50/30 dark:bg-emerald-950/5 border border-emerald-100 dark:border-emerald-900/30 rounded-xl space-y-3">
                                                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                                    <Check className="w-4 h-4" />
                                                    <span className="text-xs font-bold uppercase tracking-wider">Matching Skills ({matchingSkills.length})</span>
                                                </div>
                                                {matchingSkills.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {matchingSkills.map((s, i) => (
                                                            <span key={i} className="px-2.5 py-1 bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wide rounded-md border border-emerald-200 dark:border-emerald-900/50">
                                                                {s}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-[11px] font-medium text-slate-500 italic">No matching skills identified.</p>
                                                )}
                                            </div>

                                            {/* Right Column: Missing Skills / Gaps */}
                                            <div className="p-5 bg-red-50/20 dark:bg-red-950/5 border border-red-100 dark:border-red-900/20 rounded-xl space-y-3">
                                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                                    <X className="w-4 h-4" />
                                                    <span className="text-xs font-bold uppercase tracking-wider">Missing Skills / Gaps ({missingSkills.length})</span>
                                                </div>
                                                {missingSkills.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {missingSkills.map((s, i) => (
                                                            <span key={i} className="px-2.5 py-1 bg-white dark:bg-slate-800 text-red-500 dark:text-red-400 text-[10px] font-bold uppercase tracking-wide rounded-md border border-red-200 dark:border-red-900/50">
                                                                {s}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-[11px] font-medium text-slate-500 italic">No missing skills required for this job.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Match Verdict Reasoning */}
                                    <div className="p-5 bg-blue-50/30 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-900/20 rounded-2xl space-y-2">
                                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                            <Sparkles className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">AI Evaluation & Gap Reasoning</span>
                                        </div>
                                        <p className="text-[13px] text-slate-600 dark:text-slate-350 leading-relaxed italic">
                                            "{application.matchReasoning || "AI analysis not generated."}"
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Actions & Details Sidebar */}
                    <div className="space-y-6">
                        
                        {/* Action Desk */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Action Desk</h2>
                            
                            <div className="space-y-3">
                                {status === "Shortlisted" && application?.currentRound !== "Online Assessment" && (
                                    <div className="w-full text-center py-3 px-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        Shortlisted
                                    </div>
                                )}

                                {status === "Interview Scheduled" && application?.currentRound !== "Online Assessment" && (
                                    <div className="w-full text-center py-3 px-4 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                                        <Calendar className="w-5 h-5 text-blue-500" />
                                        Interview Scheduled
                                    </div>
                                )}
                                
                                {application?.currentRound === "Online Assessment" && (
                                    <div className="w-full text-center py-3 px-4 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                                        <Calendar className="w-5 h-5 text-amber-500" />
                                        Assessment Scheduled
                                    </div>
                                )}

                                {(status === "Applied" || status === "Reviewing Profile" || status === "Pending") && (
                                    <button 
                                        onClick={() => handleAction('shortlist')}
                                        disabled={isActionLoading || !applicationId}
                                        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-colors shadow-sm ${
                                            !applicationId
                                                ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed"
                                                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                                        }`}
                                    >
                                        <Check className="w-5 h-5" />
                                        Shortlist Candidate
                                    </button>
                                )}

                                {(status === "Shortlisted" || status === "Interview Scheduled") && (
                                    <button 
                                        onClick={() => setShowScheduleModal(true)}
                                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-violet-600 hover:bg-violet-755 text-white rounded-xl font-bold transition-colors shadow-sm shadow-violet-600/20"
                                    >
                                        <Calendar className="w-5 h-5" />
                                        Schedule Round
                                    </button>
                                )}
                                
                                <button 
                                    onClick={() => navigate('/recruiter/messages', { state: { selectUser: candidate } })}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold transition-colors shadow-sm shadow-cyan-600/20"
                                >
                                    <Mail className="w-5 h-5" />
                                    Message Candidate
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

                        {/* Experience Section */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-1.5">
                                <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Professional Experience
                            </p>
                            {candidate.experience && candidate.experience.length > 0 ? (
                                <div className="space-y-4">
                                    {candidate.experience.map((exp, idx) => (
                                        <div key={idx} className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                                            <div className="absolute w-2 h-2 bg-cyan-500 rounded-full -left-[5px] top-1.5 ring-4 ring-white dark:ring-slate-900"></div>
                                            <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{exp.title}</h3>
                                            <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium mt-0.5">{exp.company}</p>
                                            <p className="text-[10px] text-slate-500 mt-1">
                                                {exp.startDate} - {exp.currentlyWorking ? "Present" : exp.endDate} {exp.duration && `· ${exp.duration}`}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                                    <p className="text-slate-500 text-xs font-semibold mb-1">No experience added</p>
                                </div>
                            )}
                        </div>

                        {/* Personal Identity */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-4">
                                PERSONAL IDENTITY
                            </p>

                            <div className="flex flex-col gap-4">
                                {[
                                    { label: "Legal Name",    value: candidate.name, icon: <Award className="w-3.5 h-3.5 text-slate-400" /> },
                                    { label: "Primary Email", value: candidate.email, icon: <Mail className="w-3.5 h-3.5 text-slate-400" /> },
                                    { label: "Current Role",  value: candidate.currentTitle, icon: <Briefcase className="w-3.5 h-3.5 text-slate-400" /> },
                                    { label: "Phone",         value: candidate.phone || "Not set", icon: <Phone className="w-3.5 h-3.5 text-slate-400" /> },
                                ].map(({ label, value, icon }) => (
                                    <div key={label}>
                                        <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1.5">
                                            {icon} {label}
                                        </p>
                                        <p className="text-xs font-bold text-slate-955 dark:text-white leading-snug">
                                            {value}
                                        </p>
                                    </div>
                                ))}

                                {/* Skills */}
                                <div>
                                    <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-slate-400" /> Skills
                                    </p>
                                    {candidate.skills ? (
                                        <div className="flex flex-wrap gap-1.5">
                                            {candidate.skills.split(',').map((s, i) => (
                                                <span key={i} className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
                                                    {s.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs font-bold text-slate-400 dark:text-slate-600 italic">Not set</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
            {/* Schedule Interview Modal */}
            {showScheduleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Schedule Interview Round</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Candidate: <span className="font-semibold">{candidate.name}</span></p>
                            </div>
                            <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Interview Round / Stage</label>
                                <select 
                                    value={scheduleRound}
                                    onChange={(e) => setScheduleRound(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                                >
                                    <option value="Online Assessment">Online Assessment</option>
                                    <option value="Technical Round 1">Technical Round 1</option>
                                    <option value="Technical Round 2">Technical Round 2</option>
                                    <option value="HR Round">HR Round</option>
                                    <option value="Offer Discussion">Offer Discussion</option>
                                    <option value="General Interview">General Interview</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Date</label>
                                    <input 
                                        type="date"
                                        required
                                        value={scheduleDate}
                                        onChange={(e) => setScheduleDate(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Time</label>
                                    <input 
                                        type="time"
                                        required
                                        value={scheduleTime}
                                        onChange={(e) => setScheduleTime(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Medium / Type</label>
                                    <select 
                                        value={scheduleType}
                                        onChange={(e) => setScheduleType(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                                    >
                                        <option value="Video">Video Call</option>
                                        <option value="Phone">Phone Interview</option>
                                        <option value="In-person">On-site / In-person</option>
                                        <option value="Panel">Panel Interview</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Meeting Link</label>
                                    <input 
                                        type="text"
                                        placeholder="https://zoom.us/j/..."
                                        value={scheduleMeetingLink}
                                        onChange={(e) => setScheduleMeetingLink(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Instructions / Notes</label>
                                <textarea 
                                    placeholder="Enter details or preparation tips for the candidate..."
                                    rows="3"
                                    value={scheduleNotes}
                                    onChange={(e) => setScheduleNotes(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm leading-relaxed"
                                ></textarea>
                            </div>

                            <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                                <button 
                                    type="button"
                                    onClick={() => setShowScheduleModal(false)}
                                    className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isScheduling}
                                    className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-slate-350 text-white font-bold transition-colors text-sm flex items-center gap-2 shadow-sm shadow-violet-600/20 cursor-pointer"
                                >
                                    {isScheduling ? "Scheduling..." : "Schedule Round"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </RecruiterLayout>
    );
}
