import CandidateLayout from "../../layouts/CandidateLayout";
import { ArrowLeft, Building2, MapPin, Briefcase, Banknote, Clock, ExternalLink, ShieldCheck, Share2, Bookmark } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function JobDetail() {
    const navigate = useNavigate();
    const { id } = useParams();

    // Mock data for the job detail depending on the ID (we can expand this later)
    const jobData = id === '2' ? {
        title: "Global Community Director",
        company: "Lions Clubs International",
        location: "Remote (EMEA)",
        type: "Full-time",
        salary: "€90K - €110K",
        posted: "1 week ago",
        tags: ["Leadership", "Community"],
        description: `Lead our community engagement strategies across Europe, Middle East, and Africa. Ideal for someone with a strong background in non-profit leadership and cross-cultural communication. The Global Community Director will be responsible for defining and executing a comprehensive strategy to engage and grow our diverse membership base.`,
        responsibilities: [
            "Develop and execute regional community engagement strategies.",
            "Collaborate with international board members to align local initiatives with global goals.",
            "Oversee budget allocation for major EMEA events and service projects.",
            "Act as the primary spokesperson for Lions Clubs in the EMEA region."
        ],
        requirements: [
            "10+ years of experience in non-profit management or community leadership.",
            "Proven track record of managing multi-national teams.",
            "Fluency in English; proficiency in French, German, or Spanish is a huge plus.",
            "Strong understanding of cross-cultural dynamics and volunteer-driven organizations."
        ]
    } : {
        title: "Senior Operations Manager",
        company: "Rotary International Foundation",
        location: "Chicago, IL (Hybrid)",
        type: "Full-time",
        salary: "$120K - $150K",
        posted: "2 days ago",
        tags: ["Management", "Operations"],
        description: `We are seeking a highly motivated Senior Operations Manager to oversee global programmatic initiatives. You will work closely with regional directors to ensure seamless execution of humanitarian projects. This role requires an individual who thrives in a fast-paced environment and possesses strong analytical and leadership skills.`,
        responsibilities: [
            "Manage daily operations across multiple global philanthropic programs.",
            "Streamline processes to improve efficiency in grant distributions.",
            "Lead a dedicated team of operations specialists and project managers.",
            "Liaise with the Board of Trustees to report on operational metrics and KPIs."
        ],
        requirements: [
            "8+ years in operations management, preferably within an NGO or large foundation.",
            "Exceptional organizational and project management skills (PMP certification is a plus).",
            "Strong financial acumen and experience managing large-scale budgets.",
            "Commitment to Rotary’s core values of service, fellowship, diversity, integrity, and leadership."
        ]
    };

    return (
        <CandidateLayout>
            {/* Back Navigation */}
            <div className="mb-6">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Search
                </button>
            </div>

            {/* Header / Hero Section */}
            <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-3xl p-8 md:p-10 mb-8 shadow-sm relative overflow-hidden">
                {/* Decorative fade */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[20px] flex items-center justify-center flex-shrink-0">
                            <Building2 className={`w-10 h-10 ${id === '2' ? 'text-indigo-600 dark:text-indigo-500' : 'text-blue-600 dark:text-blue-500'}`} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{jobData.title}</h1>
                            </div>
                            <p className="text-lg font-bold text-slate-600 dark:text-slate-300 mb-4 flex items-center gap-2">
                                {jobData.company}
                                <ShieldCheck className="w-5 h-5 text-blue-500" />
                            </p>

                            <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {jobData.location}</span>
                                <span className="hidden md:inline text-slate-300 dark:text-slate-600">•</span>
                                <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {jobData.type}</span>
                                <span className="hidden md:inline text-slate-300 dark:text-slate-600">•</span>
                                <span className="flex items-center gap-1.5"><Banknote className="w-4 h-4" /> {jobData.salary}</span>
                                <span className="hidden md:inline text-slate-300 dark:text-slate-600">•</span>
                                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Posted {jobData.posted}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <button className="p-3.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-[20px] transition border border-slate-200 dark:border-slate-700 flex-shrink-0 shadow-sm">
                            <Bookmark className="w-5 h-5" />
                        </button>
                        <button className="p-3.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-[20px] transition border border-slate-200 dark:border-slate-700 flex-shrink-0 shadow-sm">
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-[20px] text-xs uppercase tracking-widest font-black transition shadow-sm w-full md:w-auto text-center">
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Details */}
                <div className="flex-1 space-y-8">
                    <section className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-3xl p-8 shadow-sm">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">About the Role</h2>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                            {jobData.description}
                        </p>
                    </section>

                    <section className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-3xl p-8 shadow-sm">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">Key Responsibilities</h2>
                        <ul className="space-y-4">
                            {jobData.responsibilities.map((req, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">{req}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-3xl p-8 shadow-sm">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">Requirements</h2>
                        <ul className="space-y-4">
                            {jobData.requirements.map((req, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">{req}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-[350px] flex flex-col gap-6">
                    <div className="bg-slate-900 dark:bg-[#0f172a] border border-slate-800 dark:border-[#1e293b] rounded-3xl p-8 shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
                        <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-4">Company Overview</h3>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-white rounded-[16px] flex items-center justify-center flex-shrink-0 p-2">
                                <Building2 className="w-full h-full text-slate-900" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">{jobData.company}</h4>
                                <a href="#" className="text-blue-400 text-xs font-semibold flex items-center gap-1 hover:text-blue-300 transition">
                                    Visit Website <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed mb-6">
                            A global network of 1.4 million neighbors, friends, leaders, and problem-solvers who see a world where people unite and take action to create lasting change.
                        </p>
                        
                        <div className="space-y-4 pt-6 border-t border-slate-800">
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Company Size</p>
                                <p className="text-sm font-bold text-white">1001-5000 Employees</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Industry</p>
                                <p className="text-sm font-bold text-white">Non-profit / Philanthropy</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Founded</p>
                                <p className="text-sm font-bold text-white">1905</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-3xl p-8 shadow-sm">
                        <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {jobData.tags.map(tag => (
                                <span key={tag} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-[16px] text-xs font-bold transition">
                                    {tag}
                                </span>
                            ))}
                            <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-[16px] text-xs font-bold transition">Budgeting</span>
                            <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-[16px] text-xs font-bold transition">Team Building</span>
                            <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-[16px] text-xs font-bold transition">Strategy</span>
                        </div>
                    </div>
                </div>
            </div>
        </CandidateLayout>
    );
}
