import { Briefcase, ChevronRight } from "lucide-react";

export default function JobListingRow({ title, type, location, match }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition cursor-pointer group">
            <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        {title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {type} · {location}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                    <p className="text-xs font-black text-blue-600 dark:text-blue-400">{match}%</p>
                    <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">match</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition" />
            </div>
        </div>
    );
}
