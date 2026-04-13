const Candidate = require("../models/CandidateRef");
const Assessment = require("../models/Assessment");
const { generateQuestions } = require("../services/questionGenerator");
const { evaluateAnswers } = require("../services/answerEvaluator");

/**
 * POST /api/assessment/generate/:candidateId
 *
 * Reads the candidate's skills from the database, sends them to Gemini,
 * and returns 30 tailored EQ assessment questions.
 * Also creates an Assessment record in "pending" status.
 */
exports.generateAssessment = async (req, res) => {
  try {
    const { candidateId } = req.params;

    // 1. Fetch candidate from the shared MongoDB
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    if (!candidate.skills || candidate.skills.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Candidate has no skills listed. Please update the candidate profile with skills before generating an assessment.",
      });
    }

    // 2.5. Enforce 30-day cooldown between assessments
    const lastCompleted = await Assessment.findOne({
      candidateId,
      status: "completed",
    }).sort({ completedAt: -1 });

    if (lastCompleted && lastCompleted.completedAt) {
      const cooldownMs = 30 * 24 * 60 * 60 * 1000; // 30 days
      const timeSince = Date.now() - new Date(lastCompleted.completedAt).getTime();
      if (timeSince < cooldownMs) {
        const nextEligible = new Date(new Date(lastCompleted.completedAt).getTime() + cooldownMs);
        const daysLeft = Math.ceil((cooldownMs - timeSince) / (24 * 60 * 60 * 1000));
        return res.status(429).json({
          success: false,
          message: `You can retake the assessment in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}. Next eligible date: ${nextEligible.toLocaleDateString()}.`,
          data: {
            daysRemaining: daysLeft,
            nextEligibleDate: nextEligible.toISOString(),
            lastCompletedAt: lastCompleted.completedAt,
          },
        });
      }
    }

    // 2. Generate questions using Gemini AI
    console.log(
      `Generating EQ questions for candidate: ${candidate.name} (${candidateId})`
    );
    const questions = await generateQuestions(candidate);

    // 3. Create an Assessment record
    const assessment = await Assessment.create({
      candidateId,
      questions: questions.map((q) => ({
        id: q.id,
        question: q.question,
        dimension: q.dimension,
        options: q.options,
        context: q.context || "",
      })),
      status: "pending",
    });

    // 4. Return the questions to the client
    res.status(201).json({
      success: true,
      message: `Generated ${questions.length} EQ assessment questions`,
      data: {
        assessmentId: assessment._id,
        candidateId,
        candidateName: candidate.name,
        candidateSkills: candidate.skills,
        totalQuestions: questions.length,
        questions: questions,
      },
    });
  } catch (error) {
    console.error("Error generating assessment:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * POST /api/assessment/evaluate/:assessmentId
 *
 * Receives the candidate's answers, sends them to Gemini for evaluation,
 * computes EQ scores, writes them back to the Candidate record,
 * and updates the Assessment with full results.
 *
 * Request body:
 * {
 *   "answers": [
 *     { "questionId": 1, "answer": "My response to question 1..." },
 *     { "questionId": 2, "answer": "My response to question 2..." },
 *     ...
 *   ]
 * }
 */
exports.evaluateAssessment = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an 'answers' array in the request body",
      });
    }

    // 1. Fetch the assessment
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

    if (assessment.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "This assessment has already been completed",
        data: {
          finalScores: assessment.finalScores,
          summary: assessment.summary,
        },
      });
    }

    // 2. Merge answers into the assessment questions
    const answeredQuestions = assessment.questions.map((q) => {
      const userAnswer = answers.find((a) => a.questionId === q.id);
      return {
        id: q.id,
        question: q.question,
        dimension: q.dimension,
        options: q.options,
        answer: userAnswer ? userAnswer.answer : "No answer provided",
      };
    });

    // 3. Update assessment status to in_progress
    assessment.status = "in_progress";
    await assessment.save();

    // 4. Send to Gemini for evaluation
    console.log(
      `Evaluating ${answeredQuestions.length} answers for assessment: ${assessmentId}`
    );
    const evaluation = await evaluateAnswers(
      assessment.candidateId,
      answeredQuestions
    );

    // 5. Update the Assessment record with results
    // Merge individual scores and answers back into questions
    assessment.questions = assessment.questions.map((q) => {
      const userAnswer = answers.find((a) => a.questionId === q.id);
      const indScore = evaluation.individualScores.find(
        (s) => s.questionId === q.id
      );
      return {
        ...q.toObject(),
        answer: userAnswer ? userAnswer.answer : "",
        score: indScore ? indScore.score : 0,
        feedback: indScore ? indScore.feedback : "",
      };
    });

    assessment.finalScores = {
      ...evaluation.dimensionScores,
      overall: evaluation.overallScore,
    };
    assessment.summary = evaluation.summary;
    assessment.status = "completed";
    assessment.completedAt = new Date();
    await assessment.save();

    // 6. Return evaluation results
    res.json({
      success: true,
      message: "Assessment evaluated successfully. EQ scores updated on candidate profile.",
      data: {
        assessmentId: assessment._id,
        candidateId: assessment.candidateId,
        dimensionScores: evaluation.dimensionScores,
        overallScore: evaluation.overallScore,
        summary: evaluation.summary,
        individualScores: evaluation.individualScores,
      },
    });
  } catch (error) {
    console.error("Error evaluating assessment:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /api/assessment/history/:candidateId
 *
 * Returns all past assessments for a candidate.
 */
exports.getAssessmentHistory = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const assessments = await Assessment.find({ candidateId })
      .sort({ createdAt: -1 })
      .select("-questions.answer -questions.feedback"); // Lightweight response

    res.json({
      success: true,
      count: assessments.length,
      data: assessments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /api/assessment/status/:candidateId
 *
 * Quick check — has this candidate completed an EQ assessment?
 */
exports.getAssessmentStatus = async (req, res) => {
  try {
    const { candidateId } = req.params;

    // Check if candidate exists
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    // Find the latest assessment
    const latestAssessment = await Assessment.findOne({ candidateId })
      .sort({ createdAt: -1 })
      .select("status finalScores completedAt createdAt");

    const hasCompletedAssessment =
      latestAssessment && latestAssessment.status === "completed";

    res.json({
      success: true,
      data: {
        candidateId,
        candidateName: candidate.name,
        hasCompletedAssessment,
        currentEqScores: candidate.eqScores,
        latestAssessment: latestAssessment
          ? {
              assessmentId: latestAssessment._id,
              status: latestAssessment.status,
              finalScores: latestAssessment.finalScores,
              completedAt: latestAssessment.completedAt,
              startedAt: latestAssessment.createdAt,
            }
          : null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /api/assessment/:assessmentId
 *
 * Get full details of a specific assessment (including questions, answers, and scores).
 */
exports.getAssessmentById = async (req, res) => {
  try {
    const { assessmentId } = req.params;

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

    res.json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
