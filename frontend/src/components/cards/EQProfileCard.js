export default function EQProfileCard() {
    return (
        <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-10 flex flex-col items-center justify-between shadow-sm dark:shadow-none hover:shadow-md transition relative overflow-hidden">
            <h3 className="text-xs tracking-widest font-bold uppercase text-slate-800 dark:text-slate-200 mb-10 w-full text-center">
                8-TRAIT EQ VISUALIZATION
            </h3>

            <div className="flex-1 w-full flex items-center justify-center relative my-6">
                {/* 
                 * Pure SVG Radar Implementation 
                 * We explicitly parse this grid utilizing scalable standard polygons 
                 * instead of pulling in a heavy visualization library like Recharts.
                 * The viewBox coordinate mapping ensures high performance without component bloat. 
                 */}
                <svg viewBox="0 0 240 240" className="w-[320px] h-[320px] text-slate-200 dark:text-slate-700" style={{ transform: 'scale(1.2)' }}>
                    {/* Background Grids */}
                    <polygon points="120,20 190.7,49.3 220,120 190.7,190.7 120,220 49.3,190.7 20,120 49.3,49.3" fill="none" stroke="currentColor" strokeWidth="1" />
                    <polygon points="120,45 173,67 195,120 173,173 120,195 67,173 45,120 67,67" fill="none" stroke="currentColor" strokeWidth="1" />
                    <polygon points="120,70 155,85 170,120 155,155 120,170 85,155 70,120 85,85" fill="none" stroke="currentColor" strokeWidth="1" />
                    
                    {/* Axes */}
                    <line x1="120" y1="20" x2="120" y2="220" stroke="currentColor" strokeWidth="1" />
                    <line x1="20" y1="120" x2="220" y2="120" stroke="currentColor" strokeWidth="1" />
                    <line x1="49.3" y1="49.3" x2="190.7" y2="190.7" stroke="currentColor" strokeWidth="1" />
                    <line x1="49.3" y1="190.7" x2="190.7" y2="49.3" stroke="currentColor" strokeWidth="1" />

                    {/* Blue Data Polygon */}
                    <polygon points="120,30 180,60 210,120 170,165 120,190 70,160 30,120 60,50" fill="#2563eb" fillOpacity="0.15" stroke="#2563eb" strokeWidth="2.5" strokeLinejoin="round" className="dark:fill-blue-500 dark:fill-opacity-20 dark:stroke-blue-400" />
                    
                    {/* Points */}
                    <circle cx="120" cy="30" r="3.5" fill="#2563eb" className="dark:fill-blue-400" />
                    <circle cx="180" cy="60" r="3.5" fill="#2563eb" className="dark:fill-blue-400" />
                    <circle cx="210" cy="120" r="3.5" fill="#2563eb" className="dark:fill-blue-400" />
                    <circle cx="170" cy="165" r="3.5" fill="#2563eb" className="dark:fill-blue-400" />
                    <circle cx="120" cy="190" r="3.5" fill="#2563eb" className="dark:fill-blue-400" />
                    <circle cx="70" cy="160" r="3.5" fill="#2563eb" className="dark:fill-blue-400" />
                    <circle cx="30" cy="120" r="3.5" fill="#2563eb" className="dark:fill-blue-400" />
                    <circle cx="60" cy="50" r="3.5" fill="#2563eb" className="dark:fill-blue-400" />
                </svg>

                {/* Labels */}
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest bg-white dark:bg-[#131b2f] px-1.5 py-0.5 rounded">LEADERSHIP</span>
                <span className="absolute top-10 right-0 text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">LOYALTY</span>
                <span className="absolute top-1/2 -right-4 -translate-y-1/2 text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest bg-white dark:bg-[#131b2f] px-1.5 py-0.5 rounded">ADAPTABILITY</span>
                <span className="absolute bottom-10 right-0 text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest max-w-[60px] text-center leading-tight">GROWTH MINDSET</span>
                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest bg-white dark:bg-[#131b2f] px-1.5 py-0.5 rounded">RELIABILITY</span>
                <span className="absolute bottom-10 left-2 text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">TEAMWORK</span>
                <span className="absolute top-1/2 -left-6 -translate-y-1/2 text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest bg-white dark:bg-[#131b2f] px-1.5 py-0.5 rounded">COLLABORATION</span>
                <span className="absolute top-10 left-2 text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest max-w-[60px] text-center leading-tight">PROBLEM SOLVING</span>
            </div>

            <p className="text-xs uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mt-10 w-full text-center">
                Visual analysis based on your 60-point professional assessment.
            </p>
        </div>
    );
}