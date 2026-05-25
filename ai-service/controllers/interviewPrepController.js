const Candidate = require("../models/CandidateRef");
const CandidateProfile = require("../models/CandidateProfileRef");
const { generateInterviewPrep } = require("../services/interviewPrepGenerator");

/**
 * POST /api/interview-prep/generate/:candidateId
 *
 * Generates a personalized Interview Prep Toolkit using AI.
 * Premium-only feature — the frontend gates access.
 */
exports.generatePrep = async (req, res) => {
  try {
    const { candidateId } = req.params;

    // 1. Fetch candidate data
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    // 2. Fetch the candidate profile for richer data
    const profile = await CandidateProfile.findOne({ user: candidateId });

    // 3. Build the input for AI
    const aiInput = {
      name: candidate.name,
      eqScores: candidate.eqScores || {},
      technicalScores: candidate.technicalScores || {},
      skills: profile?.skills?.technical || [],
    };

    // 4. Generate interview prep via Groq
    console.log(`Generating interview prep for candidate: ${candidate.name} (${candidateId})`);
    const prep = await generateInterviewPrep(aiInput);

    // 5. Save to candidate profile for caching
    if (profile) {
      if (!profile.premiumInsights) {
        profile.premiumInsights = {};
      }
      profile.premiumInsights.interviewPrep = prep;
      profile.premiumInsights.interviewPrepGeneratedAt = new Date();
      await profile.save();
    }

    res.json({
      success: true,
      message: "Interview prep toolkit generated successfully",
      data: prep,
    });
  } catch (error) {
    console.error("Error generating interview prep:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /api/interview-prep/:candidateId
 *
 * Returns cached interview prep if it exists.
 */
exports.getCachedPrep = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const profile = await CandidateProfile.findOne({ user: candidateId });
    if (!profile || !profile.premiumInsights?.interviewPrep) {
      return res.json({
        success: true,
        data: null,
        message: "No interview prep generated yet",
      });
    }

    res.json({
      success: true,
      data: profile.premiumInsights.interviewPrep,
      generatedAt: profile.premiumInsights.interviewPrepGeneratedAt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
