import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { Image, Video, FileText, X, Loader2, Link2, Globe, Users, UsersRound, ChevronRight, ChevronDown, MessageSquare, Clock, Calendar, ArrowLeft } from "lucide-react";

const getMinDateStr = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const VISIBILITY_OPTIONS = [
    { id: "anyone", label: "Anyone", desc: "Anyone on or off EQ Hire", icon: Globe },
    { id: "connections", label: "Connections only", desc: "Only your connections", icon: Users },
    { id: "group", label: "Group", desc: "Members of your groups", icon: UsersRound, hasArrow: true },
];

const COMMENT_OPTIONS = [
    { id: "anyone", label: "Anyone" },
    { id: "connections", label: "Connections only" },
    { id: "off", label: "Off" },
];

export default function CreatePostBox({ onPostCreated }) {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [showMediaPanel, setShowMediaPanel] = useState(false);
    const [imagePreview, setImagePreview] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const textareaRef = useRef(null);
    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);

    // Post Settings state
    const [showSettings, setShowSettings] = useState(false);
    const [visibility, setVisibility] = useState("anyone");
    const [commentControl, setCommentControl] = useState("anyone");
    const [showCommentOptions, setShowCommentOptions] = useState(false);

    // Scheduling state
    const [showScheduleSettings, setShowScheduleSettings] = useState(false);
    const [scheduleDate, setScheduleDate] = useState(getMinDateStr());
    const [scheduleTime, setScheduleTime] = useState("");
    const [scheduleAmPm, setScheduleAmPm] = useState("AM");
    const [showScheduledList, setShowScheduledList] = useState(false);
    const [scheduledPosts, setScheduledPosts] = useState([]);
    const [isLoadingScheduled, setIsLoadingScheduled] = useState(false);
    const [editingPostId, setEditingPostId] = useState(null);

    const get24HourTime = () => {
        if (!scheduleTime) return null;
        
        let h, m;
        if (scheduleTime.includes(":")) {
            [h, m] = scheduleTime.split(":");
        } else {
            const digits = scheduleTime.replace(/[^0-9]/g, '');
            if (digits.length === 0) return null;
            if (digits.length <= 2) {
                h = digits;
                m = "00";
            } else if (digits.length === 3) {
                h = digits.slice(0, 1);
                m = digits.slice(1, 3);
            } else {
                h = digits.slice(0, 2);
                m = digits.slice(2, 4);
            }
        }
        
        if (!h) return null;
        if (!m) m = "00";
        
        let hour = parseInt(h, 10);
        let minute = parseInt(m, 10);
        if (isNaN(hour) || isNaN(minute)) return null;
        if (hour < 1 || hour > 12) return null; 
        if (minute < 0 || minute > 59) return null;
        
        if (scheduleAmPm === "PM" && hour < 12) hour += 12;
        if (scheduleAmPm === "AM" && hour === 12) hour = 0;
        
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    };

    const isPastTime = () => {
        const time24 = get24HourTime();
        if (!scheduleDate || !time24) return false;
        
        const [year, month, day] = scheduleDate.split('-');
        const [hour, min] = time24.split(':');
        const selected = new Date(year, parseInt(month, 10) - 1, day, hour, min);
        
        return selected <= new Date();
    };

    const displayName = user?.fullName || user?.name || "Guest User";
    const avatarName = encodeURIComponent(displayName);

    const visibilityLabel = VISIBILITY_OPTIONS.find(v => v.id === visibility)?.label || "Anyone";
    const commentLabel = COMMENT_OPTIONS.find(c => c.id === commentControl)?.label || "Anyone";

    useEffect(() => {
        if (isModalOpen && textareaRef.current && !showSettings) {
            textareaRef.current.focus();
        }
    }, [isModalOpen, showSettings]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isModalOpen]);

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target.result;
            setImagePreview(dataUrl);
            setImageUrl(dataUrl);
            setShowMediaPanel(false);
        };
        reader.readAsDataURL(file);
    };

    const openImagePicker = () => imageInputRef.current?.click();
    const openVideoPicker = () => videoInputRef.current?.click();

    const handleImageUrlAdd = () => {
        if (imageUrl.trim()) {
            setImagePreview(imageUrl.trim());
        }
        setShowMediaPanel(false);
    };

    const removeImage = () => {
        setImageUrl("");
        setImagePreview("");
        if (imageInputRef.current) imageInputRef.current.value = "";
        if (videoInputRef.current) videoInputRef.current.value = "";
    };

    const resetModal = () => {
        setContent("");
        setImageUrl("");
        setImagePreview("");
        setShowMediaPanel(false);
        setShowSettings(false);
        setShowCommentOptions(false);
        setShowScheduleSettings(false);
        setShowScheduledList(false);
        setScheduleDate(getMinDateStr());
        setScheduleTime("");
        setEditingPostId(null);
        setIsModalOpen(false);
    };

    const fetchScheduledPosts = async () => {
        setIsLoadingScheduled(true);
        try {
            const api = (await import("../../services/api")).default;
            const res = await api.get("/community/scheduled");
            if (res.data.success) {
                setScheduledPosts(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch scheduled posts:", err);
        } finally {
            setIsLoadingScheduled(false);
        }
    };

    const handleOpenScheduledList = () => {
        setShowScheduleSettings(false);
        setShowScheduledList(true);
        fetchScheduledPosts();
    };

    const handleEditScheduledPost = (post) => {
        setContent(post.content);
        setImageUrl(post.image || "");
        setImagePreview(post.image || "");
        setVisibility(post.visibility || "anyone");
        setCommentControl(post.commentControl || "anyone");
        
        if (post.scheduledAt) {
            const dateObj = new Date(post.scheduledAt);
            setScheduleDate(dateObj.toISOString().split('T')[0]);
            
            let h = dateObj.getHours();
            const m = dateObj.getMinutes();
            const ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12 || 12;
            
            setScheduleTime(`${h}:${String(m).padStart(2, '0')}`);
            setScheduleAmPm(ampm);
        }

        setEditingPostId(post._id);
        setShowScheduledList(false);
        setShowScheduleSettings(false);
    };

    const handleDeleteScheduledPost = async (id) => {
        try {
            const api = (await import("../../services/api")).default;
            const res = await api.delete(`/community/${id}`);
            if (res.data.success) {
                setScheduledPosts(prev => prev.filter(p => p._id !== id));
            }
        } catch (err) {
            console.error("Failed to delete post:", err);
        }
    };

    const handleSubmit = async () => {
        if (!content.trim() || submitting) return;
        setSubmitting(true);
        try {
            let scheduledAt = null;
            const time24 = get24HourTime();
            if (scheduleDate && time24) {
                // Safely convert date and time to ISO string
                const [year, month, day] = scheduleDate.split('-');
                const [hour, min] = time24.split(':');
                scheduledAt = new Date(year, parseInt(month, 10) - 1, day, hour, min).toISOString();
            }

            const api = (await import("../../services/api")).default;
            const payload = {
                content: content.trim(),
                image: imageUrl || "",
                visibility,
                commentControl,
                scheduledAt,
            };

            let res;
            if (editingPostId) {
                res = await api.put(`/community/${editingPostId}`, payload);
            } else {
                res = await api.post("/community", payload);
            }
            if (res.data.success) {
                resetModal();
                // Only push to live feed if it is a brand new, immediate post
                if (onPostCreated && !scheduledAt && !editingPostId) {
                    onPostCreated(res.data.data);
                }
            }
        } catch (err) {
            console.error("Failed to create post:", err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            {/* Hidden file inputs — separated by type */}
            <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
            />
            <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileSelect}
            />

            {/* Trigger Box */}
            <div className="bg-white dark:bg-[#1d2226] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <img
                        src={`https://ui-avatars.com/api/?name=${avatarName}&background=0F172A&color=fff&bold=true&size=96`}
                        alt={displayName}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-slate-100 dark:border-slate-700"
                    />
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex-1 text-left px-5 py-3 rounded-full border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-text"
                    >
                        Start a post
                    </button>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center justify-around mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={() => { setIsModalOpen(true); setTimeout(() => openVideoPicker(), 200); }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                    >
                        <Video className="w-5 h-5 transition-transform group-hover:scale-110 text-green-600" />
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 hidden sm:inline">Video</span>
                    </button>
                    <button
                        onClick={() => { setIsModalOpen(true); setTimeout(() => openImagePicker(), 200); }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                    >
                        <Image className="w-5 h-5 transition-transform group-hover:scale-110 text-blue-600" />
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 hidden sm:inline">Photo</span>
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                    >
                        <FileText className="w-5 h-5 transition-transform group-hover:scale-110 text-red-600" />
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 hidden sm:inline">Write article</span>
                    </button>
                </div>
            </div>

            {/* Create Post Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-[8vh] px-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
                        onClick={() => { if (!submitting) resetModal(); }}
                    />

                    {/* Modal */}
                    <div className="relative bg-white dark:bg-[#1d2226] rounded-2xl shadow-2xl w-full max-w-[560px] animate-slideUp border border-slate-200 dark:border-slate-700 max-h-[80vh] flex flex-col overflow-hidden">

                        {/* ======== SCHEDULED POSTS LIST PANEL ======== */}
                        {showScheduledList ? (
                            <div className="flex flex-col h-full animate-slideLeft">
                                {/* Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => { setShowScheduledList(false); setShowScheduleSettings(true); }}
                                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500"
                                        >
                                            <ArrowLeft className="w-5 h-5" />
                                        </button>
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Scheduled posts</h2>
                                    </div>
                                    <button
                                        onClick={resetModal}
                                        className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="flex-1 overflow-y-auto px-6 py-4 bg-slate-50 dark:bg-[#13171a]">
                                    {isLoadingScheduled ? (
                                        <div className="flex items-center justify-center py-10">
                                            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                                        </div>
                                    ) : scheduledPosts.length === 0 ? (
                                        <div className="text-center py-10">
                                            <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                                            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No scheduled posts</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {scheduledPosts.map((post) => (
                                                <div key={post._id} className="bg-white dark:bg-[#1d2226] border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm relative group hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1 min-w-0" onClick={() => handleEditScheduledPost(post)} role="button">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                                                    {new Date(post.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-slate-800 dark:text-slate-300 whitespace-pre-line line-clamp-3">
                                                                {post.content}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleEditScheduledPost(post); }}
                                                            className="text-xs font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-[#1d2226] px-2 py-1 rounded"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleDeleteScheduledPost(post._id); }}
                                                            className="text-xs font-bold text-red-500 hover:text-red-700 bg-white dark:bg-[#1d2226] px-2 py-1 rounded"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : showScheduleSettings ? (
                            <div className="flex flex-col h-full animate-slideLeft">
                                {/* Settings Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setShowScheduleSettings(false)}
                                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500"
                                        >
                                            <ArrowLeft className="w-5 h-5" />
                                        </button>
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Schedule post</h2>
                                    </div>
                                    <button
                                        onClick={() => { setShowScheduleSettings(false); setIsModalOpen(false); }}
                                        className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Settings Body */}
                                <div className="flex-1 overflow-y-auto px-6 py-5">
                                    <div className="space-y-5">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 text-[#0a66c2] dark:text-blue-400">
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                                                <input
                                                    type="date"
                                                    value={scheduleDate}
                                                    onChange={(e) => setScheduleDate(e.target.value)}
                                                    min={getMinDateStr()}
                                                    className="w-full text-sm px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1d2226] text-slate-900 dark:text-white outline-none focus:border-[#0a66c2] transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 text-[#0a66c2] dark:text-blue-400">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 flex items-center gap-2">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Time</label>
                                                    <input
                                                        type="text"
                                                        placeholder="hh:mm"
                                                        value={scheduleTime}
                                                        onChange={(e) => {
                                                            setScheduleTime(e.target.value.replace(/[^0-9:]/g, '').slice(0, 5));
                                                        }}
                                                        className="w-full text-sm px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1d2226] text-slate-900 dark:text-white outline-none focus:border-[#0a66c2] transition-colors"
                                                    />
                                                </div>
                                                <div className="flex flex-col mt-6 h-[42px] justify-between border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden flex-shrink-0">
                                                    <button 
                                                        onClick={() => setScheduleAmPm("AM")}
                                                        className={`flex-1 px-3 text-xs font-bold transition-colors ${scheduleAmPm === "AM" ? "bg-blue-100 text-[#0a66c2]" : "bg-white text-slate-500 hover:bg-slate-50"}`}
                                                    >
                                                        AM
                                                    </button>
                                                    <button 
                                                        onClick={() => setScheduleAmPm("PM")}
                                                        className={`flex-1 px-3 border-t border-slate-300 dark:border-slate-600 text-xs font-bold transition-colors ${scheduleAmPm === "PM" ? "bg-blue-100 text-[#0a66c2]" : "bg-white text-slate-500 hover:bg-slate-50"}`}
                                                    >
                                                        PM
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {isPastTime() && (
                                        <p className="mt-2 text-xs font-semibold text-red-500">
                                            The scheduled time must be in the future.
                                        </p>
                                    )}

                                    <div className="mt-6">
                                        <button
                                            onClick={handleOpenScheduledList}
                                            className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            View all scheduled posts <ArrowLeft className="w-4 h-4 rotate-180" />
                                        </button>
                                    </div>
                                </div>

                                {/* Settings Footer */}
                                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
                                    <button
                                        onClick={() => {
                                            setShowScheduleSettings(false);
                                            // Ensure modal stays open for writing
                                        }}
                                        className="px-5 py-2 text-sm font-bold text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (!scheduleDate) return alert("Please select a date for scheduling.");
                                            if (!get24HourTime()) return alert("Please enter a valid time (e.g., 3:45).");
                                            if (isPastTime()) return alert("The scheduled time cannot be in the past. Please select a future time.");
                                            setShowScheduleSettings(false);
                                        }}
                                        className="px-6 py-2 bg-[#0a66c2] hover:bg-[#004182] text-white text-sm font-bold rounded-full transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        ) : showSettings ? (
                            <div className="flex flex-col h-full animate-slideLeft">
                                {/* Settings Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Post settings</h2>
                                    <button
                                        onClick={() => { setShowSettings(false); setShowCommentOptions(false); }}
                                        className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Settings Body */}
                                <div className="flex-1 overflow-y-auto px-6 py-5">
                                    {/* Who can see your post */}
                                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-4">Who can see your post?</p>
                                    <div className="space-y-1 mb-6">
                                        {VISIBILITY_OPTIONS.map(({ id, label, desc, icon: Icon, hasArrow }) => {
                                            const selected = visibility === id;
                                            return (
                                                <button
                                                    key={id}
                                                    onClick={() => setVisibility(id)}
                                                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-colors ${
                                                        selected
                                                            ? "bg-blue-50 dark:bg-blue-900/20"
                                                            : "hover:bg-slate-50 dark:hover:bg-slate-800"
                                                    }`}
                                                >
                                                    <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                        selected
                                                            ? "bg-[#0a66c2] text-white"
                                                            : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                                                    }`}>
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <p className={`text-sm font-semibold ${
                                                            selected ? "text-[#0a66c2] dark:text-blue-400" : "text-slate-800 dark:text-slate-200"
                                                        }`}>
                                                            {label}
                                                            {hasArrow && <ChevronRight className="inline w-4 h-4 ml-0.5" />}
                                                        </p>
                                                        {desc && (
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
                                                        )}
                                                    </div>
                                                    {/* Radio indicator */}
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                                        selected
                                                            ? "border-[#0a66c2]"
                                                            : "border-slate-300 dark:border-slate-600"
                                                    }`}>
                                                        {selected && (
                                                            <div className="w-2.5 h-2.5 rounded-full bg-[#0a66c2]" />
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px bg-slate-200 dark:bg-slate-700 mb-5" />

                                    {/* Comment control */}
                                    <button
                                        onClick={() => setShowCommentOptions(!showCommentOptions)}
                                        className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <MessageSquare className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                                            <div className="text-left">
                                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Comment control</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{commentLabel}</p>
                                            </div>
                                        </div>
                                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showCommentOptions ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Comment Control Options */}
                                    {showCommentOptions && (
                                        <div className="mt-2 ml-12 space-y-1 animate-fadeIn">
                                            {COMMENT_OPTIONS.map(({ id, label }) => {
                                                const selected = commentControl === id;
                                                return (
                                                    <button
                                                        key={id}
                                                        onClick={() => { setCommentControl(id); setShowCommentOptions(false); }}
                                                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors ${
                                                            selected
                                                                ? "bg-blue-50 dark:bg-blue-900/20 text-[#0a66c2] dark:text-blue-400"
                                                                : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                                        }`}
                                                    >
                                                        <span className="text-sm font-medium">{label}</span>
                                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                                                            selected ? "border-[#0a66c2]" : "border-slate-300 dark:border-slate-600"
                                                        }`}>
                                                            {selected && <div className="w-2 h-2 rounded-full bg-[#0a66c2]" />}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Settings Footer */}
                                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
                                    <button
                                        onClick={() => { setShowSettings(false); setShowCommentOptions(false); }}
                                        className="px-5 py-2 rounded-full text-sm font-bold border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-500 dark:hover:border-slate-400 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={() => { setShowSettings(false); setShowCommentOptions(false); }}
                                        className="px-5 py-2 rounded-full text-sm font-bold bg-[#0a66c2] text-white hover:bg-[#004182] transition-colors shadow-md"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* ======== MAIN POST COMPOSER ======== */
                            <>
                                {/* Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${avatarName}&background=0F172A&color=fff&bold=true&size=96`}
                                            alt={displayName}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{displayName}</p>
                                            <button
                                                onClick={() => setShowSettings(true)}
                                                className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-[#0a66c2] dark:hover:text-blue-400 transition-colors group"
                                            >
                                                {visibility === "anyone" && <Globe className="w-3 h-3" />}
                                                {visibility === "connections" && <Users className="w-3 h-3" />}
                                                {visibility === "group" && <UsersRound className="w-3 h-3" />}
                                                <span>Post to {visibilityLabel}</span>
                                                <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { if (!submitting) resetModal(); }}
                                        className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Body — scrollable */}
                                <div className="px-6 py-4 overflow-y-auto flex-1">
                                    <textarea
                                        ref={textareaRef}
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="What do you want to talk about?"
                                        className="w-full min-h-[160px] max-h-[300px] resize-none border-0 outline-none bg-transparent text-slate-900 dark:text-white text-base placeholder:text-slate-400 dark:placeholder:text-slate-500 leading-relaxed"
                                    />

                                    {/* Image Preview */}
                                    {imagePreview && (
                                        <div className="relative mt-3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                                            <img
                                                src={imagePreview}
                                                alt="Post media"
                                                className="w-full max-h-[300px] object-cover"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                            <button
                                                onClick={removeImage}
                                                className="absolute top-2 right-2 w-8 h-8 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}

                                    {/* Media Upload Panel */}
                                    {showMediaPanel && !imagePreview && (
                                        <div className="mt-3 flex flex-col gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 animate-fadeIn">
                                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Add media</p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={openImagePicker}
                                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 transition-colors text-sm font-semibold text-slate-700 dark:text-slate-300"
                                                >
                                                    <Image className="w-4 h-4 text-blue-500" />
                                                    Upload image
                                                </button>
                                                <button
                                                    onClick={openVideoPicker}
                                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 transition-colors text-sm font-semibold text-slate-700 dark:text-slate-300"
                                                >
                                                    <Video className="w-4 h-4 text-green-500" />
                                                    Upload video
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                                                or paste URL
                                                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="url"
                                                    placeholder="https://example.com/image.jpg"
                                                    value={imageUrl}
                                                    onChange={(e) => setImageUrl(e.target.value)}
                                                    className="flex-1 text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-blue-500 transition-colors"
                                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleImageUrlAdd(); } }}
                                                />
                                                <button
                                                    onClick={handleImageUrlAdd}
                                                    disabled={!imageUrl.trim()}
                                                    className="px-3 py-2 rounded-lg bg-[#0a66c2] text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#004182] transition-colors"
                                                >
                                                    <Link2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => setShowMediaPanel(false)}
                                                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors self-end"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Conditional Message */}
                                {scheduleDate && get24HourTime() && isPastTime() && (
                                    <div className="px-4 py-2.5 bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 text-xs font-semibold text-center border-t border-rose-100 dark:border-rose-500/20">
                                        Your scheduled time is currently in the past. Click the clock icon below to choose a time in the future!
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex-shrink-0 bg-slate-50 dark:bg-[#131b2f] rounded-b-2xl">
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={openImagePicker}
                                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${imagePreview ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                            title="Add photo (images only)"
                                        >
                                            <Image className={`w-5 h-5 ${imagePreview ? 'text-blue-600' : 'text-blue-500'}`} />
                                        </button>
                                        <button
                                            onClick={openVideoPicker}
                                            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                            title="Add video (videos only)"
                                        >
                                            <Video className="w-5 h-5 text-green-600" />
                                        </button>
                                        <button
                                            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                            title="Write article"
                                        >
                                            <FileText className="w-5 h-5 text-red-500" />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {/* Schedule feature */}
                                        <div className="relative group">
                                            <button
                                                onClick={() => setShowScheduleSettings(true)}
                                                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                                                    scheduleDate && scheduleTime 
                                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-[#0a66c2] dark:text-blue-400' 
                                                        : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400'
                                                }`}
                                                title="Schedule for later"
                                            >
                                                <Clock className="w-5 h-5" />
                                            </button>
                                            
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-lg z-50">
                                                Schedule for later
                                            </div>
                                        </div>

                                        {/* Post Button */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (!content.trim()) return alert("Post content cannot be empty.");
                                                if (submitting) return;
                                                const time24 = get24HourTime();
                                                if (scheduleDate && time24) {
                                                    const [year, month, day] = scheduleDate.split('-');
                                                    const [hour, min] = time24.split(':');
                                                    const selected = new Date(year, parseInt(month, 10) - 1, day, hour, min);
                                                    if (selected <= new Date()) {
                                                        alert("Error: Your scheduled time is currently in the past! Please open the clock menu and pick a future time before saving.");
                                                        return;
                                                    }
                                                }
                                                handleSubmit();
                                            }}
                                            disabled={submitting}
                                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                                                submitting
                                                    ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                                                    : "bg-[#0a66c2] hover:bg-[#004182] text-white shadow-md hover:shadow-lg"
                                            }`}
                                        >
                                            {submitting ? (
                                                <span className="flex items-center gap-2">
                                                    <Loader2 className="w-4 h-4 animate-spin" /> {editingPostId ? 'Saving...' : (scheduleDate && get24HourTime() ? 'Scheduling...' : 'Posting...')}
                                                </span>
                                            ) : (
                                                editingPostId ? 'Save Changes' : (scheduleDate && get24HourTime() ? 'Schedule' : 'Post')
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Keyframe animations */}
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
                @keyframes slideLeft { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
                .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
                .animate-slideUp { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                .animate-slideLeft { animation: slideLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
            `}</style>
        </>
    );
}
