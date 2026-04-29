export default function ActiveApplications() {
    const apps = [
        {
            id: 1,
            title: 'VP of Culture',
            company: 'Aether Platforms',
            status: 'INTERVIEW SCHEDULED',
            statusColor: 'text-blue-600 dark:text-blue-400',
            dotColor: 'bg-blue-600 dark:bg-blue-400'
        },
        {
            id: 2,
            title: 'Lead Orchestrator',
            company: 'Unity Systems',
            status: 'REVIEWING PROFILE',
            statusColor: 'text-slate-500 dark:text-slate-400',
            dotColor: 'bg-slate-300 dark:bg-slate-500'
        }
    ]
    return (
        <div className="flex flex-col w-full h-full">
            {apps.map((app, idx) => (
                <div key={app.id} className={`flex items-center gap-6 p-6 ${idx !== apps.length - 1 ? 'border-b border-slate-100 dark:border-[#1e293b]' : ''} hover:bg-slate-50 dark:hover:bg-[#0b1121]/50 transition`}>
                    <div className="w-12 h-12 rounded-full border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#131b2f] overflow-hidden shadow-sm flex items-center justify-center flex-shrink-0">
                         <img src={`https://ui-avatars.com/api/?name=${app.company.split(' ')[0]}&background=f8fafc&color=475569`} alt="" className="w-full h-full object-cover dark:opacity-80" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black tracking-tight text-slate-900 dark:text-white mb-1.5">{app.title}</h4>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2.5">{app.company}</p>
                        <div className={`flex items-center gap-2 ${app.statusColor}`}>
                            <div className={`w-2 h-2 rounded-full ${app.dotColor}`}></div>
                            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold">{app.status}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
