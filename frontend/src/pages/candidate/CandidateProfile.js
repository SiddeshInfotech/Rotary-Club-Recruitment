import { useState } from "react";
import CandidateLayout from "../../layouts/CandidateLayout";
import EQRadarChart from "../../components/profile/EQRadarChart";
import TraitBar from "../../components/profile/TraitBar";
import StatChip from "../../components/profile/StatChip";
import MembershipBadge from "../../components/profile/MembershipBadge";
import QuickStatCard from "../../components/profile/QuickStatCard";
import { useAuth } from "../../context/AuthContext";
import {
    CheckCircle, MapPin, Sparkles, Star, Award,
    Plus, ChevronRight, Edit3, Target, TrendingUp, Shield, Clock,
} from "lucide-react";


const EQ_SCORES = {
    Leadership: 88,
    Loyalty: 75,
    Adaptability: 82,
    "Growth Mindset": 94,
    Reliability: 78,
    Teamwork: 65,
    Collaboration: 70,
    "Problem Solving": 73,
};

const EQ_METRICS = [
    { label: "Top Attribute",  value: "Growth Mindset" },
    { label: "Percentile",     value: "Top 2% Globally" },
    { label: "Reliability",    value: "High (9.4/10)" },
    { label: "Last Tested",    value: "14 Days Ago" },
];

const MEMBERSHIPS = [
    { org: "Rotary International", chapter: "Member ID #4071-2021-3", verified: true, icon: Star },
    { org: "BNI Global", chapter: "Platinum Chapter Member", renewal: "Jan 2025" },
];

const GROWTH_JOURNEY = [
    {
        label: "Latest Milestone",
        title: "Advanced Leadership Certification",
        body: "Verified through Rotary Club Professional Excellence Program.",
    },
    {
        label: "Current Focus",
        title: "Adaptability Optimization",
        body: "Working on cross-functional pivots and stress-resilience metrics.",
    },
    {
        label: "Recognition",
        title: "Reliability Master",
        body: "Endorsed by 12 BNI chapter members in the last 90 days.",
        highlight: true,
    },
];

const QUICK_STATS = [
    { icon: Shield,     label: "Privacy",     value: "Protected" },
    { icon: Target,     label: "Match Rate",  value: "94%" },
    { icon: TrendingUp, label: "EQ Trend",    value: "+3.2%" },
    { icon: Clock,      label: "Last Active", value: "Today" },
];

const TABS = ["Overview", "EQ Details", "Growth Journey"];

export default function CandidateProfile() {
    const [activeTab, setActiveTab] = useState("overview");
    const { user } = useAuth();

    const candidate = {
        name: user?.fullName || "Guest User",
        legalName: user?.fullName || "Guest User",
        email: user?.email || "not set",
        role: user?.skills ? user.skills.split(',')[0] : "Not specified",
        location: "London, UK",
        verified: true,
        bio: '"Driving human-centric efficiency through analytical leadership and emotional intelligence."',
        aggregateScore: 88,
    };

    return (
        <CandidateLayout>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10 mt-2">
                <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-1">
                        CANDIDATE PORTFOLIO
                    </p>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                        {candidate.name}
                    </h1>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                        {candidate.verified && (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full">
                                <CheckCircle className="w-3 h-3" />
                                Verified Member
                            </span>
                        )}
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <MapPin className="w-3 h-3" />
                            {candidate.location}
                        </span>
                    </div>
                </div>

                <button className="flex items-center gap-2 self-start sm:self-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition shadow-sm">
                    <Sparkles className="w-4 h-4" />
                    Update EQ Test
                </button>
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
                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
                        <div className="flex items-end justify-between mb-6">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-1">
                                    EQ Intelligence DNA
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Based on your latest assessment (Oct 2023)
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-5xl font-black text-slate-900 dark:text-white leading-none">
                                    {candidate.aggregateScore}
                                </p>
                                <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mt-1">
                                    AGGREGATE SCORE
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center h-[320px] w-full">
                            <EQRadarChart scores={EQ_SCORES} />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                            {EQ_METRICS.map((m) => (
                                <StatChip key={m.label} label={m.label} value={m.value} />
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200">
                                Growth Journey
                            </p>
                            <button className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                View All <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {GROWTH_JOURNEY.map(({ label, title, body, highlight }) => (
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
                            <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full w-[62%] bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" />
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Foundation</span>
                                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">62% to Elite</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Elite Tier</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
                        <p className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-6">
                            Trait Breakdown
                        </p>
                        <div className="flex flex-col gap-4">
                            {Object.entries(EQ_SCORES).map(([trait, score]) => (
                                <TraitBar key={trait} trait={trait} score={score} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-4">
                            MEMBERSHIP STATUS
                        </p>

                        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 mb-3">
                            <Star className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wide">
                                        {MEMBERSHIPS[0].org}
                                    </p>
                                    <span className="text-[9px] font-bold text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        VERIFIED
                                    </span>
                                </div>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                                    {MEMBERSHIPS[0].chapter}
                                </p>
                            </div>
                        </div>

                        {MEMBERSHIPS.slice(1).map((m) => (
                            <MembershipBadge key={m.org} {...m} />
                        ))}

                        <button className="w-full mt-4 flex items-center justify-center gap-2 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl py-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:border-blue-400 hover:text-blue-500 dark:hover:border-blue-600 dark:hover:text-blue-400 transition">
                            <Plus className="w-4 h-4" />
                            Add Credential
                        </button>
                    </div>

                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-5">
                            PERSONAL IDENTITY
                        </p>

                        <div className="flex flex-col gap-4">
                            {[
                                { label: "Legal Name",    value: candidate.legalName },
                                { label: "Primary Email", value: candidate.email },
                                { label: "Current Role",  value: candidate.role },
                            ].map(({ label, value }) => (
                                <div key={label}>
                                    <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-1">
                                        {label}
                                    </p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                                        {value}
                                    </p>
                                </div>
                            ))}
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                                <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed">
                                    {candidate.bio}
                                </p>
                            </div>
                        </div>

                        <button className="mt-5 flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit Profile Details
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {QUICK_STATS.map((s) => (
                            <QuickStatCard key={s.label} {...s} />
                        ))}
                    </div>

                    <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-6 flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-yellow-400" />
                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                                COGNITIVE AGILITY
                            </p>
                        </div>
                        <p className="text-3xl font-black text-white">98%</p>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-blue-400">
                            RESONANCE MATCH
                        </p>
                    </div>
                </div>
            </div>
        </CandidateLayout>
    );
}
