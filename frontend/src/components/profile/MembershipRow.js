import { Building2 } from "lucide-react";

export default function MembershipRow({ org, detail, icon: Icon = Building2 }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
                <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wide">
                    {org}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{detail}</p>
            </div>
        </div>
    );
}
