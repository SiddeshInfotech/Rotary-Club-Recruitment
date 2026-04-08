import React from "react";
import CandidateLayout from "../../layouts/CandidateLayout";
import { User, Bell, Lock, Globe, Shield, CreditCard } from "lucide-react";

export default function CandidateSettings() {
    return (
        <CandidateLayout>
            <div className="max-w-4xl">
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Account Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage your profile, visibility, and platform preferences.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Settings Navigation Sidebar */}
                    <div className="w-full md:w-64 shrink-0 space-y-1">
                        {[
                            { icon: User, label: "Personal Information", active: true },
                            { icon: Bell, label: "Notifications", active: false },
                            { icon: Globe, label: "Privacy & Visibility", active: false },
                            { icon: Shield, label: "Security", active: false },
                            { icon: CreditCard, label: "Billing & Plans", active: false }
                        ].map((item, i) => (
                            <button key={i} className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-bold rounded-xl transition-colors ${item.active ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Active Settings Panel */}
                    <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Personal Information</h2>
                        
                        <div className="mb-8 flex items-center gap-6">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <img src={`https://ui-avatars.com/api/?name=Candidate&background=0F172A&color=fff`} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex gap-3">
                                <button className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-sm text-sm">Upload New</button>
                                <button className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-slate-700">Remove</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">First Name</label>
                                <input type="text" defaultValue="John" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-medium dark:text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Last Name</label>
                                <input type="text" defaultValue="Doe" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-medium dark:text-white" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email Address (Primary Login)</label>
                                <input type="email" defaultValue="johndoe@example.com" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-medium dark:text-white" />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                            <button className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-sm hover:bg-blue-700 transition">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </CandidateLayout>
    );
}
