const express = require("express");
const router = express.Router();
const assessmentController = require("../controllers/assessmentController");

// POST /api/assessment/generate/:candidateId — Generate 30 EQ questions for a candidate
router.post("/generate/:candidateId", assessmentController.generateAssessment);

// POST /api/assessment/evaluate/:assessmentId — Submit answers & get EQ scores
router.post("/evaluate/:assessmentId", assessmentController.evaluateAssessment);

// GET /api/assessment/history/:candidateId — Get all past assessments for a candidate
router.get("/history/:candidateId", assessmentController.getAssessmentHistory);

// GET /api/assessment/status/:candidateId — Check if candidate has completed assessment
router.get("/status/:candidateId", assessmentController.getAssessmentStatus);

// GET /api/assessment/:assessmentId — Get full assessment details
router.get("/:assessmentId", assessmentController.getAssessmentById);

// POST /api/assessment/generate-insights — Generate deep EQ insights from scores
router.post("/generate-insights", assessmentController.generateInsights);

module.exports = router;
