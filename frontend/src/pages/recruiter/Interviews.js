import React from "react";
import RecruiterLayout from "../../layouts/RecruiterLayout";
import { Calendar, Clock, Video, User } from "lucide-react";

export default function Interviews() {
    const interviews = [
        { id: 1, candidate: "Sarah Chen", role: "Product Manager", time: "10:00 AM - 11:00 AM", date: "Today", type: "Video Call", round: "Technical Round", status: "Upcoming", avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=0d1b2a&color=67e8f9" },
        { id: 2, candidate: "Marcus Johnson", role: "Senior Developer", time: "2:00 PM - 3:00 PM", date: "Today", type: "On-site", round: "Final Culture Fit", status: "Upcoming", avatar: "https://ui-avatars.com/api/?name=Marcus+Johnson&background=0d1b2a&color=67e8f9" },
        { id: 3, candidate: "Emily Rodriguez", role: "UX Designer", time: "9:30 AM - 10:15 AM", date: "Tomorrow", type: "Video Call", round: "Portfolio Review", status: "Scheduled", avatar: "https://ui-avatars.com/api/?name=Emily+Rodriguez&background=0d1b2a&color=67e8f9" },
    ];

    return (
        <RecruiterLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1a2b4b]">Interview Board</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage and schedule candidate interviews.</p>
                    </div>
                    <button className="flex items-center gap-2 bg-[#1a2b4b] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#243a5e] transition-colors shadow-sm">
                        <Calendar className="w-4 h-4" /> Schedule Interview
                    </button>
                </div>

                {/* Calendar / Summary view */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Upcoming List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-lg font-bold text-[#1a2b4b] mb-4">Upcoming Interviews</h2>
                        
                        {interviews.map(interview => (
                            <div key={interview.id} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center hover:shadow-md transition-shadow">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-100">
                                        <img src={interview.avatar} alt={interview.candidate} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                                        <div>
                                            <h3 className="font-bold text-[#1a2b4b] text-lg leading-tight">{interview.candidate}</h3>
                                            <p className="text-sm text-cyan-600 font-medium">{interview.role}</p>
                                        </div>
                                        <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase ${
                                            interview.status === "Upcoming" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                                        }`}>
                                            {interview.status}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-50">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 text-gray-400" /> {interview.date}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Clock className="w-4 h-4 text-gray-400" /> {interview.time.split(" ")[0]}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            {interview.type === "Video Call" ? <Video className="w-4 h-4 text-gray-400" /> : <User className="w-4 h-4 text-gray-400" />}
                                            {interview.type}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                                            {interview.round}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                                    <button className="flex-1 sm:w-full bg-cyan-50 text-cyan-700 hover:bg-cyan-100 px-4 py-2 rounded-lg font-semibold text-sm transition-colors text-center border border-transparent">
                                        Join Call
                                    </button>
                                    <button className="flex-1 sm:w-full bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg font-semibold text-sm transition-colors text-center">
                                        Reschedule
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right side stats/calendar mock */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <h3 className="font-bold text-[#1a2b4b] mb-4">This Week's Overview</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-500">Scheduled</span>
                                        <span className="font-bold text-gray-900">12</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full"><div className="w-[60%] h-full bg-blue-500 rounded-full"></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-500">Completed</span>
                                        <span className="font-bold text-gray-900">4</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full"><div className="w-[20%] h-full bg-green-500 rounded-full"></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-500">To be scheduled</span>
                                        <span className="font-bold text-gray-900">7</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full"><div className="w-[35%] h-full bg-amber-500 rounded-full"></div></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-[#1a2b4b] to-[#243a5e] rounded-xl p-6 shadow-md text-white">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                                <span className="text-xl font-bold">EQ</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2">Prepare with EQ Insights</h3>
                            <p className="text-sm text-cyan-100 mb-5 leading-relaxed">
                                Review your candidates' emotional intelligence profiles and suggested questions before the interview.
                            </p>
                            <button className="w-full bg-cyan-400 hover:bg-cyan-300 text-[#0d1b2a] font-bold text-sm py-2.5 rounded-lg transition-colors">
                                View Interview Guide
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </RecruiterLayout>
    );
}
