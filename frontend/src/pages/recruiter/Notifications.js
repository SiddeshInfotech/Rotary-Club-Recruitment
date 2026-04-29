import React from "react";
import RecruiterLayout from "../../layouts/RecruiterLayout";
import { UserPlus, MessageSquare, Briefcase } from "lucide-react";

export default function Notifications() {
    const notifications = [
        {
            id: 1,
            type: "application",
            icon: UserPlus,
            title: "New Application Received",
            message: "Sarah Chen applied for the Strategic Operations Director role with a 95% EQ Match.",
            time: "2 hours ago",
            unread: true,
            color: "text-blue-600",
            bg: "bg-blue-50 dark:bg-blue-900/20"
        },
        {
            id: 2,
            type: "message",
            icon: MessageSquare,
            title: "New Message",
            message: "Marcus Johnson replied to your interview invitation.",
            time: "5 hours ago",
            unread: true,
            color: "text-emerald-600",
            bg: "bg-emerald-50 dark:bg-emerald-900/20"
        },
        {
            id: 3,
            type: "system",
            icon: Briefcase,
            title: "Job Listing Expiring",
            message: "Your job post 'Head of EQ Strategy' is expiring in 3 days.",
            time: "1 day ago",
            unread: false,
            color: "text-amber-600",
            bg: "bg-amber-50 dark:bg-amber-900/20"
        }
    ];

    return (
        <RecruiterLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#1a2b4b] dark:text-white font-serif tracking-tight">Notifications</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Stay updated on your candidates and job posts.</p>
                </div>

                <div className="bg-white dark:bg-[#131b2f] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Recent</span>
                        <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">Mark all as read</button>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {notifications.map((notif) => {
                            const Icon = notif.icon;
                            return (
                                <div key={notif.id} className={`p-6 flex gap-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${notif.unread ? "bg-blue-50/30 dark:bg-blue-900/10" : ""}`}>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${notif.bg}`}>
                                        <Icon className={`w-6 h-6 ${notif.color}`} />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className={`text-sm font-bold ${notif.unread ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {notif.title}
                                            </h3>
                                            <span className="text-xs font-medium text-slate-400 whitespace-nowrap ml-4">{notif.time}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{notif.message}</p>
                                    </div>
                                    {notif.unread && (
                                        <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </RecruiterLayout>
    );
}
