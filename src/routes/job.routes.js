const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");

const jobController = require("../controllers/job.controller");

// ✅ CREATE JOB (Recruiter only)
router.post(
  "/",
  protect,
  checkRole("recruiter"),
  jobController.createJob
);

// ✅ GET ALL JOBS (Candidate)
router.get("/", protect, jobController.getAllJobs);

// ✅ GET MY JOBS (Recruiter)
router.get(
  "/my",
  protect,
  checkRole("recruiter"),
  jobController.getMyJobs
);

module.exports = router;