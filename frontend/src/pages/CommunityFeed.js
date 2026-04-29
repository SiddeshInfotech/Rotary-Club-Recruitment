import React from "react";
import PublicNavbar from "../components/layout/PublicNavbar";
import { MessageSquare, Heart, Share2, Award } from "lucide-react";

export default function CommunityFeed() {
    return (
        <div className="bg-[#f0f4f8] min-h-screen font-sans">
            <PublicNavbar />
            
            <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-[#1a2b4b]">Community Feed</h1>
                    <p className="text-sm text-gray-500 mt-1">Stay updated with the latest stories, achievements, and discussions.</p>
                </div>

                {/* Create Post */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex gap-4">
                    <img src="https://ui-avatars.com/api/?name=Guest+User&background=e2e8f0" alt="Avatar" className="w-10 h-10 rounded-full" />
                    <div className="flex-grow">
                        <textarea 
                            className="w-full bg-gray-50 rounded-lg p-3 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 resize-none text-sm" 
                            rows="2"
                            placeholder="Share an update or success story with the community..."
                        ></textarea>
                        <div className="flex justify-end mt-2">
                            <button className="bg-[#1a2b4b] text-white px-5 py-1.5 rounded-lg font-semibold text-sm hover:bg-[#243a5e] transition-colors">
                                Post
                            </button>
                        </div>
                    </div>
                </div>

                {/* Feed Items */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-3 items-center">
                                <img src="https://ui-avatars.com/api/?name=Rotary+SF&background=1a2b4b&color=fff" alt="Rotary" className="w-10 h-10 rounded-lg shadow-sm" />
                                <div>
                                    <h3 className="font-bold text-[#1a2b4b] text-sm">Rotary Club of San Francisco</h3>
                                    <p className="text-xs text-gray-500">2 hours ago</p>
                                </div>
                            </div>
                            <Award className="w-5 h-5 text-amber-500" />
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed mb-4">
                            We're thrilled to announce the successful completion of our local clean water initiative! Thanks to all the volunteers and matching funds, we installed 5 new purification systems in local schools. #ServiceAboveSelf #RotaryImpact
                        </p>
                        <div className="rounded-lg overflow-hidden h-64 bg-gray-100 mb-4 border border-gray-100 relative">
                            <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply flex items-center justify-center">
                                <span className="text-gray-400 font-medium">[Image Placeholder: Clean Water Event]</span>
                            </div>
                        </div>
                        <div className="flex gap-4 border-t border-gray-100 pt-3 text-sm text-gray-500 font-medium">
                            <button className="flex items-center gap-1.5 hover:text-cyan-600 transition-colors"><Heart className="w-4 h-4" /> 124 Likes</button>
                            <button className="flex items-center gap-1.5 hover:text-cyan-600 transition-colors"><MessageSquare className="w-4 h-4" /> 18 Comments</button>
                            <button className="flex items-center gap-1.5 hover:text-cyan-600 transition-colors"><Share2 className="w-4 h-4" /> Share</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
