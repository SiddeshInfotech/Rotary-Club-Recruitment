import { useNavigate } from 'react-router-dom';
import ThemeToggle from "../../components/common/ThemeToggle";

export default function EQJourney() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0b1121] text-slate-900 dark:text-white font-sans">
            <header className="absolute w-full p-8 flex justify-between items-center z-10">
                <div className="text-2xl font-bold tracking-tight">
                    <span className="text-blue-600">EQ</span>-Hire
                </div>
                <ThemeToggle />
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>
                
                <div className="max-w-[700px] text-center w-full z-10">
                    <h3 className="text-xs uppercase tracking-widest font-black text-blue-600 dark:text-blue-500 mb-6 drop-shadow-sm">ELITE ASSESSMENT PROTOCOL</h3>
                    <h1 className="text-6xl md:text-7xl font-black tracking-tight mb-8 font-serif leading-tight">
                        The EQ Journey <br/> <span className="text-slate-400 dark:text-slate-500">Begins Here</span>
                    </h1>
                    
                    <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-12 max-w-xl mx-auto">
                        This 12-minute immersive assessment unlocks your full emotional intelligence profile, matching you with elite roles that resonate with your true leadership style.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button 
                            onClick={() => navigate('/eq-assessment')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-[20px] text-sm uppercase tracking-widest font-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto"
                        >
                            Start My Assessment
                        </button>
                        <button 
                            onClick={() => navigate('/candidate')}
                            className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-10 py-5 rounded-[20px] text-sm uppercase tracking-widest font-black transition-all shadow-sm w-full sm:w-auto"
                        >
                            Skip to Dashboard
                        </button>
                    </div>

                    <div className="mt-16 flex items-center justify-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-400">
                        <span className="flex items-center gap-2">✓ 12 Minutes</span>
                        <span className="flex items-center gap-2">✓ Science-backed</span>
                        <span className="flex items-center gap-2">✓ Privacy-first</span>
                    </div>
                </div>
            </main>
        </div>
    );
}
