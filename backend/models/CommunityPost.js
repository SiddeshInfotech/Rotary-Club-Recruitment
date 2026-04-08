const mongoose = require("mongoose");

const communityPostSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, default: "" },
    authorRole: { type: String, default: "" },
    authorAvatar: { type: String, default: "" },
    content: { type: String, required: true },
    image: { type: String, default: "" },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CommunityPost", communityPostSchema);
