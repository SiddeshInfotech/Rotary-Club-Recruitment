import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CandidateLayout from "../../layouts/CandidateLayout";
import EQRadarChart from "../../components/profile/EQRadarChart";
import TechRadarChart from "../../components/profile/TechRadarChart";
import TraitBar from "../../components/profile/TraitBar";
import StatChip from "../../components/profile/StatChip";
import MembershipBadge from "../../components/profile/MembershipBadge";
import QuickStatCard from "../../components/profile/QuickStatCard";
import { useAuth } from "../../context/AuthContext";
import {
    CheckCircle, MapPin, Sparkles, Star, Award, Briefcase,
    Plus, ChevronRight, Edit3, Target, TrendingUp, Shield, Clock, X, Save, Trash2, Edit2,
    Phone, Mail, FileText, Lock, Eye, EyeOff, Key, Link as LinkIcon, Code2, Cpu
} from "lucide-react";
import api from "../../services/api";



const MEMBERSHIPS = [];



const TABS = ["Overview", "EQ Details", "Tech Details"];

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

const CompanyLogo = ({ company }) => {
    const [error, setError] = useState(false);
    
    if (error || !company) {
        return <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />;
    }

    // Try to extract the core brand name (e.g. 'Google Inc.' -> 'google.com')
    const domain = company.toLowerCase().split(' ')[0].replace(/[^a-z0-9]/g, '') + '.com';
    const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

    return (
        <img 
            src={logoUrl} 
            alt={company} 
            className="w-8 h-8 flex-shrink-0 mt-0.5 object-contain rounded-md bg-white border border-slate-100 dark:border-slate-800 p-1"
            onError={() => setError(true)}
        />
    );
};

export default function CandidateProfile() {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("overview");
    const [isEditing, setIsEditing] = useState(false);
    const [experiences, setExperiences] = useState(user?.experience || []);
    const [isAddingExperience, setIsAddingExperience] = useState(false);
    const [editingExpIndex, setEditingExpIndex] = useState(null);
    const [expForm, setExpForm] = useState({ title: "", company: "", duration: "", startDate: "", endDate: "", currentlyWorking: false });
    const [editForm, setEditForm] = useState({
        name: "",
        currentTitle: "",
        location: "",
        bio: "",
        email: "",
        phone: "",
        skills: "",
        resumeLink: "",
        currentPassword: "",
        newPassword: "",
    });
    const [editError, setEditError] = useState("");
    const [editSuccess, setEditSuccess] = useState("");
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);

    const candidateName = user?.fullName || user?.name || "Guest User";
    const formattedName = candidateName.replace(/sauravpunjabi/i, 'Saurav Punjabi').replace(/([a-z])([A-Z])/g, '$1 $2');

    // Dynamically map backend database scores to Display Traits
    const dynamicEqScores = user?.eqScores ? {
        Leadership: user.eqScores.leadership || 0,
        Loyalty: user.eqScores.loyalty || 0,
        Adaptability: user.eqScores.adaptability || 0,
        "Growth Mindset": user.eqScores.growthMindset || 0,
        Reliability: user.eqScores.reliability || 0,
        Teamwork: user.eqScores.teamwork || 0,
        Collaboration: user.eqScores.collaboration || 0,
        "Problem Solving": user.eqScores.problemSolving || 0,
    } : {
        Leadership: 0, Loyalty: 0, Adaptability: 0, "Growth Mindset": 0,
        Reliability: 0, Teamwork: 0, Collaboration: 0, "Problem Solving": 0
    };

    // Dynamically calculate Top and Lowest Attribute
    let topAttribute = "Pending";
    let lowestAttribute = "Pending";
    if (user?.eqScores) {
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

    // Count how many traits scored above 70
    const strongTraitCount = user?.eqScores
        ? Object.entries(dynamicEqScores).filter(([_, score]) => score >= 70).length
        : 0;

    // Calculate "Last Tested" from lastAssessedAt timestamp (fallback to updatedAt for existing users)
    let lastTestedLabel = "Pending";
    const assessedTimestamp = user?.lastAssessedAt || (user?.eqScores?.aggregate ? user?.updatedAt : null);
    if (user?.eqScores?.aggregate && assessedTimestamp) {
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
        { label: "Strong Traits",  value: user?.eqScores?.aggregate ? `${strongTraitCount}/8 Above 70` : "Pending" },
        { label: "Growth Area",    value: lowestAttribute },
        { label: "Last Tested",    value: lastTestedLabel },
    ];


    const candidate = {
        name: formattedName,
        legalName: formattedName,
        email: user?.email || "not set",
        currentTitle: user?.currentTitle || (user?.skills ? user.skills.split(',')[0] : "Strategic Leadership Expert"),
        location: user?.location || "Global Network",
        verified: true,
        bio: user?.bio || `Passionate professional focused on ${user?.skills ? user.skills.split(',')[0] : "career development"} and continuous cognitive growth.`,
        aggregateScore: user?.eqScores?.aggregate || 0,
    };

    const hasTakenTest = !!user?.eqScores;
    const hasTakenTechTest = user?.technicalScores?.aggregate > 0;

    const handleEditSave = async () => {
        setEditError("");
        setEditSuccess("");
        try {
            // Build payload — only send password fields if user filled them
            const payload = {
                name: editForm.name,
                currentTitle: editForm.currentTitle,
                location: editForm.location,
                bio: editForm.bio,
                email: editForm.email,
                phone: editForm.phone,
                skills: editForm.skills,
                resumeLink: editForm.resumeLink,
            };
            if (editForm.newPassword) {
                payload.currentPassword = editForm.currentPassword;
                payload.newPassword = editForm.newPassword;
            }

            const res = await api.put('/auth/me', payload);
            
            // Update Context user
            updateUser({
                name: editForm.name || candidate.name,
                currentTitle: editForm.currentTitle || candidate.currentTitle,
                location: editForm.location || candidate.location,
                bio: editForm.bio || candidate.bio,
                email: editForm.email || candidate.email,
                phone: editForm.phone,
                skills: editForm.skills,
                resumeLink: editForm.resumeLink,
            });
            
            setEditSuccess("Profile updated successfully!");
            setTimeout(() => {
                setIsEditing(false);
                setEditSuccess("");
            }, 1200);
        } catch (error) {
            const msg = error?.response?.data?.message || "Failed to update profile";
            setEditError(msg);
        }
    };

    const handleAddExperience = async () => {
        if (expForm.title && expForm.company) {
            let updatedExperiences;
            if (editingExpIndex !== null) {
                updatedExperiences = [...experiences];
                updatedExperiences[editingExpIndex] = expForm;
            } else {
                updatedExperiences = [...experiences, expForm];
            }
            
            try {
                await api.put('/auth/me', { experience: updatedExperiences });
                setExperiences(updatedExperiences);
                updateUser({ experience: updatedExperiences });
                setExpForm({ title: "", company: "", duration: "", startDate: "", endDate: "", currentlyWorking: false });
                setIsAddingExperience(false);
                setEditingExpIndex(null);
            } catch (error) {
                console.error("Failed to add experience", error);
            }
        }
    };

    const handleDeleteExperience = async (indexToDelete) => {
        const updatedExperiences = experiences.filter((_, idx) => idx !== indexToDelete);
        try {
            await api.put('/auth/me', { experience: updatedExperiences });
            setExperiences(updatedExperiences);
            updateUser({ experience: updatedExperiences });
        } catch (error) {
            console.error("Failed to delete experience", error);
        }
    };

    const handleEditExperience = (index, exp) => {
        setExpForm(exp);
        setEditingExpIndex(index);
        setIsAddingExperience(true);
    };

    return (
        <CandidateLayout>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10 mt-2">
                <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-1">
                        CANDIDATE PORTFOLIO
                    </p>
                    <div className="flex items-center gap-4 mb-2 flex-wrap">
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                            {candidate.name}
                        </h1>
                        {user?.eqScores?.aggregate >= 90 && (
                            <span className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md animate-pulse">
                                <Award className="w-4 h-4" /> Elite Placement Status Unlocked
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <MapPin className="w-3 h-3" />
                            {candidate.location}
                        </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                        {candidate.bio}
                    </p>
                </div>

                {/* Assessment Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 self-start sm:self-auto">
                    {/* EQ Test Button */}
                    {(() => {
                        const hasScores = user?.eqScores?.aggregate > 0;
                        const hasSkills = user?.skills && user.skills.trim().length > 0;
                        
                        let cooldownDaysLeft = 0;
                        const cooldownTimestamp = user?.lastAssessedAt || (hasScores ? user?.updatedAt : null);
                        if (hasScores && cooldownTimestamp) {
                            const cooldownMs = 30 * 24 * 60 * 60 * 1000;
                            const timeSince = Date.now() - new Date(cooldownTimestamp).getTime();
                            if (timeSince < cooldownMs) {
                                cooldownDaysLeft = Math.ceil((cooldownMs - timeSince) / (24 * 60 * 60 * 1000));
                            }
                        }
                        const isOnCooldown = hasScores && cooldownDaysLeft > 0;
                        const isDisabled = isOnCooldown || !hasSkills;

                        return (
                            <button 
                                onClick={() => !isDisabled && navigate('/eq-journey')}
                                disabled={isDisabled}
                                className={`flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-widest transition shadow-sm ${
                                    isDisabled 
                                        ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed' 
                                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-80'
                                }`}
                                title={!hasSkills ? 'You must add skills to your profile first' : (isOnCooldown ? `Next retake available in ${cooldownDaysLeft} days` : '')}
                            >
                                <Sparkles className="w-4 h-4" />
                                {!hasSkills 
                                    ? 'Add Skills First' 
                                    : !hasScores 
                                    ? 'Start EQ Test' 
                                    : isOnCooldown 
                                        ? `Retake in ${cooldownDaysLeft}d` 
                                        : 'Retake EQ Test'}
                            </button>
                        );
                    })()}

                    {/* Tech Test Button */}
                    {(() => {
                        const hasSkills = user?.skills && user.skills.trim().length > 0;
                        const hasTechScores = user?.technicalScores?.aggregate > 0;
                        
                        let techCooldownDays = 0;
                        const techTimestamp = user?.lastTechAssessedAt;
                        if (hasTechScores && techTimestamp) {
                            const cooldownMs = 30 * 24 * 60 * 60 * 1000;
                            const timeSince = Date.now() - new Date(techTimestamp).getTime();
                            if (timeSince < cooldownMs) {
                                techCooldownDays = Math.ceil((cooldownMs - timeSince) / (24 * 60 * 60 * 1000));
                            }
                        }
                        const isOnCooldown = hasTechScores && techCooldownDays > 0;
                        const isDisabled = isOnCooldown || !hasSkills;

                        return (
                            <button 
                                onClick={() => !isDisabled && navigate('/tech-assessment')}
                                disabled={isDisabled}
                                className={`flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-widest transition shadow-sm ${
                                    isDisabled 
                                        ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed' 
                                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                }`}
                                title={!hasSkills ? 'You must add skills to your profile first' : (isOnCooldown ? `Next retake available in ${techCooldownDays} days` : '')}
                            >
                                <Code2 className="w-4 h-4" />
                                {!hasSkills 
                                    ? 'Add Skills First' 
                                    : !hasTechScores 
                                    ? 'Start Tech Test' 
                                    : isOnCooldown 
                                        ? `Retake in ${techCooldownDays}d` 
                                        : 'Retake Tech Test'}
                            </button>
                        );
                    })()}
                </div>
            </div>

            <div className="flex gap-1 mb-8 border-b border-slate-200 dark:border-slate-800">
                {TABS.map((tab) => {
                    const key = tab.toLowerCase().replace(" ", "-");
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
                })}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
                <div className="flex flex-col gap-8">
                    {/* Conditionally rendering based on activeTab */}
                    {(activeTab === "overview") && (
                        <>
                            <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm relative overflow-hidden">
                            <div className="flex items-end justify-between mb-6">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-1">
                                        EQ Intelligence DNA
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {hasTakenTest ? "Based on your latest assessment" : "Waiting for assessment..."}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-5xl font-black text-slate-900 dark:text-white leading-none">
                                        {hasTakenTest ? candidate.aggregateScore : "???"}
                                    </p>
                                    <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mt-1">
                                        AGGREGATE SCORE
                                    </p>
                                </div>
                            </div>

                            {!hasTakenTest ? (
                                <div className="flex flex-col items-center justify-center h-[320px] w-full text-center bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                                    <Target className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4" />
                                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Cognitive Profile Locked</h3>
                                    <p className="text-sm font-medium text-slate-500 max-w-sm mb-6">
                                        Take the AI-Driven EQ Assessment to unlock your personalized behavioral DNA, trait breakdowns, and algorithmic job matching.
                                    </p>
                                    <button 
                                        onClick={() => navigate('/eq-journey')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-widest transition shadow-sm"
                                    >
                                        Start Assessment Now
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-center h-[320px] w-full">
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
                        
                        {/* Technical Scores Section in Overview */}
                        <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm relative overflow-hidden mt-8">
                            <div className="flex items-end justify-between mb-6">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-1">
                                        Technical Proficiency DNA
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {hasTakenTechTest ? "Based on your technical assessment" : "Waiting for assessment..."}
                                    </p>
                                </div>
                                {hasTakenTechTest && (
                                    <div className="text-right">
                                        <p className="text-5xl font-black text-slate-900 dark:text-white leading-none">
                                            {user.technicalScores.aggregate}
                                        </p>
                                        <div className="flex items-center justify-end gap-2 mt-1">
                                            <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${getProficiencyColor(user.technicalScores.proficiencyLevel)}`}>
                                                {user.technicalScores.proficiencyLevel?.replace('_', ' ') || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {!hasTakenTechTest ? (
                                <div className="flex flex-col items-center justify-center h-[240px] w-full text-center bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                                    <Code2 className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4" />
                                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Technical Profile Locked</h3>
                                    <p className="text-sm font-medium text-slate-500 max-w-sm mb-6">
                                        Take the AI-Driven Technical Assessment to unlock your skill matrix, proficiency level, and enhanced job matching.
                                    </p>
                                    <button 
                                        onClick={() => navigate('/tech-assessment')}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-widest transition shadow-sm"
                                    >
                                        Start Tech Assessment
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-center h-[320px] w-full">
                                        <TechRadarChart scores={user.technicalScores} />
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                                        {(() => {
                                            const scores = user.technicalScores;
                                            const dims = Object.entries(techDimensionLabels);
                                            const sorted = dims.sort((a, b) => (scores[b[0]] || 0) - (scores[a[0]] || 0));
                                            const topSkill = sorted[0];
                                            const growthArea = sorted[sorted.length - 1];

                                            let lastTechTestedLabel = "Pending";
                                            const techAssessedTimestamp = user?.lastTechAssessedAt || (scores.aggregate ? user?.updatedAt : null);
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
                        <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
                            <p className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-6">
                                Trait Breakdown
                            </p>
                            {!hasTakenTest ? (
                                <div className="text-center py-10">
                                    <p className="text-slate-500 font-medium">Trait Breakdown is locked until you complete the EQ Assessment.</p>
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

                    {/* Tech Details Tab */}
                    {activeTab === "tech-details" && (
                        <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200">
                                    Technical Dimension Breakdown
                                </p>
                                {hasTakenTechTest && (
                                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded border ${getProficiencyColor(user.technicalScores.proficiencyLevel)}`}>
                                        {user.technicalScores.proficiencyLevel?.replace('_', ' ')}
                                    </span>
                                )}
                            </div>
                            {!hasTakenTechTest ? (
                                <div className="text-center py-10">
                                    <Code2 className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                                    <p className="text-slate-500 font-medium mb-4">Technical Breakdown is locked until you complete the Technical Assessment.</p>
                                    <button 
                                        onClick={() => navigate('/tech-assessment')}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-widest transition shadow-sm"
                                    >
                                        Take Tech Assessment
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-5">
                                    {Object.entries(techDimensionLabels).map(([key, dim]) => {
                                        const score = user.technicalScores[key] || 0;
                                        const color = score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-blue-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500';
                                        const textColor = score >= 80 ? 'text-emerald-600 dark:text-emerald-400' : score >= 60 ? 'text-blue-600 dark:text-blue-400' : score >= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400';
                                        const level = score >= 90 ? 'Expert' : score >= 70 ? 'Advanced' : score >= 45 ? 'Intermediate' : 'Beginner';
                                        return (
                                            <div key={key} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
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
                                    <div className="mt-2 p-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Cpu className="w-6 h-6 text-emerald-200" />
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-widest text-emerald-200">Overall Technical Score</p>
                                                <p className="text-xs text-emerald-100 mt-0.5 capitalize">Proficiency: {user.technicalScores.proficiencyLevel?.replace('_', ' ')}</p>
                                            </div>
                                        </div>
                                        <p className="text-4xl font-black">{user.technicalScores.aggregate}<span className="text-lg text-emerald-200">%</span></p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-6">
                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-4">
                            PROFESSIONAL EXPERIENCE
                        </p>

                        {experiences.length > 0 ? (
                            <div className="flex flex-col gap-3 mb-3">
                                {experiences.map((exp, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 relative group">
                                        <CompanyLogo company={exp.company} />
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-slate-900 dark:text-white">{exp.title}</p>
                                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400 mt-1">{exp.company}</p>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1 font-medium">
                                                {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', {month: 'short', year: 'numeric'}) : ''} 
                                                {exp.startDate && <span className="opacity-50">–</span>} 
                                                {exp.currentlyWorking ? <span className="text-emerald-500 dark:text-emerald-400 font-semibold">Present</span> : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', {month: 'short', year: 'numeric'}) : (exp.startDate ? <span className="text-emerald-500 dark:text-emerald-400 font-semibold">Present</span> : ''))}
                                                {!exp.startDate && exp.duration}
                                            </p>
                                        </div>
                                        <div className="absolute right-3 top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-50 dark:bg-slate-900/40 rounded-lg px-1">
                                            <button onClick={() => handleEditExperience(idx, exp)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors" title="Edit Experience">
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => handleDeleteExperience(idx)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors" title="Delete Experience">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50 mb-3">
                                <p className="text-slate-500 text-xs font-semibold mb-1">No experience added</p>
                                <p className="text-slate-400 text-[10px]">Add your professional work history to boost your algorithmic job matching.</p>
                            </div>
                        )}

                        <button 
                            onClick={() => {
                                setEditingExpIndex(null);
                                setExpForm({ title: "", company: "", duration: "", startDate: "", endDate: "", currentlyWorking: false });
                                setIsAddingExperience(true);
                            }}
                            className="w-full mt-2 flex items-center justify-center gap-2 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl py-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:border-blue-400 hover:text-blue-500 dark:hover:border-blue-600 dark:hover:text-blue-400 transition"
                        >
                            <Plus className="w-4 h-4" />
                            Add Experience
                        </button>
                    </div>

                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-5">
                            PERSONAL IDENTITY
                        </p>

                        <div className="flex flex-col gap-4">
                            {[
                                { label: "Legal Name",    value: candidate.legalName, icon: <Edit3 className="w-3 h-3" /> },
                                { label: "Primary Email", value: candidate.email, icon: <Mail className="w-3 h-3" /> },
                                { label: "Current Role",  value: candidate.currentTitle, icon: <Briefcase className="w-3 h-3" /> },
                                { label: "Phone",         value: user?.phone || "Not set", icon: <Phone className="w-3 h-3" /> },
                            ].map(({ label, value, icon }) => (
                                <div key={label}>
                                    <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1.5">
                                        {icon} {label}
                                    </p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                                        {value}
                                    </p>
                                </div>
                            ))}

                            {/* Skills */}
                            <div>
                                <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                                    <Sparkles className="w-3 h-3" /> Skills
                                </p>
                                {user?.skills ? (
                                    <div className="flex flex-wrap gap-1.5">
                                        {user.skills.split(',').map((s, i) => (
                                            <span key={i} className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
                                                {s.trim()}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm font-bold text-slate-400 dark:text-slate-600 italic">Not set</p>
                                )}
                            </div>

                            {/* Resume Link */}
                            <div>
                                <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1.5">
                                    <FileText className="w-3 h-3" /> Resume
                                </p>
                                {user?.resumeLink ? (
                                    <a href={user.resumeLink} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 break-all">
                                        <LinkIcon className="w-3.5 h-3.5 flex-shrink-0" /> {user.resumeLink.length > 40 ? user.resumeLink.slice(0, 40) + '…' : user.resumeLink}
                                    </a>
                                ) : (
                                    <p className="text-sm font-bold text-slate-400 dark:text-slate-600 italic">Not uploaded</p>
                                )}
                            </div>


                        </div>

                        <button 
                            onClick={() => {
                                setEditError("");
                                setEditSuccess("");
                                setEditForm({
                                    name: candidate.name,
                                    currentTitle: candidate.currentTitle,
                                    location: candidate.location,
                                    bio: candidate.bio,
                                    email: candidate.email,
                                    phone: user?.phone || "",
                                    skills: user?.skills || "",
                                    resumeLink: user?.resumeLink || "",
                                    currentPassword: "",
                                    newPassword: "",
                                });
                                setShowCurrentPw(false);
                                setShowNewPw(false);
                                setIsEditing(true);
                            }}
                            className="mt-5 flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit Profile Details
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">Edit Profile</h3>
                            <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-500 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 flex flex-col gap-5 overflow-y-auto flex-1">
                            {/* Error / Success banners */}
                            {editError && (
                                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-xs font-bold">
                                    <X className="w-4 h-4 flex-shrink-0" /> {editError}
                                </div>
                            )}
                            {editSuccess && (
                                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                                    <CheckCircle className="w-4 h-4 flex-shrink-0" /> {editSuccess}
                                </div>
                            )}

                            {/* ── Section: Personal Info ── */}
                            <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1.5 -mb-2">
                                <Edit3 className="w-3 h-3" /> Personal Information
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Display Name</label>
                                    <input 
                                        type="text" 
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Current Role / Title</label>
                                    <input 
                                        type="text" 
                                        value={editForm.currentTitle}
                                        onChange={(e) => setEditForm({...editForm, currentTitle: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Location</label>
                                <input 
                                    type="text" 
                                    value={editForm.location}
                                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-slate-900 dark:text-white"
                                />
                            </div>

                            {/* ── Section: Contact & Account ── */}
                            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                                <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mb-4">
                                    <Mail className="w-3 h-3" /> Contact & Account
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Email Address</label>
                                        <input 
                                            type="email" 
                                            value={editForm.email}
                                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-slate-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Phone Number</label>
                                        <input 
                                            type="tel" 
                                            value={editForm.phone}
                                            placeholder="e.g. +91 98765 43210"
                                            onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-slate-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ── Section: Skills & Resume ── */}
                            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                                <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mb-4">
                                    <Sparkles className="w-3 h-3" /> Skills & Resume
                                </p>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">
                                        Skills <span className="lowercase font-medium tracking-normal text-slate-400 normal-case">(comma-separated)</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        value={editForm.skills}
                                        placeholder="e.g. React, Node.js, Leadership, Python"
                                        onChange={(e) => setEditForm({...editForm, skills: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">
                                        Resume Link <span className="lowercase font-medium tracking-normal text-slate-400 normal-case">(Google Drive, Dropbox, etc.)</span>
                                    </label>
                                    <input 
                                        type="url" 
                                        value={editForm.resumeLink}
                                        placeholder="https://drive.google.com/file/..."
                                        onChange={(e) => setEditForm({...editForm, resumeLink: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* ── Section: Change Password ── */}
                            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                                <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mb-1">
                                    <Key className="w-3 h-3" /> Change Password
                                </p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-600 mb-4">Leave blank to keep your current password.</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Current Password</label>
                                        <div className="relative">
                                            <input 
                                                type={showCurrentPw ? "text" : "password"} 
                                                value={editForm.currentPassword}
                                                placeholder="••••••••"
                                                onChange={(e) => setEditForm({...editForm, currentPassword: e.target.value})}
                                                className="w-full px-4 py-3 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-slate-900 dark:text-white"
                                            />
                                            <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                                {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">New Password</label>
                                        <div className="relative">
                                            <input 
                                                type={showNewPw ? "text" : "password"} 
                                                value={editForm.newPassword}
                                                placeholder="Min 6 characters"
                                                onChange={(e) => setEditForm({...editForm, newPassword: e.target.value})}
                                                className="w-full px-4 py-3 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-slate-900 dark:text-white"
                                            />
                                            <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                                {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Section: Bio ── */}
                            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                                <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mb-4">
                                    <FileText className="w-3 h-3" /> Professional Bio
                                </p>
                                <textarea 
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                                    rows="3"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-slate-900 dark:text-white resize-none"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 flex-shrink-0">
                            <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleEditSave} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm">
                                <Save className="w-4 h-4" /> Save Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Experience Modal */}
            {isAddingExperience && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">
                                {editingExpIndex !== null ? "Edit Experience" : "Add Experience"}
                            </h3>
                            <button onClick={() => setIsAddingExperience(false)} className="text-slate-400 hover:text-slate-500 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Job Title / Role</label>
                                <input 
                                    type="text" 
                                    value={expForm.title}
                                    placeholder="e.g. Senior Developer"
                                    onChange={(e) => setExpForm({...expForm, title: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-slate-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Company</label>
                                <input 
                                    type="text" 
                                    value={expForm.company}
                                    placeholder="e.g. Acme Corp"
                                    onChange={(e) => setExpForm({...expForm, company: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-slate-900 dark:text-white"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Start Date</label>
                                    <input 
                                        type="month" 
                                        value={expForm.startDate}
                                        onChange={(e) => setExpForm({...expForm, startDate: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">
                                        End Date
                                    </label>
                                    <input 
                                        type="month" 
                                        value={expForm.currentlyWorking ? '' : expForm.endDate}
                                        onChange={(e) => setExpForm({...expForm, endDate: e.target.value})}
                                        disabled={expForm.currentlyWorking}
                                        className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                            expForm.currentlyWorking 
                                                ? 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600 cursor-not-allowed' 
                                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
                                        }`}
                                    />
                                </div>
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer group mt-1">
                                <div className="relative">
                                    <input 
                                        type="checkbox" 
                                        checked={expForm.currentlyWorking}
                                        onChange={(e) => setExpForm({...expForm, currentlyWorking: e.target.checked, endDate: e.target.checked ? '' : expForm.endDate})}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-emerald-500 dark:peer-checked:bg-emerald-500 transition-colors" />
                                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm peer-checked:translate-x-4 transition-transform" />
                                </div>
                                <span className={`text-xs font-bold tracking-wide ${
                                    expForm.currentlyWorking 
                                        ? 'text-emerald-600 dark:text-emerald-400' 
                                        : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400'
                                } transition-colors`}>
                                    I currently work here
                                </span>
                            </label>
                        </div>
                        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                            <button onClick={() => setIsAddingExperience(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleAddExperience} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm">
                                {editingExpIndex !== null ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />} 
                                {editingExpIndex !== null ? "Save Changes" : "Add Experience"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </CandidateLayout>
    );
}
