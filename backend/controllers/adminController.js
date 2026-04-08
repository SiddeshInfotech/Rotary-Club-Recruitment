const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const CandidateProfile = require("../models/CandidateProfile");
const SupportTicket = require("../models/SupportTicket");

exports.getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalJobs, totalApplications, totalCandidates, totalRecruiters, openTickets] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      User.countDocuments({ role: "candidate" }),
      User.countDocuments({ role: "recruiter" }),
      SupportTicket.countDocuments({ status: "Open" }),
    ]);
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(10).select("name email role createdAt");
    const recentJobs = await Job.find().sort({ createdAt: -1 }).limit(10).select("title companyName status createdAt");
    res.json({
      success: true,
      data: { totalUsers, totalJobs, totalApplications, totalCandidates, totalRecruiters, openTickets, recentUsers, recentJobs },
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
