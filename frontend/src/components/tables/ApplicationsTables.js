import { useState, useEffect } from "react";
import api from "../../services/api";

const STATUS_STYLES = {
    'Applied': {
        statusColor: 'text-amber-600 dark:text-amber-400',
        dotColor: 'bg-amber-500 dark:bg-amber-400',
    },
    'Shortlisted': {
        statusColor: 'text-green-600 dark:text-green-400',
        dotColor: 'bg-green-500 dark:bg-green-400',
    },
    'Interview Scheduled': {
        statusColor: 'text-blue-600 dark:text-blue-400',
        dotColor: 'bg-blue-600 dark:bg-blue-400',
    },
    'Reviewing Profile': {
        statusColor: 'text-slate-500 dark:text-slate-400',
        dotColor: 'bg-slate-300 dark:bg-slate-500',
    },
    'Rejected': {
        statusColor: 'text-red-600 dark:text-red-400',
        dotColor: 'bg-red-500 dark:bg-red-400',
    },
};

export default function ActiveApplications() {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await api.get('/candidate-dashboard/applications');
                if (res.data.success) {
                    setApps(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch applications:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <span className="text-sm text-slate-400 font-medium">Loading applications...</span>
            </div>
        );
    }

    if (apps.length === 0) {
        return (
            <div className="flex items-center justify-center p-8">
                <span className="text-sm text-slate-400 font-medium">No applications yet. Start applying to jobs!</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-full">
            {apps.map((app, idx) => {
                const styles = STATUS_STYLES[app.status] || STATUS_STYLES['Applied'];
                return (
                    <div key={app._id} className={`flex items-center gap-6 p-6 ${idx !== apps.length - 1 ? 'border-b border-slate-100 dark:border-[#1e293b]' : ''} hover:bg-slate-50 dark:hover:bg-[#0b1121]/50 transition`}>
                        <div className="w-12 h-12 rounded-full border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#131b2f] overflow-hidden shadow-sm flex items-center justify-center flex-shrink-0">
                             <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(app.company.split(' ')[0])}&background=f8fafc&color=475569`} alt="" className="w-full h-full object-cover dark:opacity-80" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black tracking-tight text-slate-900 dark:text-white mb-1.5">{app.jobTitle}</h4>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2.5">{app.company}</p>
                            <div className={`flex items-center gap-2 ${styles.statusColor}`}>
                                <div className={`w-2 h-2 rounded-full ${styles.dotColor}`}></div>
                                <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold">{app.status}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}
