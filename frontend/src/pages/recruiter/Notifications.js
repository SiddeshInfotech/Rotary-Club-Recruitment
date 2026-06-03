import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import RecruiterLayout from "../../layouts/RecruiterLayout";
import { FileText, MessageSquare, Briefcase, Bell, Loader2 } from "lucide-react";
import api from "../../services/api";

function timeAgo(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return "now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getIconAndStyle(type) {
    switch (type) {
        case "job":
        case "application":
            return { icon: FileText, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" };
        case "message":
        case "interview":
            return { icon: MessageSquare, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" };
        case "system":
            return { icon: Briefcase, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" };
        default:
            return { icon: Bell, color: "text-slate-600", bg: "bg-slate-100 dark:bg-slate-800" };
    }
}

export default function Notifications() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get("/notifications");
            if (res.data.success) {
                setNotifications(res.data.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleMarkAllAsRead = async () => {
        try {
            await api.patch("/notifications/read");
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const handleMarkOneAsRead = async (notif) => {
        try {
            if (!notif.read) {
                await api.patch(`/notifications/${notif._id}/read`);
                setNotifications(prev => prev.map(n => (n._id === notif._id ? { ...n, read: true } : n)));
            }
        } catch (error) {
            console.error("Failed to mark as read", error);
        } finally {
            if (notif.link) {
                navigate(notif.link);
            }
        }
    };

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
                        <button onClick={handleMarkAllAsRead} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">Mark all as read</button>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {loading ? (
                            <div className="p-10 flex justify-center items-center gap-3">
                                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                                <span className="text-sm text-slate-500">Loading notifications...</span>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-10 flex flex-col items-center justify-center text-center">
                                <Bell className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No notifications yet.</p>
                            </div>
                        ) : (
                            notifications.map((notif) => {
                                const { icon: Icon, color, bg } = getIconAndStyle(notif.type);
                                return (
                                    <div 
                                        key={notif._id} 
                                        onClick={() => handleMarkOneAsRead(notif)}
                                        className={`p-6 flex gap-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${notif.read ? "" : "bg-blue-50/30 dark:bg-blue-900/10"}`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
                                            <Icon className={`w-6 h-6 ${color}`} />
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className={`text-sm font-bold ${!notif.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                                    {notif.title}
                                                </h3>
                                                <span className="text-xs font-medium text-slate-400 whitespace-nowrap ml-4">{timeAgo(notif.createdAt)}</span>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {notif.actorName && <strong>{notif.actorName} </strong>}
                                                {notif.message}
                                            </p>
                                        </div>
                                        {!notif.read && (
                                            <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2"></div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </RecruiterLayout>
    );
}
