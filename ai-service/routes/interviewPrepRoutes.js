const express = require("express");
const router = express.Router();
const interviewPrepController = require("../controllers/interviewPrepController");

router.post("/generate/:candidateId", interviewPrepController.generatePrep);
router.get("/:candidateId", interviewPrepController.getCachedPrep);

module.exports = router;
