import RecruiterLayout from "../../layouts/RecruiterLayout";
import { Briefcase, FileText, Users, TrendingUp, MoreVertical, Plus } from "lucide-react";

// Recruiter dashboard - stats, job listings table, top candidates
export default function RecruiterDashboard() {

    // stat card data
    const stats = [
        { label: "Active Jobs", value: "6", icon: Briefcase, color: "text-[#1a2b4b]", bg: "bg-blue-50", iconBg: "bg-blue-100" },
        { label: "Total Applications", value: "48", icon: FileText, color: "text-[#1a2b4b]", bg: "bg-purple-50", iconBg: "bg-purple-100" },
        { label: "Shortlisted", value: "12", icon: Users, color: "text-[#1a2b4b]", bg: "bg-emerald-50", iconBg: "bg-emerald-100" },
        { label: "Average EQ Match", value: "74%", icon: TrendingUp, color: "text-[#1a2b4b]", bg: "bg-cyan-50", iconBg: "bg-cyan-100" },
    ];

    // active job listing data
    const jobs = [
        { title: "Senior Product Manager", type: "Full-time · Remote", apps: 14, match: 89, status: "Active" },
        { title: "UX Designer", type: "Full-time · Hybrid", apps: 9, match: 82, status: "Active" },
        { title: "Full Stack Developer", type: "Full-time · On-site", apps: 11, match: 76, status: "Active" },
        { title: "Marketing Specialist", type: "Part-time · Remote", apps: 7, match: 71, status: "Paused" },
        { title: "Data Analyst", type: "Full-time · Hybrid", apps: 5, match: 68, status: "Active" },
        { title: "HR Manager", type: "Full-time · On-site", apps: 2, match: 65, status: "Active" },
    ];

    // top matched candidates
    const candidates = [
        {
            name: "Sarah Chen", type: "Empathetic Leader", match: 89,
            traits: [
                { name: "Emotional Intelligence", value: 92, color: "bg-[#1a2b4b]" },
                { name: "Collaboration", value: 88, color: "bg-[#2dd4bf]" },
                { name: "Adaptability", value: 85, color: "bg-[#2dd4bf]" },
            ]
        },
        {
            name: "Marcus Johnson", type: "Strategic Thinker", match: 82,
            traits: [
                { name: "Problem Solving", value: 90, color: "bg-[#1a2b4b]" },
                { name: "Leadership", value: 84, color: "bg-[#2dd4bf]" },
                { name: "Communication", value: 78, color: "bg-[#2dd4bf]" },
            ]
        },
        {
            name: "Emily Rodriguez", type: "Creative Innovator", match: 76,
            traits: [
                { name: "Creativity", value: 94, color: "bg-[#1a2b4b]" },
                { name: "Teamwork", value: 80, color: "bg-[#2dd4bf]" },
                { name: "Self-Awareness", value: 72, color: "bg-[#2dd4bf]" },
            ]
        },
        {
            name: "David Kim", type: "Analytical Mind", match: 71,
            traits: [
                { name: "Critical Thinking", value: 91, color: "bg-[#1a2b4b]" },
                { name: "Attention to Detail", value: 87, color: "bg-[#2dd4bf]" },
                { name: "Resilience", value: 74, color: "bg-[#2dd4bf]" },
            ]
        },
    ];

    return (
        <RecruiterLayout>
            <div className="space-y-8 pb-10">

                {/* stat cards row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div key={i} className="group bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between hover:shadow-lg hover:-translate-y-0.5 hover:border-[#1a2b4b]/20 transition-all duration-300 cursor-default">
                                <div>
                                    <p className="text-[13px] text-gray-500 font-medium">{stat.label}</p>
                                    <p className="text-[28px] font-bold text-[#1a2b4b] leading-tight mt-1">{stat.value}</p>
                                </div>
                                <div className={`w-11 h-11 rounded-lg ${stat.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-5 h-5 text-[#1a2b4b]" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* active job listings table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-[17px] font-bold text-[#1a2b4b] tracking-tight">Active Job Listings</h2>
                        <button className="flex items-center gap-1.5 bg-[#1a2b4b] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#243a5e] transition-colors">
                            <Plus className="w-3.5 h-3.5" /> Post New Job
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                    <th className="py-4 px-6">Job Title</th>
                                    <th className="py-4 px-6">Applications</th>
                                    <th className="py-4 px-6">Top EQ Match</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map((job, i) => (
                                    <tr key={i} className="border-t border-gray-50 hover:bg-blue-50/40 transition-colors group cursor-pointer">
                                        <td className="py-4 px-6">
                                            <p className="font-semibold text-sm text-[#1a2b4b] group-hover:text-blue-700 transition-colors">{job.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{job.type}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm font-semibold text-[#1a2b4b]">{job.apps}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`text-sm font-bold ${job.match >= 80 ? "text-emerald-500" : job.match >= 70 ? "text-cyan-500" : "text-amber-500"}`}>
                                                {job.match}%
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                                job.status === "Active"
                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                                    : "bg-gray-100 text-gray-500 border border-gray-200"
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${job.status === "Active" ? "bg-emerald-500" : "bg-gray-400"}`}></span>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <button className="px-4 py-1.5 bg-[#1a2b4b] text-white text-xs font-semibold rounded-md hover:bg-[#243a5e] transition-colors">
                                                View Candidates
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* top EQ matched candidates */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-[17px] font-bold text-[#1a2b4b] tracking-tight mb-6">Top EQ Matched Candidates</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {candidates.map((candidate, i) => (
                            <div key={i} className="group border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:-translate-y-0.5 hover:border-cyan-200 transition-all duration-300 relative overflow-hidden">
                                {/* subtle glow on hover */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-100 rounded-full mix-blend-multiply filter blur-2xl opacity-0 group-hover:opacity-40 transition-opacity -translate-y-1/2 translate-x-1/2"></div>

                                {/* avatar + match ring */}
                                <div className="flex items-start justify-between mb-4 relative z-10">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden ring-2 ring-white shadow-sm">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${candidate.name.replace(" ", "+")}&background=e2e8f0&color=1a2b4b`}
                                            alt={candidate.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="w-[46px] h-[46px] flex flex-col items-center justify-center rounded-full border-[3px] border-cyan-400 bg-cyan-50 flex-shrink-0">
                                        <span className="text-[13px] font-bold text-cyan-600 leading-none">{candidate.match}%</span>
                                        <span className="text-[7px] font-bold text-cyan-500 leading-none mt-0.5">Match</span>
                                    </div>
                                </div>

                                {/* name + type */}
                                <h3 className="font-bold text-sm text-[#1a2b4b]">{candidate.name}</h3>
                                <p className="text-xs text-cyan-600 font-medium mb-4">{candidate.type}</p>

                                {/* trait bars */}
                                <div className="space-y-3 relative z-10">
                                    {candidate.traits.map((trait, j) => (
                                        <div key={j}>
                                            <div className="flex justify-between text-[11px] mb-1">
                                                <span className="text-gray-600 font-medium">{trait.name}</span>
                                                <span className="font-bold text-[#1a2b4b]">{trait.value}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${trait.color} relative overflow-hidden`}
                                                    style={{ width: `${trait.value}%` }}
                                                >
                                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:animate-shimmer"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* floating action button */}
                <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#1a2b4b] text-white rounded-full shadow-xl shadow-[#1a2b4b]/30 flex items-center justify-center hover:bg-[#243a5e] hover:scale-110 hover:shadow-[#1a2b4b]/50 transition-all duration-300 z-40">
                    <Plus className="w-6 h-6" />
                </button>
            </div>
        </RecruiterLayout>
    );
}
