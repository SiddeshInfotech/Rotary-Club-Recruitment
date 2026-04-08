const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const communityController = require("../controllers/communityController");

router.get("/", protect, communityController.getAllPosts);
router.post("/", protect, communityController.createPost);
router.patch("/:id/like", protect, communityController.likePost);

module.exports = router;
