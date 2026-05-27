const mongoose = require("mongoose");

const singleMessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    sharedPost: { type: mongoose.Schema.Types.ObjectId, ref: "CommunityPost" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const messageBucketSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
    bucketNumber: { type: Number, default: 0, required: true },
    messageCount: { type: Number, default: 0 },
    messages: [singleMessageSchema],
  },
  { timestamps: true }
);

// Compound index for fast lookup of conversation buckets in reverse chronological order
messageBucketSchema.index({ conversationId: 1, bucketNumber: -1 }, { unique: true });

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    lastMessage: { type: String, default: "" },
    lastMessageAt: { type: Date, default: Date.now },
    unreadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Specify the collection 'message_buckets' to keep new bucket data isolated
const Message = mongoose.model("Message", messageBucketSchema, "message_buckets");
const Conversation = mongoose.model("Conversation", conversationSchema);

// Define legacy schema matching the old flat layout on 'messages' collection
const legacyMessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    sharedPost: { type: mongoose.Schema.Types.ObjectId, ref: "CommunityPost" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const LegacyMessage = mongoose.model("LegacyMessage", legacyMessageSchema, "messages");

module.exports = { Message, Conversation, LegacyMessage };
