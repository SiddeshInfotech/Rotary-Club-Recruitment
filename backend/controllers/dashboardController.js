const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/User");

// GET /api/dashboard/stats
// Returns: { activeJobs, totalApplications, shortlisted, avgEqMatch }
exports.getStats = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    // Count active jobs for this recruiter
    const activeJobs = await Job.countDocuments({
      recruiter: recruiterId,
      status: "Active",
    });

    // Get all job IDs for this recruiter
    const recruiterJobs = await Job.find({ recruiter: recruiterId }).select("_id");
    const jobIds = recruiterJobs.map((j) => j._id);

    // Total applications across all recruiter's jobs
    const totalApplications = await Application.countDocuments({
      jobId: { $in: jobIds },
    });

    // Shortlisted candidates (includes shortlisted, interviewing, and offered/hired stages)
    const shortlisted = await Application.countDocuments({
      jobId: { $in: jobIds },
      status: { $in: ["Shortlisted", "Interview Scheduled", "Offer Extended", "Hired"] },
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
    const recruiterId = req.user._id;
    const statusFilter = req.query.status || "Active";

    const activeJobs = await Job.find({ recruiter: recruiterId, status: statusFilter }).lean();

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
          locationType: job.locationType,
          location: job.location,
          status: job.status,
          companyName: job.companyName,
          createdAt: job.createdAt,
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
    const recruiterId = req.user._id;
    const limit = parseInt(req.query.limit) || 4;

    // Get all job IDs for this recruiter
    const recruiterJobs = await Job.find({ recruiter: recruiterId }).select("_id");
    const jobIds = recruiterJobs.map((j) => j._id);

    // Aggregate: group by candidateId, pick highest match score, deduplicate
    const topResults = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $sort: { eqMatchScore: -1 } },
      {
        $group: {
          _id: "$candidateId",
          maxMatchScore: { $max: "$eqMatchScore" },
          jobId: { $first: "$jobId" },
        },
      },
      { $sort: { maxMatchScore: -1 } },
      { $limit: limit },
    ]);

    // Populate candidate details from User model (since Auth creates Users, not Candidates)
    const candidateIds = topResults.map((r) => r._id);
    const linkedUsers = await User.find({ _id: { $in: candidateIds } }).lean();

    // Also fetch the respective jobs to show what they applied for
    const resultJobIds = topResults.map((r) => r.jobId);
    const linkedJobs = await Job.find({ _id: { $in: resultJobIds } }).lean();

    const topCandidates = topResults
      .map((result) => {
        const linkedUser = linkedUsers.find(
          (u) => u._id.toString() === result._id.toString()
        );
        const linkedJob = linkedJobs.find(
          (j) => j._id.toString() === result.jobId?.toString()
        );
        if (!linkedUser) return null;
        
        return {
          _id: linkedUser._id,
          name: linkedUser.name || "Candidate",
          title: linkedJob ? `Applied for: ${linkedJob.title}` : (linkedUser.currentTitle || "Active Candidate"),
          avatar: null,
          matchPercentage: result.maxMatchScore || 0,
          eqScores: { emotionalIntelligence: 0, collaboration: 0, adaptability: 0 }, // Stub since User doesn't have EQ yet
        };
      })
      .filter(Boolean);

    res.json({ success: true, data: topCandidates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
