export default function StatChip({ label, value }) {
    return (
        <div className="flex flex-col gap-1 bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">
                {label}
            </span>
            <span className="text-base font-black text-slate-900 dark:text-white leading-tight">
                {value}
            </span>
        </div>
    );
}
