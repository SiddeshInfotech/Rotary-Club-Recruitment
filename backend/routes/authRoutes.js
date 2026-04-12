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

// POST /api/auth/forgot-password
router.post("/forgot-password", authController.forgotPassword);

// POST /api/auth/reset-password/:token
router.post("/reset-password", authController.resetPassword);

// POST /api/auth/verify-reset-otp
router.post("/verify-reset-otp", authController.verifyResetOtp);

module.exports = router;
