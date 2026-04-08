const { generateJSON } = require("./aiClient");
const mongoose = require("mongoose");

// Import the Candidate model (same schema as the backend)
const Candidate = require("../models/CandidateRef");

/**
 * Evaluate a candidate's answers to EQ assessment questions.
 *
 * This function:
 * 1. Sends all question-answer pairs to Gemini for scoring
 * 2. Computes dimension-level scores (0-100 scale)
 * 3. Writes the scores back to the Candidate document in MongoDB
 * 4. Returns the detailed evaluation
 *
 * @param {string} candidateId - MongoDB ObjectId of the candidate
 * @param {object[]} answeredQuestions - Array of { id, question, dimension, answer }
 * @returns {object} Evaluation results with scores
 */
const evaluateAnswers = async (candidateId, answeredQuestions) => {
  if (!answeredQuestions || answeredQuestions.length === 0) {
    throw new Error("No answered questions provided");
  }

  // Build the evaluation prompt
  const questionsText = answeredQuestions
    .map(
      (q, i) =>
        `Question ${i + 1} [${q.dimension}]: ${q.question}\nAnswer: ${q.answer}`
    )
    .join("\n\n");

  const prompt = `You are an expert Emotional Intelligence (EQ) evaluator for a professional job portal.

A candidate has completed an EQ assessment. Below are the questions (with their EQ dimension) and the candidate's answers.

${questionsText}

Evaluate each answer on a scale of 1 to 10 based on the quality of emotional intelligence demonstrated. Consider:
- Depth of self-awareness and reflection
- Empathy and consideration for others
- Maturity of emotional regulation
- Quality of communication and collaboration approach
- Flexibility and growth mindset
- Practical problem-solving ability

Then compute aggregate scores (0-100 scale) for each dimension by averaging the individual scores within that dimension and scaling to 100.

Return ONLY a valid JSON object in this exact format:
{
  "individualScores": [
    {
      "questionId": 1,
      "dimension": "emotionalIntelligence",
      "score": 8,
      "feedback": "Brief explanation of the score"
    }
  ],
  "dimensionScores": {
    "emotionalIntelligence": 75,
    "collaboration": 82,
    "adaptability": 68
  },
  "overallScore": 75,
  "summary": "A 2-3 sentence overall assessment of the candidate's EQ strengths and areas for growth."
}

Be fair but rigorous in scoring. Do not inflate scores. Do not include any text outside the JSON object.`;

  const result = await generateJSON(prompt);

  // Validate response structure
  if (!result.dimensionScores) {
    throw new Error("AI response missing 'dimensionScores'");
  }

  const {
    emotionalIntelligence = 0,
    collaboration = 0,
    adaptability = 0,
  } = result.dimensionScores;

  // Clamp scores to 0-100
  const clamp = (val) => Math.max(0, Math.min(100, Math.round(val)));

  const finalScores = {
    emotionalIntelligence: clamp(emotionalIntelligence),
    collaboration: clamp(collaboration),
    adaptability: clamp(adaptability),
  };

  const overallScore = Math.round(
    (finalScores.emotionalIntelligence +
      finalScores.collaboration +
      finalScores.adaptability) /
      3
  );

  // Write scores back to the Candidate document in MongoDB
  await Candidate.findByIdAndUpdate(candidateId, {
    eqScores: finalScores,
  });

  console.log(
    `EQ scores updated for candidate ${candidateId}:`,
    finalScores,
    `(overall: ${overallScore})`
  );

  return {
    individualScores: result.individualScores || [],
    dimensionScores: finalScores,
    overallScore,
    summary: result.summary || "",
  };
};

module.exports = { evaluateAnswers };
