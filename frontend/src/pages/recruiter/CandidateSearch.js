import React, { useState } from "react";
import RecruiterLayout from "../../layouts/RecruiterLayout";
import { Search, Filter, MapPin, Briefcase, Star, ChevronDown } from "lucide-react";

export default function CandidateSearch() {
    const [searchQuery, setSearchQuery] = useState("");

    const candidates = [
        { id: 1, name: "Sarah Chen", role: "Product Manager", location: "San Francisco, CA", eqMatch: 89, avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=0d1b2a&color=67e8f9", traits: ["Empathetic Leader", "Strategic Thinker"] },
        { id: 2, name: "Marcus Johnson", role: "Senior Developer", location: "Remote", eqMatch: 82, avatar: "https://ui-avatars.com/api/?name=Marcus+Johnson&background=0d1b2a&color=67e8f9", traits: ["Analytical Mind", "Problem Solving"] },
        { id: 3, name: "Emily Rodriguez", role: "UX Designer", location: "New York, NY", eqMatch: 76, avatar: "https://ui-avatars.com/api/?name=Emily+Rodriguez&background=0d1b2a&color=67e8f9", traits: ["Creative Innovator", "Team Player"] },
        { id: 4, name: "David Kim", role: "Data Scientist", location: "Seattle, WA", eqMatch: 91, avatar: "https://ui-avatars.com/api/?name=David+Kim&background=0d1b2a&color=67e8f9", traits: ["Detail Oriented", "Critical Thinker"] },
        { id: 5, name: "Anna Smith", role: "Marketing Lead", location: "Austin, TX", eqMatch: 85, avatar: "https://ui-avatars.com/api/?name=Anna+Smith&background=0d1b2a&color=67e8f9", traits: ["Excellent Communicator", "Visionary"] },
        { id: 6, name: "James Wilson", role: "Financial Analyst", location: "Chicago, IL", eqMatch: 72, avatar: "https://ui-avatars.com/api/?name=James+Wilson&background=0d1b2a&color=67e8f9", traits: ["Methodical", "Reliable"] },
    ];

    const filteredCandidates = candidates.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.role.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <RecruiterLayout>
            <div className="space-y-6 pb-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1a2b4b]">Candidate Search</h1>
                        <p className="text-sm text-gray-500 mt-1">Find the perfect matches based on skills and EQ.</p>
                    </div>
                </div>

                {/* Search Bar and Filters */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, role, or keyword..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                            <span className="hidden sm:inline">Role Filter</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                            <Filter className="w-4 h-4" />
                            <span className="hidden sm:inline">More Filters</span>
                        </button>
                    </div>
                </div>

                {/* Candidate Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCandidates.map(candidate => (
                        <div key={candidate.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-cyan-200 hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <img src={candidate.avatar} alt={candidate.name} className="w-14 h-14 rounded-full border-2 border-gray-100" />
                                    <div>
                                        <h3 className="font-bold text-[#1a2b4b] cursor-pointer hover:text-cyan-600 transition-colors">{candidate.name}</h3>
                                        <p className="text-sm text-gray-600 font-medium">{candidate.role}</p>
                                    </div>
                                </div>
                                <div className="w-[42px] h-[42px] flex flex-col items-center justify-center rounded-full border-[2px] border-emerald-400 bg-emerald-50">
                                    <span className="text-xs font-bold text-emerald-600 leading-none">{candidate.eqMatch}%</span>
                                </div>
                            </div>
                            
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    {candidate.location}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Briefcase className="w-4 h-4 text-gray-400" />
                                    Available immediately
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-gray-100 flex gap-2 flex-wrap">
                                {candidate.traits.map((trait, idx) => (
                                    <span key={idx} className="px-2.5 py-1 text-[11px] font-semibold bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                                        {trait}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-5 flex gap-2">
                                <button className="flex-1 bg-[#1a2b4b] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#243a5e] transition-colors">View Profile</button>
                                <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-cyan-600 transition-colors">
                                    <Star className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </RecruiterLayout>
    );
}
