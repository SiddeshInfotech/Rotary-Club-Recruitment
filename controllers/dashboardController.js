const Job = require("../models/Job");
const Application = require("../models/Application");
const Candidate = require("../models/Candidate");

// GET /api/dashboard/stats
// Returns: { activeJobs, totalApplications, shortlisted, avgEqMatch }
exports.getStats = async (req, res) => {
  try {
    const recruiterId = req.query.recruiterId || "recruiter_1";

    // Count active jobs for this recruiter
    const activeJobs = await Job.countDocuments({
      recruiterId,
      status: "Active",
    });

    // Get all job IDs for this recruiter
    const recruiterJobs = await Job.find({ recruiterId }).select("_id");
    const jobIds = recruiterJobs.map((j) => j._id);

    // Total applications across all recruiter's jobs
    const totalApplications = await Application.countDocuments({
      jobId: { $in: jobIds },
    });

    // Shortlisted candidates
    const shortlisted = await Application.countDocuments({
      jobId: { $in: jobIds },
      status: "Shortlisted",
    });

    // Average EQ match score across all applications
    const avgResult = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: null, avgEqMatch: { $avg: "$eqMatchScore" } } },
    ]);
    const avgEqMatch = avgResult.length > 0 ? Math.round(avgResult[0].avgEqMatch) : 0;

    res.json({
      success: true,
      data: {
        activeJobs,
        totalApplications,
        shortlisted,
        avgEqMatch,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/dashboard/jobs
// Returns active job listings with application count & top EQ match per job
exports.getActiveJobListings = async (req, res) => {
  try {
    const recruiterId = req.query.recruiterId || "recruiter_1";

    const activeJobs = await Job.find({ recruiterId, status: "Active" }).lean();

    // For each job, get application count and top EQ match score
    const jobListings = await Promise.all(
      activeJobs.map(async (job) => {
        const applicationCount = await Application.countDocuments({
          jobId: job._id,
        });

        const topMatch = await Application.findOne({ jobId: job._id })
          .sort({ eqMatchScore: -1 })
          .select("eqMatchScore")
          .lean();

        return {
          _id: job._id,
          title: job.title,
          type: job.type,
          location: job.location,
          status: job.status,
          applications: applicationCount,
          topEqMatch: topMatch ? topMatch.eqMatchScore : 0,
        };
      })
    );

    res.json({ success: true, data: jobListings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/dashboard/top-candidates
// Returns top EQ matched candidates with their scores (deduplicated)
exports.getTopCandidates = async (req, res) => {
  try {
    const recruiterId = req.query.recruiterId || "recruiter_1";
    const limit = parseInt(req.query.limit) || 4;

    // Get all job IDs for this recruiter
    const recruiterJobs = await Job.find({ recruiterId }).select("_id");
    const jobIds = recruiterJobs.map((j) => j._id);

    // Aggregate: group by candidateId, pick highest match score, deduplicate
    const topResults = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $sort: { eqMatchScore: -1 } },
      {
        $group: {
          _id: "$candidateId",
          maxMatchScore: { $max: "$eqMatchScore" },
        },
      },
      { $sort: { maxMatchScore: -1 } },
      { $limit: limit },
    ]);

    // Populate candidate details
    const candidateIds = topResults.map((r) => r._id);
    const candidates = await Candidate.find({ _id: { $in: candidateIds } }).lean();

    const topCandidates = topResults.map((result) => {
      const candidate = candidates.find(
        (c) => c._id.toString() === result._id.toString()
      );
      return {
        _id: candidate._id,
        name: candidate.name,
        title: candidate.title,
        avatar: candidate.avatar,
        matchPercentage: result.maxMatchScore,
        eqScores: candidate.eqScores,
      };
    });

    res.json({ success: true, data: topCandidates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
