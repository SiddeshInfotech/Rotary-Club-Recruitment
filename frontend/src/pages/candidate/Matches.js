import CandidateLayout from "../../layouts/CandidateLayout";
import { ChevronDown, Search, Users } from 'lucide-react';

export default function Matches() {
    return (
        <CandidateLayout>
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
                <div className="max-w-[700px]">
                    <h3 className="text-[10px] tracking-widest font-bold text-slate-400 dark:text-slate-500 uppercase mb-3">CURATED OPPORTUNITIES</h3>
                    <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4 font-serif">Curated Matches</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
                        Intelligent matching based on cognitive resonance and community prestige within the Rotary, Lions, and BNI ecosystems.
                    </p>
                </div>
                
                <div className="flex gap-4">
                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] px-6 py-4 rounded-[20px] flex flex-col items-center justify-center shadow-sm">
                        <span className="text-3xl font-black text-slate-900 dark:text-white leading-none mb-2">42</span>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">HIGH RESONANCE</span>
                    </div>
                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] px-6 py-4 rounded-[20px] flex flex-col items-center justify-center shadow-sm">
                        <span className="text-3xl font-black text-blue-600 dark:text-blue-500 leading-none mb-2">12</span>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">CLUB REFERRALS</span>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full">
                <div className="flex-1 min-w-[200px] relative">
                    <select className="w-full appearance-none bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] text-sm font-semibold text-slate-700 dark:text-slate-300 py-3.5 pl-5 pr-12 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm cursor-pointer transition">
                        <option>All Communities</option>
                        <option>Rotary Club</option>
                        <option>Lions Club</option>
                        <option>BNI Network</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="flex-1 min-w-[200px] relative">
                    <select className="w-full appearance-none bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] text-sm font-semibold text-slate-700 dark:text-slate-300 py-3.5 pl-5 pr-12 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm cursor-pointer transition">
                        <option>Industry Focus</option>
                        <option>Technology</option>
                        <option>Finance</option>
                        <option>Operations</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="flex-1 min-w-[200px] relative">
                    <select className="w-full appearance-none bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] text-sm font-semibold text-slate-700 dark:text-slate-300 py-3.5 pl-5 pr-12 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm cursor-pointer transition">
                        <option>Global Location</option>
                        <option>EMEA</option>
                        <option>North America</option>
                        <option>Remote</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <button className="bg-slate-900 border border-slate-800 dark:bg-slate-800 dark:border-slate-700 text-white rounded-[20px] py-3.5 px-8 text-xs uppercase font-bold tracking-widest hover:bg-slate-800 dark:hover:bg-slate-700 transition shadow-sm w-full md:w-auto">
                    APPLY
                </button>
            </div>

            {/* Grid Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Standard Card 1 */}
                <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-[20px] p-8 flex flex-col justify-between shadow-sm dark:shadow-none hover:shadow-md transition">
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-[16px] flex items-center justify-center flex-shrink-0 text-slate-600 dark:text-slate-400">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-1">ROTARY CLUB OF LONDON</p>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none">VP, Sustainable Growth</h3>
                                </div>
                            </div>
                            {/* Circular Rate */}
                            <div className="relative w-14 h-14 flex-shrink-0">
                                <svg viewBox="0 0 36 36" className="w-full h-full text-blue-600 drop-shadow-sm">
                                    <path className="text-slate-200 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                    <path className="text-blue-600 dark:text-blue-500" strokeDasharray="92, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <span className="text-sm font-bold text-slate-900 dark:text-white leading-none">92%</span>
                                    <span className="text-[6px] tracking-widest font-black uppercase text-slate-400 dark:text-slate-500 scale-75 leading-none">RESONANCE</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-6">
                            Looking for a leader with high <strong className="text-blue-600 dark:text-blue-400 font-bold">Empathic Intelligence</strong> to bridge philanthropic goals with commercial scalability.
                        </p>

                        <div className="flex gap-2 mb-8">
                            <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400">LONDON / HYBRID</span>
                            <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400">£180K - £220K</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-[#0b1121] border border-slate-100 dark:border-[#1e293b] p-4 rounded-[20px] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex-shrink-0 overflow-hidden">
                                <img src="https://ui-avatars.com/api/?name=Elena+Vance&background=0F172A&color=fff&bold=true" alt="Elena" className="w-full h-full object-cover"/>
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-900 dark:text-white leading-tight">Elena Vance</p>
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Head Curator, Elite</p>
                            </div>
                        </div>
                        <button className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/60 px-5 py-2.5 rounded-[16px] text-[10px] uppercase tracking-widest font-bold transition">
                            ENGAGE
                        </button>
                    </div>
                </div>

                {/* Standard Card 2 */}
                <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-[20px] p-8 flex flex-col justify-between shadow-sm dark:shadow-none hover:shadow-md transition">
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-[16px] flex items-center justify-center flex-shrink-0 text-slate-600 dark:text-slate-400">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 tracking-widest uppercase mb-1">LIONS CLUB INTERNATIONAL</p>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none">Chief Intelligence Officer</h3>
                                </div>
                            </div>
                            {/* Circular Rate */}
                            <div className="relative w-14 h-14 flex-shrink-0">
                                <svg viewBox="0 0 36 36" className="w-full h-full text-indigo-600 drop-shadow-sm">
                                    <path className="text-slate-200 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                    <path className="text-indigo-600 dark:text-indigo-500" strokeDasharray="88, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <span className="text-sm font-bold text-slate-900 dark:text-white leading-none">88%</span>
                                    <span className="text-[6px] tracking-widest font-black uppercase text-slate-400 dark:text-slate-500 scale-75 leading-none">RESONANCE</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-6">
                            A role centered on <strong className="text-indigo-600 dark:text-indigo-400 font-bold">Visionary Logic</strong>. The candidate must balance data-driven insights with the club's core service values.
                        </p>

                        <div className="flex gap-2 mb-8 flex-wrap">
                            <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400">REMOTE / GLOBAL</span>
                            <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400">COMPETITIVE EQUITY</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-[#0b1121] border border-slate-100 dark:border-[#1e293b] p-4 rounded-[20px] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex-shrink-0 overflow-hidden">
                                <img src="https://ui-avatars.com/api/?name=Marcus+Thorne&background=0F172A&color=fff&bold=true" alt="Marcus" className="w-full h-full object-cover"/>
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-900 dark:text-white leading-tight">Marcus Thorne</p>
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">District Governor, Rotary</p>
                            </div>
                        </div>
                        <button className="bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 border border-slate-700 px-5 py-2.5 rounded-[16px] text-[10px] uppercase tracking-widest font-bold transition shadow-sm">
                            ENGAGE
                        </button>
                    </div>
                </div>

                {/* Standard Card 3 */}
                <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-[20px] p-8 flex flex-col justify-between shadow-sm dark:shadow-none hover:shadow-md transition">
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-[16px] flex items-center justify-center flex-shrink-0 text-slate-600 dark:text-slate-400">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-1">BNI GLOBAL NETWORK</p>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none">Managing Director, EMEA</h3>
                                </div>
                            </div>
                            {/* Circular Rate */}
                            <div className="relative w-14 h-14 flex-shrink-0">
                                <svg viewBox="0 0 36 36" className="w-full h-full text-blue-600 drop-shadow-sm">
                                    <path className="text-slate-200 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                    <path className="text-blue-600 dark:text-blue-500" strokeDasharray="82, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <span className="text-sm font-bold text-slate-900 dark:text-white leading-none">82%</span>
                                    <span className="text-[6px] tracking-widest font-black uppercase text-slate-400 dark:text-slate-500 scale-75 leading-none">RESONANCE</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-6">
                            Strategic oversight of high-performance networking chapters. Requires exceptional <strong className="text-blue-600 dark:text-blue-400 font-bold">Diplomatic Acumen</strong>.
                        </p>

                        <div className="flex gap-2 mb-8">
                            <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400">PARIS, FRANCE</span>
                            <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400">€200K+ OTE</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-[#0b1121] border border-slate-100 dark:border-[#1e293b] p-4 rounded-[20px] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex-shrink-0 overflow-hidden">
                                <img src="https://ui-avatars.com/api/?name=Sarah+Al-Fayed&background=0F172A&color=fff&bold=true" alt="Sarah" className="w-full h-full object-cover"/>
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-900 dark:text-white leading-tight">Sarah Al-Fayed</p>
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Lions Club Regional Lead</p>
                            </div>
                        </div>
                        <button className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/60 px-5 py-2.5 rounded-[16px] text-[10px] uppercase tracking-widest font-bold transition">
                            ENGAGE
                        </button>
                    </div>
                </div>

                {/* Premium Spotlight Card */}
                <div className="bg-slate-900 dark:bg-[#0f172a] border border-slate-800 dark:border-[#1e293b] rounded-[20px] p-10 flex flex-col justify-between shadow-lg relative overflow-hidden group">
                    {/* Background faint glow / shape */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 dark:bg-blue-600/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
                    
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-4">PREMIUM SPOTLIGHT</p>
                        <h3 className="text-3xl font-black text-white leading-none mb-6 font-serif">Curated Board <br/>Member Search</h3>
                        
                        <p className="text-sm text-slate-300 leading-relaxed font-medium mb-10 max-w-md">
                            Your EQ profile suggests a strong fit for Non-Executive Director roles within the Lions Foundation.
                        </p>
                    </div>

                    <button className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-4 rounded-[20px] text-xs uppercase tracking-widest font-black transition shadow-sm w-max">
                        VIEW INVITATION
                    </button>
                </div>
            </div>
        </CandidateLayout>
    );
}
