const User = require("../models/CandidateRef");
const CandidateProfile = require("../models/CandidateProfileRef");
const createNotification = require("../utils/createNotification");

/**
 * Evaluate a candidate's answers to Technical Skills assessment MCQs.
 *
 * This function:
 * 1. Iterates over answered questions and finds the pre-assigned option score
 * 2. Computes dimension-level scores (0-100 scale) for each technical dimension
 * 3. Determines a proficiency level based on overall score
 * 4. Writes the scores back to BOTH the User and CandidateProfile records
 * 5. Returns the detailed evaluation
 *
 * Scoring is weighted by difficulty:
 * - Easy questions: max 5 points each
 * - Medium questions: max 8 points each
 * - Hard questions: max 10 points each
 *
 * @param {string} candidateId - MongoDB ObjectId of the candidate
 * @param {object[]} answeredQuestions - Array of questions with selected 'answer' (option id)
 * @returns {object} Evaluation results with scores and proficiency level
 */
const evaluateTechAnswers = async (candidateId, answeredQuestions) => {
  if (!answeredQuestions || answeredQuestions.length === 0) {
    throw new Error("No answered questions provided");
  }

  const maxScoreByDifficulty = { easy: 5, medium: 8, hard: 10 };

  const dimensionTotals = {};
  const dimensionMax = {};
  const individualScores = [];

  // Calculate scores directly from predefined MCQ weights
  for (const q of answeredQuestions) {
    const dim = q.dimension;
    const difficulty = q.difficulty || "medium";

    if (!dimensionTotals[dim]) {
      dimensionTotals[dim] = 0;
      dimensionMax[dim] = 0;
    }

    const maxForQuestion = maxScoreByDifficulty[difficulty] || 8;
    dimensionMax[dim] += maxForQuestion;

    let score = 0;
    // q.answer contains the selected option ID (e.g., 'A', 'B')
    if (q.options && q.answer) {
      const selectedOpt = q.options.find((opt) => opt.id === q.answer);
      if (selectedOpt) {
        score = selectedOpt.score;
      }
    }

    dimensionTotals[dim] += score;

    individualScores.push({
      questionId: q.id,
      dimension: dim,
      difficulty: difficulty,
      score: score,
      maxScore: maxForQuestion,
      feedback: `Selected option scored ${score}/${maxForQuestion} points (${difficulty} difficulty).`,
    });
  }

  // Initialize all 5 technical dimensions
  const finalScores = {
    fundamentals: 0,
    architecture: 0,
    debugging: 0,
    bestPractices: 0,
    tooling: 0,
  };

  let totalScore = 0;
  let totalMax = 0;

  // Convert to 0-100 scale per dimension
  for (const [dim, total] of Object.entries(dimensionTotals)) {
    const max = dimensionMax[dim];
    const percentage = Math.round((total / max) * 100);
    if (finalScores[dim] !== undefined) {
      finalScores[dim] = Math.max(0, Math.min(100, percentage));
    }

    totalScore += total;
    totalMax += max;
  }

  const overallScore = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
  finalScores.aggregate = overallScore;

  // Determine proficiency level based on overall score
  let proficiencyLevel = "beginner";
  if (overallScore >= 90) {
    proficiencyLevel = "expert";
  } else if (overallScore >= 70) {
    proficiencyLevel = "advanced";
  } else if (overallScore >= 45) {
    proficiencyLevel = "intermediate";
  }

  const technicalScores = {
    ...finalScores,
    proficiencyLevel,
  };

  // Write scores back to BOTH collections to ensure everything stays in sync
  await User.findByIdAndUpdate(candidateId, {
    technicalScores,
    lastTechAssessedAt: new Date(),
  });
  await CandidateProfile.findOneAndUpdate(
    { user: candidateId },
    { technicalScores },
    { upsert: true, setDefaultsOnInsert: true }
  );

  await createNotification({
    user: candidateId,
    type: "success",
    title: "Technical Assessment Completed",
    message: `Your Tech Assessment is complete. Overall Score: ${overallScore}/100. Proficiency: ${proficiencyLevel.charAt(0).toUpperCase() + proficiencyLevel.slice(1)}.`,
    link: "/profile",
  });

  console.log(
    `Technical scores updated for candidate ${candidateId}:`,
    finalScores,
    `(overall: ${overallScore}, proficiency: ${proficiencyLevel})`
  );

  return {
    individualScores,
    dimensionScores: finalScores,
    overallScore,
    proficiencyLevel,
    summary: "Your technical proficiency has been successfully mapped based on your assessment responses.",
  };
};

module.exports = { evaluateTechAnswers };
