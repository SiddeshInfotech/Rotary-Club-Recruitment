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

Based strictly on these scores, generate exactly:
1. 3 key strengths (Focus on the highest scoring areas. Write a 1-sentence personalized explanation for each).
2. 3 areas of improvement/weaknesses (Focus on the lowest scoring areas. Keep it constructive and empowering).
3. 3 actionable recommendations (Specific, proactive steps they can take to boost their lower scores or leverage their strengths).

Return the response STRICTLY as a valid JSON object in the following format (do not include any markdown formatting like \`\`\`json):
{
  "strengths": [
    "string", "string", "string"
  ],
  "weaknesses": [
    "string", "string", "string"
  ],
  "recommendations": [
    "string", "string", "string"
  ]
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
    strengths: [
      "Demonstrates solid baseline Emotional Intelligence, allowing for stable workplace interactions.",
      "Shows a readiness to engage with team-oriented scenarios.",
      "Exhibits a balanced approach to standard problem-solving challenges."
    ],
    weaknesses: [
      "May occasionally struggle to adapt rapidly to unexpected, high-stress changes.",
      "Leadership presence might not always be felt during critical decision-making moments.",
      "Could improve proactive collaboration outside of immediate comfort zones."
    ],
    recommendations: [
      "Volunteer to lead minor project modules to build leadership confidence.",
      "Actively seek feedback on adaptability during rapid transition periods.",
      "Participate in cross-functional team discussions to enhance collaborative reach."
    ]
  };
};

module.exports = {
  generatePremiumInsights,
};
