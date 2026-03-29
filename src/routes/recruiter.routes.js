const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");
const recruiterController = require("../controllers/recruiter.controller");

// ✅ CREATE / UPDATE recruiter profile
router.post(
  "/",
  protect,
  checkRole("recruiter"),
  recruiterController.createOrUpdateRecruiterProfile
);

// ✅ GET recruiter profile
router.get(
  "/",
  protect,
  checkRole("recruiter"),
  recruiterController.getRecruiterProfile
);

// ✅ GET all candidates (list view)
router.get(
  "/candidates",
  protect,
  checkRole("recruiter"),
  recruiterController.getAllCandidates
);

// ✅ GET single candidate profile (detailed view)
router.get(
  "/candidate/:id",
  protect,
  checkRole("recruiter"),
  recruiterController.getCandidateProfileById
);

module.exports = router;