export default function RecommendedMatches({ logo, title, company, tags, match }) {
    return (
        <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm dark:shadow-none transition-all hover:shadow-md dark:hover:border-[#334155]">
            <div className="flex items-center gap-6 mb-4 md:mb-0">
                <div className="w-16 h-16 bg-slate-900 dark:bg-slate-800 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-black overflow-hidden shadow-inner">
                    <img src={`https://ui-avatars.com/api/?name=${company.split(' ')[0]}&background=0F172A&color=fff&bold=true`} alt={company} className="w-full h-full object-cover" />
                </div>
                <div>
                    <h4 className="text-base font-black tracking-tight text-slate-900 dark:text-white mb-1.5 leading-none">{title}</h4>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-3">{company}</p>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, idx) => (
                            <span key={idx} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-md text-[10px] sm:text-xs font-bold tracking-widest uppercase shadow-sm">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-6 md:pl-6 md:border-l border-slate-100 dark:border-slate-800 w-full md:w-auto justify-end">
                <div className="flex flex-col items-end">
                    <span className="text-base font-black text-blue-600 dark:text-blue-400">{match}</span>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-500 uppercase tracking-widest mt-0.5">EQ MATCH</span>
                </div>
                <button className="px-5 py-2.5 rounded-full bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white flex items-center justify-center gap-2 transition flex-shrink-0 shadow-sm shadow-slate-300 dark:shadow-none">
                    <span className="text-[11px] font-bold tracking-widest uppercase">Apply</span>
                    <span className="text-base font-bold leading-none mb-0.5">&rarr;</span>
                </button>
            </div>
        </div>
    )
}