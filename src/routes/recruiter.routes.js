const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware"); // ✅ IMPORTANT
const recruiterController = require("../controllers/recruiter.controller");

// CREATE / UPDATE recruiter profile
router.post(
  "/",
  protect,
  checkRole("recruiter"), // ✅ only recruiter allowed
  recruiterController.createOrUpdateRecruiterProfile
);

// GET recruiter profile
router.get(
  "/",
  protect,
  checkRole("recruiter"),
  recruiterController.getRecruiterProfile
);

// UPDATE recruiter profile
router.put(
  "/",
  protect,
  checkRole("recruiter"),
  recruiterController.createOrUpdateRecruiterProfile
);

// VIEW ALL STUDENTS
router.get(
  "/candidates",
  protect,
  checkRole("recruiter"),
  recruiterController.getAllCandidates
);

module.exports = router;