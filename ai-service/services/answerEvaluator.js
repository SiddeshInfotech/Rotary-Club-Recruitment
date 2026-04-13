const User = require("../models/CandidateRef");
const CandidateProfile = require("../models/CandidateProfileRef");

/**
 * Evaluate a candidate's answers to EQ assessment MCQs.
 *
 * This function:
 * 1. Iterates over answered questions and finds the pre-assigned option score
 * 2. Computes dimension-level scores (0-100 scale)
 * 3. Writes the scores back to BOTH the User and CandidateProfile records
 * 4. Returns the detailed evaluation
 *
 * @param {string} candidateId - MongoDB ObjectId of the candidate
 * @param {object[]} answeredQuestions - Array of questions with selected 'answer' (option id)
 * @returns {object} Evaluation results with scores
 */
const evaluateAnswers = async (candidateId, answeredQuestions) => {
  if (!answeredQuestions || answeredQuestions.length === 0) {
    throw new Error("No answered questions provided");
  }

  const dimensionTotals = {};
  const dimensionMax = {};
  const individualScores = [];

  // Calculate scores directly from predefined MCQ weights
  for (const q of answeredQuestions) {
    const dim = q.dimension;
    if (!dimensionTotals[dim]) {
      dimensionTotals[dim] = 0;
      dimensionMax[dim] = 0;
    }

    dimensionMax[dim] += 10; // Max possible score per question is 10

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
      score: score,
      feedback: `Selected option scored ${score}/10 points.`
    });
  }

  // Initialize all 8 traits
  const finalScores = {
    leadership: 0,
    loyalty: 0,
    adaptability: 0,
    growthMindset: 0,
    reliability: 0,
    teamwork: 0,
    collaboration: 0,
    problemSolving: 0,
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

  // Write scores back to BOTH collections to ensure everything stays in sync
  await User.findByIdAndUpdate(candidateId, { eqScores: finalScores });
  await CandidateProfile.findOneAndUpdate(
    { user: candidateId },
    { eqScores: finalScores },
    { upsert: true, setDefaultsOnInsert: true }
  );

  console.log(
    `EQ scores updated for candidate ${candidateId}:`,
    finalScores,
    `(overall: ${overallScore})`
  );

  return {
    individualScores,
    dimensionScores: finalScores,
    overallScore,
    summary: "Your EQ footprint has been successfully mapped based on your scenario responses.",
  };
};

module.exports = { evaluateAnswers };
