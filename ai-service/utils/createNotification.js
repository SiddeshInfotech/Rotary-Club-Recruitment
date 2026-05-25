const NotificationRef = require("../models/NotificationRef");

async function createNotification({ user, type, title, message, link, actorName, actorAvatar }) {
  try {
    if (!user || !title) return null;
    const notification = await NotificationRef.create({
      user,
      type: type || "info",
      title,
      message: message || "",
      link: link || "",
      actorName: actorName || "",
      actorAvatar: actorAvatar || "",
    });
    return notification;
  } catch (err) {
    console.error("Failed to create notification:", err.message);
    return null;
  }
}

module.exports = createNotification;
