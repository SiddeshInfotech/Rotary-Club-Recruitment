const { Message, Conversation } = require("../models/Message");
const { emitToUser } = require("../utils/socket");

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user.id })
      .populate("participants", "name email role location company currentTitle")
      .sort({ lastMessageAt: -1 });
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
    }).sort({ createdAt: 1 }).populate("sender", "name").populate("receiver", "name");
    res.json({ success: true, data: messages });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    
    // Create message
    let message = await Message.create({ sender: req.user.id, receiver: receiverId, content });
    message = await message.populate("sender", "name email role");

    // Upsert conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, receiverId] }
    });
    
    if (!conversation) {
      conversation = await Conversation.create({ 
        participants: [req.user.id, receiverId], 
        lastMessage: content, 
        lastMessageAt: new Date(),
        unreadCount: 1
      });
    } else {
      conversation.lastMessage = content;
      conversation.lastMessageAt = new Date();
      // Only increment unread count for the receiver
      conversation.unreadCount += 1;
      await conversation.save();
    }

    const populatedConversation = await Conversation.findById(conversation._id)
      .populate("participants", "name email role location company currentTitle");

    // Emit live updates to both receiver and sender (for multi-tab sync)
    emitToUser(receiverId, "new_message", { message, conversation: populatedConversation });
    emitToUser(req.user.id, "new_message", { message, conversation: populatedConversation });

    res.status(201).json({ success: true, data: message, conversation: populatedConversation });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    const otherUser = conversation.participants.find(p => p.toString() !== req.user.id);
    
    // Mark messages from the other user as read
    await Message.updateMany(
      { sender: otherUser, receiver: req.user.id, read: false },
      { $set: { read: true } }
    );

    // Reset unread count
    conversation.unreadCount = 0;
    await conversation.save();

    // Notify other user that messages are read
    emitToUser(otherUser, "messages_read", { conversationId, readBy: req.user.id });

    res.json({ success: true, message: "Conversation marked as read" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
