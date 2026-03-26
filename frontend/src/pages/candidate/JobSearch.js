import CandidateLayout from "../../layouts/CandidateLayout";
import { Search, Briefcase, MapPin, Building2, Filter, ChevronDown, Clock, Banknote } from 'lucide-react';

export default function JobSearch() {
    return (
        <CandidateLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-8">
                <div className="max-w-[700px]">
                    <h3 className="text-[10px] tracking-widest font-bold text-slate-400 dark:text-slate-500 uppercase mb-3">GLOBAL OPPORTUNITIES</h3>
                    <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4 font-serif">Job Search</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
                        Explore open positions across the Rotary, Lions, and BNI ecosystems. Use advanced filters to find the perfect role.
                    </p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-6 mb-10 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Job title, keywords, or company..." 
                            className="w-full bg-slate-50 dark:bg-[#0b1121] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-semibold py-4 pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                        />
                    </div>
                    <div className="md:w-[250px] relative">
                        <MapPin className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="City, state, or Remote" 
                            className="w-full bg-slate-50 dark:bg-[#0b1121] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-semibold py-4 pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                        />
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 px-10 text-xs uppercase font-bold tracking-widest transition shadow-sm w-full md:w-auto">
                        SEARCH
                    </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex flex-wrap gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                            Job Type <ChevronDown className="w-3 h-3" />
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                            Experience Level <ChevronDown className="w-3 h-3" />
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                            Salary Range <ChevronDown className="w-3 h-3" />
                        </button>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition uppercase">
                        <Filter className="w-4 h-4" />
                        More Filters
                    </button>
                </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-sm font-bold text-slate-900 dark:text-white">Showing 24 open positions</p>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Sort by:
                    <select className="bg-transparent text-slate-900 dark:text-white font-bold cursor-pointer focus:outline-none">
                        <option>Most Relevant</option>
                        <option>Most Recent</option>
                        <option>Highest Salary</option>
                    </select>
                </div>
            </div>

            {/* Job List */}
            <div className="flex flex-col gap-4">
                {/* Job Card 1 */}
                <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-6 shadow-sm hover:shadow-md transition group cursor-pointer">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex gap-4">
                            <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Building2 className="w-7 h-7 text-blue-600 dark:text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">Senior Operations Manager</h3>
                                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">Rotary International Foundation</p>
                                
                                <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">
                                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Chicago, IL (Hybrid)</span>
                                    <span className="text-slate-300 dark:text-slate-600">•</span>
                                    <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> Full-time</span>
                                    <span className="text-slate-300 dark:text-slate-600">•</span>
                                    <span className="flex items-center gap-1.5"><Banknote className="w-3.5 h-3.5" /> $120K - $150K</span>
                                </div>

                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mb-4">
                                    We are seeking a highly motivated Senior Operations Manager to oversee global programmatic initiatives. You will work closely with regional directors to ensure seamless execution of humanitarian projects...
                                </p>
                                
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-md text-[10px] font-bold uppercase tracking-wider">Management</span>
                                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-[10px] font-bold uppercase tracking-wider">Operations</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 flex-shrink-0">
                            <button className="bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 px-6 py-3 rounded-xl text-xs uppercase tracking-widest font-black transition w-full md:w-auto text-center border border-slate-800 dark:border-slate-700">
                                Apply Now
                            </button>
                            <span className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-slate-400">
                                <Clock className="w-3 h-3" /> 2 days ago
                            </span>
                        </div>
                    </div>
                </div>

                {/* Job Card 2 */}
                <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-6 shadow-sm hover:shadow-md transition group cursor-pointer">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex gap-4">
                            <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Building2 className="w-7 h-7 text-indigo-600 dark:text-indigo-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">Global Community Director</h3>
                                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">Lions Clubs International</p>
                                
                                <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">
                                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Remote (EMEA)</span>
                                    <span className="text-slate-300 dark:text-slate-600">•</span>
                                    <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> Full-time</span>
                                    <span className="text-slate-300 dark:text-slate-600">•</span>
                                    <span className="flex items-center gap-1.5"><Banknote className="w-3.5 h-3.5" /> €90K - €110K</span>
                                </div>

                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mb-4">
                                    Lead our community engagement strategies across Europe, Middle East, and Africa. Ideal for someone with a strong background in non-profit leadership and cross-cultural communication...
                                </p>
                                
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-md text-[10px] font-bold uppercase tracking-wider">Leadership</span>
                                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-[10px] font-bold uppercase tracking-wider">Community</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 flex-shrink-0">
                            <button className="bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 px-6 py-3 rounded-xl text-xs uppercase tracking-widest font-black transition w-full md:w-auto text-center border border-slate-800 dark:border-slate-700">
                                Apply Now
                            </button>
                            <span className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-slate-400">
                                <Clock className="w-3 h-3" /> 1 week ago
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Pagination Placeholder */}
            <div className="flex justify-center mt-10">
                <button className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-8 py-3 rounded-xl text-xs uppercase tracking-widest font-bold transition shadow-sm">
                    Load More Jobs
                </button>
            </div>
        </CandidateLayout>
    );
}
