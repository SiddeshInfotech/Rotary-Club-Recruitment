import React, { useState, useEffect } from "react";
import CandidateLayout from "../../layouts/CandidateLayout";
import RecruiterLayout from "../../layouts/RecruiterLayout";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { 
    Briefcase, MessageSquare, Star, Users, CheckCircle, 
    AlertTriangle, Info, Bell, Trash2, Check
} from "lucide-react";

export default function Notifications() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isRecruiter = user?.role === 'recruiter';
    const Layout = isRecruiter ? RecruiterLayout : CandidateLayout;

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await api.get('/notifications');
            if (res.data && res.data.success) {
                setNotifications(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
            setError("Failed to load notifications. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.patch('/notifications/read');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error("Failed to mark all as read:", err);
        }
    };

    const markAsRead = async (id, e) => {
        if (e) e.stopPropagation();
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error("Failed to mark read:", err);
        }
    };

    const deleteNotification = async (id, e) => {
        if (e) e.stopPropagation();
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n._id !== id));
        } catch (err) {
            console.error("Failed to delete notification:", err);
        }
    };

    const timeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return 'Just now';
        
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
        
        if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
        
        return date.toLocaleDateString();
    };

    const getIconConfig = (type) => {
        switch (type) {
            case 'job':
                return { icon: Briefcase, bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' };
            case 'message':
                return { icon: MessageSquare, bg: 'bg-cyan-100', text: 'text-cyan-600', border: 'border-cyan-200' };
            case 'interview':
                return { icon: Star, bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' };
            case 'network':
                return { icon: Users, bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200' };
            case 'community':
                return { icon: MessageSquare, bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-200' };
            case 'success':
                return { icon: CheckCircle, bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' };
            case 'warning':
                return { icon: AlertTriangle, bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' };
            case 'info':
            case 'system':
            default:
                return { icon: Info, bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' };
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto py-6">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white font-serif tracking-tight">Notifications</h1>
                    {notifications.some(n => !n.read) && (
                        <button 
                            onClick={markAllAsRead}
                            className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                            <Check className="w-4 h-4" /> Mark all as read
                        </button>
                    )}
                </div>

                <div className="bg-white dark:bg-[#1d2226] rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                    {loading ? (
                        <div className="p-10 text-center text-slate-500">
                            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"></div>
                            Loading notifications...
                        </div>
                    ) : error ? (
                        <div className="p-10 text-center text-red-500 font-medium">
                            {error}
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-16 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <Bell className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">You're all caught up!</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                                You don't have any notifications right now. Check back later for updates.
                            </p>
                        </div>
                    ) : (
                        notifications.map((notification) => {
                            const { icon: Icon, bg, text, border } = getIconConfig(notification.type);
                            
                            // Wrapping element depends on whether there is a link
                            const Wrapper = notification.link ? Link : 'div';
                            const wrapperProps = notification.link ? { to: notification.link } : {};
                            
                            return (
                                <Wrapper
                                    key={notification._id}
                                    {...wrapperProps}
                                    className={`p-5 min-h-[85px] border-b border-gray-50 dark:border-slate-800 flex gap-4 transition-colors relative group
                                        ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-slate-800/50'}
                                    `}
                                    onClick={() => !notification.read && markAsRead(notification._id)}
                                >
                                    <div className="relative">
                                        {notification.actorAvatar ? (
                                            <img 
                                                src={notification.actorAvatar} 
                                                alt={notification.actorName || "User"} 
                                                className="w-12 h-12 rounded-full object-cover outline outline-1 outline-slate-200 dark:outline-slate-700" 
                                            />
                                        ) : (
                                            <div className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center shrink-0 ${text} border ${border}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                        )}
                                        
                                        {/* Small secondary icon if there is an avatar */}
                                        {notification.actorAvatar && (
                                            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${bg} border-2 border-white dark:border-[#1d2226] flex items-center justify-center ${text}`}>
                                                <Icon className="w-3 h-3" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 pb-1">
                                        <p className="text-sm text-gray-900 dark:text-white mb-1">
                                            {notification.actorName && (
                                                <span className="font-bold mr-1">{notification.actorName}</span>
                                            )}
                                            {notification.title && !notification.actorName && (
                                                <span className="font-bold mr-1">{notification.title}:</span>
                                            )}
                                            <span dangerouslySetInnerHTML={{ 
                                                __html: notification.message.replace(
                                                    new RegExp(notification.actorName || '%%%%', 'g'), 
                                                    ''
                                                ) 
                                                // If actorName was replaced and left starting punctuation, we could strip it, 
                                                // but the backend messages generally start correctly or just let it flow.
                                            }} />
                                        </p>
                                        <p className={`text-xs font-bold uppercase tracking-widest ${!notification.read ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
                                            {timeAgo(notification.createdAt)}
                                        </p>
                                    </div>
                                    
                                    {/* Action buttons visible on hover */}
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!notification.read && (
                                            <button 
                                                onClick={(e) => markAsRead(notification._id, e)}
                                                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                                                title="Mark as read"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button 
                                            onClick={(e) => deleteNotification(notification._id, e)}
                                            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                            title="Delete notification"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    
                                    {/* Unread indicator dot */}
                                    {!notification.read && (
                                        <div className="w-3 h-3 bg-blue-500 rounded-full shrink-0 self-center opacity-100 group-hover:opacity-0 transition-opacity"></div>
                                    )}
                                </Wrapper>
                            );
                        })
                    )}
                </div>
            </div>
        </Layout>
    );
}
