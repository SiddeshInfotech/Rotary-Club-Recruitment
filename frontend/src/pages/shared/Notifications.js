import React from "react";
import PublicNavbar from "../../components/layout/PublicNavbar";
import { Bell, Briefcase, MessageSquare, Star } from "lucide-react";

export default function Notifications() {
    return (
        <div className="bg-[#f0f4f8] shadow-inner min-h-screen font-sans">
            <PublicNavbar />
            
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-black text-[#1a2b4b]">Notifications</h1>
                    <button className="text-sm font-bold text-blue-600 hover:text-blue-700">Mark all as read</button>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-gray-50 flex gap-4 bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600 border border-blue-200">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-900 mb-1"><span className="font-bold">Veridian Dynamics</span> viewed your candidate profile for <span className="font-medium">Senior Product Manager</span>.</p>
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">2 Hours Ago</p>
                        </div>
                        <div className="w-3 h-3 bg-blue-500 rounded-full shrink-0 self-center"></div>
                    </div>

                    <div className="p-5 border-b border-gray-50 flex gap-4 hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center shrink-0 text-cyan-600 border border-cyan-200">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-900 mb-1"><span className="font-bold">Sarah Chen</span> sent you a direct message.</p>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Yesterday</p>
                        </div>
                    </div>

                    <div className="p-5 flex gap-4 hover:bg-gray-50 transition-colors cursor-pointer opacity-70">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-600 border border-amber-200">
                            <Star className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-900 mb-1">Your EQ Assessment has been fully processed and you are in the top 5% of candidates.</p>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">March 28, 2026</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
