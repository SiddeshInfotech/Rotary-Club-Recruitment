import React, { useState, useEffect } from "react";
import CandidateLayout from "../../layouts/CandidateLayout";
import { Users, MessageSquare, Award, ExternalLink } from 'lucide-react';
import api from "../../services/api";

export default function Network() {
    const [posts, setPosts] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postsRes, membersRes] = await Promise.all([
                    api.get('/community'),
                    api.get('/network/members')
                ]);
                if (postsRes.data.success) setPosts(postsRes.data.data);
                if (membersRes.data.success) setMembers(membersRes.data.data.filter(m => m.role === 'candidate'));
            } catch (err) {
                console.error("Failed to fetch network data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const timeAgo = (dateStr) => {
        const diff = Math.floor((new Date() - new Date(dateStr)) / 60000); 
        if (diff < 60) return `${diff}m ago`;
        if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
        return `${Math.floor(diff / 1440)}d ago`;
    };

    return (
        <CandidateLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-8">
                <div className="max-w-[700px]">
                    <h3 className="text-[10px] tracking-widest font-bold text-slate-400 dark:text-slate-500 uppercase mb-3">ELITE CURATOR NETWORK</h3>
                    <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4 font-serif">Community Feed</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
                        Engage with high-resonance leaders, share insights, and build strategic alliances across the global network.
                    </p>
                </div>
                
                <div className="flex gap-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 px-8 text-xs uppercase font-bold tracking-widest transition shadow-sm w-full md:w-auto">
                        NEW POST
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Feed */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {loading ? (
                        <div className="text-center py-12 text-slate-500 font-medium">Loading community feed...</div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
                            <p className="text-slate-500 dark:text-slate-400 font-medium">No posts yet.</p>
                        </div>
                    ) : (
                        posts.map(post => (
                            <div key={post._id} className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                                        <img src={post.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.authorName || 'User')}&background=0F172A&color=fff&bold=true`} alt={post.authorName} className="w-full h-full object-cover"/>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900 dark:text-white">{post.authorName || 'Community Member'}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{post.authorRole || 'Member'} • {timeAgo(post.createdAt)}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 whitespace-pre-line">
                                    {post.content}
                                </p>
                                <div className="flex items-center gap-6 border-t border-slate-100 dark:border-slate-800 pt-4">
                                    <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition uppercase tracking-widest">
                                        <Award className="w-4 h-4" /> {post.likesCount || 0} Resonate
                                    </button>
                                    <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition uppercase tracking-widest">
                                        <MessageSquare className="w-4 h-4" /> {post.commentsCount || 0} Comments
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Sidebar Widgets */}
                <div className="flex flex-col gap-6">
                    {/* Suggested Connections */}
                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-6 shadow-sm">
                        <h4 className="text-xs uppercase tracking-widest font-bold text-slate-800 dark:text-slate-200 mb-6">High Resonance Profiles</h4>
                        
                        <div className="flex flex-col gap-5">
                            {members.slice(0, 5).map((member, i) => (
                                <div key={member._id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex-shrink-0 overflow-hidden">
                                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0F172A&color=fff&bold=true`} alt={member.name} className="w-full h-full object-cover"/>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-900 dark:text-white leading-tight">{member.name}</p>
                                            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">94% Match</p>
                                        </div>
                                    </div>
                                    <button className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-2 rounded-lg transition">
                                        <Users className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        <button className="w-full mt-6 text-[10px] uppercase font-bold tracking-widest text-slate-500 hover:text-blue-600 transition">
                            VIEW ALL SUGGESTIONS
                        </button>
                    </div>
                </div>
            </div>
        </CandidateLayout>
    );
}
