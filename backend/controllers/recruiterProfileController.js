const Recruiter = require("../models/Recruiter");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Candidate = require("../models/Candidate");

// GET /api/recruiter-profile/:id — Full recruiter profile
exports.getProfile = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.params.id);
    if (!recruiter) {
      return res.status(404).json({ success: false, message: "Recruiter not found" });
    }
    res.json({ success: true, data: recruiter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/recruiter-profile — Create a new recruiter
exports.createRecruiter = async (req, res) => {
  try {
    const recruiter = await Recruiter.create(req.body);
    res.status(201).json({ success: true, data: recruiter });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/recruiter-profile/:id — Update recruiter profile (Edit Profile)
exports.updateProfile = async (req, res) => {
  try {
    const recruiter = await Recruiter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!recruiter) {
      return res.status(404).json({ success: false, message: "Recruiter not found" });
    }
    res.json({ success: true, data: recruiter });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/recruiter-profile/:id/metrics — Recruitment metrics
exports.getMetrics = async (req, res) => {
  try {
    const recruiterId = req.params.id;

    // Count active jobs
    const activeJobs = await Job.countDocuments({ recruiterId, status: "Active" });

    // Get all job IDs for this recruiter
    const recruiterJobs = await Job.find({ recruiterId }).select("_id");
    const jobIds = recruiterJobs.map((j) => j._id);

    // Total applicants across all recruiter's jobs
    const totalApplicants = await Application.countDocuments({
      jobId: { $in: jobIds },
    });

    // Interviews scheduled (shortlisted applications including scheduled and hired)
    const interviewsScheduled = await Application.countDocuments({
      jobId: { $in: jobIds },
      status: { $in: ["Shortlisted", "Interview Scheduled", "Offer Extended", "Hired"] },
    });

    // Average time to hire (in days) — computed from the time between
    // job creation and the latest shortlisted application for that job
    let avgTimeToHire = 0;
    if (jobIds.length > 0) {
      const hireTimes = await Application.aggregate([
        {
          $match: {
            jobId: { $in: jobIds },
            status: { $in: ["Shortlisted", "Interview Scheduled", "Offer Extended", "Hired"] },
          },
        },
        {
          $lookup: {
            from: "jobs",
            localField: "jobId",
            foreignField: "_id",
            as: "job",
          },
        },
        { $unwind: "$job" },
        {
          $project: {
            daysToHire: {
              $divide: [
                { $subtract: ["$updatedAt", "$job.createdAt"] },
                1000 * 60 * 60 * 24, // ms → days
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            avgDays: { $avg: "$daysToHire" },
          },
        },
      ]);
      avgTimeToHire = hireTimes.length > 0 ? Math.round(hireTimes[0].avgDays) : 0;
    }

    res.json({
      success: true,
      data: {
        activeJobs,
        totalApplicants,
        interviewsScheduled,
        avgTimeToHire,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/recruiter-profile/:id/jobs — Active job listings
exports.getActiveJobs = async (req, res) => {
  try {
    const recruiterId = req.params.id;

    const activeJobs = await Job.find({ recruiterId, status: "Active" })
      .sort({ createdAt: -1 })
      .lean();

    // For each job, attach the applicant count
    const jobListings = await Promise.all(
      activeJobs.map(async (job) => {
        const applicantCount = await Application.countDocuments({ jobId: job._id });

        return {
          _id: job._id,
          title: job.title,
          company: job.company,
          location: job.location,
          type: job.type,
          status: job.status,
          employeeCount: job.employeeCount,
          applicants: applicantCount,
          updatedAt: job.updatedAt,
        };
      })
    );

    res.json({ success: true, data: jobListings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/recruiter-profile/:id/activity — Recent activity feed
exports.getRecentActivity = async (req, res) => {
  try {
    const recruiterId = req.params.id;
    const limit = parseInt(req.query.limit) || 5;

    // Get recruiter's job IDs
    const recruiterJobs = await Job.find({ recruiterId }).select("_id title");
    const jobIds = recruiterJobs.map((j) => j._id);

    // Get the most recent applications
    const recentApplications = await Application.find({ jobId: { $in: jobIds } })
      .populate("candidateId", "name title avatar")
      .populate("jobId", "title")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const activity = recentApplications.map((app) => ({
      type: "New application received",
      candidate: app.candidateId
        ? { name: app.candidateId.name, title: app.candidateId.title, avatar: app.candidateId.avatar }
        : null,
      job: app.jobId ? app.jobId.title : "Unknown Job",
      timestamp: app.createdAt,
    }));

    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/recruiter-profile/:id/eq-insights — Top EQ matches
exports.getEqInsights = async (req, res) => {
  try {
    const recruiterId = req.params.id;
    const limit = parseInt(req.query.limit) || 3;

    // Get recruiter's job IDs
    const recruiterJobs = await Job.find({ recruiterId }).select("_id title");
    const jobIds = recruiterJobs.map((j) => j._id);

    // Top EQ-matched candidates
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

    // Populate candidate and job details
    const candidateIds = topResults.map((r) => r._id);
    const candidates = await Candidate.find({ _id: { $in: candidateIds } }).lean();

    const jobIdsFromResults = topResults.map((r) => r.jobId);
    const jobs = await Job.find({ _id: { $in: jobIdsFromResults } }).lean();

    const insights = topResults.map((result) => {
      const candidate = candidates.find(
        (c) => c._id.toString() === result._id.toString()
      );
      const job = jobs.find(
        (j) => j._id.toString() === result.jobId.toString()
      );
      return {
        label: "Top EQ Match",
        candidate: candidate
          ? { name: candidate.name, title: candidate.title }
          : null,
        matchPercentage: result.maxMatchScore,
        jobTitle: job ? job.title : "Unknown",
        description: candidate
          ? `${candidate.name} - ${result.maxMatchScore}% compatibility for ${job ? job.title : "Unknown"} role`
          : null,
      };
    });

    res.json({ success: true, data: insights });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
