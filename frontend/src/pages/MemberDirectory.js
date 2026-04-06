import React from "react";
import PublicNavbar from "../components/layout/PublicNavbar";
import { Search, MapPin, Award, CheckCircle2, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function MemberDirectory() {
    const members = [
        { id: 1, name: "David Kim", role: "Software Engineer", eq: 91, location: "Seattle, WA", tags: ["Technical Mentor", "Youth Outreach"] },
        { id: 2, name: "Sarah Chen", role: "Product Manager", eq: 89, location: "San Francisco, CA", tags: ["Leadership", "Event Organizer"] },
        { id: 3, name: "Marcus Johnson", role: "Financial Advisor", eq: 82, location: "Chicago, IL", tags: ["Treasurer", "Fundraising"] }
    ];

    return (
        <div className="bg-[#f0f4f8] min-h-screen font-sans">
            <PublicNavbar />
            
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1a2b4b]">Member Directory</h1>
                        <p className="text-sm text-gray-500 mt-2">Connect with verified Rotary professionals globally.</p>
                    </div>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Search members by name, role, or interest..." 
                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map(member => (
                        <Link to={`/member/${member.id}`} key={member.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-cyan-200 transition-all group block">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-4 items-center">
                                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-sm">
                                        <img src={`https://ui-avatars.com/api/?name=${member.name.replace(' ', '+')}&background=0d1b2a&color=fff`} alt={member.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#1a2b4b] group-hover:text-cyan-600 transition-colors flex items-center gap-1">
                                            {member.name} <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                                        </h3>
                                        <p className="text-sm text-gray-500 font-medium">{member.role}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-3 mb-5">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4 text-gray-400" /> {member.location}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Award className="w-4 h-4 text-emerald-500" /> EQ Ranked: <span className="font-bold text-[#1a2b4b]">{member.eq}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50">
                                {member.tags.map(tag => (
                                    <span key={tag} className="px-2.5 py-1 text-[11px] font-semibold bg-gray-50 text-gray-600 rounded-md border border-gray-200">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
