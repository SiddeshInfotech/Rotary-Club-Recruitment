import React from "react";
import PublicNavbar from "../components/layout/PublicNavbar";
import { ArrowRight, Star } from "lucide-react";

export default function SuccessStories() {
    return (
        <div className="bg-[#f0f4f8] min-h-screen font-sans">
            <PublicNavbar />

            <div className="bg-[#1a2b4b] py-16 text-center text-white">
                <h1 className="text-4xl font-bold mb-4">Success Stories</h1>
                <p className="text-cyan-100 max-w-2xl mx-auto px-6">See how EQ-Hire is connecting Rotary values with exceptional talent around the world.</p>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="h-48 bg-gray-200 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                                <div className="absolute bottom-4 left-4 z-20">
                                    <span className="bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Tech Sector</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex text-amber-400 mb-3 block">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} fill="currentColor" className="w-4 h-4" />)}
                                </div>
                                <h3 className="font-bold text-xl text-[#1a2b4b] mb-3 leading-tight group-hover:text-cyan-600 transition-colors">
                                    Finding the Perfect Fit: How empathy transformed leadership.
                                </h3>
                                <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                                    When the local Rotary club was looking for a new program director, they didn't just look at resumes. They used the EQ index to find a leader who...
                                </p>
                                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                    <img src={`https://ui-avatars.com/api/?name=User+${i}&background=e2e8f0`} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-bold text-sm text-[#1a2b4b]">Rotary Club of Seattle</p>
                                        <p className="text-xs text-gray-500">Hired 3 months ago</p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-cyan-500 ml-auto group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
