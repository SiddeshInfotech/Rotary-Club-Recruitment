const express = require("express");
const router = express.Router();
const recruiterProfileController = require("../controllers/recruiterProfileController");

// POST /api/recruiter-profile             — Create a new recruiter
router.post("/", recruiterProfileController.createRecruiter);

// GET /api/recruiter-profile/:id          — Full recruiter profile
router.get("/:id", recruiterProfileController.getProfile);

// PUT /api/recruiter-profile/:id          — Update recruiter profile (Edit Profile)
router.put("/:id", recruiterProfileController.updateProfile);

// GET /api/recruiter-profile/:id/metrics  — Recruitment metrics
router.get("/:id/metrics", recruiterProfileController.getMetrics);

// GET /api/recruiter-profile/:id/jobs     — Active job listings
router.get("/:id/jobs", recruiterProfileController.getActiveJobs);

// GET /api/recruiter-profile/:id/activity — Recent activity feed
router.get("/:id/activity", recruiterProfileController.getRecentActivity);

// GET /api/recruiter-profile/:id/eq-insights — Top EQ matches
router.get("/:id/eq-insights", recruiterProfileController.getEqInsights);

module.exports = router;
