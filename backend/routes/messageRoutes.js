const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const messageController = require("../controllers/messageController");

router.get("/conversations", protect, messageController.getConversations);
router.get("/conversations/:conversationId", protect, messageController.getMessages);
router.post("/send", protect, messageController.sendMessage);
router.put("/conversations/:conversationId/read", protect, messageController.markAsRead);

module.exports = router;
