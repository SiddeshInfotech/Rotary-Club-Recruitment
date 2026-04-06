import React, { useState } from "react";
import PublicNavbar from "../../components/layout/PublicNavbar";
import { Search, Briefcase, Users, Building, Filter } from "lucide-react";
import { Link } from "react-router-dom";

export default function GlobalSearch() {
    const [searchType, setSearchType] = useState('all'); // all, jobs, candidates, clubs

    const getIcon = (type) => {
        switch(type) {
            case 'job': return <Briefcase className="w-5 h-5 text-blue-500" />;
            case 'candidate': return <Users className="w-5 h-5 text-cyan-500" />;
            case 'club': return <Building className="w-5 h-5 text-emerald-500" />;
            default: return <Search className="w-5 h-5" />;
        }
    };

    return (
        <div className="bg-[#f0f4f8] shadow-inner min-h-screen font-sans">
            <PublicNavbar />
            
            <div className="max-w-5xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-black text-[#1a2b4b] mb-8">Search Results</h1>
                
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            defaultValue="Product Manager"
                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-lg"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl shadow-sm hover:bg-gray-50 transition-colors">
                        <Filter className="w-5 h-5" /> Filters
                    </button>
                    <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-sm hover:bg-blue-700 transition-colors">
                        Search
                    </button>
                </div>

                <div className="flex gap-2 p-1 bg-gray-200/50 rounded-xl w-fit mb-8 border border-gray-200/60 overflow-x-auto">
                    {['all', 'jobs', 'candidates', 'clubs'].map((type) => (
                        <button 
                            key={type}
                            onClick={() => setSearchType(type)}
                            className={`px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide capitalize whitespace-nowrap transition-all ${searchType === type ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    <p className="text-sm font-bold text-gray-500 mb-6 uppercase tracking-widest">Found 24 results for "Product Manager"</p>
                    
                    {/* Fake Results for Preview */}
                    {[
                        { title: "Senior Product Manager", desc: "Veridian Dynamics • Full-time", type: "job", url: "/job/1" },
                        { title: "Sarah Chen", desc: "Product Manager • 98% EQ Match", type: "candidate", url: "/member/2" },
                        { title: "Product Marketing Lead", desc: "NexCore Intelligence • Remote", type: "job", url: "/job/2" },
                        { title: "Rotary Club of Seattle App Project", desc: "Club Initiative • Seattle, WA", type: "club", url: "/clubs" }
                    ].map((res, i) => (
                        <Link to={res.url} key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex gap-5 items-center group">
                            <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex justify-center items-center shrink-0">
                                {getIcon(res.type)}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#1a2b4b] group-hover:text-blue-600 transition-colors">{res.title}</h3>
                                <p className="text-gray-500 font-medium text-sm">{res.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
