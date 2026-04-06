import React from "react";
import { Link } from "react-router-dom";
import { BarChart2, Users, Settings, LogOut, Search, Activity, Shield } from "lucide-react";

export default function AdminDashboard() {
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {[{o: "Total Users", v: "14,295", c: "text-blue-600"}, {o: "Active Sessions", v: "842", c: "text-green-600"}, {o: "Total Clubs", v: "156", c: "text-cyan-600"}, {o: "Server Load", v: "34%", c: "text-amber-600"}].map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <p className="text-sm font-medium text-gray-500 mb-1">{stat.o}</p>
                                <p className={`text-3xl font-extrabold ${stat.c}`}>{stat.v}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-[#1a2b4b] mb-4">Recent Activity Logs</h2>
                        <div className="rounded-xl border border-gray-100 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">Timestamp</th>
                                        <th className="px-6 py-3 font-semibold">Event</th>
                                        <th className="px-6 py-3 font-semibold">User ID</th>
                                        <th className="px-6 py-3 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {[1,2,3,4,5].map((i) => (
                                        <tr key={i} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-3 text-gray-500">2026-04-06 10:{42-i}:0{i}</td>
                                            <td className="px-6 py-3 text-[#1a2b4b] font-medium">Authentication token generated</td>
                                            <td className="px-6 py-3 text-gray-500 font-mono text-xs">USR-{1000+i*7}</td>
                                            <td className="px-6 py-3"><span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-semibold">Success</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
