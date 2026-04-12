const Job = require("../models/Job");
const CandidateProfile = require("../models/CandidateProfile");

// MATCH SCORE (Candidate vs Job)
exports.getMatchScore = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const profile = await CandidateProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Candidate profile not found" });
    }

    // Skills Match
    const candidateSkills = profile.skills?.technical || [];
    const jobSkills = job.skillsRequired || [];

    const matchedSkills = jobSkills.filter((skill) =>
      candidateSkills.includes(skill)
    );

    const skillsMatch =
      jobSkills.length > 0
        ? (matchedSkills.length / jobSkills.length) * 100
        : 0;

    // EQ Match
    const eq = profile.eqScores || {};
    const eqValues = Object.values(eq).filter(v => typeof v === 'number');

    const eqMatch =
      eqValues.length > 0
        ? eqValues.reduce((a, b) => a + b, 0) / eqValues.length
        : 0;

    // Final Score
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
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET JOB DETAILS (by ID) — public
exports.getJobDetails = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// SEARCH JOBS — public
exports.searchJobs = async (req, res) => {
  try {
    const { keyword, location, jobType, experience, skills, remote, sort } = req.query;

    let query = {};

    if (keyword) {
      const regex = { $regex: keyword, $options: "i" };
      query.$or = [
        { title: regex },
        { company: regex },
        { companyName: regex },
        { description: regex },
      ];
    }

    if (remote === 'true') {
      query.location = { $regex: 'remote', $options: 'i' };
    } else if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (jobType && jobType !== "All") {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { type: { $regex: jobType, $options: "i" } },
          { jobType: { $regex: jobType, $options: "i" } }
        ]
      });
    }

    if (experience && experience !== "All") {
      query.experienceRequired = { $regex: experience, $options: "i" };
    }

    if (skills) {
      // Allow comma separated skills e.g. "React, Node"
      const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
      if (skillsArray.length > 0) {
        query.$and = query.$and || [];
        query.$and.push({
          skillsRequired: { $regex: skillsArray.join('|'), $options: 'i' }
        });
      }
    }

    let sortOptions = { createdAt: -1 }; // Most Recent by default
    if (sort === 'Oldest') {
        sortOptions = { createdAt: 1 };
    } else if (sort === 'Salary High') {
        sortOptions = { salary: -1, createdAt: -1 };
    } else if (sort === 'Salary Low') {
        sortOptions = { salary: 1, createdAt: -1 };
    } else if (sort === 'Company A-Z') {
        sortOptions = { companyName: 1, company: 1, createdAt: -1 };
    }

    const jobs = await Job.find(query).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
