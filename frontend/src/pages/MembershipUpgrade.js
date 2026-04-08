import React from "react";
import PublicNavbar from "../components/layout/PublicNavbar";
import { CheckCircle, Shield, Zap, CircleDollarSign } from "lucide-react";

export default function MembershipUpgrade() {
    return (
        <div className="bg-[#f0f4f8] min-h-screen font-sans">
            <PublicNavbar />
            
            <div className="max-w-7xl mx-auto px-6 py-16 text-center">
                <h1 className="text-4xl font-black text-[#1a2b4b] mb-4">Elevate Your Impact</h1>
                <p className="text-gray-600 max-w-2xl mx-auto mb-12">Upgrade your membership to unlock premium Rotaract features, detailed EQ benchmarking, and guaranteed interview placements.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
                    {/* Basic */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm relative">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Member</h3>
                        <p className="text-sm text-gray-500 mb-6">Essential networking and hiring access.</p>
                        <div className="mb-6"><span className="text-4xl font-black text-[#1a2b4b]">Free</span><span className="text-gray-500">/forever</span></div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3 text-sm text-gray-700"><CheckCircle className="w-5 h-5 text-gray-400 shrink-0" /> Public club directory access</li>
                            <li className="flex items-start gap-3 text-sm text-gray-700"><CheckCircle className="w-5 h-5 text-gray-400 shrink-0" /> Basic EQ assessment</li>
                            <li className="flex items-start gap-3 text-sm text-gray-700"><CheckCircle className="w-5 h-5 text-gray-400 shrink-0" /> Apply to standard jobs</li>
                        </ul>
                        <button className="w-full py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-colors">Current Plan</button>
                    </div>

                    {/* Premium */}
                    <div className="bg-[#1a2b4b] rounded-3xl p-8 border-2 border-cyan-400 shadow-xl relative transform md:-translate-y-4">
                        <div className="absolute -top-4 inset-x-0 flex justify-center"><span className="bg-cyan-400 text-[#0d1b2a] text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest">Recommended</span></div>
                        <h3 className="text-xl font-bold text-white mb-2">Professional</h3>
                        <p className="text-sm text-cyan-100 mb-6">Advanced metrics and premium matching.</p>
                        <div className="mb-6"><span className="text-4xl font-black text-white">$12</span><span className="text-cyan-200">/month</span></div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3 text-sm text-white"><CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" /> Full EQ radar insights</li>
                            <li className="flex items-start gap-3 text-sm text-white"><CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" /> Top tier job matching algorithm</li>
                            <li className="flex items-start gap-3 text-sm text-white"><CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" /> Priority application processing</li>
                            <li className="flex items-start gap-3 text-sm text-white"><CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" /> Direct recruiter messaging</li>
                        </ul>
                        <button className="w-full py-3 rounded-xl bg-cyan-400 text-[#0d1b2a] font-bold hover:bg-cyan-300 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.4)]">Upgrade Now</button>
                    </div>

                    {/* Enterprise / Club */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm relative">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Organization</h3>
                        <p className="text-sm text-gray-500 mb-6">Full suite for club presidents & teams.</p>
                        <div className="mb-6"><span className="text-4xl font-black text-[#1a2b4b]">$49</span><span className="text-gray-500">/month</span></div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3 text-sm text-gray-700"><CheckCircle className="w-5 h-5 text-blue-500 shrink-0" /> Everything in Professional</li>
                            <li className="flex items-start gap-3 text-sm text-gray-700"><CheckCircle className="w-5 h-5 text-blue-500 shrink-0" /> Dedicated club page management</li>
                            <li className="flex items-start gap-3 text-sm text-gray-700"><CheckCircle className="w-5 h-5 text-blue-500 shrink-0" /> Unlimited job postings</li>
                            <li className="flex items-start gap-3 text-sm text-gray-700"><CheckCircle className="w-5 h-5 text-blue-500 shrink-0" /> Admin reporting and analytics</li>
                        </ul>
                        <button className="w-full py-3 rounded-xl border-2 border-[#1a2b4b] bg-gray-50 text-[#1a2b4b] font-bold hover:bg-gray-100 transition-colors">Contact Sales</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
