export default function StatBlock({ label, value }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{value}</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">
                {label}
            </span>
        </div>
    );
}
