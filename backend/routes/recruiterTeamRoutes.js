const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const checkRole = require("../middleware/role");
const recruiterTeamController = require("../controllers/recruiterTeamController");

// POST /api/recruiter (create or update recruiter profile)
router.post("/", protect, checkRole("recruiter"), recruiterTeamController.createOrUpdateRecruiterProfile);

// GET /api/recruiter (get recruiter profile)
router.get("/", protect, checkRole("recruiter"), recruiterTeamController.getRecruiterProfile);

// PUT /api/recruiter (update recruiter profile)
router.put("/", protect, checkRole("recruiter"), recruiterTeamController.createOrUpdateRecruiterProfile);

// GET /api/recruiter/candidates (view all candidates - list)
router.get("/candidates", protect, checkRole("recruiter"), recruiterTeamController.getAllCandidates);

// GET /api/recruiter/candidate/:id (view single candidate profile - detailed)
router.get("/candidate/:id", protect, checkRole("recruiter"), recruiterTeamController.getCandidateProfileById);

module.exports = router;
