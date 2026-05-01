const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const mongoose = require("mongoose");
const axios = require("axios");

// GET /api/applications — List all applications (optional filter by jobId)
exports.getAllApplications = async (req, res) => {
  try {
    const filter = {};
    if (req.query.jobId) filter.jobId = req.query.jobId;
    if (req.query.candidateId) filter.candidateId = req.query.candidateId;

    const applications = await Application.find(filter)
      .populate("jobId", "title type location status company companyName description skillsRequired")
      .populate("candidateId", "name title eqScores")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/applications — Create an application
exports.createApplication = async (req, res) => {
  try {
    const { jobId, candidateId } = req.body;
    
    const existingApplication = await Application.findOne({ jobId, candidateId });
    if (existingApplication) {
      return res.status(400).json({ success: false, message: "You have already applied for this job." });
    }

    // Attempt to calculate Total Fit Score (Hard Skills + EQ Match) via ai-service
    let eqMatchScore = 0;
    let technicalScore = 0;
    let eqScore = 0;
    let matchReasoning = "";

    try {
      const job = await Job.findById(jobId);
      const candidate = await User.findById(candidateId);

      // Only attempt to calculate if candidate has eqScores
      if (job && candidate && candidate.eqScores && candidate.eqScores.aggregate > 0) {
        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:5001';
        
        console.log(`Evaluating match for Candidate: ${candidate.name} applied to Job: ${job.title}`);
        
        const matchRes = await axios.post(`${aiServiceUrl}/api/assessment/evaluate-match`, {
          candidate: {
            name: candidate.name,
            currentTitle: candidate.currentTitle,
            skills: candidate.skills,
            eqScores: candidate.eqScores
          },
          job: {
            title: job.title,
            description: job.description,
            skillsRequired: job.skillsRequired,
            experienceLevel: job.experienceLevel
          }
        });

        if (matchRes.data && matchRes.data.success) {
          eqMatchScore = matchRes.data.data.matchScore;
          technicalScore = matchRes.data.data.details.technicalScore || 0;
          eqScore = matchRes.data.data.details.eqScore || 0;
          matchReasoning = matchRes.data.data.details.reasoning || "";
          console.log(`Evaluated Total Fit Score: ${eqMatchScore}%`);
        }
      }
    } catch (aiError) {
      console.error("Failed to calculate AI match score, defaulting to 0:", aiError.message);
      // We don't fail the application if AI service is down or there is an issue
    }

    const applicationData = { ...req.body, eqMatchScore, technicalScore, eqScore, matchReasoning };
    const application = await Application.create(applicationData);
    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PATCH /api/applications/:id/shortlist — Mark application as shortlisted
exports.shortlistApplication = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid application ID" });
    }
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status: "Shortlisted" },
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }
    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/applications/:id/reject — Mark application as rejected
exports.rejectApplication = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid application ID" });
    }
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }
    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Auto-evaluate candidate's existing applications
exports.reEvaluateCandidateApplications = async (candidateId) => {
  try {
    const candidate = await User.findById(candidateId);
    if (!candidate || !candidate.eqScores || candidate.eqScores.aggregate === 0) return;

    const applications = await Application.find({ candidateId }).populate("jobId");
    
    for (const app of applications) {
      const job = app.jobId;
      if (!job) continue;

      try {
        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:5001';
        const matchRes = await axios.post(`${aiServiceUrl}/api/assessment/evaluate-match`, {
          candidate: {
            name: candidate.name,
            currentTitle: candidate.currentTitle,
            skills: candidate.skills,
            eqScores: candidate.eqScores
          },
          job: {
            title: job.title,
            description: job.description,
            skillsRequired: job.skillsRequired,
            experienceLevel: job.experienceLevel
          }
        });

        if (matchRes.data && matchRes.data.success) {
          app.eqMatchScore = matchRes.data.data.matchScore;
          app.technicalScore = matchRes.data.data.details.technicalScore || 0;
          app.eqScore = matchRes.data.data.details.eqScore || 0;
          app.matchReasoning = matchRes.data.data.details.reasoning || "";
          await app.save();
          console.log(`Re-evaluated Application for ${candidate.name} on Job: ${job.title} -> ${app.eqMatchScore}%`);
        }
      } catch (err) {
        console.error(`Failed to re-evaluate application ${app._id}:`, err.message);
      }
    }
  } catch (error) {
    console.error("Error in reEvaluateCandidateApplications:", error.message);
  }
};
