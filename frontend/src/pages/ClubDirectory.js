import React from "react";
import { Users, Search, MapPin, Building, ChevronRight } from "lucide-react";
import PublicNavbar from "../components/layout/PublicNavbar";

export default function ClubDirectory() {
    const clubs = [
        { name: "Rotary Club of San Francisco", district: "5150", members: 142, focus: "Community Health, Education", location: "San Francisco, CA" },
        { name: "Rotary Club of New York", district: "7230", members: 215, focus: "International Service, Youth", location: "New York, NY" },
        { name: "Rotary Club of London", district: "1130", members: 180, focus: "Environmental Sustainability", location: "London, UK" },
        { name: "Rotary Club of Tokyo", district: "2750", members: 320, focus: "Economic Development", location: "Tokyo, Japan" },
        { name: "Rotary Club of Sydney", district: "9675", members: 165, focus: "Peace and Conflict Resolution", location: "Sydney, Australia" },
        { name: "Rotary Club of Toronto", district: "7070", members: 198, focus: "Water and Sanitation", location: "Toronto, Canada" },
    ];

    return (
        <div className="bg-[#f0f4f8] min-h-screen font-sans">
            <PublicNavbar />
            
            <div className="bg-[#1a2b4b] py-16 text-center text-white">
                <h1 className="text-4xl font-bold mb-4">Rotary Club Directory</h1>
                <p className="text-cyan-100 max-w-2xl mx-auto">Discover and connect with Rotary clubs around the world making an impact in their local and global communities.</p>
                
                <div className="max-w-3xl mx-auto mt-8 relative px-6">
                    <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search by club name, district, or location..." 
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-lg"
                    />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clubs.map((club, idx) => (
                        <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
                            <div className="h-24 bg-gradient-to-r from-blue-600 to-cyan-500 relative">
                                <div className="absolute -bottom-6 left-6 w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center p-2">
                                    <Building className="w-full h-full text-[#1a2b4b]" />
                                </div>
                            </div>
                            <div className="p-6 pt-10">
                                <h3 className="font-bold text-lg text-[#1a2b4b] mb-1 group-hover:text-cyan-600 transition-colors">{club.name}</h3>
                                <p className="text-sm font-semibold text-cyan-600 mb-4">District {club.district}</p>
                                
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-start gap-2 text-sm text-gray-600">
                                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" /> {club.location}
                                    </div>
                                    <div className="flex items-start gap-2 text-sm text-gray-600">
                                        <Users className="w-4 h-4 text-gray-400 mt-0.5" /> {club.members} active members
                                    </div>
                                </div>
                                
                                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Focus: <span className="font-medium text-gray-700">{club.focus}</span></span>
                                    <button className="text-cyan-600 hover:text-cyan-800 p-1 bg-cyan-50 rounded-full transition-colors">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
