const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const profileController = require("../controllers/profile.controller");

// CREATE or UPDATE profile
router.post("/", protect, profileController.createOrUpdateProfile);

// GET profile
router.get("/", protect, profileController.getProfile);

// ✅ ADD THIS (IMPORTANT)
router.put("/", protect, profileController.createOrUpdateProfile);

module.exports = router;