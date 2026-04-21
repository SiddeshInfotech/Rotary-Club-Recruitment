import CandidateLayout from "../../layouts/CandidateLayout";
import { TrendingUp, Target, Zap } from 'lucide-react';

export default function Growth() {
    return (
        <CandidateLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-8">
                <div className="max-w-[700px]">
                    <h3 className="text-[10px] tracking-widest font-bold text-slate-400 dark:text-slate-500 uppercase mb-3">CONTINUOUS DEVELOPMENT</h3>
                    <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4 font-serif">Leadership Growth</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
                        Track your emotional intelligence progression and recommended actionable steps to elevate your resonance profile.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] p-8 rounded-[20px] shadow-sm text-center">
                    <div className="w-16 h-16 mx-auto bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
                        <TrendingUp className="w-8 h-8" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">+12%</h3>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">EQ Score Growth (YTD)</p>
                </div>
                <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] p-8 rounded-[20px] shadow-sm text-center">
                    <div className="w-16 h-16 mx-auto bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4">
                        <Zap className="w-8 h-8" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Adaptability</h3>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Most Improved Trait</p>
                </div>
            </div>

            <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-[20px] shadow-sm p-8">
                <h3 className="text-sm font-bold tracking-widest text-slate-800 dark:text-slate-200 uppercase mb-6">RECOMMENDED ACTIONS</h3>
                
                <div className="flex flex-col gap-6">
                    <div className="flex gap-4 p-6 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0b1121] rounded-[20px] hover:shadow-md transition">
                        <div className="flex-shrink-0 mt-1">
                            <Target className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <h4 className="text-base font-black text-slate-900 dark:text-white mb-2">Enhance Empathic Resonance</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4 max-w-2xl">
                                Your baseline scores show great analytical capability. Bridging this with advanced empathic understanding will unlock Tier 1 executive roles within the Lions Club network.
                            </p>
                            <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">Start Simulation</button>
                        </div>
                    </div>
                </div>
            </div>
        </CandidateLayout>
    );
}
