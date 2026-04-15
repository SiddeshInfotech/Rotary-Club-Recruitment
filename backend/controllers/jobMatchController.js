const Job = require("../models/Job");
const CandidateProfile = require("../models/CandidateProfile");
const User = require("../models/User");

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
    const { keyword, location, jobType, experience, skills, remote, sort, page, limit } = req.query;

    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

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

    const jobs = await Job.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNumber);
        
    const totalJobs = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      count: jobs.length,
      totalJobs,
      hasNextPage: skip + jobs.length < totalJobs,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// TOGGLE SAVE JOB (Candidate)
exports.toggleSaveJob = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id || req.user.id);
    
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const jobIndex = user.savedJobs.findIndex(jobId => jobId.toString() === id);
    if (jobIndex > -1) {
      user.savedJobs.splice(jobIndex, 1);
      await user.save();
      return res.status(200).json({ success: true, message: "Removed", isSaved: false });
    } else {
      user.savedJobs.push(id);
      await user.save();
      return res.status(200).json({ success: true, message: "Saved", isSaved: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CHECK IF JOB IS SAVED
exports.checkSavedJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    const isSaved = user.savedJobs.includes(req.params.id);
    res.status(200).json({ success: true, isSaved });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SAVED JOBS (Candidate)
exports.getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id).populate({
      path: 'savedJobs',
      select: 'title companyName company location type jobType description skillsRequired createdAt'
    });
    
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, data: user.savedJobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};