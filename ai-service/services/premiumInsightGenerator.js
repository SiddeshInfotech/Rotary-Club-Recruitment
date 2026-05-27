const { GoogleGenAI } = require("@google/genai");

const API_KEY = process.env.GEMINI_API_KEY;
let ai = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

/**
 * Generates premium insights (strengths, weaknesses, recommendations)
 * based on the candidate's EQ scores.
 *
 * @param {object} candidate - The candidate object with name, skills, eqScores
 * @returns {object} { strengths: [], weaknesses: [], recommendations: [] }
 */
const generatePremiumInsights = async (candidate) => {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not set. Generating mock insights.");
      return getMockInsights(candidate.eqScores);
    }
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  const { name, eqScores } = candidate;

  const promptText = `
You are an expert Organizational Psychologist and EQ Assessor.
You are generating a premium "Deep EQ Insight" report for a candidate named ${name}.

Here are their EQ Scores out of 100:
- Leadership: ${eqScores.leadership || 0}
- Loyalty: ${eqScores.loyalty || 0}
- Adaptability: ${eqScores.adaptability || 0}
- Growth Mindset: ${eqScores.growthMindset || 0}
- Reliability: ${eqScores.reliability || 0}
- Teamwork: ${eqScores.teamwork || 0}
- Collaboration: ${eqScores.collaboration || 0}
- Problem Solving: ${eqScores.problemSolving || 0}
- Overall Aggregate: ${eqScores.aggregate || 0}

Based strictly on these scores, generate a fully personalized insight profile:
1. **Persona**: Give them a unique title (e.g. "The Agile Navigator") and a short 2-sentence description of their leadership style based on their highest traits.
2. **Career Trajectory**: A 1-sentence recommendation for their ideal career path or roles.
3. **Growth Plan**: 3 specific, actionable steps tailored to improving their lowest scores.
4. **Blind Spot**: Detail their stress response based on their lowest trait. Include a 'trigger' (what causes it), their default 'response', and a tactical 'fix'.

Return the response STRICTLY as a valid JSON object in the following format (do not include any markdown formatting like \`\`\`json):
{
  "persona": {
    "title": "string",
    "desc": "string"
  },
  "careerTrajectory": "string",
  "growthPlan": [
    "string", "string", "string"
  ],
  "blindSpot": {
    "trigger": "string",
    "response": "string",
    "fix": "string"
  }
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptText,
      config: {
        temperature: 0.7,
      },
    });

    let rawText = response.text;
    
    // Clean up potential markdown formatting (```json ... ```)
    if (rawText.startsWith("```")) {
      const match = rawText.match(/```(?:json)?\n([\s\S]*?)\n```/);
      if (match) {
        rawText = match[1];
      }
    }

    const jsonResult = JSON.parse(rawText.trim());
    return jsonResult;
  } catch (error) {
    console.error("Failed to generate premium insights from Gemini:", error.message);
    // Fallback to mock data if Gemini fails so the UX isn't broken
    return getMockInsights(candidate.eqScores);
  }
};

const getMockInsights = (scores) => {
  return {
    persona: {
      title: "The Balanced Professional",
      desc: "You possess a well-rounded emotional toolkit, allowing you to adapt your style to whatever the situation demands."
    },
    careerTrajectory: "Versatile roles requiring balanced interpersonal and technical skills.",
    growthPlan: [
      "Reflect on your recent challenges to identify hidden friction points.",
      "Seek feedback from a trusted peer on your collaboration style.",
      "Set one micro-goal for next week to stretch your comfort zone."
    ],
    blindSpot: {
      trigger: "Under extreme stress or ambiguous situations",
      response: "You may revert to isolated baseline behaviors instead of communicating.",
      fix: "Take a tactical pause and proactively update your team on your status."
    }
  };
};

module.exports = {
  generatePremiumInsights,
};
