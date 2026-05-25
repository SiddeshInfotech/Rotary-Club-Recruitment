const express = require("express");
const router = express.Router();
const techAssessmentController = require("../controllers/techAssessmentController");

// POST /api/tech-assessment/generate/:candidateId — Generate 25 technical questions for a candidate
router.post("/generate/:candidateId", techAssessmentController.generateTechAssessment);

// POST /api/tech-assessment/evaluate/:assessmentId — Submit answers & get technical scores
router.post("/evaluate/:assessmentId", techAssessmentController.evaluateTechAssessment);

// GET /api/tech-assessment/history/:candidateId — Get all past technical assessments for a candidate
router.get("/history/:candidateId", techAssessmentController.getTechAssessmentHistory);

// GET /api/tech-assessment/status/:candidateId — Check if candidate has completed technical assessment
router.get("/status/:candidateId", techAssessmentController.getTechAssessmentStatus);

// GET /api/tech-assessment/:assessmentId — Get full technical assessment details
router.get("/:assessmentId", techAssessmentController.getTechAssessmentById);

module.exports = router;
