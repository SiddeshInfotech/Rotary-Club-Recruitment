import React from "react";
import RecruiterLayout from "../../layouts/RecruiterLayout";
import { Search, MoreVertical, Send, Paperclip } from "lucide-react";

export default function Messages() {
    const contacts = [
        { id: 1, name: "Sarah Chen", msg: "I'm available for an interview next Tuesday.", time: "10:42 AM", unread: 2, avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=0d1b2a&color=67e8f9", active: true },
        { id: 2, name: "Marcus Johnson", msg: "Thanks for the feedback!", time: "Yesterday", unread: 0, avatar: "https://ui-avatars.com/api/?name=Marcus+Johnson&background=0d1b2a&color=67e8f9" },
        { id: 3, name: "Emily Rodriguez", msg: "When works for a follow up?", time: "Mon", unread: 0, avatar: "https://ui-avatars.com/api/?name=Emily+Rodriguez&background=0d1b2a&color=67e8f9" },
    ];

    return (
        <RecruiterLayout>
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden h-[calc(100vh-140px)] flex">
                {/* Sidebar */}
                <div className="w-1/3 border-r border-gray-100 dark:border-slate-800 flex flex-col">
                    <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex-shrink-0">
                        <h2 className="text-lg font-bold text-[#1a2b4b] dark:text-white">Messages</h2>
                        <div className="relative mt-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input 
                                type="text" 
                                placeholder="Search messages..." 
                                className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-sm"
                            />
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-grow">
                        {contacts.map(c => (
                            <div key={c.id} className={`p-4 border-b border-gray-50 dark:border-slate-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors flex gap-3 ${c.active ? "bg-cyan-50/30 dark:bg-cyan-900/20" : ""}`}>
                                <div className="relative">
                                    <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full" />
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className="text-sm font-bold text-[#1a2b4b] dark:text-white truncate">{c.name}</h3>
                                        <span className="text-xs text-gray-400 dark:text-slate-500 flex-shrink-0 ml-2">{c.time}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{c.msg}</p>
                                </div>
                                {c.unread > 0 && (
                                    <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 bg-cyan-500 rounded-full text-[10px] font-bold text-white">
                                        {c.unread}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-grow flex flex-col bg-[#fcfdfd] dark:bg-slate-900/50">
                    {/* Header */}
                    <div className="h-16 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-6 flex-shrink-0 bg-white dark:bg-slate-900">
                        <div className="flex items-center gap-3">
                            <img src={contacts[0].avatar} alt={contacts[0].name} className="w-9 h-9 rounded-full" />
                            <div>
                                <h3 className="text-[15px] font-bold text-[#1a2b4b] dark:text-white leading-tight">{contacts[0].name}</h3>
                                <p className="text-[11px] text-green-500 font-medium">Online</p>
                            </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-grow overflow-y-auto p-6 space-y-6">
                        <div className="flex justify-center">
                            <span className="text-[11px] font-semibold text-gray-400 dark:text-slate-400 bg-gray-50 dark:bg-slate-800 px-3 py-1 rounded-full border border-gray-100 dark:border-slate-700">Today</span>
                        </div>
                        
                        <div className="flex gap-3">
                            <img src={contacts[0].avatar} alt={contacts[0].name} className="w-8 h-8 rounded-full flex-shrink-0 mt-1" />
                            <div className="flex flex-col gap-1 max-w-[70%]">
                                <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 px-4 py-2.5 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-700 dark:text-slate-300">
                                    Hello! I saw your recent message regarding the Product Manager role.
                                </div>
                                <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 px-4 py-2.5 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-700 dark:text-slate-300">
                                    I'm available for an interview next Tuesday. Let me know what time works best.
                                </div>
                                <span className="text-[10px] text-gray-400 font-medium ml-1">10:42 AM</span>
                            </div>
                        </div>

                        <div className="flex gap-3 flex-row-reverse">
                            <div className="flex flex-col gap-1 max-w-[70%] items-end">
                                <div className="bg-[#1a2b4b] text-white px-4 py-2.5 rounded-2xl rounded-tr-none shadow-sm text-sm">
                                    Perfect, Sarah! Tuesday at 2:00 PM EST?
                                </div>
                                <span className="text-[10px] text-gray-400 font-medium mr-1">10:45 AM</span>
                            </div>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 flex-shrink-0">
                        <div className="flex gap-3 items-center bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full pl-4 pr-1 py-1 focus-within:ring-2 focus-within:ring-cyan-500/40 focus-within:border-cyan-500 transition-all">
                            <button className="p-1 text-gray-400 hover:text-cyan-600 transition-colors">
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <input 
                                type="text" 
                                placeholder="Type a message..." 
                                className="flex-grow bg-transparent border-none focus:outline-none focus:ring-0 text-sm py-2 dark:text-white"
                            />
                            <button className="w-9 h-9 flex items-center justify-center bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition-colors shadow-sm flex-shrink-0">
                                <Send className="w-4 h-4 ml-0.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </RecruiterLayout>
    );
}
