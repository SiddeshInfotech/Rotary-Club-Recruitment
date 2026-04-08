import React from "react";
import PublicNavbar from "../components/layout/PublicNavbar";
import { ArrowLeft, Quote, Heart, Share2, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function SuccessStoryDetails() {
    return (
        <div className="bg-[#f0f4f8] min-h-screen font-sans">
            <PublicNavbar />
            
            {/* Hero Image */}
            <div className="w-full h-80 bg-[#1a2b4b] relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply"></div>
                <div className="max-w-4xl mx-auto relative z-10 h-full flex flex-col justify-end pb-12 px-6">
                    <Link to="/success-stories" className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-100 font-semibold text-sm mb-6 w-fit transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Stories
                    </Link>
                    <div className="flex gap-4 items-center mb-4">
                        <span className="bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Tech Sector</span>
                        <span className="text-gray-300 text-sm font-medium">Published March 15, 2026</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                        Finding the Perfect Fit: How empathy transformed leadership.
                    </h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
                {/* Content */}
                <div className="flex-1">
                    <p className="text-lg text-gray-700 leading-relaxed font-medium mb-8">
                        When the local Rotary club was looking for a new program director, they didn't just look at resumes. They used the EQ index to find a leader who not only had the technical skills but the emotional intelligence to unite a divided team.
                    </p>

                    <div className="prose prose-blue max-w-none text-gray-700">
                        <p className="mb-6">
                            Technology companies face a unique challenge: balancing rapid shipment with sustainable team health. For Veridian Dynamics, turnover in the engineering department had reached a peak. Their previous directors were technically brilliant but lacked the core collaborative traits required to foster psychological safety.
                        </p>
                        
                        <div className="my-10 p-8 bg-blue-50 border-l-4 border-blue-600 rounded-r-xl">
                            <Quote className="w-8 h-8 text-blue-300 mb-4" />
                            <p className="text-xl font-medium text-[#1a2b4b] italic leading-relaxed">
                                "The EQ-Hire platform completely reoriented our hiring. We stopped asking 'Can they code this?' and started asking 'Can they lead this team through a crisis?' The metrics provided clear, actionable insights."
                            </p>
                            <p className="mt-4 font-bold text-blue-600">— Director of HR, Veridian Dynamics</p>
                        </div>

                        <h3 className="text-2xl font-bold text-[#1a2b4b] mt-8 mb-4">The Result</h3>
                        <p className="mb-6">
                            Within six months of utilizing the platform to hire Sarah Chen (who scored in the 98th percentile for Empathy and Strategic Thinking), team retention improved by 40%. The focus on emotional intelligence didn't just improve team morale; it directly translated to faster, more effective product launches.
                        </p>
                    </div>

                    <div className="flex items-center gap-6 mt-12 py-6 border-t border-gray-200">
                        <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 font-semibold transition-colors">
                            <Heart className="w-5 h-5" /> 245 Likes
                        </button>
                        <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 font-semibold transition-colors">
                            <Share2 className="w-5 h-5" /> Share Article
                        </button>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-full md:w-80 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-bold text-[#1a2b4b] mb-4 text-sm uppercase tracking-widest">Involved Parties</h3>
                        
                        <div className="flex gap-4 items-center mb-6">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center p-2 border border-gray-200">
                                <Building2 className="w-full h-full text-blue-600" />
                            </div>
                            <div>
                                <p className="font-bold text-sm text-gray-900">Veridian Dynamics</p>
                                <p className="text-xs text-gray-500">Tech Enterprise</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-center">
                            <img src="https://ui-avatars.com/api/?name=Sarah+Chen&background=0d1b2a&color=fff" className="w-12 h-12 rounded-full border border-gray-200" />
                            <div>
                                <p className="font-bold text-sm text-gray-900 cursor-pointer hover:text-cyan-600 transition-colors">Sarah Chen</p>
                                <p className="text-xs text-gray-500">Hired Candidate</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
