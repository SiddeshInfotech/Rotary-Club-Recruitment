const mongoose = require("mongoose");
const { Message, Conversation, LegacyMessage } = require("../models/Message");
const { emitToUser } = require("../utils/socket");

// Helper to dynamically migrate old messages into buckets
const migrateLegacyMessages = async (conversationId, user1Id, user2Id) => {
  try {
    const user1 = new mongoose.Types.ObjectId(user1Id.toString());
    const user2 = new mongoose.Types.ObjectId(user2Id.toString());

    // Fetch any legacy messages between these two users
    const legacyMsgs = await LegacyMessage.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ createdAt: 1 });

    if (!legacyMsgs || legacyMsgs.length === 0) return;

    console.log(`[Migration] Migrating ${legacyMsgs.length} messages for conversation ${conversationId}`);

    const bucketsToCreate = [];
    let currentBucketMessages = [];
    let bucketNumber = 0;

    for (const msg of legacyMsgs) {
      currentBucketMessages.push({
        _id: msg._id,
        sender: msg.sender,
        receiver: msg.receiver,
        content: msg.content,
        read: msg.read,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt
      });

      if (currentBucketMessages.length === 100) {
        bucketsToCreate.push({
          conversationId,
          bucketNumber,
          messageCount: 100,
          messages: currentBucketMessages,
        });
        currentBucketMessages = [];
        bucketNumber++;
      }
    }

    if (currentBucketMessages.length > 0) {
      bucketsToCreate.push({
        conversationId,
        bucketNumber,
        messageCount: currentBucketMessages.length,
        messages: currentBucketMessages,
      });
    }

    // Insert all created buckets into message_buckets
    await Message.insertMany(bucketsToCreate);

    // Delete legacy messages so they aren't processed again
    await LegacyMessage.deleteMany({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    });

    console.log(`[Migration] Successfully migrated ${legacyMsgs.length} messages into ${bucketsToCreate.length} bucket(s).`);
  } catch (err) {
    console.error("[Migration] Error during legacy message migration:", err);
  }
};

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

    // Fetch all message buckets for this conversation
    let buckets = await Message.find({ conversationId }).sort({ bucketNumber: 1 });

    if (!buckets || buckets.length === 0) {
      const otherUser = conversation.participants.find(p => p.toString() !== req.user.id);
      await migrateLegacyMessages(conversation._id, req.user.id, otherUser);
      // Re-fetch buckets
      buckets = await Message.find({ conversationId })
        .sort({ bucketNumber: 1 })
        .populate("messages.sender", "name")
        .populate("messages.receiver", "name")
        .populate({ path: "messages.sharedPost", select: "content image authorName authorAvatar authorTitle createdAt" });
    } else {
      // Populate sender/receiver/sharedPost for existing buckets
      buckets = await Message.populate(buckets, [
        { path: "messages.sender", select: "name" },
        { path: "messages.receiver", select: "name" },
        { path: "messages.sharedPost", select: "content image authorName authorAvatar authorTitle createdAt" }
      ]);
    }

    // Flatten all messages from all buckets
    let messages = [];
    buckets.forEach(bucket => {
      messages = messages.concat(bucket.messages);
    });

    res.json({ success: true, data: messages });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content, sharedPost } = req.body;
    
    // Create or find conversation
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

    // Build the new message object
    const messageId = new mongoose.Types.ObjectId();
    const newMessage = {
      _id: messageId,
      sender: req.user.id,
      receiver: receiverId,
      content,
      read: false,
      createdAt: new Date()
    };
    if (sharedPost) {
      newMessage.sharedPost = sharedPost;
    }

    // Find the latest message bucket or create one if full (max 100 messages)
    let bucket = await Message.findOne({ conversationId: conversation._id })
      .sort({ bucketNumber: -1 });

    if (!bucket) {
      // Migrate any legacy messages first
      await migrateLegacyMessages(conversation._id, req.user.id, receiverId);
      // Re-query the latest bucket
      bucket = await Message.findOne({ conversationId: conversation._id })
        .sort({ bucketNumber: -1 });
    }

    if (!bucket || bucket.messages.length >= 100) {
      const nextBucketNumber = bucket ? bucket.bucketNumber + 1 : 0;
      bucket = await Message.create({
        conversationId: conversation._id,
        bucketNumber: nextBucketNumber,
        messages: [newMessage],
        messageCount: 1
      });
    } else {
      bucket.messages.push(newMessage);
      bucket.messageCount += 1;
      await bucket.save();
    }

    // Populate sender info for Socket.io / Response format
    const populatedBucket = await Message.populate(bucket, [
      { path: "messages.sender", select: "name email role" },
      { path: "messages.sharedPost", select: "content image authorName authorAvatar authorTitle createdAt" }
    ]);

    // Find the message we just added
    const savedMessage = populatedBucket.messages.find(m => m._id.toString() === messageId.toString());

    const populatedConversation = await Conversation.findById(conversation._id)
      .populate("participants", "name email role location company currentTitle");

    // Generate a notification for the receiver
    const createNotification = require("../utils/createNotification");
    const senderName = req.user.name || "A user";
    
    const receiver = populatedConversation.participants.find(p => p._id.toString() === receiverId.toString());
    const receiverRole = receiver ? receiver.role : "candidate";
    const linkPath = receiverRole === "recruiter" ? "/recruiter/messages" : "/candidate/messages";

    await createNotification({
      user: receiverId,
      type: "message",
      title: "New Message",
      message: `${senderName} sent you a direct message.`,
      actorName: senderName,
      link: linkPath
    });

    // Emit live updates to both receiver and sender (for multi-tab sync)
    emitToUser(receiverId, "new_message", { message: savedMessage, conversation: populatedConversation });
    emitToUser(req.user.id, "new_message", { message: savedMessage, conversation: populatedConversation });

    res.status(201).json({ success: true, data: savedMessage, conversation: populatedConversation });
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
    const otherUserId = new mongoose.Types.ObjectId(otherUser.toString());
    
    // Mark messages from the other user as read in all buckets for this conversation
    await Message.updateMany(
      { conversationId, "messages.sender": otherUserId, "messages.read": false },
      { $set: { "messages.$[elem].read": true } },
      { arrayFilters: [{ "elem.sender": otherUserId, "elem.read": false }] }
    );

    // Reset unread count
    conversation.unreadCount = 0;
    await conversation.save();

    // Notify other user that messages are read
    emitToUser(otherUser.toString(), "messages_read", { conversationId, readBy: req.user.id });

    res.json({ success: true, message: "Conversation marked as read" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
