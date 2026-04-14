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

    // --- 1. Skills Match ---
    const candidateSkills = profile.skills?.technical || [];
    const jobSkills = job.skillsRequired || [];
    const matchedSkills = jobSkills.filter((skill) =>
      candidateSkills.some(s => s.toLowerCase() === skill.toLowerCase())
    );

    const skillsMatch = jobSkills.length > 0
        ? (matchedSkills.length / jobSkills.length) * 100
        : 0;

    // --- 2. EQ Match ---
    const eq = profile.eqScores || {};
    const eqValues = Object.values(eq).filter(v => typeof v === 'number');
    const eqMatch = eqValues.length > 0
        ? eqValues.reduce((a, b) => a + b, 0) / eqValues.length
        : 0;

    // --- 3. Education/Backlog Check (Added logic) ---
    // You can use this to lower the score or flag the user
    let criteriaMet = true;
    if (job.education?.allowBacklogs === false && profile.hasBacklogs === true) {
        criteriaMet = false;
    }

    // Final Score
    const matchScore = Math.round((skillsMatch + eqMatch) / 2);

    res.status(200).json({
      success: true,
      data: {
        matchScore,
        skillsMatch: Math.round(skillsMatch),
        eqMatch: Math.round(eqMatch),
        meetsCriteria: criteriaMet
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

    let query = { status: "Active" }; // Only show active jobs

    // A. Keyword Search
    if (keyword) {
      const regex = { $regex: keyword, $options: "i" };
      query.$or = [
        { title: regex },
        { companyName: regex },
        { description: regex },
      ];
    }

    // B. Smart Location Logic (Updated for your 3-option model)
    if (remote === 'true') {
      query.locationType = "Remote";
    } else if (location) {
      // Searches both the City field and the General Location field
      query.$or = query.$or || [];
      query.$or.push(
        { location: { $regex: location, $options: "i" } },
        { locationType: { $regex: location, $options: "i" } }
      );
    }

    // C. Employment Type (Full-time, Internship, etc.)
    if (jobType && jobType !== "All") {
      query.type = jobType;
    }

    // D. Exact Experience Level Match
    if (experience && experience !== "All") {
      query.experienceLevel = experience;
    }

    // E. Skills Filter
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
      if (skillsArray.length > 0) {
        // Find jobs that have ANY of these skills
        query.skillsRequired = { $in: skillsArray.map(s => new RegExp(s, 'i')) };
      }
    }

    // F. Sorting
    let sortOptions = { createdAt: -1 }; 
    if (sort === 'Oldest') {
        sortOptions = { createdAt: 1 };
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