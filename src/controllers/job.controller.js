const Job = require("../models/Job");

// ✅ CREATE JOB (Recruiter)
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      companyName,
      location,
      jobType,
      skillsRequired,
      experienceRequired,
      description,
    } = req.body;

    // validation
    if (
      !title ||
      !companyName ||
      !jobType ||
      !skillsRequired ||
      !experienceRequired ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const skillsArray = Array.isArray(skillsRequired)
      ? skillsRequired
      : skillsRequired.split(",").map((s) => s.trim());

    const job = await Job.create({
      recruiter: req.user.id,
      title,
      companyName,
      location,
      jobType,
      skillsRequired: skillsArray,
      experienceRequired,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ GET ALL JOBS (Candidate)
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("recruiter", "name email");

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ GET JOBS BY RECRUITER
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user.id });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};