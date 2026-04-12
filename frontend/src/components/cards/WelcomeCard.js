export default function WelcomeCard({ primaryAnchor, strengthRating, peerPercentile, traitStability }) {
    const label = primaryAnchor?.label || 'Not Assessed';
    const description = primaryAnchor?.description || 'Complete your EQ assessment to see your Core DNA.';
    const rating = strengthRating || 0;
    const percentile = peerPercentile || 0;
    const stability = traitStability || 'N/A';

    return (
        <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-10 flex flex-col justify-between shadow-sm dark:shadow-none hover:shadow-md transition">
            <div className="mb-10">
                <span className="text-xs tracking-widest font-bold uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-3 py-1.5 rounded-md inline-block mb-6">
                    PRIMARY ANCHOR
                </span>
                <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-4 font-serif">{label}</h2>
                <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {description}
                </p>
            </div>

            <div>
                <div className="flex justify-between items-end mb-4">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-wider">Strength Rating</span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{rating}<span className="text-sm text-slate-400 dark:text-slate-500 font-medium">/100</span></span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full mb-10 overflow-hidden">
                    <div 
                        className="h-full bg-blue-600 dark:bg-blue-500 rounded-full shadow-sm transition-all duration-700 ease-out"
                        style={{ width: `${Math.min(rating, 100)}%` }}
                    ></div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-slate-50 dark:bg-[#0b1121] border border-slate-100 dark:border-[#1e293b] p-6 rounded-2xl shadow-sm hover:shadow transition">
                        <p className="text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-2">PEER PERCENTILE</p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">{percentile > 0 ? `${percentile}th` : '—'}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-[#0b1121] border border-slate-100 dark:border-[#1e293b] p-6 rounded-2xl shadow-sm hover:shadow transition">
                        <p className="text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-2">TRAIT STABILITY</p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">{stability}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}