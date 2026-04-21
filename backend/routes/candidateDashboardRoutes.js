const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const candidateDashboardController = require("../controllers/candidateDashboardController");

// GET /api/candidate-dashboard — All dashboard metrics (EQ scores, elite score, rank, etc.)
router.get("/", protect, candidateDashboardController.getDashboardData);

// GET /api/candidate-dashboard/applications — Candidate's own applications
router.get("/applications", protect, candidateDashboardController.getMyApplications);

// GET /api/candidate-dashboard/match-scores?jobIds=id1,id2 — Real match scores for jobs
router.get("/match-scores", protect, candidateDashboardController.getMatchScores);

// POST /api/candidate-dashboard/start-trial — Activate free 1-month trial
router.post("/start-trial", protect, candidateDashboardController.startTrial);

// POST /api/candidate-dashboard/create-order — Create a Razorpay order for premium upgrade
router.post("/create-order", protect, candidateDashboardController.createOrder);

// POST /api/candidate-dashboard/verify-payment — Verify Razorpay signature & activate premium
router.post("/verify-payment", protect, candidateDashboardController.verifyPayment);

module.exports = router;
