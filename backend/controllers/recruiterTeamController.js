const RecruiterProfileTeam = require("../models/RecruiterProfileTeam");
const CandidateProfile = require("../models/CandidateProfile");
const User = require("../models/User");

// CREATE or UPDATE recruiter profile
exports.createOrUpdateRecruiterProfile = async (req, res) => {
  try {
    const {
      companyName,
      industry,
      roleHiringFor,
      requiredSkills,
      experienceRequired,
      companyDescription,
    } = req.body;

    if (!companyName || !industry || !roleHiringFor || !requiredSkills || !experienceRequired || !companyDescription) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const skillsArray = Array.isArray(requiredSkills)
      ? requiredSkills
      : requiredSkills.split(",").map((s) => s.trim());

    const userId = req.user.id;

    let profile = await RecruiterProfileTeam.findOne({ user: userId });

    if (profile) {
      profile = await RecruiterProfileTeam.findOneAndUpdate(
        { user: userId },
        { companyName, industry, roleHiringFor, requiredSkills: skillsArray, experienceRequired, companyDescription },
        { new: true }
      );
    } else {
      profile = await RecruiterProfileTeam.create({
        user: userId,
        companyName,
        industry,
        roleHiringFor,
        requiredSkills: skillsArray,
        experienceRequired,
        companyDescription,
      });
    }

    res.status(200).json({ success: true, message: "Recruiter profile saved successfully", data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET recruiter profile
exports.getRecruiterProfile = async (req, res) => {
  try {
    const profile = await RecruiterProfileTeam.findOne({ user: req.user.id }).populate("user", "name email");

    if (!profile) {
      return res.status(404).json({ success: false, message: "Recruiter profile not found" });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL CANDIDATES (basic list)
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await CandidateProfile.find()
      .populate("user", "name email role")
      .select("college degree skills experienceLevel user");

    res.status(200).json({ success: true, count: candidates.length, data: candidates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE CANDIDATE PROFILE (detailed view)
exports.getCandidateProfileById = async (req, res) => {
  const fs = require('fs');
  const logFile = '/Users/zeelhiteshbhaigondaliya/.gemini/antigravity/scratch/api_call.log';
  try {
    const { id } = req.params;
    fs.appendFileSync(logFile, `[${new Date().toISOString()}] getCandidateProfileById called with id: ${id}, headers: ${JSON.stringify(req.headers)}\n`);

    const user = await User.findById(id).select("-password -otp -resetPasswordToken -otpExpires -resetPasswordExpires");

    if (!user) {
      fs.appendFileSync(logFile, `[${new Date().toISOString()}] User not found in DB for id: ${id}\n`);
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }

    const profile = await CandidateProfile.findOne({ user: id });

    // Combine user and candidate profile details to ensure the chat sidebar is fully populated
    const mergedData = {
      ...user.toObject(),
      location: user.location || (profile ? profile.college : "") || "Location not specified",
      currentTitle: user.currentTitle || (profile ? profile.preferredJobRole : "") || "Candidate",
      bio: user.bio || (profile ? profile.summary : "") || "",
      resumeLink: user.resumeLink || (profile ? profile.resumeUrl : "") || "",
      skills: user.skills || (profile ? [
        ...(profile.skills?.technical || []),
        ...(profile.skills?.soft || []),
        ...(profile.skills?.tools || [])
      ].filter(Boolean).join(", ") : "") || "",
      eqScores: {
        leadership: user.eqScores?.leadership || (profile?.eqScores?.leadership) || 0,
        loyalty: user.eqScores?.loyalty || (profile?.eqScores?.loyalty) || 0,
        adaptability: user.eqScores?.adaptability || (profile?.eqScores?.adaptability) || 0,
        growthMindset: user.eqScores?.growthMindset || (profile?.eqScores?.growthMindset) || 0,
        reliability: user.eqScores?.reliability || (profile?.eqScores?.reliability) || 0,
        teamwork: user.eqScores?.teamwork || (profile?.eqScores?.teamwork) || 0,
        collaboration: user.eqScores?.collaboration || (profile?.eqScores?.collaboration) || 0,
        problemSolving: user.eqScores?.problemSolving || (profile?.eqScores?.problemSolving) || 0,
        aggregate: user.eqScores?.aggregate || (profile?.eqScores?.aggregate) || 0,
      }
    };

    fs.appendFileSync(logFile, `[${new Date().toISOString()}] getCandidateProfileById success: ${JSON.stringify(mergedData)}\n`);
    res.status(200).json({ success: true, data: mergedData });
  } catch (error) {
    fs.appendFileSync(logFile, `[${new Date().toISOString()}] getCandidateProfileById error: ${error.stack || error.message}\n`);
    res.status(500).json({ success: false, message: error.message });
  }
};
