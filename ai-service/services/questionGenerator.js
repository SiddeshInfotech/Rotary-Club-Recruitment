const { generateJSON } = require("./aiClient");

/**
 * Generate 30 EQ assessment questions tailored to the candidate's skills and profile.
 *
 * The questions are distributed across 3 EQ dimensions:
 * - Emotional Intelligence (10 questions): self-awareness, empathy, emotional regulation
 * - Collaboration (10 questions): teamwork, communication, conflict resolution
 * - Adaptability (10 questions): flexibility, learning agility, handling change
 *
 * @param {object} candidate - The candidate document from MongoDB
 * @param {string} candidate.name
 * @param {string} candidate.title
 * @param {string[]} candidate.skills
 * @returns {object[]} Array of 30 question objects
 */
const generateQuestions = async (candidate) => {
  const { name, title, skills } = candidate;

  if (!skills || skills.length === 0) {
    throw new Error(
      "Candidate has no skills listed. Please update the candidate profile with skills before generating an assessment."
    );
  }

  const prompt = `You are an expert Emotional Intelligence (EQ) assessment designer for a professional job portal.

A candidate has the following profile:
- Name: ${name}
- Title: ${title || "Not specified"}
- Skills: ${skills.join(", ")}

Generate exactly 30 situational and behavioral assessment questions to evaluate this candidate's Emotional Quotient (EQ). The questions must be:

1. **Relevant** to the candidate's skills and professional domain
2. **Scenario-based** — present realistic workplace situations the candidate might face given their skills
3. **Open-ended** — requiring thoughtful, detailed responses (not yes/no)
4. **Evenly distributed** across these 3 EQ dimensions (10 questions each):
   - **emotionalIntelligence**: Self-awareness, empathy, emotional regulation, motivation
   - **collaboration**: Teamwork, communication, conflict resolution, leadership
   - **adaptability**: Flexibility, learning agility, handling change, problem-solving under pressure

For each question, provide:
- "id": a sequential number (1-30)
- "question": the full question text
- "dimension": one of "emotionalIntelligence", "collaboration", or "adaptability"
- "context": a brief note on what this question is specifically assessing

Return ONLY a valid JSON object in this exact format:
{
  "questions": [
    {
      "id": 1,
      "question": "...",
      "dimension": "emotionalIntelligence",
      "context": "Assessing self-awareness in ..."
    }
  ]
}

Do not include any text outside the JSON object.`;

  const result = await generateJSON(prompt);

  // Validate the response structure
  if (!result.questions || !Array.isArray(result.questions)) {
    throw new Error("AI response missing 'questions' array");
  }

  if (result.questions.length < 25) {
    throw new Error(
      `AI generated only ${result.questions.length} questions, expected 30. Please retry.`
    );
  }

  return result.questions;
};

module.exports = { generateQuestions };
