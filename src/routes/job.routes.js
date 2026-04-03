const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");
const jobController = require("../controllers/job.controller");

// ✅ PUBLIC ROUTES (MUST BE FIRST)
router.get("/search", jobController.searchJobs);
router.get("/job/:id", jobController.getJobDetails);

// ✅ PROTECTED ROUTES
router.get("/", protect, jobController.getAllJobs);

router.get(
  "/my",
  protect,
  checkRole("recruiter"),
  jobController.getMyJobs
);

router.get(
  "/:jobId/match",
  protect,
  checkRole("candidate"),
  jobController.getMatchScore
);

router.post(
  "/",
  protect,
  checkRole("recruiter"),
  jobController.createJob
);

module.exports = router;