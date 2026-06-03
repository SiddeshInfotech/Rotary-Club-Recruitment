import React, { useState, useEffect, useCallback } from "react";
import PublicNavbar from "../../components/layout/PublicNavbar";
import { Bell, Briefcase, MessageSquare, Star, Loader2 } from "lucide-react";
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
            return { icon: Briefcase, color: "text-blue-600", bg: "bg-blue-100 border-blue-200" };
        case "message":
        case "interview":
            return { icon: MessageSquare, color: "text-cyan-600", bg: "bg-cyan-100 border-cyan-200" };
        case "system":
        case "warning":
        case "success":
            return { icon: Star, color: "text-amber-600", bg: "bg-amber-100 border-amber-200" };
        default:
            return { icon: Bell, color: "text-slate-600", bg: "bg-slate-100 border-slate-200" };
    }
}

export default function Notifications() {
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

    const handleMarkOneAsRead = async (id, read) => {
        if (read) return;
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => (n._id === id ? { ...n, read: true } : n)));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    return (
        <div className="bg-[#f0f4f8] shadow-inner min-h-screen font-sans">
            <PublicNavbar />
            
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-black text-[#1a2b4b]">Notifications</h1>
                    <button onClick={handleMarkAllAsRead} className="text-sm font-bold text-blue-600 hover:text-blue-700">Mark all as read</button>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    {loading ? (
                        <div className="p-10 flex justify-center items-center gap-3">
                            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                            <span className="text-sm text-gray-500">Loading notifications...</span>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-10 flex flex-col items-center justify-center text-center">
                            <Bell className="w-10 h-10 text-gray-300 mb-3" />
                            <p className="text-sm font-medium text-gray-500">No notifications yet.</p>
                        </div>
                    ) : (
                        notifications.map((notif) => {
                            const { icon: Icon, color, bg } = getIconAndStyle(notif.type);
                            return (
                                <div 
                                    key={notif._id}
                                    onClick={() => handleMarkOneAsRead(notif._id, notif.read)}
                                    className={`p-5 border-b border-gray-50 flex gap-4 transition-colors cursor-pointer ${notif.read ? "hover:bg-gray-50 opacity-70" : "bg-blue-50/50 hover:bg-blue-50"}`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${bg} ${color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-900 mb-1">
                                            {notif.actorName && <span className="font-bold">{notif.actorName} </span>}
                                            {notif.message}
                                        </p>
                                        <p className={`text-xs font-bold uppercase tracking-widest ${notif.read ? "text-gray-400" : "text-blue-600"}`}>
                                            {timeAgo(notif.createdAt)}
                                        </p>
                                    </div>
                                    {!notif.read && (
                                        <div className="w-3 h-3 bg-blue-500 rounded-full shrink-0 self-center"></div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
