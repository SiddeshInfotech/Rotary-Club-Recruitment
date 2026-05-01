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
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password -otp -resetPasswordToken -otpExpires -resetPasswordExpires");

    if (!user) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
