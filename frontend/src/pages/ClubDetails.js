import React from "react";
import PublicNavbar from "../components/layout/PublicNavbar";
import { MapPin, Users, Globe, Mail, Calendar, Briefcase, ChevronRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ClubDetails() {
    return (
        <div className="bg-[#f0f4f8] shadow-inner min-h-screen font-sans">
            <PublicNavbar />
            
            {/* Club Header Banner */}
            <div className="bg-[#1a2b4b] relative border-b-4 border-cyan-500">
                <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row gap-8 items-center md:items-start">
                    <div className="w-32 h-32 rounded-2xl bg-white p-2 shadow-xl shrink-0 hidden md:block">
                        <img src="https://ui-avatars.com/api/?name=RS&background=f8f9fa&color=1a2b4b&font-size=0.4" alt="Rotary Seattle" className="w-full h-full rounded-xl object-cover" />
                    </div>
                    <div className="text-center md:text-left text-white flex-1">
                        <div className="flex justify-center md:justify-start gap-2 mb-3">
                            <span className="bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg">District 5030</span>
                            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg">Verified Active</span>
                        </div>
                        <h1 className="text-4xl font-black mb-2">Rotary Club of Seattle</h1>
                        <p className="text-cyan-100/80 text-lg mb-6 max-w-2xl">One of the largest and oldest Rotary clubs in the world, dedicated to community service and building business relationships.</p>
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-medium text-blue-100">
                            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-400" /> Seattle, WA</span>
                            <span className="flex items-center gap-2"><Users className="w-4 h-4 text-cyan-400" /> 500+ Members</span>
                            <span className="flex items-center gap-2"><Globe className="w-4 h-4 text-cyan-400" /> seattlerotary.org</span>
                        </div>
                    </div>
                    <div>
                        <button className="bg-cyan-500 text-[#1a2b4b] px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-cyan-400 transition-colors w-full md:w-auto">
                            Join This Club
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
                {/* Main Content */}
                <div className="flex-1 space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-bold text-[#1a2b4b] mb-4">About Our Chapter</h2>
                        <p className="text-gray-600 leading-relaxed font-medium mb-6">
                            Founded in 1909, the Rotary Club of Seattle is one of the oldest and largest Rotary clubs in the world. We are a diverse group of business, professional, and community leaders who come together to connect, engage in professional development, and execute high-impact service projects globally and locally.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                <span className="block text-2xl font-black text-blue-600 mb-1">$2M+</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-blue-500/70">Annual Grants</span>
                            </div>
                            <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-100">
                                <span className="block text-2xl font-black text-cyan-600 mb-1">15</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-cyan-600/70">Active Committees</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-[#1a2b4b]">Open Positions</h2>
                            <Link to="/job-search" className="text-sm font-bold text-blue-600 flex items-center hover:underline">View All Programs <ChevronRight className="w-4 h-4" /></Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            {[
                                { t: "Youth Programs Director", type: "Volunteer Leadership", loc: "Local Seattle" },
                                { t: "Fundraising Chairperson", type: "Board Member", loc: "Hybrid" }
                            ].map((job, i) => (
                                <Link to="/job/1" key={i} className="flex justify-between items-center p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50/30 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex justify-center items-center">
                                            <Briefcase className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 group-hover:text-blue-600">{job.t}</h4>
                                            <p className="text-sm text-gray-500 font-medium">{job.type} • {job.loc}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Details */}
                <div className="w-full lg:w-80 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-6">Chapter Details</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm text-gray-900">Meeting Times</p>
                                    <p className="text-sm text-gray-500">Every Wednesday, 12:00 PM PST</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm text-gray-900">Meeting Location</p>
                                    <p className="text-sm text-gray-500">Westin Seattle, Grand Ballroom</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm text-gray-900">Contact Email</p>
                                    <p className="text-sm text-blue-600">office@seattlerotary.org</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-4">Leadership</h3>
                        <div className="space-y-4">
                            {[ { n: "James Thorne", r: "Club President" }, { n: "Maria Rodriguez", r: "Membership Chair" } ].map((l, i) => (
                                <Link to="/member/1" key={i} className="flex gap-3 items-center group">
                                    <img src={`https://ui-avatars.com/api/?name=${l.n.replace(' ','+')}&background=e2e8f0`} className="w-10 h-10 rounded-full border border-gray-200" />
                                    <div>
                                        <p className="font-bold text-sm text-[#1a2b4b] group-hover:text-blue-600 flex items-center gap-1">{l.n} <CheckCircle2 className="w-3 h-3 text-emerald-500" /></p>
                                        <p className="text-xs text-gray-500">{l.r}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
