import React, { useState, useEffect } from "react";
import RecruiterLayout from "../../layouts/RecruiterLayout";
import api from "../../services/api";
import { Calendar, Clock, Video, User, Star, X, Play, CheckCircle2, MessageSquare } from "lucide-react";

export default function Interviews() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Feedback Modal State
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [feedbackRating, setFeedbackRating] = useState(5);
    const [feedbackNotes, setFeedbackNotes] = useState("");
    const [feedbackOutcome, setFeedbackOutcome] = useState("pass"); // pass, hire, fail
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    
    // Filter State
    const [activeFilter, setActiveFilter] = useState("Scheduled"); // Scheduled, Completed, Cancelled

    const fetchInterviews = async () => {
        setLoading(true);
        try {
            const res = await api.get("/interviews");
            if (res.data.success) {
                setInterviews(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch interviews:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInterviews();
    }, []);

    const handleCancelInterview = async (interviewId) => {
        if (!window.confirm("Are you sure you want to cancel this interview?")) return;
        try {
            const res = await api.patch(`/interviews/${interviewId}/cancel`);
            if (res.data.success) {
                // Update local state
                setInterviews(prev => prev.map(item => 
                    item._id === interviewId ? { ...item, status: "Cancelled" } : item
                ));
            }
        } catch (error) {
            console.error("Failed to cancel interview:", error);
            alert("Failed to cancel interview. Please try again.");
        }
    };

    const handleOpenFeedback = (interview) => {
        setSelectedInterview(interview);
        setFeedbackRating(5);
        setFeedbackNotes("");
        setFeedbackOutcome("pass");
        setShowFeedbackModal(true);
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        if (!selectedInterview) return;
        setIsSubmittingFeedback(true);

        let appStatus = "Shortlisted"; // Default "pass" outcome reverts back to shortlisted so they can schedule next round
        if (feedbackOutcome === "hire") {
            appStatus = "Offer Extended";
        } else if (feedbackOutcome === "fail") {
            appStatus = "Rejected";
        }

        try {
            const res = await api.put(`/interviews/${selectedInterview._id}`, {
                status: "Completed",
                notes: `[Rating: ${feedbackRating}/5] ${feedbackNotes}`,
                applicationStatus: appStatus
            });

            if (res.data.success) {
                setInterviews(prev => prev.map(item => 
                    item._id === selectedInterview._id 
                        ? { ...item, status: "Completed", notes: `[Rating: ${feedbackRating}/5] ${feedbackNotes}` } 
                        : item
                ));
                setShowFeedbackModal(false);
            }
        } catch (error) {
            console.error("Failed to complete interview feedback:", error);
            alert("Failed to save feedback. Please try again.");
        } finally {
            setIsSubmittingFeedback(false);
        }
    };

    const filteredInterviews = interviews.filter(item => item.status === activeFilter);

    // Compute status counts for overview
    const scheduledCount = interviews.filter(item => item.status === "Scheduled").length;
    const completedCount = interviews.filter(item => item.status === "Completed").length;
    const cancelledCount = interviews.filter(item => item.status === "Cancelled").length;

    return (
        <RecruiterLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Interview Board</h1>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Track and manage candidates in your interview pipeline.</p>
                    </div>
                </div>

                {/* Filter / Summary Tabs */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* List Area */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                            {["Scheduled", "Completed", "Cancelled"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveFilter(tab)}
                                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
                                        activeFilter === tab
                                            ? "border-blue-600 text-blue-600 dark:text-blue-400"
                                            : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-355"
                                    }`}
                                >
                                    {tab} ({tab === "Scheduled" ? scheduledCount : tab === "Completed" ? completedCount : cancelledCount})
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <div className="text-center py-12 text-slate-500 font-medium">Loading interviews...</div>
                        ) : filteredInterviews.length === 0 ? (
                            <div className="text-center py-12 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/10">
                                <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                                <p className="text-slate-500 dark:text-slate-400 font-medium">No {activeFilter.toLowerCase()} interviews found.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredInterviews.map((interview) => {
                                    const avatarName = interview.candidateName ? interview.candidateName.replace(" ", "+") : "User";
                                    const avatarUrl = `https://ui-avatars.com/api/?name=${avatarName}&background=0d1b2a&color=67e8f9`;
                                    const interviewDateStr = interview.date ? new Date(interview.date).toLocaleDateString("en-US", {
                                        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                                    }) : "Pending";

                                    return (
                                        <div key={interview._id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center hover:shadow-md transition-shadow relative overflow-hidden">
                                            <div className="flex-shrink-0">
                                                <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-100 dark:border-slate-850">
                                                    <img src={avatarUrl} alt={interview.candidateName} className="w-full h-full object-cover" />
                                                </div>
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                                                    <div>
                                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{interview.candidateName || interview.candidate?.name}</h3>
                                                        <p className="text-sm text-cyan-600 dark:text-cyan-400 font-semibold mt-0.5">{interview.jobTitle || interview.job?.title}</p>
                                                    </div>
                                                    <div className="flex gap-2 items-center">
                                                        <span className="px-2 py-0.5 rounded bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 text-[10px] font-bold uppercase tracking-wider border border-violet-100 dark:border-violet-900/30">
                                                            {interview.round}
                                                        </span>
                                                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase border ${
                                                            interview.status === "Scheduled" 
                                                                ? "bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30" 
                                                                : interview.status === "Completed"
                                                                ? "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30"
                                                                : "bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                                                        }`}>
                                                            {interview.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                        <Calendar className="w-4 h-4 text-slate-400" /> {interviewDateStr}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                        <Clock className="w-4 h-4 text-slate-400" /> {interview.time}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                        {interview.type === "Video" ? <Video className="w-4 h-4 text-slate-400" /> : <User className="w-4 h-4 text-slate-400" />}
                                                        {interview.type === "Video" ? "Video Call" : interview.type === "Phone" ? "Phone Call" : interview.type}
                                                    </div>
                                                </div>

                                                {interview.notes && (
                                                    <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                                                        <p className="font-black text-[10px] text-slate-450 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800/50 pb-1"><MessageSquare className="w-3.5 h-3.5" /> Notes / Feedback</p>
                                                        <p className="whitespace-pre-line text-xs leading-relaxed font-semibold">{interview.notes}</p>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {interview.status === "Scheduled" && (
                                                <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0 self-stretch sm:justify-center border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-4 sm:pt-0 sm:pl-4">
                                                    {interview.meetingLink && (
                                                        <a 
                                                            href={interview.meetingLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-xs transition-colors text-center cursor-pointer"
                                                        >
                                                            <Play className="w-3.5 h-3.5" /> Join Call
                                                        </a>
                                                    )}
                                                    <button 
                                                        onClick={() => handleOpenFeedback(interview)}
                                                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-xs transition-colors text-center cursor-pointer"
                                                    >
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                                                    </button>
                                                    <button 
                                                        onClick={() => handleCancelInterview(interview._id)}
                                                        className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-white dark:bg-slate-800 text-red-600 border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-950/20 px-4 py-2 rounded-lg font-semibold text-xs transition-colors text-center"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Right side stats/calendar mock */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Pipeline Overview</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs font-semibold mb-1">
                                        <span className="text-slate-500 dark:text-slate-400">Scheduled Interviews</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">{scheduledCount}</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                                        <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${interviews.length > 0 ? (scheduledCount / interviews.length) * 100 : 0}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-semibold mb-1">
                                        <span className="text-slate-500 dark:text-slate-400">Completed Reviews</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">{completedCount}</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${interviews.length > 0 ? (completedCount / interviews.length) * 100 : 0}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-semibold mb-1">
                                        <span className="text-slate-500 dark:text-slate-400">Cancelled Rounds</span>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">{cancelledCount}</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                                        <div className="h-full bg-slate-400 dark:bg-slate-650 rounded-full transition-all duration-500" style={{ width: `${interviews.length > 0 ? (cancelledCount / interviews.length) * 100 : 0}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-6 shadow-md text-white">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 border border-white/10">
                                <Star className="w-6 h-6 text-cyan-400" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Multi-Round Pipelines</h3>
                            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
                                Seamlessly transition candidate stages. Choose to advance to next stage, extend offer, or decline application.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedback & Complete Modal */}
            {showFeedbackModal && selectedInterview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Complete Round Feedback</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Candidate: <span className="font-semibold">{selectedInterview.candidateName || selectedInterview.candidate?.name}</span></p>
                            </div>
                            <button onClick={() => setShowFeedbackModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleFeedbackSubmit} className="p-6 space-y-4">
                            {/* Rating Stars */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Rating</label>
                                <div className="flex items-center gap-1.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star}
                                            type="button"
                                            onClick={() => setFeedbackRating(star)}
                                            className="p-1 rounded transition-transform active:scale-95"
                                        >
                                            <Star className={`w-7 h-7 transition-colors ${star <= feedbackRating ? "fill-yellow-500 text-yellow-500" : "text-slate-300 dark:text-slate-700"}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Outcome Select */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Outcome Decision</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: "pass", label: "Pass Round", desc: "Shortlist for next", color: "border-blue-500 text-blue-600 bg-blue-50/20" },
                                        { id: "hire", label: "Hire / Offer", desc: "Extend job offer", color: "border-emerald-500 text-emerald-600 bg-emerald-50/20" },
                                        { id: "fail", label: "Reject Candidate", desc: "Decline application", color: "border-red-500 text-red-600 bg-red-50/20" }
                                    ].map((opt) => {
                                        const selected = feedbackOutcome === opt.id;
                                        return (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => setFeedbackOutcome(opt.id)}
                                                className={`p-3 rounded-xl border text-center transition-all ${
                                                    selected 
                                                        ? opt.color + " ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-900 font-bold" 
                                                        : "border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850"
                                                }`}
                                            >
                                                <p className="text-xs font-black">{opt.label}</p>
                                                <p className="text-[9px] mt-0.5 opacity-80">{opt.desc}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Comments/Notes */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Comments & Interview Notes</label>
                                <textarea 
                                    placeholder="Enter performance feedback, strengths, and areas of growth..."
                                    rows="4"
                                    required
                                    value={feedbackNotes}
                                    onChange={(e) => setFeedbackNotes(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm leading-relaxed"
                                ></textarea>
                            </div>

                            <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                                <button 
                                    type="button"
                                    onClick={() => setShowFeedbackModal(false)}
                                    className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-450 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSubmittingFeedback}
                                    className="px-5 py-2.5 rounded-xl bg-blue-650 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold transition-colors text-sm flex items-center gap-2 shadow-sm cursor-pointer"
                                >
                                    {isSubmittingFeedback ? "Submitting..." : "Save Feedback"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </RecruiterLayout>
    );
}
