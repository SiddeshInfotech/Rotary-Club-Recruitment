const Job = require("../models/Job");
const CandidateProfile = require("../models/CandidateProfile");

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

// ✅ GET MY JOBS (Recruiter)
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

// ✅ MATCH SCORE (Candidate)
exports.getMatchScore = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const profile = await CandidateProfile.findOne({
      user: req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    // 🟢 SKILLS MATCH
    const candidateSkills = profile.skills?.technical || [];
    const jobSkills = job.skillsRequired || [];

    const matchedSkills = jobSkills.filter((skill) =>
      candidateSkills.includes(skill)
    );

    const skillsMatch =
      jobSkills.length > 0
        ? (matchedSkills.length / jobSkills.length) * 100
        : 0;

    // 🟢 EQ MATCH
    const eq = profile.eqScores || {};
    const eqValues = Object.values(eq);

    const eqMatch =
      eqValues.length > 0
        ? eqValues.reduce((a, b) => a + b, 0) / eqValues.length
        : 0;

    // 🟢 FINAL SCORE
    const matchScore = Math.round((skillsMatch + eqMatch) / 2);

    res.status(200).json({
      success: true,
      data: {
        matchScore,
        skillsMatch: Math.round(skillsMatch),
        eqMatch: Math.round(eqMatch),
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};