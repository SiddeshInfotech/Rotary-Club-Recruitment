import CandidateLayout from "../../layouts/CandidateLayout";
import { Link } from 'react-router-dom';
import { Network as NetworkIcon, Users, MessageSquare, Briefcase, Award } from 'lucide-react';

export default function Network() {
    return (
        <CandidateLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-8">
                <div className="max-w-[700px]">
                    <h3 className="text-[10px] tracking-widest font-bold text-slate-400 dark:text-slate-500 uppercase mb-3">ELITE CURATOR NETWORK</h3>
                    <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4 font-serif">Community Feed</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
                        Engage with high-resonance leaders, share insights, and build strategic alliances across the global network.
                    </p>
                </div>
                
                <div className="flex gap-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 px-8 text-xs uppercase font-bold tracking-widest transition shadow-sm w-full md:w-auto">
                        NEW POST
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Feed */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Post 1 */}
                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                                <img src="https://ui-avatars.com/api/?name=Sarah+Al-Fayed&background=0F172A&color=fff&bold=true" alt="Sarah" className="w-full h-full object-cover"/>
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-slate-900 dark:text-white">Sarah Al-Fayed</h4>
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Lions Club Regional Lead • 2 hours ago</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                            Just successfully matched our 50th candidate using the new <strong className="text-blue-600 dark:text-blue-400">Empathic Intelligence</strong> parameters! The quality of leadership alignment is unprecedented. Have you updated your EQ profile recently?
                        </p>
                        <div className="flex items-center gap-6 border-t border-slate-100 dark:border-slate-800 pt-4">
                            <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition uppercase tracking-widest">
                                <Award className="w-4 h-4" /> 24 Resonate
                            </button>
                            <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition uppercase tracking-widest">
                                <MessageSquare className="w-4 h-4" /> 5 Comments
                            </button>
                        </div>
                    </div>

                    {/* Post 2 */}
                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                                <img src="https://ui-avatars.com/api/?name=Marcus+Thorne&background=0F172A&color=fff&bold=true" alt="Marcus" className="w-full h-full object-cover"/>
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-slate-900 dark:text-white">Marcus Thorne</h4>
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">District Governor, Rotary • 5 hours ago</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                            Seeking individuals with high <strong className="text-indigo-600 dark:text-indigo-400">Visionary Logic</strong> for our upcoming global sustainability panel. If your resonance is over 80% on this trait, let's connect!
                        </p>
                        <div className="flex items-center gap-6 border-t border-slate-100 dark:border-slate-800 pt-4">
                            <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition uppercase tracking-widest">
                                <Award className="w-4 h-4" /> 89 Resonate
                            </button>
                            <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition uppercase tracking-widest">
                                <MessageSquare className="w-4 h-4" /> 12 Comments
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="flex flex-col gap-6">
                    {/* Suggested Connections */}
                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-6 shadow-sm">
                        <h4 className="text-xs uppercase tracking-widest font-bold text-slate-800 dark:text-slate-200 mb-6">High Resonance Profiles</h4>
                        
                        <div className="flex flex-col gap-5">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex-shrink-0 overflow-hidden">
                                            <img src={`https://ui-avatars.com/api/?name=Leader+${i}&background=0F172A&color=fff&bold=true`} alt="User" className="w-full h-full object-cover"/>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-900 dark:text-white leading-tight">Elite Candidate {i}</p>
                                            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">94% Match</p>
                                        </div>
                                    </div>
                                    <button className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-2 rounded-lg transition">
                                        <Users className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        <button className="w-full mt-6 text-[10px] uppercase font-bold tracking-widest text-slate-500 hover:text-blue-600 transition">
                            VIEW ALL SUGGESTIONS
                        </button>
                    </div>
                </div>
            </div>
        </CandidateLayout>
    );
}
