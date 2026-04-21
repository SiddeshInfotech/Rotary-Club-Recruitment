const { Message, Conversation } = require("../models/Message");
const User = require("../models/User");
const createNotification = require("../utils/createNotification");

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user.id })
      .populate("participants", "name email role").sort({ lastMessageAt: -1 });
    res.json({ success: true, count: conversations.length, data: conversations });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ success: false, message: "Conversation not found" });
    const otherUser = conversation.participants.find(p => p.toString() !== req.user.id);
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: otherUser },
        { sender: otherUser, receiver: req.user.id },
      ]
    }).sort({ createdAt: 1 })
      .populate("sender", "name")
      .populate("receiver", "name")
      .populate({ path: "sharedPost", select: "content image authorName authorAvatar authorTitle createdAt" });
    res.json({ success: true, data: messages });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content, sharedPost } = req.body;
    const messageData = { sender: req.user.id, receiver: receiverId, content };
    if (sharedPost) messageData.sharedPost = sharedPost;
    
    // We populate the sharedPost so the frontend can immediately display the rich card
    let message = await Message.create(messageData);
    if (sharedPost) {
        message = await message.populate({ path: "sharedPost", select: "content image authorName authorAvatar authorTitle createdAt" });
    }
    // Upsert conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, receiverId] }
    });
    if (!conversation) {
      conversation = await Conversation.create({ participants: [req.user.id, receiverId], lastMessage: content, lastMessageAt: new Date() });
    } else {
      conversation.lastMessage = content;
      conversation.lastMessageAt = new Date();
      conversation.unreadCount += 1;
      await conversation.save();
    }

    // Notify receiver
    if (receiverId && receiverId.toString() !== req.user.id.toString()) {
      const avatarName = encodeURIComponent(req.user.name || "User");
      await createNotification({
        user: receiverId,
        type: "message",
        title: "New Message",
        message: `${req.user.name} sent you a message: "${content.substring(0, 30)}${content.length > 30 ? '...' : ''}"`,
        link: `/messages`,
        actorName: req.user.name,
        actorAvatar: `https://ui-avatars.com/api/?name=${avatarName}&background=0F172A&color=fff&bold=true`
      });
    }

    res.status(201).json({ success: true, data: message });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
