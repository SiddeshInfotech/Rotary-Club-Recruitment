const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const profileController = require("../controllers/profileController");

// POST /api/profile (create or update)
router.post("/", protect, profileController.createOrUpdateProfile);

// GET /api/profile
router.get("/", protect, profileController.getProfile);

// PUT /api/profile (update)
router.put("/", protect, profileController.createOrUpdateProfile);

module.exports = router;
