import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { Search, MoreVertical, Send, Paperclip, Check, CheckCheck, Calendar, Video, Phone, MapPin, AlertCircle, ChevronLeft, ChevronRight, User, Building2, Briefcase, Globe, Mail, X } from "lucide-react";
import CandidateLayout from "../../layouts/CandidateLayout";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const SOCKET_URL = process.env.REACT_APP_API_URL 
  ? process.env.REACT_APP_API_URL.replace("/api", "") 
  : "http://localhost:5000";

export default function CandidateMessages() {
  const { user } = useAuth();
  const location = useLocation();
  
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Real-time status states
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Card interaction state
  const [processingCardId, setProcessingCardId] = useState(null);
  const [cardError, setCardError] = useState("");

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

  // Recruiter Details Sidebar and Applications state
  const [showRecruiterPanel, setShowRecruiterPanel] = useState(true);
  const [applications, setApplications] = useState([]);
  
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

  useEffect(() => {
    if (!user?._id && !user?.id) return;
    const fetchApplications = async () => {
      try {
        const res = await api.get(`/applications?candidateId=${user._id || user.id}`);
        if (res.data.success) {
          setApplications(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };
    fetchApplications();
  }, [user]);

  const currentConversationRef = useRef(currentConversation);
  useEffect(() => {
    currentConversationRef.current = currentConversation;
  }, [currentConversation]);

  // WebSockets setup
  useEffect(() => {
    if (!user) return;

    const socketInstance = io(SOCKET_URL);
    setSocket(socketInstance);

    // Join room on connection
    socketInstance.emit("join", user._id || user.id);

    // Receive message
    socketInstance.on("new_message", ({ message, conversation }) => {
      const current = currentConversationRef.current;
      const isCurrentChat = current && conversation && current._id === conversation._id;
      
      if (isCurrentChat) {
        setMessages((prev) => {
          if (prev.some((m) => String(m._id) === String(message._id))) return prev;
          
          // Mark as read immediately on backend if it's from the other person
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

        // If it's the currently open chat, keep unreadCount = 0
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

    // Handle messages read confirmation
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

    // Handle presence updates
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

    // Handle typing indicator
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

  // Handle routing state redirection (when selecting a profile or job recruiter to message)
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
        // Create draft conversation in state
        const targetId = targetUser._id || targetUser.id;
        const draft = {
          _id: "draft",
          participants: [
            { _id: user._id || user.id, name: user.name, role: user.role },
            {
              _id: targetId,
              name: targetUser.name,
              role: targetUser.role || "recruiter",
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
      // Clear location state so refreshes don't re-trigger drafts
      window.history.replaceState({}, document.title);
    }
  }, [location.state, conversationsFetched]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, otherUserTyping]);

  const selectConversation = async (conversation) => {
    setCurrentConversation(conversation);
    setOtherUserTyping(false);
    
    // If it's a draft, no message history to fetch
    if (conversation._id === "draft") {
      setMessages([]);
      return;
    }

    try {
      const res = await api.get(`/messages/conversations/${conversation._id}`);
      if (res.data.success) {
        setMessages(res.data.data);
      }

      // Mark as read
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

  // Handle input typing
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

  // Send message
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
    
    // Clear typing timeout
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
        // If this was a draft conversation, replace draft with actual conversation
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

  // Accept interview invitation
  const handleAcceptInvite = async (msgId, inviteDetails) => {
    setProcessingCardId(msgId);
    setCardError("");

    const otherUser = getOtherParticipant(currentConversation);

    try {
      // 1. Create interview entry on backend
      const res = await api.post("/interviews", {
        recruiter: otherUser._id || otherUser.id,
        candidate: user._id || user.id,
        candidateName: user.name,
        candidateEmail: user.email,
        jobTitle: inviteDetails.jobTitle,
        date: inviteDetails.date,
        time: inviteDetails.time,
        type: inviteDetails.type || "Video",
        notes: inviteDetails.notes || "",
        meetingLink: inviteDetails.meetingLink || ""
      });

      if (res.data.success) {
        // 2. Send acceptance message in chat thread
        const replyText = `✅ I accepted your interview invite for: ${inviteDetails.jobTitle} on ${new Date(inviteDetails.date).toLocaleDateString()} at ${inviteDetails.time}`;
        
        await api.post("/messages/send", {
          receiverId: otherUser._id,
          content: replyText,
        });

        // 3. Update the UI state locally
        setMessages((prev) => 
          prev.map((m) => {
            if (m._id === msgId) {
              try {
                const parsed = JSON.parse(m.content);
                parsed.status = "accepted";
                return { ...m, content: JSON.stringify(parsed) };
              } catch (e) {}
            }
            return m;
          })
        );
      }
    } catch (err) {
      console.error("Error accepting interview invite:", err);
      setCardError("Failed to accept invitation. Please try again.");
    } finally {
      setProcessingCardId(null);
    }
  };

  // Decline interview invitation
  const handleDeclineInvite = async (msgId, inviteDetails) => {
    setProcessingCardId(msgId);
    setCardError("");

    const otherUser = getOtherParticipant(currentConversation);

    try {
      // Send refusal message in chat
      const replyText = `❌ I requested to reschedule the interview invitation for: ${inviteDetails.jobTitle} on ${new Date(inviteDetails.date).toLocaleDateString()} at ${inviteDetails.time}. Please let me know alternative times.`;
      
      await api.post("/messages/send", {
        receiverId: otherUser._id,
        content: replyText,
      });

      // Update the UI card state locally to "declined"
      setMessages((prev) => 
        prev.map((m) => {
          if (m._id === msgId) {
            try {
              const parsed = JSON.parse(m.content);
              parsed.status = "declined";
              return { ...m, content: JSON.stringify(parsed) };
            } catch (e) {}
          }
          return m;
        })
      );
    } catch (err) {
      console.error("Error declining interview invite:", err);
      setCardError("Failed to decline/reschedule invite.");
    } finally {
      setProcessingCardId(null);
    }
  };

  // Helper: Get other participant
  const getOtherParticipant = (conv) => {
    return conv.participants.find((p) => p._id !== (user._id || user.id)) || { name: "User" };
  };

  // Helper: Format message timestamp
  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Helper: Format date divider
  const formatDateHeader = (isoString) => {
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  };

  // Filter conversations based on query
  const filteredConversations = conversations.filter((c) => {
    const other = getOtherParticipant(c);
    return other.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const activeOtherUser = currentConversation ? getOtherParticipant(currentConversation) : null;
  const isActiveOnline = activeOtherUser && onlineUsers.has(activeOtherUser._id);

  const recruiterApps = applications.filter((app) => {
    const recruiterId = app.jobId?.recruiter?._id || app.jobId?.recruiter;
    const otherUserId = activeOtherUser?._id || activeOtherUser?.id;
    return recruiterId && otherUserId && recruiterId.toString() === otherUserId.toString();
  });

  // Helper to render message content with interactive cards
  const renderMessageContent = (msg, isMe) => {
    if (msg.sharedPost) {
      return (
        <div className="bg-white dark:bg-[#1d2226] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-md w-[400px] max-w-full text-left">
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex gap-3 items-start">
              <img src={msg.sharedPost.authorAvatar} alt="author" className="w-10 h-10 rounded-full flex-shrink-0 object-cover" />
              <div className="min-w-0 pt-0.5">
                <div className="flex items-center gap-1">
                  <span className="text-[14px] font-bold text-slate-900 dark:text-white truncate">{msg.sharedPost.authorName}</span>
                </div>
                <p className="text-[12px] text-slate-500 truncate leading-snug mt-0.5">{msg.sharedPost.authorTitle || 'Community Member'}</p>
                <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">Recent • Edited • <Globe className="w-2.5 h-2.5 inline" /></p>
              </div>
            </div>
          </div>
          <div className="px-4 py-3">
            <p className="text-[13px] text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              {msg.sharedPost.content && msg.sharedPost.content.length > 200 ? msg.sharedPost.content.substring(0, 200) + "...more" : msg.sharedPost.content}
            </p>
          </div>
          {msg.sharedPost.image && (
            <div className="w-full bg-slate-100 dark:bg-black/50 border-t border-slate-100 dark:border-slate-800">
              <img src={msg.sharedPost.image} alt="Shared post content" className="w-full h-auto object-cover max-h-[220px]" />
            </div>
          )}
        </div>
      );
    }

    try {
      if (msg.content && typeof msg.content === 'string' && msg.content.startsWith('{"cardType":"interview_invite"')) {
        const invite = JSON.parse(msg.content);
        const inviteDate = new Date(invite.date).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
        const isProcessing = processingCardId === msg._id;
        
        return (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 w-72 md:w-80 shadow-md text-slate-800 dark:text-slate-100 flex flex-col gap-3 font-sans text-left">
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

            {/* Action buttons only for the candidate and when invite is pending */}
            {!isMe && invite.status === "pending" && (
              <div className="flex flex-col gap-2 pt-1">
                {cardError && (
                  <div className="text-[10px] text-red-500 flex items-center gap-1 font-semibold">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {cardError}
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptInvite(msg._id, invite)}
                    disabled={isProcessing}
                    className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? "Accepting..." : "Accept"}
                  </button>
                  <button
                    onClick={() => handleDeclineInvite(msg._id, invite)}
                    disabled={isProcessing}
                    className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      }
    } catch (e) {
      // Fallback
    }

    return (
      <div
        className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
          isMe
            ? "bg-blue-600 text-white rounded-tr-none"
            : "bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none"
        }`}
      >
        {msg.content}
      </div>
    );
  };

  return (
    <CandidateLayout>
      <div className="bg-white dark:bg-[#131b2f] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden h-[calc(100vh-140px)] flex">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
            <h2 className="text-lg font-bold text-[#1a2b4b] dark:text-white">Messages</h2>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm dark:text-white"
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
                      isSelected ? "bg-blue-50/40 dark:bg-blue-900/20" : ""
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
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#131b2f] rounded-full"></div>
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
                      <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 bg-blue-600 rounded-full text-[10px] font-bold text-white self-center">
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
          <>
            <div className="flex-grow flex flex-col bg-[#fcfdfd] dark:bg-[#0b1120] min-w-0">
              {/* Header */}
              <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 flex-shrink-0 bg-white dark:bg-[#131b2f]">
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
                    <p className={`text-[11px] font-medium ${isActiveOnline ? "text-emerald-500" : "text-slate-400"}`}>
                      {isActiveOnline ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowRecruiterPanel(!showRecruiterPanel)}
                    title="Toggle Recruiter Info Panel"
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-md transition-colors"
                  >
                    {showRecruiterPanel ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
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
                        <div className={`flex flex-col gap-1 ${msg.sharedPost ? 'max-w-[85%]' : 'max-w-[70%]'} ${isMe ? "items-end" : ""}`}>
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
                    <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 bg-white dark:bg-[#131b2f] border-t border-slate-200 dark:border-slate-800 flex-shrink-0"
              >
                {selectedFile && (
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs mb-3 w-max text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-750">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span className="font-medium truncate max-w-[200px]">{selectedFile.name}</span>
                    <button type="button" onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-red-500 ml-1">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
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
                    className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Recruiter Details Panel */}
            {showRecruiterPanel && activeOtherUser && (
              <div className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131b2f] flex flex-col flex-shrink-0 animate-in slide-in-from-right duration-200">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#1a2b4b] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-4 h-4 text-blue-500" />
                    Recruiter Profile
                  </h3>
                </div>

                <div className="overflow-y-auto flex-grow p-4 space-y-6">
                  {/* Basic summary */}
                  <div className="text-center">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        activeOtherUser.name || "Recruiter"
                      )}&background=0d1b2a&color=67e8f9&size=128`}
                      alt={activeOtherUser.name}
                      className="w-20 h-20 rounded-full mx-auto border-2 border-blue-500/20 shadow-sm"
                    />
                    <h4 className="text-base font-bold text-slate-800 dark:text-white mt-3 leading-snug">
                      {activeOtherUser.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold flex items-center justify-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {activeOtherUser.company || "Company not specified"}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {activeOtherUser.currentTitle || "Recruiter"}
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="border-t border-slate-100 dark:border-slate-800/85 pt-4 space-y-3">
                    <h5 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                      Contact Info
                    </h5>
                    {activeOtherUser.location && (
                      <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                        <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span>{activeOtherUser.location}</span>
                      </div>
                    )}
                    {activeOtherUser.email && (
                      <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300 truncate">
                        <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <a href={`mailto:${activeOtherUser.email}`} className="hover:underline text-blue-600 dark:text-blue-400 truncate">
                          {activeOtherUser.email}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Applied Roles */}
                  <div className="border-t border-slate-100 dark:border-slate-800/85 pt-4">
                    <h5 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                      Applied Roles
                    </h5>
                    {recruiterApps.length > 0 ? (
                      <div className="space-y-3">
                        {recruiterApps.map((app) => {
                          const job = app.jobId;
                          if (!job) return null;

                          const status = app.status || "Applied";
                          const statusConfig = {
                            "Applied": "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50",
                            "Shortlisted": "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50",
                            "Rejected": "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-800/50"
                          };
                          const badgeClass = statusConfig[status] || statusConfig["Applied"];

                          return (
                            <div key={app._id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/60 flex flex-col gap-2">
                              <div className="flex flex-col gap-0.5">
                                <a
                                  href={`/job/${job._id}`}
                                  className="text-xs font-bold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1"
                                >
                                  {job.title}
                                </a>
                                <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                                  <Briefcase className="w-3 h-3" />
                                  <span>{job.type || "Full-time"}</span>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center mt-1">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${badgeClass}`}>
                                  {status}
                                </span>
                                <span className="text-[9px] text-slate-400 font-medium">
                                  {app.createdAt ? new Date(app.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                        <Briefcase className="w-5 h-5 text-slate-300 dark:text-slate-600 mx-auto mb-1.5" />
                        <h6 className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Direct Contact</h6>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 px-3 mt-0.5">
                          No active job application found. Reached out via direct messaging.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center bg-[#fcfdfd] dark:bg-[#0b1120] text-slate-400">
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
      </div>
    </CandidateLayout>
  );
}
