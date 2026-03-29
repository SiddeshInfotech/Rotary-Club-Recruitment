const Application = require("../models/Application");
const mongoose = require("mongoose");

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
