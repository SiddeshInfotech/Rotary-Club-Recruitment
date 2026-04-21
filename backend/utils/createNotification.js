const Notification = require("../models/Notification");

/**
 * Creates a notification for a user.
 * @param {Object} params
 * @param {string} params.user        - ObjectId of the user to notify
 * @param {string} params.type        - Notification type (job, interview, message, network, community, info, success, warning, system)
 * @param {string} params.title       - Notification title / headline
 * @param {string} [params.message]   - Optional longer description
 * @param {string} [params.link]      - Optional URL/path to navigate to
 * @param {string} [params.actorName] - Name of the person who triggered the notification
 * @param {string} [params.actorAvatar] - Avatar URL of the actor
 */
async function createNotification({ user, type, title, message, link, actorName, actorAvatar }) {
  try {
    if (!user || !title) return null;
    const notification = await Notification.create({
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
