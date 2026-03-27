import { LayoutDashboard, Star, Network, TrendingUp, BrainCircuit, Users, Settings, Bell, Search } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import ThemeToggle from '../components/common/ThemeToggle';
import { useAuth } from '../context/AuthContext';

export default function CandidateLayout({ children }) {
    const location = useLocation();
    const { user } = useAuth();

    const displayName = user?.fullName || 'Guest User';
    const avatarName = encodeURIComponent(displayName);

    const baseMainMenu = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/candidate' },
        { name: 'Job Search', icon: Search, path: '/job-search' },
        { name: 'Network', icon: Network, path: '/network' },
        { name: 'Growth', icon: TrendingUp, path: '/growth' }
    ];

    const isJobRelated = location.pathname.includes('/job') || location.pathname === '/matches';
    
    const mainMenu = isJobRelated ? [
        baseMainMenu[0],
        baseMainMenu[1],
        { name: 'Matches', icon: Star, path: '/matches' }
    ] : baseMainMenu;

    const insightsMenu = [
        { name: 'EQ Insights', icon: BrainCircuit, path: '/insights' },
        { name: 'Referrals', icon: Users, path: '/referrals' }
    ];

    return (
        <div className="flex h-screen overflow-hidden font-sans bg-slate-50 dark:bg-[#0b1121]">
            <aside className="w-[300px] h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col py-8 px-6 relative z-10 flex-shrink-0 hidden lg:flex">
                <div className="mb-10 px-4">
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        <span className="text-blue-600">EQ</span>-Hire
                    </h1>
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
                            <a href="#" className="flex items-center gap-4 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 w-full">
                                <Settings className="w-5 h-5 text-slate-400" />
                                Settings
                            </a>
                        </div>
                        <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200">
                            <Bell className="w-5 h-5 text-slate-400" />
                            Notifications
                        </a>

                    <Link to="/profile" className="flex items-center gap-3 px-4 mb-6 group hover:opacity-80 transition" id="sidebar-profile-link">
                        <div className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                            <img src={`https://ui-avatars.com/api/?name=${avatarName}&background=0F172A&color=fff&bold=true`} alt="User" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-blue-600 dark:text-blue-400">Premium Tier</p>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{displayName.toUpperCase()}</p>
                        </div>
                    </Link>

                    <button className="w-full bg-slate-900 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 text-white rounded-xl py-3.5 text-xs uppercase font-bold tracking-widest hover:bg-slate-800 dark:hover:bg-slate-700 transition shadow-sm">
                        UPGRADE STATUS
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-full overflow-y-auto p-8 lg:p-12 relative">
                <div className="max-w-[1240px] mx-auto w-full">
                    <header className="flex items-center justify-between mb-10">
                        <div className="text-xl font-bold text-slate-900 dark:text-white lg:hidden">
                            <span className="text-blue-600">EQ</span>-Hire
                        </div>
                        <div className="hidden lg:flex flex-1 max-w-md relative">
                            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all"
                            />
                        </div>
                        
                        <div className="flex items-center gap-4 ml-auto">
                            <ThemeToggle />
                            
                            <button className="relative p-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition shadow-sm">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-600 border-2 border-white dark:border-slate-900 rounded-full"></span>
                            </button>
                        </div>
                    </header>

                    {children}
                </div>
            </main>
        </div>
    )
}