import { useState, useEffect, useCallback } from 'react';
import { LayoutDashboard, Star, Network, TrendingUp, BrainCircuit, Users, Settings, Bell, Search, MessageSquare, LogOut, Bookmark } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function CandidateLayout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const displayName = user?.fullName || user?.name || 'Guest User';
    const avatarName = encodeURIComponent(displayName);

    const handleLogout = () => {
        logout();
        localStorage.removeItem('eqhire_token');
        sessionStorage.removeItem('eqhire_token');
        navigate('/login');
    };

    const [isPremium, setIsPremium] = useState(false);
    const [unreadNotifCount, setUnreadNotifCount] = useState(0);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const res = await api.get('/notifications');
            if (res.data.success) {
                setUnreadNotifCount(res.data.unreadCount || 0);
            }
        } catch { /* ignore */ }
    }, []);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await api.get('/profile');
                if (res.data.success) {
                    setIsPremium(res.data.data.isPremium || false);
                }
            } catch (e) { /* ignore */ }
        };
        fetchStatus();
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, [fetchUnreadCount]);

    useEffect(() => {
        if (location.pathname === '/candidate/notifications') {
            setUnreadNotifCount(0);
        }
    }, [location.pathname]);

    const mainMenu = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/candidate' },
        { name: 'Job Search', icon: Search, path: '/job-search' },
        { name: 'My Jobs', icon: Bookmark, path: '/my-jobs' },
        { name: 'Network', icon: Network, path: '/network' },
        { name: 'Messages', icon: MessageSquare, path: '/candidate/messages' }
    ];

    const insightsMenu = [
        { name: 'EQ Insights', icon: BrainCircuit, path: '/insights' },
        { name: 'Referrals', icon: Users, path: '/referrals' }
    ];

    return (
        <div className="flex h-screen overflow-hidden font-sans bg-slate-50 dark:bg-slate-950">
            <aside className="w-[300px] h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col py-8 px-6 relative z-10 flex-shrink-0 hidden lg:flex">
                <div className="mb-10 px-4">
                    <Link to="/candidate" className="text-xl font-bold tracking-tight text-slate-900 dark:text-white hover:opacity-80 transition-opacity inline-block">
                        <span className="text-blue-600">EQ</span>-Hire
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="mb-8">
                        <p className="px-4 text-[10px] tracking-widest font-bold text-slate-400 dark:text-slate-500 uppercase mb-3">MAIN MENU</p>
                        <nav className="flex flex-col gap-1">
                            {mainMenu.map((item) => {
                                const active = location.pathname === item.path;
                                const IconComponent = item.icon;
                                return (
                                    <Link 
                                        key={item.name} 
                                        to={item.path} 
                                        className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${active ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'}`}
                                    >
                                        <IconComponent className={`w-5 h-5 ${active ? 'fill-blue-600/20 text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div>
                        <p className="px-4 text-[10px] tracking-widest font-bold text-slate-400 dark:text-slate-500 uppercase mb-3">INSIGHTS</p>
                        <nav className="flex flex-col gap-1">
                            {insightsMenu.map((item) => {
                                const active = location.pathname === item.path;
                                const IconComponent = item.icon;
                                return (
                                    <Link 
                                        key={item.name} 
                                        to={item.path} 
                                        className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${active ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'}`}
                                    >
                                        <IconComponent className={`w-5 h-5 ${active ? 'fill-blue-600/20 text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                <div className="pt-6 mt-6">
                        <div className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <Link to="/settings" className="flex items-center gap-4 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 w-full">
                                <Settings className="w-5 h-5 text-slate-400" />
                                Settings
                            </Link>
                        </div>
                        <Link to="/candidate/notifications" className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 relative">
                            <div className="relative">
                                <Bell className="w-5 h-5 text-slate-400" />
                                {unreadNotifCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1 leading-none">
                                        {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                                    </span>
                                )}
                            </div>
                            Notifications
                        </Link>

                    <Link to="/profile" className="flex items-center gap-3 px-4 mb-4 group hover:opacity-80 transition" id="sidebar-profile-link">
                        <div className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                            <img src={`https://ui-avatars.com/api/?name=${avatarName}&background=0F172A&color=fff&bold=true`} alt="User" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className={`text-xs font-bold uppercase tracking-wide ${isPremium ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>{isPremium ? 'Premium Tier' : 'Basic'}</p>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{displayName.toUpperCase()}</p>
                        </div>
                    </Link>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-full overflow-y-auto p-8 lg:p-12 relative">
                <div className="max-w-[1240px] mx-auto w-full">
                    <header className="flex items-center justify-between mb-10">
                        <Link to="/candidate" className="text-xl font-bold text-slate-900 dark:text-white lg:hidden hover:opacity-80 transition-opacity">
                            <span className="text-blue-600">EQ</span>-Hire
                        </Link>
                        <div className="hidden lg:flex flex-1 max-w-md relative">
                            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all"
                            />
                        </div>
                        
                        <div className="flex items-center gap-4 ml-auto">
                            <button
                                onClick={handleLogout}
                                title="Sign out"
                                className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </header>

                    {children}
                </div>
            </main>
        </div>
    )
}