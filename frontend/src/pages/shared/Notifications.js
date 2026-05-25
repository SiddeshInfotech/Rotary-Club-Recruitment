import React, { useState, useEffect, useCallback, useRef } from "react";
import PublicNavbar from "../../components/layout/PublicNavbar";
import { MoreHorizontal, Bell, Loader2, Trash2, CheckCheck, Eye, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const FILTER_TABS = [
    { key: "all", label: "All" },
    { key: "job", label: "Jobs" },
    { key: "community", label: "My posts" },
    { key: "mention", label: "Mentions" },
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

function RichText({ actorName, title, message }) {
    if (actorName && message) {
        return <span><strong>{actorName}</strong>{" — "}{message}</span>;
    }
    if (actorName && title) {
        return <span><strong>{actorName}</strong>{": "}{title}</span>;
    }
    return <span><strong>{title}</strong>{message ? ` ${message}` : ""}</span>;
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
                className="p-1.5 rounded-full text-gray-400 hover:bg-gray-200 transition-colors"
            >
                <MoreHorizontal className="w-5 h-5" />
            </button>
            {open && (
                <div className="absolute right-0 top-8 z-50 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5">
                    {!isRead && (
                        <button onClick={(e) => { e.stopPropagation(); onMarkRead(); setOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                            <Eye className="w-4 h-4" /> Mark as read
                        </button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); onDelete(); setOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
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
                setNotifications(res.data.data || []);
                setUnreadCount(res.data.unreadCount || 0);
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
        <div className="bg-[#f0f4f8] shadow-inner min-h-screen font-sans">
            <PublicNavbar />

            <div className="max-w-3xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h1 className="text-2xl font-black text-[#1a2b4b]">Notifications</h1>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700"
                        >
                            <CheckCheck className="w-4 h-4" />
                            Mark all read
                        </button>
                    )}
                </div>

                {/* Filter pills */}
                <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
                    {FILTER_TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap border transition-all duration-200
                                ${filter === tab.key
                                    ? "bg-emerald-600 text-white border-emerald-600"
                                    : "bg-transparent text-gray-600 border-gray-300 hover:border-gray-400 hover:text-gray-800"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Notification list */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-20 gap-3">
                            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                            <span className="text-sm text-gray-500">Loading…</span>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 px-6">
                            <Bell className="w-10 h-10 text-gray-300 mb-3" />
                            <p className="text-sm font-medium text-gray-500">
                                {filter === "all" ? "No notifications yet" : `No ${FILTER_TABS.find(t => t.key === filter)?.label.toLowerCase()} notifications`}
                            </p>
                        </div>
                    ) : (
                        <div>
                            {filtered.map((notif) => {
                                const fallback = getDefaultAvatar(notif.type);

                                return (
                                    <div
                                        key={notif._id}
                                        className={`flex items-start gap-3 px-5 py-4 border-b border-gray-50 last:border-b-0 transition-colors cursor-pointer ${!notif.read ? "bg-blue-50/40 hover:bg-blue-50" : "hover:bg-gray-50"}`}
                                        onClick={() => { if (!notif.read) handleMarkOneRead(notif._id); if (notif.link) navigate(notif.link); }}
                                    >
                                        {/* Unread dot */}
                                        <div className="w-2 flex-shrink-0 pt-4">
                                            {!notif.read && (
                                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            )}
                                        </div>

                                        {/* Avatar */}
                                        {notif.actorAvatar ? (
                                            <img
                                                src={notif.actorAvatar}
                                                alt=""
                                                className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-gray-200"
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
                                            <p className={`text-sm leading-relaxed ${!notif.read ? "text-gray-900" : "text-gray-600"}`}>
                                                <RichText actorName={notif.actorName} title={notif.title} message={notif.message} />
                                            </p>
                                            <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${!notif.read ? "text-blue-600" : "text-gray-400"}`}>
                                                {timeAgo(notif.createdAt)}
                                            </p>
                                        </div>

                                        {/* Time (desktop) */}
                                        <span className="hidden sm:block text-xs font-medium text-gray-400 whitespace-nowrap flex-shrink-0 pt-0.5">
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
        </div>
    );
}
