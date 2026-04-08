import React, { useState, useEffect } from "react";
import RecruiterLayout from "../../layouts/RecruiterLayout";
import { Calendar, Clock, Video, User } from "lucide-react";
import api from "../../services/api";

export default function Interviews() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const res = await api.get('/interviews');
                if (res.data.success) {
                    setInterviews(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch interviews", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInterviews();
    }, []);

    const handleStatusChange = async (id, currentStatus) => {
        if (currentStatus !== 'Scheduled' && currentStatus !== 'Upcoming') return;
        try {
            await api.patch(`/interviews/${id}/cancel`);
            // Refresh list
            const res = await api.get('/interviews');
            if (res.data.success) setInterviews(res.data.data);
        } catch (err) {
            console.error("Failed to cancel interview", err);
        }
    };

    const getAvatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Candidate')}&background=0d1b2a&color=67e8f9`;

    return (
        <RecruiterLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1a2b4b] dark:text-white">Interview Board</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and schedule candidate interviews.</p>
                    </div>
                    <button className="flex items-center gap-2 bg-[#1a2b4b] dark:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#243a5e] dark:hover:bg-blue-500 transition-colors shadow-sm">
                        <Calendar className="w-4 h-4" /> Schedule Interview
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-lg font-bold text-[#1a2b4b] dark:text-white mb-4">Upcoming Interviews</h2>
                        
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading interviews...</div>
                        ) : interviews.length === 0 ? (
                            <div className="p-12 text-center text-gray-500 border border-dashed border-gray-200 dark:border-slate-800 rounded-xl">
                                No interviews scheduled right now.
                            </div>
                        ) : interviews.map(interview => (
                            <div key={interview._id} className="bg-white dark:bg-[#131b2f] rounded-xl border border-gray-200 dark:border-slate-800 p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center hover:shadow-md transition-shadow">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-100 dark:border-cyan-800">
                                        <img src={getAvatar(interview.candidateName)} alt={interview.candidateName} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                                        <div>
                                            <h3 className="font-bold text-[#1a2b4b] dark:text-white text-lg leading-tight">{interview.candidateName}</h3>
                                            <p className="text-sm text-cyan-600 dark:text-cyan-400 font-medium">{interview.jobTitle || 'Role Evaluation'}</p>
                                        </div>
                                        <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase ${
                                            interview.status === "Cancelled" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : 
                                            interview.status === "Completed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                            "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                        }`}>
                                            {interview.status}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-50 dark:border-slate-800/50">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Calendar className="w-4 h-4 text-gray-400" /> {new Date(interview.date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Clock className="w-4 h-4 text-gray-400" /> {interview.time || 'TBD'}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            {interview.type === "Video Call" ? <Video className="w-4 h-4 text-gray-400" /> : <User className="w-4 h-4 text-gray-400" />}
                                            {interview.type}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-300">
                                            {interview.duration} mins
                                        </div>
                                    </div>
                                </div>
                                <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                                    <button 
                                        disabled={interview.status === 'Cancelled'}
                                        onClick={() => interview.meetingLink ? window.open(interview.meetingLink, '_blank') : alert('No meeting link available yet')}
                                        className="flex-1 sm:w-full bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 px-4 py-2 rounded-lg font-semibold text-sm transition-colors text-center border border-transparent disabled:opacity-50"
                                    >
                                        Join Call
                                    </button>
                                    <button 
                                        onClick={() => handleStatusChange(interview._id, interview.status)}
                                        disabled={interview.status === 'Cancelled' || interview.status === 'Completed'}
                                        className="flex-1 sm:w-full bg-white dark:bg-[#131b2f] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 px-4 py-2 rounded-lg font-semibold text-sm transition-colors text-center disabled:opacity-50"
                                    >
                                        {interview.status === 'Cancelled' ? 'Cancelled' : 'Cancel'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white dark:bg-[#131b2f] rounded-xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
                            <h3 className="font-bold text-[#1a2b4b] dark:text-white mb-4">This Week's Overview</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-500 dark:text-gray-400">Scheduled</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{interviews.length}</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-full"><div className="w-[60%] h-full bg-blue-500 rounded-full"></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-500 dark:text-gray-400">Completed</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{interviews.filter(i => i.status === 'Completed').length}</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-full"><div className="w-[20%] h-full bg-green-500 rounded-full"></div></div>
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
