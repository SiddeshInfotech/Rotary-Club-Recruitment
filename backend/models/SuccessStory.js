const mongoose = require("mongoose");

const successStorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, default: "" },
    authorRole: { type: String, default: "" },
    authorAvatar: { type: String, default: "" },
    summary: { type: String, default: "" },
    content: { type: String, default: "" },
    image: { type: String, default: "" },
    club: { type: String, default: "" },
    tags: [String],
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SuccessStory", successStorySchema);
