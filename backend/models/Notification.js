const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, default: "" },
    type: { type: String, enum: ["info", "success", "warning", "job", "interview", "message", "network", "community", "system"], default: "info" },
    read: { type: Boolean, default: false },
    link: { type: String, default: "" },
    actorName: { type: String, default: "" },
    actorAvatar: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
