const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, default: "" },
    authorAvatar: { type: String, default: "" },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const communityPostSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, default: "" },
    authorRole: { type: String, default: "" },
    authorTitle: { type: String, default: "" },
    authorAvatar: { type: String, default: "" },
    content: { type: String, required: true },
    image: { type: String, default: "" },
    visibility: { type: String, enum: ["anyone", "connections", "group"], default: "anyone" },
    commentControl: { type: String, enum: ["anyone", "connections", "off"], default: "anyone" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
    tags: [String],
    scheduledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CommunityPost", communityPostSchema);
