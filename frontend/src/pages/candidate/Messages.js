import React, { useState, useEffect, useRef } from "react";
import CandidateLayout from "../../layouts/CandidateLayout";
import { Search, MoreVertical, Send, Paperclip, MessageSquareText, Globe } from "lucide-react";
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
        <CandidateLayout>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-[calc(100vh-140px)] flex dark:bg-[#131b2f] dark:border-slate-800">
                {/* Sidebar */}
                <div className="w-full md:w-1/3 border-r border-slate-200 dark:border-slate-800 flex flex-col hidden md:flex">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white font-serif tracking-tight">Messaging</h2>
                        <div className="relative mt-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input 
                                type="text" 
                                placeholder="Search messages..." 
                                className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]/40 text-sm dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-grow">
                        {loading ? (
                            <div className="p-6 text-center text-gray-400 text-sm font-medium">Loading...</div>
                        ) : conversations.length === 0 ? (
                            <div className="p-6 text-center text-gray-400 text-sm font-medium">No conversations yet</div>
                        ) : conversations.map(c => {
                            const other = getOtherParticipant(c);
                            const isActive = activeConvo && activeConvo._id === c._id;
                            
                            return (
                                <div key={c._id} onClick={() => setActiveConvo(c)} className={`p-4 border-b border-gray-50 dark:border-slate-800/50 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex gap-3 ${isActive ? "bg-slate-50 dark:bg-slate-800/80 border-l-4 border-l-[#0a66c2]" : "border-l-4 border-transparent"}`}>
                                    <div className="relative flex-shrink-0">
                                        <img src={getAvatar(other.name)} alt={other.name} className="w-10 h-10 rounded-full" />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h3 className="text-sm font-bold text-slate-900 dark:text-gray-200 truncate">{other.name}</h3>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{c.lastMessage}</p>
                                    </div>
                                    {c.unreadCount > 0 && !isActive && (
                                        <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 bg-[#0a66c2] rounded-full text-[10px] font-bold text-white">
                                            {c.unreadCount}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-grow flex flex-col bg-slate-50 dark:bg-[#0f172a]">
                    {activeConvo ? (
                        <>
                            {/* Header */}
                            <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 flex-shrink-0 bg-white dark:bg-[#131b2f]">
                                <div className="flex items-center gap-3">
                                    <img src={getAvatar(getOtherParticipant(activeConvo).name)} alt="avatar" className="w-9 h-9 rounded-full" />
                                    <div>
                                        <h3 className="text-[15px] font-bold text-slate-900 dark:text-white leading-tight">{getOtherParticipant(activeConvo).name}</h3>
                                        <p className="text-[11px] text-[#057642] font-medium tracking-wide">Online</p>
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
                                            <div className={`flex flex-col gap-1 ${msg.sharedPost ? 'max-w-[85%]' : 'max-w-[75%]'} ${isMe ? 'items-end' : ''}`}>
                                                
                                                {/* Standard Text Message */}
                                                {!msg.sharedPost && (
                                                    <div className={`${isMe ? 'bg-[#0a66c2] text-white rounded-br-sm' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-bl-sm text-slate-700 dark:text-gray-200'} px-4 py-2.5 rounded-2xl shadow-sm text-sm whitespace-pre-wrap leading-relaxed`}>
                                                        {msg.content}
                                                    </div>
                                                )}

                                                {/* Embedded Rich Post */}
                                                {msg.sharedPost && (
                                                    <div className="bg-white dark:bg-[#1d2226] border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-md w-[400px] max-w-full text-left">
                                                        <div className="p-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                                                            <div className="flex gap-3 items-start">
                                                                <img src={msg.sharedPost.authorAvatar} alt="author" className="w-10 h-10 rounded-full flex-shrink-0 object-cover" />
                                                                <div className="min-w-0 pt-0.5">
                                                                    <div className="flex items-center gap-1">
                                                                        <span className="text-[14px] font-bold text-slate-900 dark:text-white truncate">{msg.sharedPost.authorName}</span>
                                                                    </div>
                                                                    <p className="text-[12px] text-slate-500 truncate leading-snug mt-0.5">{msg.sharedPost.authorTitle || 'Community Member'}</p>
                                                                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">Recent ΓÇó Edited ΓÇó <Globe className="w-2.5 h-2.5 inline" /></p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="px-4 py-3">
                                                            <p className="text-[13px] text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                                                                {msg.sharedPost.content.length > 200 ? msg.sharedPost.content.substring(0, 200) + "...more" : msg.sharedPost.content}
                                                            </p>
                                                        </div>
                                                        {msg.sharedPost.image && (
                                                            <div className="w-full bg-slate-100 dark:bg-black/50 border-t border-slate-100 dark:border-slate-800">
                                                                <img src={msg.sharedPost.image} alt="Shared post content" className="w-full h-auto object-cover max-h-[220px]" />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-[#131b2f] border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
                                <div className="flex gap-3 items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full pl-4 pr-1 py-1 focus-within:ring-2 focus-within:ring-[#0a66c2]/40 focus-within:border-[#0a66c2] transition-all">
                                    <button type="button" className="p-1 text-slate-400 hover:text-[#0a66c2] transition-colors">
                                        <Paperclip className="w-5 h-5" />
                                    </button>
                                    <input 
                                        type="text" 
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Write a message..." 
                                        className="flex-grow bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-medium py-2 dark:text-white placeholder:text-slate-400"
                                    />
                                    <button type="submit" disabled={!newMessage.trim()} className="w-9 h-9 flex items-center justify-center bg-[#0a66c2] text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm flex-shrink-0 disabled:opacity-50">
                                        <Send className="w-4 h-4 ml-0.5" />
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-slate-400 font-medium">
                            <span className="bg-slate-100 dark:bg-slate-800 rounded-full p-4 mb-3">
                                <MessageSquareText className="w-8 h-8 text-slate-400" />
                            </span>
                            Select a conversation to start messaging
                        </div>
                    )}
                </div>
            </div>
        </CandidateLayout>
    );
}