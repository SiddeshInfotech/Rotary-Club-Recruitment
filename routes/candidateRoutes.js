const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");

// GET  /api/candidates      — List all candidates
// POST /api/candidates      — Create a candidate
router
  .route("/")
  .get(candidateController.getAllCandidates)
  .post(candidateController.createCandidate);

// GET /api/candidates/:id   — Get single candidate
router.route("/:id").get(candidateController.getCandidateById);

module.exports = router;
