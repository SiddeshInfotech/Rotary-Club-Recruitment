import React, { useState, useEffect, useRef } from "react";
import RecruiterLayout from "../../layouts/RecruiterLayout";
import { Search, MoreVertical, Send, Paperclip } from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function Messages() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeConvo, setActiveConvo] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (activeConvo) {
            fetchMessages(activeConvo._id);
        }
    }, [activeConvo]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchConversations = async () => {
        try {
            const res = await api.get('/messages/conversations');
            if (res.data.success) {
                setConversations(res.data.data);
                if (res.data.data.length > 0 && !activeConvo) {
                    setActiveConvo(res.data.data[0]);
                }
            }
        } catch (err) {
            console.error("Failed to fetch conversations", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (convoId) => {
        try {
            const res = await api.get(`/messages/conversations/${convoId}`);
            if (res.data.success) {
                setMessages(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch messages", err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConvo) return;

        const otherParticipant = activeConvo.participants.find(p => p._id !== user.id);
        if (!otherParticipant) return;

        try {
            const res = await api.post('/messages/send', {
                receiverId: otherParticipant._id,
                content: newMessage
            });
            if (res.data.success) {
                setNewMessage("");
                fetchMessages(activeConvo._id);
                fetchConversations(); // refresh sidebar 
            }
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    const getOtherParticipant = (convo) => {
        return convo.participants.find(p => p._id !== user.id) || convo.participants[0];
    };

    const getAvatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=0d1b2a&color=67e8f9`;

    return (
        <RecruiterLayout>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-140px)] flex dark:bg-[#131b2f] dark:border-slate-800">
                {/* Sidebar */}
                <div className="w-1/3 border-r border-gray-100 dark:border-slate-800 flex flex-col">
                    <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex-shrink-0">
                        <h2 className="text-lg font-bold text-[#1a2b4b] dark:text-white">Messages</h2>
                        <div className="relative mt-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input 
                                type="text" 
                                placeholder="Search messages..." 
                                className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-sm dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-grow">
                        {loading ? (
                            <div className="p-6 text-center text-gray-400 text-sm">Loading...</div>
                        ) : conversations.length === 0 ? (
                            <div className="p-6 text-center text-gray-400 text-sm">No conversations yet</div>
                        ) : conversations.map(c => {
                            const other = getOtherParticipant(c);
                            const isActive = activeConvo && activeConvo._id === c._id;
                            
                            return (
                                <div key={c._id} onClick={() => setActiveConvo(c)} className={`p-4 border-b border-gray-50 dark:border-slate-800/50 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors flex gap-3 ${isActive ? "bg-cyan-50/30 dark:bg-cyan-900/20" : ""}`}>
                                    <div className="relative flex-shrink-0">
                                        <img src={getAvatar(other.name)} alt={other.name} className="w-10 h-10 rounded-full" />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h3 className="text-sm font-bold text-[#1a2b4b] dark:text-gray-200 truncate">{other.name}</h3>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{c.lastMessage}</p>
                                    </div>
                                    {c.unreadCount > 0 && !isActive && (
                                        <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 bg-cyan-500 rounded-full text-[10px] font-bold text-white">
                                            {c.unreadCount}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-grow flex flex-col bg-[#fcfdfd] dark:bg-[#0f172a]">
                    {activeConvo ? (
                        <>
                            {/* Header */}
                            <div className="h-16 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-6 flex-shrink-0 bg-white dark:bg-[#131b2f]">
                                <div className="flex items-center gap-3">
                                    <img src={getAvatar(getOtherParticipant(activeConvo).name)} alt="avatar" className="w-9 h-9 rounded-full" />
                                    <div>
                                        <h3 className="text-[15px] font-bold text-[#1a2b4b] dark:text-white leading-tight">{getOtherParticipant(activeConvo).name}</h3>
                                        <p className="text-[11px] text-green-500 font-medium">Online</p>
                                    </div>
                                </div>
                                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-md">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Messages Body */}
                            <div className="flex-grow overflow-y-auto p-6 space-y-6">
                                {messages.map(msg => {
                                    const isMe = msg.sender._id === user.id;
                                    return (
                                        <div key={msg._id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                            {!isMe && (
                                                <img src={getAvatar(msg.sender.name)} alt="avatar" className="w-8 h-8 rounded-full flex-shrink-0 mt-1" />
                                            )}
                                            <div className={`flex flex-col gap-1 max-w-[70%] ${isMe ? 'items-end' : ''}`}>
                                                <div className={`${isMe ? 'bg-[#1a2b4b] dark:bg-blue-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-tl-none text-gray-700 dark:text-gray-200'} px-4 py-2.5 rounded-2xl shadow-sm text-sm whitespace-pre-wrap`}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-[#131b2f] border-t border-gray-100 dark:border-slate-800 flex-shrink-0">
                                <div className="flex gap-3 items-center bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full pl-4 pr-1 py-1 focus-within:ring-2 focus-within:ring-cyan-500/40 focus-within:border-cyan-500 transition-all">
                                    <button type="button" className="p-1 text-gray-400 hover:text-cyan-600 transition-colors">
                                        <Paperclip className="w-5 h-5" />
                                    </button>
                                    <input 
                                        type="text" 
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..." 
                                        className="flex-grow bg-transparent border-none focus:outline-none focus:ring-0 text-sm py-2 dark:text-white"
                                    />
                                    <button type="submit" disabled={!newMessage.trim()} className="w-9 h-9 flex items-center justify-center bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition-colors shadow-sm flex-shrink-0 disabled:opacity-50">
                                        <Send className="w-4 h-4 ml-0.5" />
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-grow flex items-center justify-center text-gray-400">
                            Select a conversation to start messaging
                        </div>
                    )}
                </div>
            </div>
        </RecruiterLayout>
    );
}
