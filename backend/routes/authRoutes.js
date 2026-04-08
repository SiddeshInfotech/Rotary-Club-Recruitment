const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const protect = require("../middleware/auth");

// POST /api/auth/register
router.post("/register", authController.register);

// POST /api/auth/login
router.post("/login", authController.login);

// GET /api/auth/me (protected)
router.get("/me", protect, authController.getMe);

// PUT /api/auth/me (protected)
router.put("/me", protect, authController.updateMe);

// POST /api/auth/verify-otp
router.post("/verify-otp", authController.verifyOtp);

// POST /api/auth/resend-otp
router.post("/resend-otp", authController.resendOtp);

module.exports = router;
