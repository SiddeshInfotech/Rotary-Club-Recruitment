import CandidateLayout from "../../layouts/CandidateLayout";
import EQRadarChart from "../../components/profile/EQRadarChart";
import TraitBar from "../../components/profile/TraitBar";
import StatBlock from "../../components/profile/StatBlock";
import JobListingRow from "../../components/profile/JobListingRow";
import TestimonialCard from "../../components/profile/TestimonialCard";
import MembershipRow from "../../components/profile/MembershipRow";
import {
    MapPin, CheckCircle, Building2, Users,
    Star, Globe, Mail, ChevronRight, Bookmark, Send,
} from "lucide-react";

const RECRUITER = {
    name: "Priya Nair",
    title: "Talent Director",
    company: "NexCore Intelligence",
    location: "Mumbai, India",
    email: "p.nair@nexcore.ai",
    website: "nexcore.ai",
    verified: true,
    memberSince: "2021",
    bio: "Passionate about matching emotionally intelligent professionals with organisations built for impact. 11+ years in strategic recruitment across FinTech and SaaS.",
    hiresMade: 142,
    avgMatchScore: 91,
    responseTime: "< 24 hrs",
    activeJobs: 6,
};

const EQ_FOCUS = {
    Leadership: 95,
    Adaptability: 88,
    "Growth Mindset": 82,
    Collaboration: 90,
    Reliability: 78,
    Teamwork: 85,
    "Problem Solving": 80,
    Loyalty: 72,
};

const ACTIVE_JOBS = [
    { title: "Strategic Operations Director", type: "Full-time · Hybrid", match: 98, location: "London, UK" },
    { title: "Senior Product Catalyst", type: "Remote · Global", match: 94, location: "Remote" },
    { title: "Head of EQ Strategy", type: "Full-time · On-site", match: 87, location: "Mumbai, IN" },
    { title: "Talent Intelligence Lead", type: "Full-time · Hybrid", match: 83, location: "Singapore" },
];

const TESTIMONIALS = [
    {
        name: "Marcus Sterling",
        role: "VP of Operations",
        text: "Priya understood exactly what I was looking for — not just skills, but cultural alignment. Placed me in under 3 weeks.",
    },
    {
        name: "Ayesha Khan",
        role: "Director of Product",
        text: "The EQ-first approach made all the difference. Priya's shortlisting was incredibly precise and human.",
    },
];

const MEMBERSHIPS = [
    { org: "Rotary International", detail: "Active Professional Member", icon: Star },
    { org: "BNI Global Network", detail: "Platinum Recruiter Chapter", icon: Building2 },
    { org: "SHRM Certified", detail: "Senior Certified Professional", icon: CheckCircle },
];

const STATS = [
    { label: "Hires Made", value: RECRUITER.hiresMade },
    { label: "Avg EQ Match", value: `${RECRUITER.avgMatchScore}%` },
    { label: "Response Time", value: RECRUITER.responseTime },
    { label: "Active Roles", value: RECRUITER.activeJobs },
];

const MATCHED_TRAITS = ["Growth Mindset", "Collaboration", "Adaptability"];

export default function RecruiterProfile() {
    return (
        <CandidateLayout>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10 mt-2">
                <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-1">
                        RECRUITER PROFILE
                    </p>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                        {RECRUITER.name}
                    </h1>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1.5">
                        {RECRUITER.title} · {RECRUITER.company}
                    </p>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                        {RECRUITER.verified && (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full">
                                <CheckCircle className="w-3 h-3" />
                                Verified Recruiter
                            </span>
                        )}
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <MapPin className="w-3 h-3" />
                            {RECRUITER.location}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <Users className="w-3 h-3" />
                            Member since {RECRUITER.memberSince}
                        </span>
                    </div>
                </div>

                <div className="flex gap-3 self-start sm:self-auto">
                    <button className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-[20px] px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm">
                        <Bookmark className="w-4 h-4" />
                        Save
                    </button>
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-[20px] px-5 py-3 text-xs font-bold uppercase tracking-widest transition shadow-sm">
                        <Send className="w-4 h-4" />
                        Express Interest
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8">
                <div className="flex flex-col gap-8">
                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-[20px] p-8 shadow-sm">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-4">
                            ABOUT
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            {RECRUITER.bio}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                            {STATS.map((s) => (
                                <StatBlock key={s.label} label={s.label} value={s.value} />
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-[20px] p-8 shadow-sm">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-1">
                            EQ HIRING PRIORITIES
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                            Traits this recruiter values most in candidates
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex items-center justify-center h-[260px]">
                                <EQRadarChart scores={EQ_FOCUS} />
                            </div>
                            <div className="flex flex-col justify-center gap-3">
                                {Object.entries(EQ_FOCUS).map(([trait, score]) => (
                                    <TraitBar key={trait} trait={trait} score={score} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-[20px] p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200">
                                Open Roles
                            </p>
                            <button className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                View All <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-3">
                            {ACTIVE_JOBS.map((job) => (
                                <JobListingRow key={job.title} {...job} />
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-[20px] p-8 shadow-sm">
                        <p className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-6">
                            Candidate Testimonials
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {TESTIMONIALS.map((t) => (
                                <TestimonialCard key={t.name} {...t} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-[20px] p-6 shadow-sm">
                        <div className="flex flex-col items-center text-center mb-6">
                            <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(RECRUITER.name)}&background=1e3a6e&color=fff&bold=true&size=128`}
                                alt={RECRUITER.name}
                                className="w-20 h-20 rounded-[20px] shadow-md mb-4"
                            />
                            <p className="text-sm font-black text-slate-900 dark:text-white">{RECRUITER.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{RECRUITER.title}</p>
                            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1">{RECRUITER.company}</p>
                        </div>
                        <div className="flex flex-col gap-3 border-t border-slate-100 dark:border-slate-800 pt-5">
                            <a
                                href={`mailto:${RECRUITER.email}`}
                                className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                            >
                                <Mail className="w-4 h-4 flex-shrink-0" />
                                {RECRUITER.email}
                            </a>
                            <a
                                href={`https://${RECRUITER.website}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                            >
                                <Globe className="w-4 h-4 flex-shrink-0" />
                                {RECRUITER.website}
                            </a>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-[20px] p-6 shadow-sm">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-4">
                            MEMBERSHIPS
                        </p>
                        <div className="flex flex-col gap-3">
                            {MEMBERSHIPS.map((m) => (
                                <MembershipRow key={m.org} {...m} />
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-[20px] p-6 shadow-sm">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-3">
                            YOUR MATCH
                        </p>
                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-4xl font-black text-blue-600 dark:text-blue-400">94%</span>
                            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
                                compatibility
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            Your EQ profile strongly aligns with this recruiter's hiring priorities.
                        </p>
                        <div className="mt-4 flex flex-col gap-2">
                            {MATCHED_TRAITS.map((trait) => (
                                <div key={trait} className="flex items-center gap-2">
                                    <CheckCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                    <span className="text-xs text-slate-600 dark:text-slate-400">{trait}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 dark:bg-slate-800 rounded-[20px] p-6 flex flex-col gap-4">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                            ELITE RECRUITER
                        </p>
                        <p className="text-2xl font-black text-white leading-tight">
                            Top 5% on<br />EQ-Hire Platform
                        </p>
                        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-[20px] py-3 text-xs font-bold uppercase tracking-widest transition">
                            Express Interest
                        </button>
                    </div>
                </div>
            </div>
        </CandidateLayout>
    );
}
