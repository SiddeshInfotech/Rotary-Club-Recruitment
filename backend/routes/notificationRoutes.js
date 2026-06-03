const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const notificationController = require("../controllers/notificationController");

router.get("/", protect, notificationController.getNotifications);
router.patch("/read", protect, notificationController.markAsRead);
router.patch("/:id/read", protect, notificationController.markOneAsRead);
router.delete("/:id", protect, notificationController.deleteNotification);

module.exports = router;
