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

module.exports = router;
