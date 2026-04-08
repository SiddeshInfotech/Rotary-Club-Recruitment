const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

// GET /api/dashboard/stats — Summary cards (Active Jobs, Total Applications, Shortlisted, Avg EQ Match)
router.get("/stats", dashboardController.getStats);

// GET /api/dashboard/jobs — Active job listings table
router.get("/jobs", dashboardController.getActiveJobListings);

// GET /api/dashboard/top-candidates — Top EQ matched candidates section
router.get("/top-candidates", dashboardController.getTopCandidates);

module.exports = router;
