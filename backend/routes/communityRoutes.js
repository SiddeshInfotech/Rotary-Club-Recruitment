const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const communityController = require("../controllers/communityController");

router.get("/", protect, communityController.getAllPosts);
router.get("/scheduled", protect, communityController.getScheduledPosts);
router.post("/", protect, communityController.createPost);
router.put("/:id", protect, communityController.updatePost);
router.patch("/:id/like", protect, communityController.toggleLike);
router.post("/:id/comments", protect, communityController.addComment);
router.post("/:id/repost", protect, communityController.repostPost);
router.delete("/:id", protect, communityController.deletePost);

module.exports = router;
