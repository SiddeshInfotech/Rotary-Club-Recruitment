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

Generate exactly 30 situational Multiple Choice Questions (MCQs) to evaluate this candidate's Emotional Quotient (EQ). The questions must be:

1. **Relevant** to the candidate's skills and professional domain
2. **Scenario-based** — present realistic workplace situations the candidate might face
3. **Distributed** across these 8 EQ dimensions (distribute them so that each dimension gets 3 to 4 questions, totaling exactly 30):
   - "leadership", "loyalty", "adaptability", "growthMindset", "reliability", "teamwork", "collaboration", "problemSolving"

Each question MUST have a populated 'options' array containing EXACTLY 4 JSON objects (A, B, C, D). DO NOT return empty options [].

Assign a score to each option based on emotional maturity:
- 10 = Highly emotionally intelligent response
- 7 = Good, but could be better
- 4 = Suboptimal but understandable
- 1 = Poor EQ or flawed approach

Return ONLY a valid JSON object. DO NOT include introductory or concluding text. 
Here is the exact JSON structure you MUST follow:
{
  "questions": [
    {
      "id": 1,
      "dimension": "leadership",
      "question": "Your scenario-based question here...",
      "options": [
        { "id": "A", "text": "Take charge and dictate...", "score": 1 },
        { "id": "B", "text": "Ask the team for input before deciding...", "score": 10 },
        { "id": "C", "text": "Wait to see what happens...", "score": 4 },
        { "id": "D", "text": "Delegate but monitor closely...", "score": 7 }
      ]
    }
  ]
}

Ensure all 30 questions are in the array. Do not include any text outside the JSON object.`;

  const result = await generateJSON(prompt);

  // Validate the response structure
  if (!result.questions || !Array.isArray(result.questions)) {
    throw new Error("AI response missing 'questions' array");
  }

  if (result.questions.length < 30) {
    throw new Error(
      `AI generated only ${result.questions.length} questions, expected 30. Please retry.`
    );
  }

  return result.questions;
};

module.exports = { generateQuestions };
