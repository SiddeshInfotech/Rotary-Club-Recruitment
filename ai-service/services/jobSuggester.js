const { generateJSON } = require("./aiClient");

/**
 * Suggests the top 5 relevant jobs for a candidate based on their skills and EQ scores.
 * 
 * @param {object} candidate - The candidate profile containing skills and eqScores
 * @param {Array} jobs - Arary of available jobs to evaluate
 * @returns {Array} - Array of objects containing suggested jobId and matchReason
 */
const suggestJobs = async (candidate, jobs) => {
  if (!jobs || jobs.length === 0) {
    return [];
  }

  const prompt = `You are an expert technical recruiter matching candidates to job positions. 
You must analyze the candidate's skills and Emotional Quotient (EQ) scores and compare them against the provided list of active jobs.

Candidate Profile:
- Skills: ${candidate.skills.join(", ")}
- EQ Scores:
  - Emotional Intelligence: ${candidate.eqScores.emotionalIntelligence}/100
  - Collaboration: ${candidate.eqScores.collaboration}/100
  - Adaptability: ${candidate.eqScores.adaptability}/100

Active Jobs Available:
${jobs.map((job) => `- ID: ${job._id.toString()} | Title: ${job.title} | Type: ${job.type} | Company: ${job.company} | Location: ${job.location}`).join("\n")}

Respond ONLY with a valid JSON object in the following format:
{
  "suggestedJobs": [
    {
      "jobId": "<Job ID from the list>",
      "matchReason": "<A brief 1-2 sentence explanation of why this job is a strong match for this candidate based on their skills and EQ scores>"
    }
  ]
}

Important Instructions:
1. Select the top 5 most relevant jobs from the list based on the candidate's profile.
2. If there are fewer than 5 jobs, return as many as are relevant.
3. Ensure the \`jobId\` matches exactly with the provided Job IDs.
4. Your response must be strictly valid JSON without any markdown formatting.`;

  const parsedResponse = await generateJSON(prompt);

  // Return max 5 just to enforce the limit programmaticallly
  const suggestions = parsedResponse.suggestedJobs || [];
  return suggestions.slice(0, 5);
};

module.exports = { suggestJobs };
