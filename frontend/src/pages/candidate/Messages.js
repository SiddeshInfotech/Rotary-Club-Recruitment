import React from "react";
import CandidateLayout from "../../layouts/CandidateLayout";
import { Search, MoreVertical, Send, Paperclip } from "lucide-react";

export default function CandidateMessages() {
    const contacts = [
        { id: 1, name: "Priya Nair", msg: "I'm available for an interview next Tuesday.", time: "10:42 AM", unread: 2, avatar: "https://ui-avatars.com/api/?name=Priya+Nair&background=0d1b2a&color=67e8f9", active: true },
        { id: 2, name: "NexCore HR", msg: "Thanks for the feedback!", time: "Yesterday", unread: 0, avatar: "https://ui-avatars.com/api/?name=NexCore+HR&background=0d1b2a&color=67e8f9" },
    ];

    return (
        <CandidateLayout>
            <div className="bg-white dark:bg-[#131b2f] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden h-[calc(100vh-140px)] flex">
                {/* Sidebar */}
                <div className="w-1/3 border-r border-slate-100 dark:border-slate-800 flex flex-col">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
                        <h2 className="text-lg font-bold text-[#1a2b4b] dark:text-white">Messages</h2>
                        <div className="relative mt-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input 
                                type="text" 
                                placeholder="Search messages..." 
                                className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-grow">
                        {contacts.map(c => (
                            <div key={c.id} className={`p-4 border-b border-slate-50 dark:border-slate-800/50 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-3 ${c.active ? "bg-blue-50/30 dark:bg-blue-900/20" : ""}`}>
                                <div className="relative">
                                    <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full" />
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#131b2f] rounded-full"></div>
                                </div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className="text-sm font-bold text-[#1a2b4b] dark:text-white truncate">{c.name}</h3>
                                        <span className="text-xs text-slate-400 flex-shrink-0 ml-2">{c.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{c.msg}</p>
                                </div>
                                {c.unread > 0 && (
                                    <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 bg-blue-600 rounded-full text-[10px] font-bold text-white">
                                        {c.unread}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-grow flex flex-col bg-[#fcfdfd] dark:bg-[#0b1120]">
                    {/* Header */}
                    <div className="h-16 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-6 flex-shrink-0 bg-white dark:bg-[#131b2f]">
                        <div className="flex items-center gap-3">
                            <img src={contacts[0].avatar} alt={contacts[0].name} className="w-9 h-9 rounded-full" />
                            <div>
                                <h3 className="text-[15px] font-bold text-[#1a2b4b] dark:text-white leading-tight">{contacts[0].name}</h3>
                                <p className="text-[11px] text-emerald-500 font-medium">Online</p>
                            </div>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-md">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-grow overflow-y-auto p-6 space-y-6">
                        <div className="flex justify-center">
                            <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-700">Today</span>
                        </div>
                        
                        <div className="flex gap-3">
                            <img src={contacts[0].avatar} alt={contacts[0].name} className="w-8 h-8 rounded-full flex-shrink-0 mt-1" />
                            <div className="flex flex-col gap-1 max-w-[70%]">
                                <div className="bg-white dark:bg-[#131b2f] border border-slate-100 dark:border-slate-800 px-4 py-2.5 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-700 dark:text-slate-200">
                                    Hello! I saw your recent application regarding the Product Manager role.
                                </div>
                                <div className="bg-white dark:bg-[#131b2f] border border-slate-100 dark:border-slate-800 px-4 py-2.5 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-700 dark:text-slate-200">
                                    I'm available for an interview next Tuesday. Let me know what time works best for you.
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium ml-1">10:42 AM</span>
                            </div>
                        </div>

                        <div className="flex gap-3 flex-row-reverse">
                            <div className="flex flex-col gap-1 max-w-[70%] items-end">
                                <div className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-none shadow-sm text-sm">
                                    Perfect, Priya! Tuesday at 2:00 PM EST works for me.
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium mr-1">10:45 AM</span>
                            </div>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white dark:bg-[#131b2f] border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
                        <div className="flex gap-3 items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full pl-4 pr-1 py-1 focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-500 transition-all">
                            <button className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <input 
                                type="text" 
                                placeholder="Type a message..." 
                                className="flex-grow bg-transparent border-none focus:outline-none focus:ring-0 text-sm py-2 dark:text-white"
                            />
                            <button className="w-9 h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors shadow-sm flex-shrink-0">
                                <Send className="w-4 h-4 ml-0.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </CandidateLayout>
    );
}
