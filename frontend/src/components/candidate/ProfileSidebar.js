import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { Bookmark, Users, Newspaper, Calendar } from "lucide-react";

export default function ProfileSidebar() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/profile');
                if (res.data.success) setProfile(res.data.data);
            } catch (err) {
                console.error("Failed to fetch profile for sidebar", err);
            }
        };
        fetchProfile();
    }, []);

    const displayName = profile?.fullName || user?.fullName || 'Guest User';
    const avatarName = encodeURIComponent(displayName);
    const isPremium = profile?.isPremium || false;
    const headline = profile?.title || profile?.jobTitle || 'Member';
    const location = profile?.location || '';
    const education = profile?.education?.[0]?.institution || '';

    const quickLinks = [
        { icon: Bookmark, label: 'Saved items', path: '/job-search' },
        { icon: Users, label: 'Groups', path: '/network' },
        { icon: Newspaper, label: 'Newsletters', path: '/community-feed' },
        { icon: Calendar, label: 'Events', path: '/network' },
    ];

    return (
        <aside className="hidden lg:flex flex-col gap-2 w-[220px] xl:w-[240px] flex-shrink-0">
            {/* Profile Card */}
            <div className="bg-white dark:bg-[#1d2226] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                {/* Banner with name overlay */}
                <div className="relative h-[80px] bg-gradient-to-r from-blue-600 to-indigo-700">
                    <div className="absolute bottom-2 right-3 text-right">
                        <p className="text-white text-[11px] font-bold leading-tight drop-shadow">{displayName}</p>
                        <p className="text-white/70 text-[9px] leading-tight">{user?.email || ''}</p>
                    </div>
                    {/* Avatar overlapping the banner */}
                    <div className="absolute -bottom-8 left-4">
                        <img
                            src={`https://ui-avatars.com/api/?name=${avatarName}&background=0F172A&color=fff&bold=true&size=80`}
                            alt={displayName}
                            className="w-16 h-16 rounded-full border-2 border-white dark:border-[#1d2226] object-cover shadow-md"
                        />
                    </div>
                </div>

                {/* Info */}
                <div className="pt-10 pb-4 px-4">
                    <Link to="/profile" className="hover:underline">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-1">
                            {displayName}
                            <svg className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                            </svg>
                        </h2>
                    </Link>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">{headline}</p>
                    {location && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{location}</p>}
                    {education && (
                        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <div className="w-5 h-5 bg-slate-100 dark:bg-slate-700 rounded-sm flex-shrink-0 flex items-center justify-center">
                                <span className="text-[8px] font-black text-slate-500">U</span>
                            </div>
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight">{education}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Premium CTA (non-premium only) */}
            {!isPremium && (
                <div className="bg-white dark:bg-[#1d2226] rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 leading-snug">Get 14x more connections on average with Premium</p>
                    <Link to="/premium/pricing" className="flex items-center gap-2 text-xs font-bold text-[#b07800] dark:text-[#e7a33e] hover:underline">
                        <span className="w-7 h-7 bg-[#e7a33e] rounded flex items-center justify-center text-white text-sm flex-shrink-0">★</span>
                        <span>Claim 1 month of Premium for free</span>
                    </Link>
                </div>
            )}

            {/* Quick Links */}
            <div className="bg-white dark:bg-[#1d2226] rounded-xl border border-slate-200 dark:border-slate-800 px-2 py-2">
                {quickLinks.map(({ icon: Icon, label, path }) => (
                    <Link
                        key={label}
                        to={path}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
                    >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {label}
                    </Link>
                ))}
            </div>
        </aside>
    );
}
