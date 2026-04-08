export default function QuickStatCard({ icon: Icon, label, value }) {
    return (
        <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col gap-2">
            <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">
                {label}
            </p>
            <p className="text-sm font-black text-slate-900 dark:text-white">{value}</p>
        </div>
    );
}
