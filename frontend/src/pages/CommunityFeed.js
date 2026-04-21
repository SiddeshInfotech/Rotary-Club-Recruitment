import React, { useState, useEffect } from "react";
import CandidateLayout from "../layouts/CandidateLayout";
import RecruiterLayout from "../layouts/RecruiterLayout";
import { useAuth } from "../context/AuthContext";
import PostFeed from "../components/candidate/PostFeed";
import api from "../services/api";
import { Loader2, Image as ImageIcon } from "lucide-react";

export default function CommunityFeed() {
    const { user } = useAuth();
    const isRecruiter = user?.role === 'recruiter';
    const Layout = isRecruiter ? RecruiterLayout : CandidateLayout;

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPost, setNewPost] = useState("");
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await api.get('/community');
            if (res.data.success) {
                setPosts(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch community posts:", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePostSubmit = async () => {
        if (!newPost.trim() || creating) return;
        setCreating(true);
        try {
            const res = await api.post('/community', { content: newPost.trim() });
            if (res.data.success) {
                setNewPost("");
                fetchPosts();
            }
        } catch (err) {
            console.error("Failed to create post:", err);
            alert("Failed to create post.");
        } finally {
            setCreating(false);
        }
    };

    const handleDeletePost = (postId) => {
        setPosts(posts.filter(p => p._id !== postId));
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto py-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white font-serif tracking-tight">Community Feed</h1>
                    <p className="text-sm text-slate-500 mt-1">Updates, insights, and discussions from the network.</p>
                </div>

                {/* Create Post */}
                <div className="bg-white dark:bg-[#1d2226] rounded-xl border border-slate-200 dark:border-slate-800 p-4 mb-6 shadow-sm">
                    <div className="flex gap-4">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || "User")}&background=0F172A&color=fff&bold=true`} 
                            alt="User" 
                            className="w-12 h-12 rounded-full object-cover outline outline-1 outline-slate-200 dark:outline-slate-700" 
                        />
                        <div className="flex-1">
                            <textarea
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                placeholder="Start a post..."
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors resize-none text-slate-900 dark:text-white"
                                rows="3"
                            ></textarea>
                            <div className="flex justify-between items-center mt-3">
                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors">
                                    <ImageIcon className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={handlePostSubmit}
                                    disabled={!newPost.trim() || creating}
                                    className="px-5 py-1.5 bg-[#0a66c2] text-white text-sm font-bold rounded-full hover:bg-[#004182] transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="py-12 flex justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                    </div>
                ) : (
                    <PostFeed posts={posts} onDeletePost={handleDeletePost} />
                )}
            </div>
        </Layout>
    );
}
