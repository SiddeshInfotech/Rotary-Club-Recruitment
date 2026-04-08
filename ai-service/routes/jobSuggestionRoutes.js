const express = require("express");
const router = express.Router();
const jobSuggestionController = require("../controllers/jobSuggestionController");

// GET /api/suggestions/:candidateId — Get top 5 job matches for a candidate based on AI evaluation
router.get("/:candidateId", jobSuggestionController.getJobSuggestions);

module.exports = router;
