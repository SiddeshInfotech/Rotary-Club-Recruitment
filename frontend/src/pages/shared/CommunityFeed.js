import React, { useState, useEffect } from "react";
import CandidateLayout from "../../layouts/CandidateLayout";
import { MessageSquare, Heart, Share2, MoreHorizontal, Image as ImageIcon } from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function CommunityFeed() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPost, setNewPost] = useState("");

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await api.get('/community');
            if (res.data.success) setPosts(res.data.data);
        } catch (err) {
            console.error("Failed to fetch posts:", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePostSubmit = async () => {
        if (!newPost.trim()) return;
        try {
            const res = await api.post('/community', { content: newPost });
            if (res.data.success) {
                setNewPost("");
                fetchPosts(); // Refresh list
            }
        } catch (err) {
            console.error("Failed to create post:", err);
        }
    };

    const handleLike = async (id) => {
        try {
            await api.patch(`/community/${id}/like`);
            fetchPosts(); // Refresh list
        } catch (err) {
            console.error("Failed to like post:", err);
        }
    };

    const timeAgo = (dateStr) => {
        const diff = Math.floor((new Date() - new Date(dateStr)) / 60000); // in minutes
        if (diff < 60) return `${diff}m`;
        if (diff < 1440) return `${Math.floor(diff / 60)}h`;
        return `${Math.floor(diff / 1440)}d`;
    };

    return (
        <CandidateLayout>
            <div className="max-w-2xl mx-auto space-y-6 pb-10">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-[#1a2b4b] dark:text-white mb-2">Community Feed</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Updates, insights, and discussions from the network.</p>
                    </div>
                </div>

                {/* Create Post */}
                <div className="bg-white dark:bg-[#131b2f] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex gap-4">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstName || 'User')}&background=0d1b2a&color=67e8f9`} alt="User" className="w-12 h-12 rounded-full flex-shrink-0" />
                        <div className="flex-1">
                            <textarea
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                placeholder="Share your latest project, achievement, or question..."
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:bg-white dark:focus:bg-gray-800 transition-all resize-none dark:text-white"
                                rows="3"
                            ></textarea>
                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                                <button className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 rounded-lg transition-colors">
                                    <ImageIcon className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={handlePostSubmit}
                                    disabled={!newPost.trim()}
                                    className="px-6 py-2 bg-[#1a2b4b] disabled:opacity-50 text-white text-sm font-semibold rounded-lg hover:bg-[#243a5e] transition-colors"
                                >
                                    Post Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feed */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="text-center py-12 text-slate-500 font-medium">Loading community feed...</div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
                            <p className="text-slate-500 dark:text-slate-400 font-medium">No posts yet. Be the first to share something!</p>
                        </div>
                    ) : (
                        posts.map(post => (
                            <div key={post._id} className="bg-white dark:bg-[#131b2f] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-3">
                                        <img src={post.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.authorName || 'Guest')}&background=random`} alt={post.authorName} className="w-12 h-12 rounded-full" />
                                        <div>
                                            <h3 className="font-bold text-[#1a2b4b] dark:text-white leading-tight">{post.authorName || 'Anonymous Worker'}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{post.authorRole || 'Community Member'} • {timeAgo(post.createdAt)}</p>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 p-1.5 rounded-lg transition-colors">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>

                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">{post.content}</p>

                                {post.tags && post.tags.length > 0 && (
                                    <div className="flex gap-2 mb-4">
                                        {post.tags.map((tag, idx) => (
                                            <span key={idx} className="text-xs font-semibold text-cyan-700 bg-cyan-50 dark:bg-cyan-900/30 px-2.5 py-1 rounded-md">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center gap-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-gray-500 text-sm font-medium">
                                    <button 
                                        onClick={() => handleLike(post._id)}
                                        className="flex items-center gap-2 hover:text-rose-500 transition-colors"
                                    >
                                        <Heart className="w-5 h-5" /> {post.likes || 0}
                                    </button>
                                    <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                                        <MessageSquare className="w-5 h-5" /> {post.comments || 0}
                                    </button>
                                    <button className="flex items-center gap-2 hover:text-green-500 transition-colors ml-auto">
                                        <Share2 className="w-5 h-5" /> Share
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </CandidateLayout>
    );
}
