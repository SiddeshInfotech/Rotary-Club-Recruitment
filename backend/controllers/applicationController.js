const Application = require("../models/Application");
const mongoose = require("mongoose");
const Job = require("../models/Job");
const User = require("../models/User");
const createNotification = require("../utils/createNotification");

// GET /api/applications — List all applications (optional filter by jobId)
exports.getAllApplications = async (req, res) => {
  try {
    const filter = {};
    if (req.query.jobId) filter.jobId = req.query.jobId;

    const applications = await Application.find(filter)
      .populate("jobId", "title type location status")
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
    const application = await Application.create(req.body);
    
    // Notify recruiter
    if (req.body.jobId && req.body.userId) {
      const job = await Job.findById(req.body.jobId).populate("recruiter recruiterId");
      const candidateUser = await User.findById(req.body.userId);
      const recruiterId = job?.recruiter?._id || job?.recruiterId?._id;
      
      if (recruiterId && candidateUser && recruiterId.toString() !== candidateUser._id.toString()) {
        const avatarName = encodeURIComponent(candidateUser.name || "User");
        await createNotification({
          user: recruiterId,
          type: "job",
          title: "New Job Application",
          message: `${candidateUser.name} applied for ${job.title}`,
          link: `/recruiter/applications`,
          actorName: candidateUser.name,
          actorAvatar: `https://ui-avatars.com/api/?name=${avatarName}&background=0F172A&color=fff&bold=true`
        });
      }
    }

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

    // Notify candidate
    if (application.userId) {
      const job = await Job.findById(application.jobId);
      const recruiterName = req.user ? req.user.name : "Recruiter";
      const avatarName = encodeURIComponent(recruiterName);
      
      await createNotification({
        user: application.userId,
        type: "success",
        title: "Application Shortlisted",
        message: `Your application for ${job ? job.title : "a job"} was shortlisted!`,
        link: `/candidate-dashboard`,
        actorName: recruiterName,
        actorAvatar: `https://ui-avatars.com/api/?name=${avatarName}&background=0F172A&color=fff&bold=true`
      });
    }

    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
