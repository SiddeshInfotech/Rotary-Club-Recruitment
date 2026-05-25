import React, { useState, useEffect, useCallback, useRef } from "react";
import RecruiterLayout from "../../layouts/RecruiterLayout";
import { MoreHorizontal, Bell, Loader2, Trash2, CheckCheck, Eye, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const FILTER_TABS = [
    { key: "all", label: "All" },
    { key: "job", label: "Jobs" },
    { key: "interview", label: "Interviews" },
    { key: "message", label: "Messages" },
    { key: "network", label: "Network" },
];

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

function getDefaultAvatar(type) {
    const colors = {
        job: { bg: "#1e40af", text: "💼" },
        interview: { bg: "#6d28d9", text: "📅" },
        message: { bg: "#0e7490", text: "💬" },
        network: { bg: "#7c3aed", text: "🤝" },
        community: { bg: "#059669", text: "👥" },
        success: { bg: "#d97706", text: "⭐" },
        warning: { bg: "#ea580c", text: "⚠️" },
        info: { bg: "#475569", text: "ℹ️" },
        system: { bg: "#4338ca", text: "🔔" },
    };
    return colors[type] || colors.info;
}

function getCTA(type) {
    switch (type) {
        case "job": return { label: "View application", path: "/recruiter" };
        case "interview": return { label: "View interview", path: "/recruiter/interviews" };
        case "network": return { label: "View profile", path: "/recruiter/search" };
        default: return null;
    }
}

function RichText({ actorName, title, message }) {
    if (actorName && message) {
        return (
            <span>
                <strong>{actorName}</strong>{" — "}{message}
            </span>
        );
    }
    if (actorName && title) {
        return (
            <span>
                <strong>{actorName}</strong>{": "}{title}
            </span>
        );
    }
    return (
        <span>
            <strong>{title}</strong>
            {message ? ` ${message}` : ""}
        </span>
    );
}

function NotifMenu({ onMarkRead, onDelete, isRead }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
                className="p-1.5 rounded-full text-slate-500 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
                <MoreHorizontal className="w-5 h-5" />
            </button>
            {open && (
                <div className="absolute right-0 top-8 z-50 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 animate-in fade-in slide-in-from-top-1">
                    {!isRead && (
                        <button onClick={(e) => { e.stopPropagation(); onMarkRead(); setOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            <Eye className="w-4 h-4" /> Mark as read
                        </button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); onDelete(); setOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <Trash2 className="w-4 h-4" /> Delete notification
                    </button>
                </div>
            )}
        </div>
    );
}

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const navigate = useNavigate();

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get("/notifications");
            if (res.data.success) {
                let notifs = res.data.data || [];
                const unread = res.data.unreadCount || 0;
                
                if (unread > 0) {
                    api.patch("/notifications/read").catch(() => {});
                    notifs = notifs.map(n => ({ ...n, read: true }));
                    setUnreadCount(0);
                } else {
                    setUnreadCount(unread);
                }
                setNotifications(notifs);
            }
        } catch { /* ignore */ }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

    const handleMarkOneRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
            setUnreadCount((c) => Math.max(0, c - 1));
        } catch { /* ignore */ }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.patch("/notifications/read");
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch { /* ignore */ }
    };

    const handleDelete = async (id) => {
        const n = notifications.find((x) => x._id === id);
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications((prev) => prev.filter((x) => x._id !== id));
            if (n && !n.read) setUnreadCount((c) => Math.max(0, c - 1));
        } catch { /* ignore */ }
    };

    const filtered = filter === "all"
        ? notifications
        : notifications.filter((n) => n.type === filter);

    return (
        <RecruiterLayout>
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h1>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            <CheckCheck className="w-3.5 h-3.5" />
                            Mark all read
                        </button>
                    )}
                </div>

                {/* Filter pills */}
                <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
                    {FILTER_TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap border transition-all duration-200
                                ${filter === tab.key
                                    ? "bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:border-emerald-500"
                                    : "bg-transparent text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Notification list */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-20 gap-3">
                            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                            <span className="text-sm text-slate-500">Loading…</span>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 px-6">
                            <Bell className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                {filter === "all" ? "No notifications yet" : `No ${FILTER_TABS.find(t => t.key === filter)?.label.toLowerCase()} notifications`}
                            </p>
                        </div>
                    ) : (
                        <div>
                            {filtered.map((notif) => {
                                const fallback = getDefaultAvatar(notif.type);
                                const cta = getCTA(notif.type);

                                return (
                                    <div
                                        key={notif._id}
                                        className={`flex items-start gap-3 px-4 py-4 border-b border-slate-100 dark:border-slate-800 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer`}
                                        onClick={() => { if (!notif.read) handleMarkOneRead(notif._id); if (notif.link) navigate(notif.link); }}
                                    >
                                        {/* Unread dot */}
                                        <div className="w-2 flex-shrink-0 pt-4">
                                            {!notif.read && (
                                                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                            )}
                                        </div>

                                        {/* Avatar */}
                                        {notif.actorAvatar ? (
                                            <img
                                                src={notif.actorAvatar}
                                                alt=""
                                                className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-slate-200 dark:border-slate-700"
                                            />
                                        ) : (
                                            <div
                                                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-lg"
                                                style={{ backgroundColor: fallback.bg }}
                                            >
                                                {fallback.text}
                                            </div>
                                        )}

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm leading-relaxed ${!notif.read ? "text-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-400"}`}>
                                                <RichText actorName={notif.actorName} title={notif.title} message={notif.message} />
                                            </p>

                                            {cta && notif.link && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); navigate(notif.link || cta.path); }}
                                                    className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-colors"
                                                >
                                                    <ExternalLink className="w-3 h-3" />
                                                    {cta.label}
                                                </button>
                                            )}
                                        </div>

                                        {/* Time */}
                                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap flex-shrink-0 pt-0.5">
                                            {timeAgo(notif.createdAt)}
                                        </span>

                                        {/* 3-dot menu */}
                                        <NotifMenu
                                            isRead={notif.read}
                                            onMarkRead={() => handleMarkOneRead(notif._id)}
                                            onDelete={() => handleDelete(notif._id)}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </RecruiterLayout>
    );
}
