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
      const cooldownMs = 15 * 24 * 60 * 60 * 1000; // 15 days
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

const { generateJSON } = require("../services/aiClient");

exports.evaluateMatch = async (req, res) => {
  try {
    const { candidate, job } = req.body;

    if (!candidate || !job) {
      return res.status(400).json({ success: false, message: "Missing candidate or job data" });
    }

    const hasTech = candidate.technicalScores && candidate.technicalScores.aggregate > 0;
    const hasEQ = candidate.eqScores && candidate.eqScores.aggregate > 0;

    const actualTechScore = hasTech ? candidate.technicalScores.aggregate : 0;
    const actualEqScore = hasEQ ? candidate.eqScores.aggregate : 0;

    // If both are not taken, we can skip Gemini entirely or just return -1 for all
    if (!hasTech && !hasEQ) {
      return res.json({
        success: true,
        data: {
          matchScore: -1,
          details: {
            skillsAlignmentFactor: 0,
            technicalScore: -1,
            eqScore: -1,
            totalMatchScore: -1,
            reasoning: "Candidate has not taken either the EQ Assessment or the Technical Assessment, so no fit scores can be determined."
          }
        }
      });
    }

    // Prepare prompt instructions dynamically
    let promptInstructions = "";
    if (hasTech) {
      promptInstructions += `- Analyze the Skills Alignment Factor (0 to 100%): How well do the candidate's skills and experience match the requirements and title of this job?\n`;
    } else {
      promptInstructions += `- Skills Alignment Factor: Since the candidate has not completed their Technical Assessment, set this factor to 0.\n`;
    }

    const prompt = `
You are an expert technical and behavioral recruiter.
Your task is to evaluate a candidate's fit for a specific job.

Candidate Profile:
- Name: ${candidate.name || 'Candidate'}
- Current Title: ${candidate.currentTitle || 'N/A'}
- Skills: ${candidate.skills || 'N/A'}
- Actual EQ Assessment Score: ${hasEQ ? actualEqScore + '%' : 'Not assessed yet (N/A)'}
- Actual EQ Dimension Breakdown: ${JSON.stringify(candidate.eqScores || {})}
- Actual Technical Assessment Score: ${hasTech ? actualTechScore + '%' : 'Not assessed yet (N/A)'}
- Actual Technical Dimension Breakdown: ${JSON.stringify(candidate.technicalScores || {})}

Job Profile:
- Title: ${job.title || 'Job'}
- Skills Required: ${job.skillsRequired && job.skillsRequired.length > 0 ? job.skillsRequired.join(', ') : 'Not specified'}
- Experience Level: ${job.experienceLevel || 'Not specified'}
- Description: ${job.description || 'Not specified'}

Instructions:
${promptInstructions}
- Analyze the candidate's EQ traits in relation to the job's demands and integrate this analysis into your reasoning text.
Generate an evaluation explaining the match. Write a 2-3 sentence reasoning explaining the alignment or lack thereof.

Analyze the match and provide your evaluation as a valid JSON object with the following structure:
{
  "skillsAlignmentFactor": <0-100 number>,
  "reasoning": "<A 2-3 sentence explanation explaining the match. If they have taken a test, explain how their general assessment score maps to this specific job. If they haven't taken a test, note that the assessment is pending.>"
}
`;

    const evaluation = await generateJSON(prompt);

    // Compute scores strictly in JavaScript to avoid LLM math errors
    const skillsAlignmentFactor = hasTech ? (evaluation.skillsAlignmentFactor || 0) : 0;

    const technicalScore = hasTech ? Math.round(actualTechScore * (skillsAlignmentFactor / 100)) : -1;
    const eqScore = hasEQ ? actualEqScore : -1;

    const totalMatchScore = (hasTech && hasEQ) ? Math.round(0.60 * technicalScore + 0.40 * eqScore) : -1;

    res.json({
      success: true,
      data: {
        matchScore: totalMatchScore,
        details: {
          skillsAlignmentFactor,
          technicalScore,
          eqScore,
          totalMatchScore,
          reasoning: evaluation.reasoning || ""
        }
      }
    });

  } catch (error) {
    console.error("Error evaluating match:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
