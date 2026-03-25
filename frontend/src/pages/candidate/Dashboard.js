import CandidateLayout from "../../layouts/CandidateLayout";
import WelcomeCard from "../../components/cards/WelcomeCard";
import EQProfileCard from "../../components/cards/EQProfileCard";
import RecommendedMatches from "../../components/cards/JobCard";
import ActiveApplications from "../../components/tables/ApplicationsTables";

export default function Dashboard() {
    return (
        <CandidateLayout>
            
            {/* Hero Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 mt-4 gap-8">
                <div className="max-w-[700px]">
                    <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4 font-serif">Candidate Intelligence</h1>
                    <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                        Welcome back, Marcus. Your EQ profile has been updated based on your recent teamwork simulations.
                    </p>
                </div>
                
                <div className="flex gap-6">
                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] px-8 py-6 rounded-2xl flex flex-col items-center justify-center shadow-sm">
                        <span className="text-4xl font-black text-slate-900 dark:text-white leading-none mb-2">842</span>
                        <span className="text-xs uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">ELITE SCORE</span>
                    </div>
                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] px-8 py-6 rounded-2xl flex flex-col items-center justify-center shadow-sm">
                        <span className="text-4xl font-black text-blue-600 dark:text-blue-500 leading-none mb-2">Top 2%</span>
                        <span className="text-xs uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">GLOBAL RANK</span>
                    </div>
                </div>
            </div>

            {/* EQ CORE DNA ANALYSIS */}
            <div className="mb-6 flex items-end justify-between">
                <h3 className="text-sm font-bold tracking-widest text-slate-800 dark:text-slate-200 uppercase">EQ CORE DNA ANALYSIS</h3>
                <a href="#" className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline flex items-center gap-2">
                    Detailed Breakdown 
                    <span className="text-xl leading-none">&rarr;</span>
                </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                <WelcomeCard />
                <EQProfileCard />
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    <div className="flex items-center gap-4 mb-8">
                        <h3 className="text-sm font-bold tracking-widest text-slate-800 dark:text-slate-200 uppercase">AI RECOMMENDED MATCHES</h3>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase bg-blue-50 dark:bg-blue-900/40 px-3 py-1.5 rounded-md">2 NEW TODAY</span>
                    </div>
                    <div className="flex flex-col gap-6">
                        <RecommendedMatches 
                            title="Strategic Operations Director"
                            company="NexCore Intelligence • Full-time • Hybrid"
                            match="98%"
                            tags={['Leadership', 'Strategy']}
                        />
                        <RecommendedMatches 
                            title="Senior Product Catalyst"
                            company="Veridian Dynamics • Remote • Global"
                            match="94%"
                            tags={['Adaptability', 'Growth']}
                        />
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-bold tracking-widest text-slate-800 dark:text-slate-200 uppercase mb-8">ACTIVE APPLICATIONS</h3>
                    <div className="flex flex-col gap-0 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                        <ActiveApplications />
                    </div>
                    <button className="w-full mt-6 text-xs font-bold tracking-widest uppercase py-4 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white transition shadow-sm">
                        VIEW ALL HISTORY
                    </button>
                </div>
            </div>

        </CandidateLayout>
    );
}