import React, { useState, useEffect } from "react";
import RecruiterLayout from "../../layouts/RecruiterLayout";
import { User, Shield, Sliders, Bell } from "lucide-react";

export default function RecruiterSettings() {
    const [activeTab, setActiveTab] = useState("Account Basics");
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => {
            const newMode = !prev;
            if (newMode) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
            return newMode;
        });
    };

    const tabs = [
        { icon: User, label: "Account Basics" },
        { icon: Shield, label: "Security" },
        { icon: Sliders, label: "Preferences" },
        { icon: Bell, label: "Notifications" }
    ];

    return (
        <RecruiterLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#1a2b4b] dark:text-white font-serif tracking-tight">Settings</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your account settings and preferences.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 shrink-0 space-y-1">
                        {tabs.map((item, i) => (
                            <button 
                                key={i} 
                                onClick={() => setActiveTab(item.label)}
                                className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-bold rounded-xl transition-colors ${activeTab === item.label ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-[#1a2b4b] dark:text-white mb-6">{activeTab}</h2>
                        
                        {activeTab === "Account Basics" && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                                        <img src={`https://ui-avatars.com/api/?name=Recruiter&background=0F172A&color=fff`} className="w-full h-full object-cover" alt="Profile" />
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 transition shadow-sm">Upload New</button>
                                        <button className="px-5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700">Remove</button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">First Name</label>
                                        <input type="text" defaultValue="Saurav" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium dark:text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Last Name</label>
                                        <input type="text" defaultValue="Punjabi" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium dark:text-white" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                                        <input type="email" defaultValue="sauravpunjabi123@gmail.com" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium dark:text-white" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Company / Organization</label>
                                        <input type="text" defaultValue="NexCore Intelligence" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium dark:text-white" />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition text-sm shadow-sm">Save Changes</button>
                                </div>
                            </div>
                        )}

                        {activeTab === "Security" && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Current Password</label>
                                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium dark:text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">New Password</label>
                                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium dark:text-white" />
                                </div>
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <button className="text-red-500 text-sm font-bold hover:underline">Deactivate Account</button>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition text-sm shadow-sm">Update Password</button>
                                </div>
                            </div>
                        )}

                        {activeTab === "Preferences" && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl">
                                    <div>
                                        <p className="text-sm font-bold text-[#1a2b4b] dark:text-white">Dark Mode</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Toggle dark mode interface.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={isDarkMode} onChange={toggleDarkMode} />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl">
                                    <div>
                                        <p className="text-sm font-bold text-[#1a2b4b] dark:text-white">Public Recruiter Profile</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Allow candidates to view your profile.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        )}

                        {activeTab === "Notifications" && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl">
                                    <div>
                                        <p className="text-sm font-bold text-[#1a2b4b] dark:text-white">Email Notifications</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Receive alerts for new applicants via email.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl">
                                    <div>
                                        <p className="text-sm font-bold text-[#1a2b4b] dark:text-white">In-App Notifications</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Show alerts inside the platform.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </RecruiterLayout>
    );
}
