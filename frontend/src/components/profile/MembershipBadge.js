import { Building2 } from "lucide-react";

export default function MembershipBadge({ org, chapter, verified = false, renewal, icon: Icon = Building2 }) {
    return (
        <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wide">
                            {org}
                        </p>
                        {verified && (
                            <span className="text-[9px] font-bold text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                VERIFIED
                            </span>
                        )}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{chapter}</p>
                    {renewal && (
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                            Renewal due: {renewal}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
