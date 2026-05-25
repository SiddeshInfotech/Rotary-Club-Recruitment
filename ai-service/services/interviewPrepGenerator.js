const { generateJSON } = require("./aiClient");

/**
 * Generate a personalized Interview Prep Toolkit based on the candidate's
 * EQ scores, technical scores, and skills.
 *
 * Uses Groq (Llama 3.3 70B) to produce:
 * - 5 likely behavioral interview questions (targeting their weak EQ areas)
 * - For each: a tailored "ideal response framework" leveraging their strengths
 * - 3 "power phrases" they should weave into interviews
 * - 3 red flags to avoid based on their profile
 *
 * @param {object} candidate - { name, eqScores, technicalScores, skills }
 * @returns {object} Interview prep data
 */
const generateInterviewPrep = async (candidate) => {
  const { name, eqScores, technicalScores, skills } = candidate;

  // Build EQ context string
  const eqContext = eqScores
    ? Object.entries(eqScores)
        .filter(([k, v]) => k !== "aggregate" && typeof v === "number")
        .map(([k, v]) => `- ${formatTrait(k)}: ${v}/100`)
        .join("\n")
    : "No EQ scores available";

  const eqAggregate = eqScores?.aggregate || "N/A";

  // Build tech context string
  const techContext = technicalScores
    ? Object.entries(technicalScores)
        .filter(
          ([k, v]) =>
            k !== "aggregate" &&
            k !== "proficiencyLevel" &&
            typeof v === "number"
        )
        .map(([k, v]) => `- ${formatTrait(k)}: ${v}/100`)
        .join("\n")
    : "No technical scores available";

  const techAggregate = technicalScores?.aggregate || "N/A";
  const proficiency = technicalScores?.proficiencyLevel || "not_assessed";

  const skillsList =
    skills && skills.length > 0 ? skills.join(", ") : "Not specified";

  const prompt = `
You are an expert Career Coach and Interview Strategist.
You are generating a personalized "Interview Prep Toolkit" for a candidate named ${name}.

Here is their profile:

EQ (Emotional Quotient) Scores (each out of 100):
${eqContext}
Overall EQ: ${eqAggregate}/100

Technical Scores (each out of 100):
${techContext}
Overall Technical: ${techAggregate}/100
Proficiency Level: ${proficiency}

Skills: ${skillsList}

Based on this profile, generate:

1. "questions" — An array of exactly 5 behavioral/situational interview questions that interviewers are MOST LIKELY to ask this candidate. Focus on probing their WEAKEST EQ areas (lowest scores). For each question, include:
   - "question": The interview question text
   - "whyAsked": A short explanation of why interviewers ask this (1 sentence)
   - "idealResponse": A 2-3 sentence response framework that leverages the candidate's STRONGEST traits to compensate
   - "targetTrait": Which EQ trait this question probes

2. "powerPhrases" — An array of exactly 3 power phrases/statements the candidate should naturally weave into interviews. These should highlight their strongest EQ and technical traits. Each should be a short, natural-sounding sentence they could say.

3. "redFlags" — An array of exactly 3 things the candidate should AVOID saying or doing in interviews, based on their weakest traits. Each should be a short, specific warning.

4. "overallStrategy" — A 2-sentence summary of the candidate's optimal interview strategy based on their unique profile.

Return ONLY valid JSON in this exact format:
{
  "questions": [
    { "question": "...", "whyAsked": "...", "idealResponse": "...", "targetTrait": "..." }
  ],
  "powerPhrases": ["...", "...", "..."],
  "redFlags": ["...", "...", "..."],
  "overallStrategy": "..."
}
`;

  try {
    const result = await generateJSON(prompt);
    return result;
  } catch (error) {
    console.error("Failed to generate interview prep:", error.message);
    // Return mock data so UX isn't broken
    return getMockInterviewPrep();
  }
};

/**
 * Convert camelCase trait names to readable labels
 */
function formatTrait(key) {
  const map = {
    leadership: "Leadership",
    loyalty: "Loyalty",
    adaptability: "Adaptability",
    growthMindset: "Growth Mindset",
    reliability: "Reliability",
    teamwork: "Teamwork",
    collaboration: "Collaboration",
    problemSolving: "Problem Solving",
    fundamentals: "Fundamentals",
    architecture: "Architecture",
    debugging: "Debugging",
    bestPractices: "Best Practices",
    tooling: "Tooling",
  };
  return map[key] || key;
}

/**
 * Fallback mock data if AI generation fails
 */
function getMockInterviewPrep() {
  return {
    questions: [
      {
        question:
          "Tell me about a time you had to adapt to a sudden, major change at work. How did you handle it?",
        whyAsked:
          "Interviewers probe adaptability to assess how you handle uncertainty and disruption.",
        idealResponse:
          "Acknowledge the challenge honestly, then describe the specific steps you took to assess the new situation. Emphasize your problem-solving approach and how you turned the change into an opportunity.",
        targetTrait: "Adaptability",
      },
      {
        question:
          "Describe a situation where you had to lead a team through a difficult project. What was your approach?",
        whyAsked:
          "This reveals your leadership style and how you motivate others under pressure.",
        idealResponse:
          "Focus on how you communicated the vision clearly, delegated based on team strengths, and maintained transparency throughout. Highlight a specific measurable outcome.",
        targetTrait: "Leadership",
      },
      {
        question:
          "How do you handle disagreements with team members who have a very different working style?",
        whyAsked:
          "Tests your collaboration skills and emotional maturity in conflict scenarios.",
        idealResponse:
          "Describe your approach to active listening first, then finding common ground. Give a concrete example where understanding the other perspective led to a better solution.",
        targetTrait: "Collaboration",
      },
      {
        question:
          "Can you give an example of when you received critical feedback? How did you respond?",
        whyAsked:
          "Assesses growth mindset and ability to use feedback constructively.",
        idealResponse:
          "Show genuine appreciation for the feedback, describe the specific change you made, and quantify the improvement that resulted. Avoid being defensive.",
        targetTrait: "Growth Mindset",
      },
      {
        question:
          "Tell me about a commitment you made that was harder to keep than expected. What did you do?",
        whyAsked:
          "Tests reliability and how you handle overcommitment or obstacle scenarios.",
        idealResponse:
          "Emphasize that you communicated early when challenges arose, renegotiated timelines proactively rather than silently struggling, and ultimately delivered on your commitment.",
        targetTrait: "Reliability",
      },
    ],
    powerPhrases: [
      "I believe in communicating early and often — my team always knows where things stand.",
      "I approach every challenge by first understanding the full picture before jumping to solutions.",
      "I'm energized by cross-functional work because the best ideas come from diverse perspectives.",
    ],
    redFlags: [
      "Avoid saying 'I work best alone' — it signals low collaboration potential.",
      "Don't dismiss past failures without showing what you learned from them.",
      "Avoid vague answers like 'I just figured it out' — always show your thought process.",
    ],
    overallStrategy:
      "Lead with your strongest EQ traits by providing concrete examples that demonstrate them naturally. For your weaker areas, prepare specific stories that show self-awareness and active improvement.",
  };
}

module.exports = { generateInterviewPrep };
