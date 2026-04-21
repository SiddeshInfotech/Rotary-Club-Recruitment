import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { ThumbsUp, MessageCircle, Repeat2, Send, MoreHorizontal, Trash2, Globe, Loader2, X, Search, Link as LinkIcon } from "lucide-react";

function timeAgo(dateStr) {
    const now = new Date();
    const then = new Date(dateStr);
    const seconds = Math.floor((now - then) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w`;
    return then.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function PostCard({ post, onDelete, currentUserId, currentUserName }) {
    const [isLiked, setIsLiked] = useState(post.isLiked || false);
    const [likesCount, setLikesCount] = useState(post.likesCount || 0);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(Array.isArray(post.comments) ? post.comments : []);
    const [commentText, setCommentText] = useState("");
    const [submittingComment, setSubmittingComment] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [likeAnimating, setLikeAnimating] = useState(false);
    const [shared, setShared] = useState(false);
    const [reposted, setReposted] = useState(false);

    const isOwner = currentUserId && (post.author?._id === currentUserId || post.author === currentUserId);
    const contentIsLong = post.content?.length > 280;

    const handleLike = async () => {
        const wasLiked = isLiked;
        // Optimistic update
        setIsLiked(!wasLiked);
        setLikesCount((prev) => (wasLiked ? prev - 1 : prev + 1));
        setLikeAnimating(true);
        setTimeout(() => setLikeAnimating(false), 400);

        try {
            const res = await api.patch(`/community/${post._id}/like`);
            if (res.data.success) {
                setIsLiked(res.data.data.isLiked);
                setLikesCount(res.data.data.likesCount);
            }
        } catch (err) {
            console.error("Failed to toggle like:", err);
            // Revert on failure
            setIsLiked(wasLiked);
            setLikesCount((prev) => (wasLiked ? prev + 1 : prev - 1));
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || submittingComment) return;
        setSubmittingComment(true);
        try {
            const res = await api.post(`/community/${post._id}/comments`, { text: commentText.trim() });
            if (res.data.success) {
                setComments((prev) => [...prev, res.data.data]);
                setCommentText("");
            }
        } catch (err) {
            console.error("Failed to add comment:", err);
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this post?")) return;
        try {
            await api.delete(`/community/${post._id}`);
            if (onDelete) onDelete(post._id);
        } catch (err) {
            console.error("Failed to delete post:", err);
        }
        setShowMenu(false);
    };

    const [showSendModal, setShowSendModal] = useState(false);
    const [members, setMembers] = useState([]);
    const [sendingTo, setSendingTo] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const handleShare = async () => {
        setShowSendModal(true);
        setSelectedUsers([]);
        setSearchQuery("");
        try {
            const res = await api.get('/network/members');
            if (res.data.success) {
                setMembers(res.data.data.filter(m => m._id !== currentUserId));
            }
        } catch (err) {
            console.error("Failed to fetch members for sending:", err);
        }
    };

    const handleSendToSelected = async () => {
        if (selectedUsers.length === 0) return;
        setSendingTo("all");
        try {
            const postAuthor = post.authorName || "User";
            const summary = post.content.length > 50 ? post.content.substring(0, 50) + "..." : post.content;
            
            await Promise.all(selectedUsers.map(userId => 
                api.post('/messages/send', {
                    receiverId: userId,
                    content: `I shared a post with you.`,
                    sharedPost: post._id
                })
            ));
            
            setShowSendModal(false);
            setShared(true);
            setTimeout(() => setShared(false), 2000);
        } catch (err) {
            console.error("Failed to send message:", err);
            alert("Failed to send message");
        } finally {
            setSendingTo(null);
            setSelectedUsers([]);
        }
    };

    const toggleUser = (userId) => {
        setSelectedUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
    };

    const handleCopyLink = async () => {
        try {
            const shareText = `${post.content}\n\n— ${post.authorName || "User"} on EQ Hire`;
            await navigator.clipboard.writeText(shareText);
            setShared(true);
            setTimeout(() => setShared(false), 2000);
            setShowSendModal(false);
        } catch {
            setShared(true);
            setTimeout(() => setShared(false), 2000);
            setShowSendModal(false);
        }
    };

    const filteredMembers = members.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleRepost = async () => {
        try {
            await api.post(`/community/${post._id}/repost`);
            setReposted(true);
            setTimeout(() => setReposted(false), 2000);
        } catch (err) {
            console.error("Failed to repost:", err);
            alert("Failed to repost. Please try again.");
        }
    };

    const authorName = post.authorName || post.author?.name || "User";
    const authorTitle = post.authorTitle || "";
    const avatarUrl = post.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=0F172A&color=fff&bold=true`;

    return (
        <div className="bg-white dark:bg-[#1d2226] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all hover:shadow-md">
            {/* Post Header */}
            <div className="flex items-start gap-3 px-4 pt-4 pb-2">
                <img
                    src={avatarUrl}
                    alt={authorName}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight capitalize truncate">{authorName}</p>
                    </div>
                    {authorTitle && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight mt-0.5 truncate">{authorTitle}</p>
                    )}
                    <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-xs text-slate-400 dark:text-slate-500">{timeAgo(post.createdAt)}</span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <Globe className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                    </div>
                </div>

                {/* Post Menu */}
                {isOwner && (
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-400"
                        >
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                        {showMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                                <div className="absolute right-0 top-9 bg-white dark:bg-[#1d2226] border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-20 py-1 w-44 animate-fadeIn">
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" /> Delete post
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3">
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap break-words">
                    {contentIsLong && !expanded
                        ? post.content.slice(0, 280) + "..."
                        : post.content
                    }
                </p>
                {contentIsLong && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#0a66c2] dark:hover:text-blue-400 mt-1 transition-colors"
                    >
                        {expanded ? "see less" : "...see more"}
                    </button>
                )}
            </div>

            {/* Post Image */}
            {post.image && (
                <div className="w-full">
                    <img
                        src={post.image}
                        alt="Post"
                        className="w-full object-cover max-h-[500px]"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                </div>
            )}

            {/* Engagement Stats Bar */}
            {(likesCount > 0 || comments.length > 0) && (
                <div className="flex items-center justify-between px-4 py-2">
                    {likesCount > 0 ? (
                        <div className="flex items-center gap-1.5">
                            <span className="w-[18px] h-[18px] rounded-full bg-[#0a66c2] flex items-center justify-center">
                                <ThumbsUp className="w-[10px] h-[10px] text-white fill-white" />
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 hover:text-[#0a66c2] dark:hover:text-blue-400 cursor-pointer transition-colors">
                                {likesCount}
                            </span>
                        </div>
                    ) : <div />}
                    {comments.length > 0 && (
                        <button
                            onClick={() => setShowComments(!showComments)}
                            className="text-xs text-slate-500 dark:text-slate-400 hover:text-[#0a66c2] dark:hover:text-blue-400 transition-colors hover:underline"
                        >
                            {comments.length} comment{comments.length !== 1 ? "s" : ""}
                        </button>
                    )}
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center border-t border-slate-100 dark:border-slate-800 mx-4">
                {/* Like */}
                <button
                    onClick={handleLike}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-lg transition-all group relative ${
                        isLiked
                            ? "text-[#0a66c2] dark:text-blue-400"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                >
                    <ThumbsUp
                        className={`w-5 h-5 transition-all ${
                            isLiked ? "fill-current" : ""
                        } ${likeAnimating ? "scale-125" : "group-hover:scale-110"}`}
                    />
                    <span className="text-xs font-semibold">{isLiked ? "Liked" : "Like"}</span>
                </button>

                {/* Comment */}
                <button
                    onClick={() => setShowComments(!showComments)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-lg transition-colors group ${
                        showComments
                            ? "text-[#0a66c2] dark:text-blue-400"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                >
                    <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">Comment</span>
                </button>

                {/* Repost */}
                <button
                    onClick={handleRepost}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-lg transition-colors group ${
                        reposted
                            ? "text-green-600 dark:text-green-400"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                >
                    <Repeat2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">{reposted ? "Reposted!" : "Repost"}</span>
                </button>

                {/* Send / Share */}
                <button
                    onClick={handleShare}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-lg transition-colors group ${
                        shared
                            ? "text-[#0a66c2] dark:text-blue-400"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                >
                    <Send className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">{shared ? "Copied!" : "Send"}</span>
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-fadeIn">
                    {/* Comment Input */}
                    <form onSubmit={handleComment} className="flex items-center gap-2">
                        <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUserName || "Me")}&background=0F172A&color=fff&bold=true&size=64`}
                            alt="You"
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1 flex items-center bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 overflow-hidden focus-within:border-slate-400 dark:focus-within:border-slate-500 transition-colors">
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 px-4 py-2.5 outline-none"
                            />
                            {commentText.trim() && (
                                <button
                                    type="submit"
                                    disabled={submittingComment}
                                    className="px-3 py-2 text-[#0a66c2] hover:text-[#004182] dark:text-blue-400 transition-colors"
                                >
                                    {submittingComment ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Comment List */}
                    {comments.length > 0 && (
                        <div className="space-y-2 pt-1">
                            {comments.map((comment, idx) => (
                                <div key={comment._id || idx} className="flex gap-2 group">
                                    <img
                                        src={
                                            comment.authorAvatar ||
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                comment.authorName || "User"
                                            )}&background=0F172A&color=fff&bold=true&size=64`
                                        }
                                        alt={comment.authorName}
                                        className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5"
                                    />
                                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs font-bold text-slate-900 dark:text-white capitalize">
                                                {comment.authorName || "User"}
                                            </p>
                                            {comment.createdAt && (
                                                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                                    {timeAgo(comment.createdAt)}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed break-words">{comment.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {comments.length === 0 && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-2">No comments yet — be the first!</p>
                    )}
                </div>
            )}

            {/* Send Modal */}
            {showSendModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 overflow-hidden" onClick={() => setShowSendModal(false)}>
                    <div className="bg-white dark:bg-[#1d2226] w-full max-w-[520px] rounded-xl shadow-2xl flex flex-col h-[75vh] max-h-[600px] m-4 animate-fadeIn" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-slate-800">
                            <h3 className="font-semibold text-xl text-gray-900 dark:text-white leading-tight">Send {authorName}’s Post</h3>
                            <button onClick={() => setShowSendModal(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-500 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-800">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 font-bold" />
                                <input 
                                    type="text" 
                                    placeholder="Search" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[#eef3f8] dark:bg-slate-800 text-gray-900 dark:text-white text-sm rounded h-9 pl-9 pr-4 focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder:text-gray-600 font-medium font-sans"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {members.length === 0 ? (
                                <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                                    <Loader2 className="w-6 h-6 animate-spin mb-2 text-[#0a66c2]" />
                                    <p className="text-sm font-medium">Loading network...</p>
                                </div>
                            ) : filteredMembers.length === 0 ? (
                                <div className="p-8 text-center text-slate-500 text-sm">No connections found.</div>
                            ) : (
                                filteredMembers.map(m => (
                                    <div key={m._id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer border-b border-gray-100 dark:border-slate-800/50" onClick={() => toggleUser(m._id)}>
                                        <div className="flex items-center gap-3">
                                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=0F172A&color=fff&bold=true`} alt={m.name} className="w-12 h-12 rounded-full object-cover" />
                                            <div>
                                                <p className="text-[15px] font-semibold text-gray-900 dark:text-white capitalize leading-snug">{m.name}</p>
                                                <p className="text-xs text-gray-600 dark:text-slate-400 capitalize max-w-[320px] truncate">{m.currentTitle || m.role}</p>
                                            </div>
                                        </div>
                                        <div className="mr-1">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedUsers.includes(m._id) ? 'bg-[#01754f] border-[#01754f]' : 'border-gray-500'}`}>
                                                {selectedUsers.includes(m._id) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-[#1d2226] rounded-b-xl">
                            <button onClick={handleCopyLink} className="flex items-center gap-2 text-[#0a66c2] text-sm font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1.5 rounded transition-colors">
                                <LinkIcon className="w-5 h-5" /> Copy link to post
                            </button>
                            {selectedUsers.length > 0 && (
                                <button 
                                    onClick={handleSendToSelected}
                                    disabled={sendingTo === "all"}
                                    className="bg-[#0a66c2] text-white px-4 py-1.5 rounded-full text-sm font-bold hover:bg-[#004182] transition-colors disabled:opacity-50"
                                >
                                    {sendingTo === "all" ? "Sending..." : "Send"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .animate-fadeIn { animation: fadeIn 0.15s ease-out; }
            `}</style>
        </div>
    );
}

export default function PostFeed({ posts, onDeletePost }) {
    const { user } = useAuth();
    const currentUserId = user?._id || user?.id;
    const currentUserName = user?.fullName || user?.name || "Me";

    if (!posts || posts.length === 0) {
        return (
            <div className="bg-white dark:bg-[#1d2226] rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-sm">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <MessageCircle className="w-7 h-7 text-slate-400 dark:text-slate-500" />
                </div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No posts yet</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Be the first to share something with the community!</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {posts.map((post) => (
                <PostCard
                    key={post._id}
                    post={post}
                    onDelete={onDeletePost}
                    currentUserId={currentUserId}
                    currentUserName={currentUserName}
                />
            ))}
        </div>
    );
}
