const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const storyController = require("../controllers/storyController");

router.get("/", protect, storyController.getAllStories);
router.get("/:id", protect, storyController.getStoryById);
router.post("/", protect, storyController.createStory);

module.exports = router;
