const Candidate = require("../models/CandidateRef");
const Job = require("../models/JobRef");
const { suggestJobs } = require("../services/jobSuggester");

/**
 * GET /api/suggestions/:candidateId
 *
 * Fetches the active top 5 job matches for a candidate based on skills and EQ score.
 * Considers only jobs created in the last 48 hours.
 */
exports.getJobSuggestions = async (req, res) => {
  try {
    const { candidateId } = req.params;

    // 1. Fetch candidate
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    if (!candidate.skills || candidate.skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Candidate has no skills listed. Cannot suggest jobs.",
      });
    }

    // 2. Fetch Active jobs created in the last 48 hours
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    
    // Using createdAt as the proxy for when the job was added
    const activeJobs = await Job.find({
      status: "Active",
      createdAt: { $gte: fortyEightHoursAgo },
    });

    if (activeJobs.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No active jobs found in the last 48 hours to match.",
        data: [],
      });
    }

    // 3. Get AI suggestions
    console.log(`Generating job suggestions for candidate: ${candidate.name} against ${activeJobs.length} recent jobs...`);
    const suggestions = await suggestJobs(candidate, activeJobs);

    // 4. Map suggested IDs back to full job objects
    const populatedSuggestions = suggestions.map((suggestion) => {
      const jobObject = activeJobs.find((j) => j._id.toString() === suggestion.jobId);
      return {
        job: jobObject,
        matchReason: suggestion.matchReason,
      };
    }).filter(s => s.job); // Filter out any mismatched IDs just in case

    // 5. Return success
    res.status(200).json({
      success: true,
      data: populatedSuggestions,
    });
  } catch (error) {
    console.error("Error generating job suggestions:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
