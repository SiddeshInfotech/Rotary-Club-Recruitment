import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { io } from "socket.io-client";
import { Search, MoreVertical, Send, Paperclip, Check, CheckCheck, User, Sparkles, BookOpen, ChevronRight, ChevronLeft, Zap, Calendar, X, Video, MapPin, Phone, HelpCircle } from "lucide-react";
import RecruiterLayout from "../../layouts/RecruiterLayout";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const SOCKET_URL = process.env.REACT_APP_API_URL 
  ? process.env.REACT_APP_API_URL.replace("/api", "") 
  : "http://localhost:5000";

const TEMPLATES = [
  { label: "Interview Request", text: "Hi {name}, we reviewed your profile and would love to invite you for an interview. Let us know what times work best for you next week!" },
  { label: "Follow Up", text: "Hi {name}, just checking in to see if you have any questions regarding the interview details we discussed." },
  { label: "Offer Details", text: "Hi {name}, we are excited to move forward with your application. Let's schedule a call to discuss the offer details and onboarding." },
  { label: "Keep in Touch", text: "Hi {name}, thank you for chatting. Although we don't have an immediate fit, we will keep your details on file for future roles." }
];

export default function RecruiterMessages() {
  const { user } = useAuth();
  const location = useLocation();

  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Right sidebar details state
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [showContextPanel, setShowContextPanel] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Quick templates list toggle
  const [showTemplates, setShowTemplates] = useState(false);

  // Interview scheduling modal state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleJobTitle, setScheduleJobTitle] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleType, setScheduleType] = useState("Video");
  const [scheduleNotes, setScheduleNotes] = useState("");
  const [scheduleMeetingLink, setScheduleMeetingLink] = useState("");

  // Sockets state
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const [conversationsFetched, setConversationsFetched] = useState(false);

  // Load conversations list
  const fetchConversations = async () => {
    try {
      const res = await api.get("/messages/conversations");
      if (res.data.success) {
        setConversations(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      setConversationsFetched(true);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const currentConversationRef = useRef(currentConversation);
  useEffect(() => {
    currentConversationRef.current = currentConversation;
  }, [currentConversation]);

  // Socket setup
  useEffect(() => {
    if (!user) return;

    const socketInstance = io(SOCKET_URL);
    setSocket(socketInstance);

    socketInstance.emit("join", user._id || user.id);

    socketInstance.on("new_message", ({ message, conversation }) => {
      const current = currentConversationRef.current;
      const isCurrentChat = current && conversation && current._id === conversation._id;

      if (isCurrentChat) {
        setMessages((prev) => {
          if (prev.some((m) => String(m._id) === String(message._id))) return prev;

          const msgSenderId = message.sender?._id || message.sender;
          const currentUserId = user?._id || user?.id;
          const fromOther = msgSenderId !== currentUserId;
          if (fromOther) {
            api.put(`/messages/conversations/${conversation._id}/read`).catch(console.error);
          }
          return [...prev, message];
        });
      }

      // Update conversations list
      setConversations((prev) => {
        const idx = prev.findIndex((c) => c._id === conversation._id);
        const updatedConversations = [...prev];
        const updatedConv = { ...conversation };

        if (isCurrentChat) {
          updatedConv.unreadCount = 0;
        }

        if (idx > -1) {
          updatedConversations.splice(idx, 1);
          updatedConversations.unshift(updatedConv);
        } else {
          updatedConversations.unshift(updatedConv);
        }
        return updatedConversations;
      });
    });

    socketInstance.on("messages_read", ({ conversationId }) => {
      const current = currentConversationRef.current;
      if (current && current._id === conversationId) {
        setMessages((prev) =>
          prev.map((m) =>
            (m.sender?._id || m.sender) === (user?._id || user?.id) ? { ...m, read: true } : m
          )
        );
      }

      setConversations((prev) =>
        prev.map((c) => (c._id === conversationId ? { ...c, unreadCount: 0 } : c))
      );
    });

    // Handle initial online users list
    socketInstance.on("online_users", (userIds) => {
      setOnlineUsers(new Set(userIds));
    });

    socketInstance.on("user_status", ({ userId, status }) => {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        if (status === "online") {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });
    });

    socketInstance.on("typing_status", ({ senderId, isTyping: typing }) => {
      const current = currentConversationRef.current;
      if (current) {
        const other = current.participants.find((p) => p._id !== (user._id || user.id));
        if (other && other._id === senderId) {
          setOtherUserTyping(typing);
        }
      }
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  // Handle routing state redirection (from candidate profile view or applications)
  useEffect(() => {
    if (!conversationsFetched) return;

    const targetUser = location.state?.selectUser;
    if (targetUser) {
      const existing = conversations.find((c) =>
        c.participants.some((p) => p._id === targetUser._id || p._id === targetUser.id)
      );

      if (existing) {
        selectConversation(existing);
      } else {
        const targetId = targetUser._id || targetUser.id;
        const draft = {
          _id: "draft",
          participants: [
            { _id: user._id || user.id, name: user.name, role: user.role },
            {
              _id: targetId,
              name: targetUser.name,
              role: targetUser.role || "candidate",
              email: targetUser.email || "",
              company: targetUser.company || "",
            },
          ],
          lastMessage: "Start of a new conversation",
          lastMessageAt: new Date(),
          unreadCount: 0,
        };
        setConversations((prev) => [draft, ...prev.filter(c => c._id !== "draft")]);
        setCurrentConversation(draft);
        setMessages([]);
      }
      window.history.replaceState({}, document.title);
    }
  }, [location.state, conversationsFetched]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, otherUserTyping]);

  // Fetch candidate profile when active user changes
  useEffect(() => {
    if (!currentConversation) {
      setCandidateProfile(null);
      return;
    }

    const otherUser = getOtherParticipant(currentConversation);
    if (otherUser && otherUser.role === "candidate") {
      setLoadingProfile(true);
      api
        .get(`/recruiter/candidate/${otherUser._id}`)
        .then((res) => {
          if (res.data.success) {
            setCandidateProfile(res.data.data);
          }
        })
        .catch((err) => {
          console.error("Error fetching candidate detailed profile:", err);
          setCandidateProfile(null);
        })
        .finally(() => {
          setLoadingProfile(false);
        });
    } else {
      setCandidateProfile(null);
    }
  }, [currentConversation]);

  const selectConversation = async (conversation) => {
    setCurrentConversation(conversation);
    setOtherUserTyping(false);
    setShowTemplates(false);

    if (conversation._id === "draft") {
      setMessages([]);
      return;
    }

    try {
      const res = await api.get(`/messages/conversations/${conversation._id}`);
      if (res.data.success) {
        setMessages(res.data.data);
      }

      if (conversation.unreadCount > 0) {
        await api.put(`/messages/conversations/${conversation._id}/read`);
        setConversations((prev) =>
          prev.map((c) => (c._id === conversation._id ? { ...c, unreadCount: 0 } : c))
        );
      }
    } catch (err) {
      console.error("Error opening conversation:", err);
    }
  };

  const handleInputChange = (e) => {
    setNewMessageText(e.target.value);

    if (!socket || !currentConversation) return;

    const otherUser = currentConversation.participants.find((p) => p._id !== (user._id || user.id));
    if (!otherUser) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", {
        senderId: user._id || user.id,
        receiverId: otherUser._id,
        isTyping: true,
      });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("typing", {
        senderId: user._id || user.id,
        receiverId: otherUser._id,
        isTyping: false,
      });
    }, 2000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() && !selectedFile) return;
    if (!currentConversation) return;

    const otherUser = currentConversation.participants.find((p) => p._id !== (user._id || user.id));
    if (!otherUser) return;

    let textToSend = newMessageText;
    if (selectedFile) {
      const filePrefix = `📎 [Attachment: ${selectedFile.name}]`;
      textToSend = textToSend ? `${filePrefix}\n\n${textToSend}` : filePrefix;
    }
    setNewMessageText("");

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setIsTyping(false);
    if (socket) {
      socket.emit("typing", {
        senderId: user._id || user.id,
        receiverId: otherUser._id,
        isTyping: false,
      });
    }

    try {
      const res = await api.post("/messages/send", {
        receiverId: otherUser._id,
        content: textToSend,
      });

      if (res.data.success) {
        if (currentConversation._id === "draft") {
          const actualConv = res.data.conversation;
          setConversations((prev) =>
            prev.map((c) => (c._id === "draft" ? actualConv : c))
          );
          setCurrentConversation(actualConv);
        }
        setMessages((prev) => {
          if (prev.some((m) => String(m._id) === String(res.data.data._id))) return prev;
          return [...prev, res.data.data];
        });
        setSelectedFile(null);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Submit interview invite
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleJobTitle || !scheduleDate || !scheduleTime) return;

    const otherUser = getOtherParticipant(currentConversation);
    if (!otherUser) return;

    // Build the payload
    const invitePayload = {
      cardType: "interview_invite",
      jobTitle: scheduleJobTitle,
      date: scheduleDate,
      time: scheduleTime,
      type: scheduleType,
      notes: scheduleNotes,
      meetingLink: scheduleMeetingLink,
      status: "pending"
    };

    const textToSend = JSON.stringify(invitePayload);

    try {
      const res = await api.post("/messages/send", {
        receiverId: otherUser._id,
        content: textToSend,
      });

      if (res.data.success) {
        if (currentConversation._id === "draft") {
          const actualConv = res.data.conversation;
          setConversations((prev) =>
            prev.map((c) => (c._id === "draft" ? actualConv : c))
          );
          setCurrentConversation(actualConv);
        }
        setMessages((prev) => {
          if (prev.some((m) => String(m._id) === String(res.data.data._id))) return prev;
          return [...prev, res.data.data];
        });
      }
    } catch (err) {
      console.error("Error sending interview card:", err);
    }

    // Reset fields and close modal
    setScheduleJobTitle("");
    setScheduleDate("");
    setScheduleTime("");
    setScheduleType("Video");
    setScheduleNotes("");
    setScheduleMeetingLink("");
    setShowScheduleModal(false);
  };

  // Quick Reply template select
  const applyTemplate = (tplText) => {
    const activeOtherUser = getOtherParticipant(currentConversation);
    const parsedText = tplText.replace("{name}", activeOtherUser?.name || "there");
    setNewMessageText(parsedText);
    setShowTemplates(false);
  };

  const getOtherParticipant = (conv) => {
    return conv.participants.find((p) => p._id !== (user._id || user.id)) || { name: "User" };
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDateHeader = (isoString) => {
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  };

  const filteredConversations = conversations.filter((c) => {
    const other = getOtherParticipant(c);
    return other.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const activeOtherUser = currentConversation ? getOtherParticipant(currentConversation) : null;
  const isActiveOnline = activeOtherUser && onlineUsers.has(activeOtherUser._id);

  // Helper to render message content
  const renderMessageContent = (msg, isMe) => {
    try {
      if (msg.content && typeof msg.content === 'string' && msg.content.startsWith('{"cardType":"interview_invite"')) {
        const invite = JSON.parse(msg.content);
        const inviteDate = new Date(invite.date).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
        return (
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 w-72 md:w-80 shadow-md text-slate-800 dark:text-slate-100 flex flex-col gap-3 font-sans text-left">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Interview invite</span>
                <h4 className="text-sm font-bold mt-0.5">{invite.jobTitle}</h4>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                invite.status === "accepted" 
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                  : invite.status === "declined"
                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
              }`}>
                {invite.status.toUpperCase()}
              </span>
            </div>
            
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 border-t border-b border-slate-100 dark:border-slate-700/80 py-2.5">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>{inviteDate} at {invite.time}</span>
              </div>
              <div className="flex items-center gap-2">
                {invite.type === "Video" ? (
                  <Video className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                ) : invite.type === "Phone" ? (
                  <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                )}
                <span>{invite.type} Interview</span>
              </div>
              {invite.meetingLink && (
                <div className="flex items-center gap-2 truncate">
                  <Video className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                  <a href={invite.meetingLink} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 truncate">
                    {invite.meetingLink}
                  </a>
                </div>
              )}
            </div>

            {invite.notes && (
              <p className="text-[11px] italic text-slate-500 dark:text-slate-400 leading-relaxed">
                "{invite.notes}"
              </p>
            )}
          </div>
        );
      }
    } catch (e) {
      // Fallback if parsing fails
    }

    return (
      <div
        className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
          isMe
            ? "bg-blue-600 text-white rounded-tr-none"
            : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-tl-none"
        }`}
      >
        {msg.content}
      </div>
    );
  };

  return (
    <RecruiterLayout>
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden h-[calc(100vh-140px)] flex relative">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-slate-200 dark:border-slate-800 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
            <h2 className="text-lg font-bold text-[#1a2b4b] dark:text-white">Messages</h2>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm"
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-grow">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((c) => {
                const other = getOtherParticipant(c);
                const isSelected = currentConversation && currentConversation._id === c._id;
                const isOnline = onlineUsers.has(other._id);
                return (
                  <div
                    key={c._id}
                    onClick={() => selectConversation(c)}
                    className={`p-4 border-b border-slate-100 dark:border-slate-800/50 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-3 ${
                      isSelected ? "bg-blue-50/30 dark:bg-blue-900/20" : ""
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          other.name
                        )}&background=0d1b2a&color=67e8f9`}
                        alt={other.name}
                        className="w-10 h-10 rounded-full"
                      />
                      {isOnline && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className="text-sm font-bold text-[#1a2b4b] dark:text-white truncate">
                          {other.name}
                        </h3>
                        <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
                          {formatTime(c.lastMessageAt || c.updatedAt)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {c.lastMessage && typeof c.lastMessage === 'string' && c.lastMessage.startsWith('{"cardType":') ? "📅 Interview Invitation" : (c.lastMessage || "")}
                      </p>
                    </div>
                    {c.unreadCount > 0 && !isSelected && (
                      <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 bg-blue-500 rounded-full text-[10px] font-bold text-white self-center">
                        {c.unreadCount}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm">
                No conversations found
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        {currentConversation ? (
          <div className="flex-grow flex flex-col bg-[#fcfdfd] dark:bg-slate-900/50 min-w-0 relative">
            {/* Header */}
            <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 flex-shrink-0 bg-white dark:bg-slate-900 z-10">
              <div className="flex items-center gap-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    activeOtherUser?.name
                  )}&background=0d1b2a&color=67e8f9`}
                  alt={activeOtherUser?.name}
                  className="w-9 h-9 rounded-full"
                />
                <div>
                  <h3 className="text-[15px] font-bold text-[#1a2b4b] dark:text-white leading-tight">
                    {activeOtherUser?.name}
                  </h3>
                  <p className={`text-[11px] font-medium ${isActiveOnline ? "text-green-500" : "text-slate-400"}`}>
                    {isActiveOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowContextPanel(!showContextPanel)}
                  title="Toggle Candidate Info Panel"
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-md transition-colors"
                >
                  {showContextPanel ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {messages.map((msg, index) => {
                const senderId = msg.sender?._id || msg.sender;
                const isMe = senderId === (user?._id || user?.id);
                const showDateHeader =
                  index === 0 ||
                  formatDateHeader(messages[index - 1].createdAt) !== formatDateHeader(msg.createdAt);

                return (
                  <div key={msg._id || index} className="space-y-4">
                    {showDateHeader && (
                      <div className="flex justify-center my-2">
                        <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                          {formatDateHeader(msg.createdAt || new Date())}
                        </span>
                      </div>
                    )}

                    <div className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                      {!isMe && (
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            activeOtherUser?.name
                          )}&background=0d1b2a&color=67e8f9`}
                          alt={activeOtherUser?.name}
                          className="w-8 h-8 rounded-full flex-shrink-0 mt-1"
                        />
                      )}
                      <div className={`flex flex-col gap-1 max-w-[70%] ${isMe ? "items-end" : ""}`}>
                        {renderMessageContent(msg, isMe)}
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[10px] text-slate-400 font-medium">
                            {formatTime(msg.createdAt)}
                          </span>
                          {isMe && (
                            msg.read ? (
                              <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                            ) : (
                              <Check className="w-3.5 h-3.5 text-slate-300" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {otherUserTyping && (
                <div className="flex gap-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      activeOtherUser?.name
                    )}&background=0d1b2a&color=67e8f9`}
                    alt={activeOtherUser?.name}
                    className="w-8 h-8 rounded-full flex-shrink-0 mt-1"
                  />
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex-shrink-0 relative">
              {/* Selected File Badge */}
              {selectedFile && (
                <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs mb-3 w-max text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-750">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span className="font-medium truncate max-w-[200px]">{selectedFile.name}</span>
                  <button type="button" onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-red-500 ml-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Templates popover */}
              {showTemplates && (
                <div className="absolute bottom-16 left-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-3 w-80 max-h-60 overflow-y-auto z-20">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-yellow-500" />
                    Quick Reply Templates
                  </h4>
                  <div className="space-y-1.5">
                    {TEMPLATES.map((t, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => applyTemplate(t.text)}
                        className="w-full text-left text-xs p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:text-slate-300 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all font-medium"
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="flex gap-3 items-center">
                <button
                  type="button"
                  onClick={() => setShowTemplates(!showTemplates)}
                  className={`p-2 rounded-full border transition-all ${
                    showTemplates
                      ? "bg-blue-50 dark:bg-blue-900/30 border-blue-300 text-blue-600"
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-blue-500"
                  }`}
                  title="Quick Responses"
                >
                  <Zap className="w-4 h-4" />
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(true)}
                  className="p-2 rounded-full border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-blue-500 hover:border-blue-300 transition-all"
                  title="Proposal Interview Card"
                >
                  <Calendar className="w-4 h-4" />
                </button>

                <div className="flex-grow min-w-0 flex gap-3 items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full pl-4 pr-1 py-1 focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-500 transition-all">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessageText}
                    onChange={handleInputChange}
                    className="flex-grow min-w-0 bg-transparent border-none focus:outline-none focus:ring-0 text-sm py-2 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={!newMessageText.trim() && !selectedFile}
                    className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors shadow-sm flex-shrink-0 ${
                      newMessageText.trim() || selectedFile
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center bg-[#fcfdfd] dark:bg-slate-900/50 text-slate-400">
            <svg
              className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-sm font-medium">Select a conversation to start messaging</p>
          </div>
        )}

        {/* Collapsible Candidate Info Right Panel */}
        {currentConversation && showContextPanel && activeOtherUser?.role === "candidate" && (
          <div className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col flex-shrink-0 animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-700 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-500" />
                Candidate Profile
              </h3>
            </div>

            <div className="overflow-y-auto flex-grow p-4 space-y-6">
              {loadingProfile ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3 text-slate-400">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs">Loading profile details...</span>
                </div>
              ) : candidateProfile ? (
                <>
                  {/* Basic summary */}
                  <div className="text-center">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                         candidateProfile.name
                      )}&background=0d1b2a&color=67e8f9&size=128`}
                      alt={candidateProfile.name}
                      className="w-20 h-20 rounded-full mx-auto border-2 border-blue-500/20 shadow-sm"
                    />
                    <h4 className="text-base font-bold text-slate-800 dark:text-white mt-3 leading-snug">
                      {candidateProfile.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {candidateProfile.currentTitle || "Candidate"}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {candidateProfile.location || "Location not specified"}
                    </p>
                  </div>

                  {/* Skills */}
                  {candidateProfile.skills && (
                    <div>
                      <h5 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                        Skills
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {candidateProfile.skills.split(",").map((skill, index) => (
                          <span
                            key={index}
                            className="text-[10px] bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-700/60 font-semibold"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* EQ Scores */}
                  {candidateProfile.eqScores && (
                    <div>
                      <h5 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                        EQ assessment
                      </h5>
                      <div className="space-y-4">
                        {/* Overall / Aggregate */}
                        <div>
                          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                            <span>Aggregate EQ</span>
                            <span className="text-green-600 dark:text-green-400">{candidateProfile.eqScores.aggregate || 0}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
                            <div
                              className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${candidateProfile.eqScores.aggregate || 0}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* 8 EQ Traits 2-Column Grid */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-1">
                          {[
                            { label: "Leadership", key: "leadership" },
                            { label: "Loyalty", key: "loyalty" },
                            { label: "Adaptability", key: "adaptability" },
                            { label: "Growth Mindset", key: "growthMindset" },
                            { label: "Reliability", key: "reliability" },
                            { label: "Teamwork", key: "teamwork" },
                            { label: "Collaboration", key: "collaboration" },
                            { label: "Problem Solving", key: "problemSolving" }
                          ].map((t) => (
                            <div key={t.key}>
                              <div className="flex justify-between text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                                <span className="truncate" title={t.label}>{t.label}</span>
                                <span className="font-bold text-slate-750 dark:text-slate-350">{candidateProfile.eqScores[t.key] || 0}%</span>
                              </div>
                              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                                  style={{ width: `${candidateProfile.eqScores[t.key] || 0}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions / Resume link */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    {candidateProfile.resumeLink && (
                      <a
                        href={candidateProfile.resumeLink}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        View Resume
                      </a>
                    )}
                    <Link
                      to={`/recruiter/candidate/${candidateProfile._id}`}
                      className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      View Full Profile
                    </Link>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  No extended profile found for this candidate.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Scheduling Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowScheduleModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-500" />
              Propose Interview
            </h3>
            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                  Job Title / Recruitment Round
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Product Manager - Technical Interview"
                  value={scheduleJobTitle}
                  onChange={(e) => setScheduleJobTitle(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                    Proposed Date
                  </label>
                  <input
                    type="date"
                    required
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                    Proposed Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 2:00 PM EST"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                  Interview Type
                </label>
                <select
                  value={scheduleType}
                  onChange={(e) => setScheduleType(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  <option value="Video">Video Call</option>
                  <option value="Phone">Phone Call</option>
                  <option value="In-person">In-Person</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                  Meeting / Video Link
                </label>
                <input
                  type="text"
                  placeholder="e.g. Google Meet or Zoom URL (optional)"
                  value={scheduleMeetingLink}
                  onChange={(e) => setScheduleMeetingLink(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                  Agenda Notes (optional)
                </label>
                <textarea
                  placeholder="e.g. We will review your EQ score and past experience..."
                  value={scheduleNotes}
                  onChange={(e) => setScheduleNotes(e.target.value)}
                  rows="3"
                  className="w-full text-sm px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-bold"
                >
                  Send Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </RecruiterLayout>
  );
}
