const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const interviewController = require("../controllers/interviewController");

router.get("/", protect, interviewController.getInterviews);
router.post("/", protect, interviewController.createInterview);
router.put("/:id", protect, interviewController.updateInterview);
router.patch("/:id/cancel", protect, interviewController.cancelInterview);

module.exports = router;
