import { Home, Users, Briefcase, Bell, Settings, LogOut, ChevronDown, Award, Search, MessageSquareText } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import ThemeToggle from '../components/common/ThemeToggle';
import { useAuth } from '../context/AuthContext';

export default function CandidateLayout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isPremium, setIsPremium] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const fetchProfileAndNotifications = async () => {
            try {
                const profileRes = await api.get('/profile');
                if (profileRes.data.success && profileRes.data.data) {
                    setIsPremium(profileRes.data.data.isPremium || false);
                }
            } catch (err) {
                console.error("Failed to fetch profile in layout", err);
            }
            try {
                const notifRes = await api.get('/notifications');
                if (notifRes.data.success) {
                    setUnreadNotifications(notifRes.data.unreadCount || 0);
                }
            } catch (err) {
                console.error("Failed to fetch notifications count", err);
            }
        };
        if (user) {
            fetchProfileAndNotifications();
        }
    }, [user]);

    // Handle clicking outside the profile dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const displayName = user?.fullName || 'Guest User';
    const avatarName = encodeURIComponent(displayName);

    const navItems = [
        { name: 'Home', icon: Home, path: '/candidate' },
        { name: 'Network', icon: Users, path: '/network' },
        { name: 'Jobs', icon: Briefcase, path: '/job-search' },
        { name: 'Messaging', icon: MessageSquareText, path: '/messages' },
        { name: 'Notifications', icon: Bell, path: '/notifications' }
    ];

    return (
        <div className="flex flex-col h-screen overflow-hidden font-sans bg-[#f3f2ef] dark:bg-[#000000]">
            {/* Top Navigation Bar */}
            <nav className="bg-white dark:bg-[#1d2226] border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-2 md:py-0 flex items-center justify-between z-20 flex-shrink-0">
                {/* Brand / Logo & Search */}
                <div className="flex items-center gap-2">
                    <Link to="/candidate" className="flex items-center justify-center bg-[#0a66c2] text-white rounded w-9 h-9 font-bold text-lg leading-none pt-0.5">
                        EQ
                    </Link>
                    <form 
                        onSubmit={(e) => {
                            e.preventDefault();
                            const query = e.target.search.value.trim();
                            if (query) navigate(`/job-search?q=${encodeURIComponent(query)}`);
                        }}
                        className="hidden lg:flex relative items-center ml-1"
                    >
                        <Search className="w-4 h-4 absolute left-3 text-slate-500 dark:text-slate-400" />
                        <input 
                            name="search"
                            type="text" 
                            placeholder="Search jobs..." 
                            className="bg-[#edf3f8] dark:bg-slate-800 text-sm font-medium h-9 pl-9 pr-4 rounded focus:outline-none focus:w-[280px] w-[240px] transition-all text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                        />
                    </form>
                </div>

                {/* Center Navigation Links */}
                <div className="hidden md:flex flex-1 justify-center max-w-2xl px-6 h-14">
                    {navItems.map((item) => {
                        const active = location.pathname === item.path || (item.path === '/job-search' && location.pathname.includes('/job'));
                        const IconComponent = item.icon;
                        return (
                            <Link 
                                key={item.name} 
                                to={item.path} 
                                className={`flex flex-col items-center justify-center w-[85px] border-b-[3px] transition-colors ${active ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                <div className="relative mb-0.5">
                                    <IconComponent className={`w-[24px] h-[24px] ${active ? 'fill-current' : ''}`} />
                                    {item.name === 'Notifications' && unreadNotifications > 0 && (
                                        <span className="absolute -top-1 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white dark:border-[#1d2226]">
                                            {unreadNotifications > 9 ? '9+' : unreadNotifications}
                                        </span>
                                    )}
                                </div>
                                <span className={`text-[12px] tracking-wide leading-none ${active ? 'font-semibold' : 'font-medium'}`}>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-1 md:gap-3 h-14 border-l border-transparent md:border-slate-200 dark:border-slate-800 pl-0 md:pl-4">
                    <ThemeToggle />
                    
                    {/* Profile Dropdown */}
                    <div className="relative h-full flex items-center" ref={dropdownRef}>
                        <button 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex flex-col items-center justify-center w-16 md:w-20 transition hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-slate-400 h-full"
                        >
                            <img src={`https://ui-avatars.com/api/?name=${avatarName}&background=0F172A&color=fff&bold=true`} alt="User" className="w-[24px] h-[24px] rounded-full object-cover mb-1 outline outline-1 outline-slate-200 dark:outline-slate-700" />
                            <div className="flex items-center text-[12px] font-medium tracking-wide leading-none">
                                Me <ChevronDown className="w-3 h-3 ml-0.5" />
                            </div>
                        </button>

                        {isProfileOpen && (
                            <div className="absolute top-14 right-0 w-64 bg-white dark:bg-[#1d2226] border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl py-2 animate-in fade-in slide-in-from-top-2">
                                <Link to="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition group mb-2" onClick={() => setIsProfileOpen(false)}>
                                    <img src={`https://ui-avatars.com/api/?name=${avatarName}&background=0F172A&color=fff&bold=true`} alt="User" className="w-10 h-10 rounded-full object-cover" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight capitalize">{displayName}</p>
                                        <p className="text-xs text-slate-500 font-medium mt-0.5">{isPremium ? 'Premium Candidate' : 'Candidate'}</p>
                                    </div>
                                </Link>
                                <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                                    <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="block w-full text-center border border-blue-600 text-blue-600 rounded-full py-1 text-sm font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition">View Profile</Link>
                                </div>
                                
                                <div className="py-1 border-b border-slate-100 dark:border-slate-800">
                                    <p className="px-4 py-1.5 text-xs font-bold text-slate-900 dark:text-white">Account</p>
                                    <Link to="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center px-4 py-2 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                                        <Settings className="w-4 h-4 mr-2" /> Settings
                                    </Link>
                                </div>
                                <div className="pt-1">
                                    <button onClick={handleLogout} className="flex w-full items-center px-4 py-2 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Premium CTA */}
                    {!isPremium && (
                        <div className="hidden lg:flex items-center h-full border-l border-slate-200 dark:border-slate-800 pl-4 ml-1">
                            <Link to="/premium/pricing" className="text-[12px] hover:underline text-[#e7a33e] text-center font-semibold leading-tight flex flex-col items-center">
                                <Award className="w-5 h-5 mb-0.5 fill-amber-100 dark:fill-[#e7a33e]/30" />
                                Try Premium
                            </Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* Mobile Navigation (Bottom bar) */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-[#1d2226] border-t border-slate-200 dark:border-slate-800 flex justify-around items-center h-14 z-20 pb-safe">
                {navItems.map((item) => {
                    const active = location.pathname === item.path || (item.path === '/job-search' && location.pathname.includes('/job'));
                    const IconComponent = item.icon;
                    return (
                        <Link 
                            key={item.name} 
                            to={item.path} 
                            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${active ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            <div className="relative mb-0.5">
                                <IconComponent className={`w-[24px] h-[24px] ${active ? 'fill-current' : ''}`} />
                                {item.name === 'Notifications' && unreadNotifications > 0 && (
                                    <span className="absolute -top-1 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-white dark:border-[#1d2226]">
                                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 w-full overflow-y-auto relative pb-16 md:pb-0">
                <div className="max-w-[1128px] mx-auto w-full p-4 md:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}