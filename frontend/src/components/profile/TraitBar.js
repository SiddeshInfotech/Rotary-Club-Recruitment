export default function TraitBar({ trait, score }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {trait}
                </span>
                <span className="text-xs font-black text-slate-900 dark:text-white">
                    {score}
                </span>
            </div>
            <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-700"
                    style={{ width: `${score}%` }}
                />
            </div>
        </div>
    );
}
