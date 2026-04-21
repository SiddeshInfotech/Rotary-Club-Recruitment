import CandidateLayout from "../../layouts/CandidateLayout";
import EQRadarChart from "../../components/profile/EQRadarChart";

const EQ_SCORES = {
    Leadership: 88, Loyalty: 75, Adaptability: 82, 
    "Growth Mindset": 94, Reliability: 78, Teamwork: 65, 
    Collaboration: 70, "Problem Solving": 73,
};

export default function Insights() {
    return (
        <CandidateLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-8">
                <div className="max-w-[700px]">
                    <h3 className="text-[10px] tracking-widest font-bold text-slate-400 dark:text-slate-500 uppercase mb-3">ANALYTICS</h3>
                    <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4 font-serif">EQ Insights</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
                        Deep dive into your emotional intelligence DNA and see how you map against top 1% leaders across global communities.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-[20px] p-8 shadow-sm flex flex-col items-center justify-center">
                    <h3 className="text-sm font-bold tracking-widest text-slate-800 dark:text-slate-200 uppercase mb-8 self-start">COGNITIVE FOOTPRINT</h3>
                    <div className="w-full h-[400px]">
                        <EQRadarChart scores={EQ_SCORES} />
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="bg-slate-900 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 rounded-[20px] p-8 shadow-lg text-white">
                        <h4 className="text-[10px] uppercase tracking-widest font-bold text-blue-400 mb-2">DOMINANT TRAIT</h4>
                        <h2 className="text-3xl font-black mb-4">Growth Mindset</h2>
                        <p className="text-sm text-slate-300 leading-relaxed font-medium">
                            Your ability to adapt and seek improvement is exceptional. This trait makes you highly favorable for rapid-scaling initiatives and change-management roles.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-[20px] p-8 shadow-sm">
                        <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">DEVELOPMENT AREA</h4>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Teamwork & Collaboration</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-6">
                            While being highly self-sustaining, optimizing your collaborative friction can unlock 3x more leadership opportunities.
                        </p>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full w-[65%] rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </CandidateLayout>
    );
}
