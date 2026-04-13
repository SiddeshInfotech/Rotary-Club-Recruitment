const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const protect = require("../middleware/auth");

// --- Registration & Login ---
router.post("/register", authController.register);
router.post("/login", authController.login);

// --- OTP Verification (New Logic: Saves user to DB only here) ---
// Make sure your frontend calls: api.post('/auth/verify-otp', { otp, signupToken })
router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-otp", authController.resendOtp);

// --- Password Reset Flow (OTP-based) ---
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-reset-otp", authController.verifyResetOtp);
router.post("/reset-password", authController.resetPassword);

// --- Profile Management ---
router.get("/me", protect, authController.getMe);
router.put("/me", protect, authController.updateMe);

module.exports = router;