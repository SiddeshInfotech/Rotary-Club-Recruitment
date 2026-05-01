import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CandidateLayout from "../../layouts/CandidateLayout";
import EQRadarChart from "../../components/profile/EQRadarChart";
import TraitBar from "../../components/profile/TraitBar";
import StatChip from "../../components/profile/StatChip";
import MembershipBadge from "../../components/profile/MembershipBadge";
import QuickStatCard from "../../components/profile/QuickStatCard";
import { useAuth } from "../../context/AuthContext";
import { CheckCircle, MapPin, Sparkles, Star, Award, Briefcase,
    Plus, ChevronRight, Edit3, Target, TrendingUp, Shield, Clock, X, Save, Trash2, Edit2,
    Phone, Mail, FileText, Lock, Eye, EyeOff, Key, Link as LinkIcon
} from "lucide-react";
import api from "../../services/api";



const MEMBERSHIPS = [];



const TABS = ["Overview", "EQ Details", "Growth Journey"];

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

    const candidateName = user?.fullName || "Guest User";
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

    // Calculate "Last Tested" from updatedAt timestamp
    let lastTestedLabel = "Pending";
    if (user?.eqScores?.aggregate && user?.updatedAt) {
        const diffMs = Date.now() - new Date(user.updatedAt).getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffMins < 5) lastTestedLabel = "Just Now";
        else if (diffMins < 60) lastTestedLabel = `${diffMins}m ago`;
        else if (diffHours < 24) lastTestedLabel = `${diffHours}h ago`;
        else if (diffDays < 7) lastTestedLabel = `${diffDays}d ago`;
        else lastTestedLabel = new Date(user.updatedAt).toLocaleDateString();
    }

    const dynamicEqMetrics = [
        { label: "Top Attribute",  value: topAttribute },
        { label: "Strong Traits",  value: user?.eqScores?.aggregate ? `${strongTraitCount}/8 Above 70` : "Pending" },
        { label: "Growth Area",    value: lowestAttribute },
        { label: "Last Tested",    value: lastTestedLabel },
    ];

    const dynamicGrowthJourney = [
        {
            label: "Top Strength",
            title: topAttribute !== "Pending" ? `${topAttribute} Mastery` : "Awaiting Assessment",
            body: topAttribute !== "Pending" ? `Your instinctual responses showcase high maturity and capability in ${topAttribute.toLowerCase()}.` : "Complete the assessment to unlock.",
        },
        {
            label: "Current Focus",
            title: lowestAttribute !== "Pending" ? `${lowestAttribute} Optimization` : "Awaiting Assessment",
            body: lowestAttribute !== "Pending" ? `Your AI analysis suggests a growth opportunity by focusing on workplace ${lowestAttribute.toLowerCase()}.` : "Complete the assessment to unlock.",
        },
        {
            label: "Cognitive Potential",
            title: user?.eqScores?.aggregate ? `Aggregate Rating: ${user.eqScores.aggregate}/100` : "Not Available",
            body: "Analyzed continuously scaling to real-world corporate demands.",
            highlight: true,
        },
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
            
            // Send to backend
            const res = await api.put("/auth/me", payload);
            
            // Update Context user
            if (res.data && res.data.data) {
                updateUser(res.data.data);
            }
            
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
                await api.put("/auth/me", { experience: updatedExperiences });
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
            await api.put("/auth/me", { experience: updatedExperiences });
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

                {(() => {
                    const hasScores = user?.eqScores?.aggregate > 0;
                    const hasSkills = user?.skills && user.skills.trim().length > 0;
                    
                    let cooldownDaysLeft = 0;
                    if (hasScores && user?.updatedAt) {
                        const cooldownMs = 30 * 24 * 60 * 60 * 1000;
                        const timeSince = Date.now() - new Date(user.updatedAt).getTime();
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
                            className={`flex items-center gap-2 self-start sm:self-auto rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-widest transition shadow-sm ${
                                isDisabled 
                                    ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed' 
                                    : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-80'
                            }`}
                            title={!hasSkills ? 'You must add skills to your profile first' : (isOnCooldown ? `Next retake available in ${cooldownDaysLeft} days` : '')}
                        >
                            <Sparkles className="w-4 h-4" />
                            {!hasSkills 
                                ? 'Add Skills to Unlock Test' 
                                : !hasScores 
                                ? 'Start EQ Test' 
                                : isOnCooldown 
                                    ? `Retake in ${cooldownDaysLeft} day${cooldownDaysLeft !== 1 ? 's' : ''}` 
                                    : 'Retake EQ Test'}
                        </button>
                    );
                })()}
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
                    )}

                    {(activeTab === "growth-journey") && (
                        <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200">
                                    Growth Journey
                                </p>
                            </div>

                            {!hasTakenTest ? (
                                <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50 mt-4">
                                    <p className="text-slate-500 font-medium">Your Growth Journey insights will become available after your first assessment.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        {dynamicGrowthJourney.map(({ label, title, body, highlight }) => (
                                            <div key={label}>
                                                <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-2">
                                                    {label}
                                                </p>
                                                <p className={`text-sm font-bold leading-snug mb-1 ${highlight ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white"}`}>
                                                    {title}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{body}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8">
                                        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                                            <div 
                                                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000" 
                                                style={{ width: `${user?.eqScores?.aggregate || 0}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between mt-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Foundation</span>
                                            {user?.eqScores?.aggregate !== undefined && user.eqScores.aggregate < 90 && (
                                                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                                    {user.eqScores.aggregate}% to Elite
                                                </span>
                                            )}
                                            <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${user?.eqScores?.aggregate >= 90 ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`}>
                                                {user?.eqScores?.aggregate >= 90 && <Sparkles className="w-3 h-3" />}
                                                Elite Tier
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
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