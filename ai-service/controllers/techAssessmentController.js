const Candidate = require("../models/CandidateRef");
const TechnicalAssessment = require("../models/TechnicalAssessment");
const { generateTechQuestions } = require("../services/techQuestionGenerator");
const { evaluateTechAnswers } = require("../services/techAnswerEvaluator");

/**
 * POST /api/tech-assessment/generate/:candidateId
 *
 * Reads the candidate's skills from the database, sends them to the AI,
 * and returns 25 tailored technical assessment questions.
 * Also creates a TechnicalAssessment record in "pending" status.
 */
exports.generateTechAssessment = async (req, res) => {
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
          "Candidate has no skills listed. Please update the candidate profile with skills before generating a technical assessment.",
      });
    }

    // 2. Enforce 30-day cooldown between technical assessments
    const lastCompleted = await TechnicalAssessment.findOne({
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
          message: `You can retake the technical assessment in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}. Next eligible date: ${nextEligible.toLocaleDateString()}.`,
          data: {
            daysRemaining: daysLeft,
            nextEligibleDate: nextEligible.toISOString(),
            lastCompletedAt: lastCompleted.completedAt,
          },
        });
      }
    }

    // 3. Generate questions using AI
    console.log(
      `Generating technical questions for candidate: ${candidate.name} (${candidateId})`
    );
    const questions = await generateTechQuestions(candidate);

    // 4. Create a TechnicalAssessment record
    const assessment = await TechnicalAssessment.create({
      candidateId,
      questions: questions.map((q) => ({
        id: q.id,
        question: q.question,
        dimension: q.dimension,
        difficulty: q.difficulty,
        codeSnippet: q.codeSnippet || "",
        codeLanguage: q.codeLanguage || "",
        options: q.options,
      })),
      status: "pending",
    });

    // 5. Return the questions to the client
    res.status(201).json({
      success: true,
      message: `Generated ${questions.length} technical assessment questions`,
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
    console.error("Error generating technical assessment:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * POST /api/tech-assessment/evaluate/:assessmentId
 *
 * Receives the candidate's answers, evaluates them using pre-assigned scores,
 * computes technical dimension scores, writes them back to the Candidate record,
 * and updates the TechnicalAssessment with full results.
 *
 * Request body:
 * {
 *   "answers": [
 *     { "questionId": 1, "answer": "B" },
 *     { "questionId": 2, "answer": "A" },
 *     ...
 *   ]
 * }
 */
exports.evaluateTechAssessment = async (req, res) => {
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
    const assessment = await TechnicalAssessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Technical assessment not found",
      });
    }

    if (assessment.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "This technical assessment has already been completed",
        data: {
          finalScores: assessment.finalScores,
          proficiencyLevel: assessment.proficiencyLevel,
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
        difficulty: q.difficulty,
        options: q.options,
        answer: userAnswer ? userAnswer.answer : "No answer provided",
      };
    });

    // 3. Update assessment status to in_progress
    assessment.status = "in_progress";
    await assessment.save();

    // 4. Evaluate answers
    console.log(
      `Evaluating ${answeredQuestions.length} technical answers for assessment: ${assessmentId}`
    );
    const evaluation = await evaluateTechAnswers(
      assessment.candidateId,
      answeredQuestions
    );

    // 5. Update the TechnicalAssessment record with results
    assessment.questions = assessment.questions.map((q) => {
      const userAnswer = answers.find((a) => a.questionId === q.id);
      const indScore = evaluation.individualScores.find(
        (s) => s.questionId === q.id
      );
      return {
        ...q.toObject(),
        selectedOption: userAnswer ? userAnswer.answer : "",
        score: indScore ? indScore.score : 0,
        feedback: indScore ? indScore.feedback : "",
      };
    });

    assessment.finalScores = {
      ...evaluation.dimensionScores,
      overall: evaluation.overallScore,
    };
    assessment.proficiencyLevel = evaluation.proficiencyLevel;
    assessment.summary = evaluation.summary;
    assessment.status = "completed";
    assessment.completedAt = new Date();
    await assessment.save();

    // 6. Return evaluation results
    res.json({
      success: true,
      message: "Technical assessment evaluated successfully. Technical scores updated on candidate profile.",
      data: {
        assessmentId: assessment._id,
        candidateId: assessment.candidateId,
        dimensionScores: evaluation.dimensionScores,
        overallScore: evaluation.overallScore,
        proficiencyLevel: evaluation.proficiencyLevel,
        summary: evaluation.summary,
        individualScores: evaluation.individualScores,
      },
    });
  } catch (error) {
    console.error("Error evaluating technical assessment:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /api/tech-assessment/history/:candidateId
 *
 * Returns all past technical assessments for a candidate.
 */
exports.getTechAssessmentHistory = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const assessments = await TechnicalAssessment.find({ candidateId })
      .sort({ createdAt: -1 })
      .select("-questions.selectedOption -questions.feedback");

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
 * GET /api/tech-assessment/status/:candidateId
 *
 * Quick check — has this candidate completed a Technical assessment?
 */
exports.getTechAssessmentStatus = async (req, res) => {
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

    // Find the latest technical assessment
    const latestAssessment = await TechnicalAssessment.findOne({ candidateId })
      .sort({ createdAt: -1 })
      .select("status finalScores proficiencyLevel completedAt createdAt");

    const hasCompletedAssessment =
      latestAssessment && latestAssessment.status === "completed";

    res.json({
      success: true,
      data: {
        candidateId,
        candidateName: candidate.name,
        hasCompletedAssessment,
        currentTechnicalScores: candidate.technicalScores,
        latestAssessment: latestAssessment
          ? {
              assessmentId: latestAssessment._id,
              status: latestAssessment.status,
              finalScores: latestAssessment.finalScores,
              proficiencyLevel: latestAssessment.proficiencyLevel,
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
 * GET /api/tech-assessment/:assessmentId
 *
 * Get full details of a specific technical assessment.
 */
exports.getTechAssessmentById = async (req, res) => {
  try {
    const { assessmentId } = req.params;

    const assessment = await TechnicalAssessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Technical assessment not found",
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
