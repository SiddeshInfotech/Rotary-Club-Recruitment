import { LayoutDashboard, BrainCircuit, Briefcase, Share2, Settings, Bell, User } from 'lucide-react';
import ThemeToggle from '../components/common/ThemeToggle';

export default function CandidateLayout({ children }) {
    const navItems = [
        { name: 'OVERVIEW', icon: LayoutDashboard },
        { name: 'EQ INSIGHTS', icon: BrainCircuit },
        { name: 'OPPORTUNITIES', icon: Briefcase },
        { name: 'REFERRALS', icon: Share2 },
        { name: 'SETTINGS', icon: Settings }
    ];

    return (
        <div className="flex min-h-screen font-sans">
            {/* Left Sidebar */}
            <aside className="w-[280px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col pt-8 pb-6 px-6 relative z-10 flex-shrink-0 hidden lg:flex">
                <div className="mb-12">
                    <p className="text-xs tracking-wider font-black text-slate-800 dark:text-slate-200 uppercase mb-2">MEMBER PROFILE</p>
                    <span className="inline-block px-3 py-1 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-[10px] font-bold tracking-widest uppercase">
                        Premium Tier
                    </span>
                </div>

                <nav className="flex flex-col gap-2">
                    {navItems.map((item, idx) => {
                        const active = idx === 0;
                        const IconComponent = item.icon;
                        return (
                            <a key={item.name} href="#" className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold tracking-wider relative transition-colors ${active ? 'text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'}`}>
                                {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-600 dark:bg-blue-500 rounded-r-full" />}
                                <IconComponent className={`w-5 h-5 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                                {item.name}
                            </a>
                        );
                    })}
                </nav>
                <div className="mt-auto pt-8">
                    <button className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg py-4 text-xs uppercase font-bold tracking-widest hover:bg-slate-800 transition shadow-sm">
                        UPGRADE STATUS
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col bg-white dark:bg-[#0b1121] min-h-screen">
                {/* Top Nav */}
                <header className="h-[80px] px-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-shrink-0 bg-white dark:bg-slate-900">
                    <div className="flex items-center gap-14">
                        <div className="text-xl font-bold text-slate-900 dark:text-white">
                            <span className="text-blue-600">EQ</span>-Hire
                        </div>
                        <nav className="flex items-center gap-10 text-sm font-bold text-slate-500 dark:text-slate-400">
                            <a href="#" className="text-slate-900 dark:text-white pb-[27px] pt-7 border-b-[3px] border-blue-600 relative top-[1px]">Dashboard</a>
                            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Matches</a>
                            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Network</a>
                            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Growth</a>
                        </nav>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        {/* Dark Mode Toggle */}
                        <ThemeToggle />

                        <div className="relative cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-600 border-2 border-white dark:border-slate-900 rounded-full"></span>
                        </div>
                        <div className="flex items-center gap-3 cursor-pointer pl-4 border-l border-slate-200 dark:border-slate-700">
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden">
                                <User className="w-6 h-6 text-slate-500 dark:text-slate-400 mt-2" />
                            </div>
                            <span className="text-sm font-bold text-slate-800 dark:text-white">Marcus Thorne</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-12">
                    <div className="max-w-[1240px] mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}