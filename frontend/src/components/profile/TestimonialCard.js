export default function TestimonialCard({ name, role, text }) {
    return (
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-6 border border-slate-100 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed mb-5">
                "{text}"
            </p>
            <div className="flex items-center gap-3">
                <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0F172A&color=fff&bold=true`}
                    alt={name}
                    className="w-8 h-8 rounded-full"
                />
                <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{name}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{role}</p>
                </div>
            </div>
        </div>
    );
}
