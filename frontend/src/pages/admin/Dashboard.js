import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChart2, Users, Settings, LogOut, Search, Activity, Shield } from "lucide-react";
import api from "../../services/api";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                if (res.data.success) {
                    setStats(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch admin stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="flex h-screen bg-[#f8f9fa] font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-[#0d1b2a] text-white flex flex-col shadow-2xl z-10 transition-all">
                <div className="p-6 border-b border-white/10 flex items-center justify-center gap-3">
                    <Shield className="w-8 h-8 text-cyan-400" />
                    <span className="font-bold text-xl tracking-tight">Admin Console</span>
                </div>
                
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-cyan-500/10 text-cyan-400 rounded-xl font-medium border border-cyan-500/20 shadow-sm transition-colors text-left">
                        <BarChart2 className="w-5 h-5" /> Platform Analytics
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors text-left">
                        <Users className="w-5 h-5 opacity-70" /> User Management
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors text-left">
                        <Activity className="w-5 h-5 opacity-70" /> System Health
                    </button>
                    <div className="my-4 border-t border-white/10 mx-2"></div>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors text-left">
                        <Settings className="w-5 h-5 opacity-70" /> Platform Settings
                    </button>
                </div>
                
                <div className="p-4 border-t border-white/10">
                    <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl font-medium transition-colors text-left">
                        <LogOut className="w-5 h-5" /> Sign Out
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-0 relative">
                    <div className="flex items-center bg-gray-100 rounded-full px-4 py-1.5 w-96 border border-gray-200 focus-within:ring-2 ring-cyan-400/30 focus-within:border-cyan-400 transition-all">
                        <Search className="w-4 h-4 text-gray-400 mr-2" />
                        <input type="text" placeholder="Search logs, users, configuration..." className="bg-transparent border-none outline-none text-sm w-full" />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-bold text-[#1a2b4b]">System Administrator</p>
                            <p className="text-[11px] text-green-500 font-medium">All systems operational</p>
                        </div>
                    </div>
                </header>

                {/* Dashboard body */}
                <div className="flex-1 overflow-y-auto p-8">
                    <h1 className="text-2xl font-bold text-[#1a2b4b] mb-6">Overview</h1>
                    
                    {loading ? (
                        <div className="p-12 text-center text-gray-500 font-medium">Loading system statistics...</div>
                    ) : !stats ? (
                        <div className="p-12 text-center text-red-500 font-medium bg-red-50 rounded-xl">Error loading stats. Check server connection logs. Note: Requires Admin role.</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                {[
                                    {o: "Total Users", v: stats.totalUsers || 0, c: "text-blue-600"}, 
                                    {o: "Open Jobs", v: stats.totalJobs || 0, c: "text-green-600"}, 
                                    {o: "Applications", v: stats.totalApplications || 0, c: "text-indigo-600"}, 
                                    {o: "Open Tickets", v: stats.openTickets || 0, c: "text-amber-600"}
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <p className="text-sm font-medium text-gray-500 mb-1">{stat.o}</p>
                                        <p className={`text-3xl font-extrabold ${stat.c}`}>{stat.v}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-lg font-bold text-[#1a2b4b] mb-4">Recent User Registrations</h2>
                                <div className="rounded-xl border border-gray-100 overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
                                            <tr>
                                                <th className="px-6 py-3 font-semibold">Joined At</th>
                                                <th className="px-6 py-3 font-semibold">User</th>
                                                <th className="px-6 py-3 font-semibold">Email</th>
                                                <th className="px-6 py-3 font-semibold">Role</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {stats.recentUsers && stats.recentUsers.map((user) => (
                                                <tr key={user._id} className="hover:bg-gray-50/50">
                                                    <td className="px-6 py-3 text-gray-500">{new Date(user.createdAt).toLocaleString()}</td>
                                                    <td className="px-6 py-3 text-[#1a2b4b] font-medium">{user.name || 'N/A'}</td>
                                                    <td className="px-6 py-3 text-gray-500 font-mono text-xs">{user.email}</td>
                                                    <td className="px-6 py-3"><span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-cyan-50 text-cyan-700'}`}>{user.role}</span></td>
                                                </tr>
                                            ))}
                                            {(!stats.recentUsers || stats.recentUsers.length === 0) && (
                                                <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No users found in database.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
