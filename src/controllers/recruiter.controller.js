const RecruiterProfile = require("../models/RecruiterProfile");
const CandidateProfile = require("../models/CandidateProfile");

// ✅ CREATE or UPDATE recruiter profile
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

    // ✅ Validation
    if (
      !companyName ||
      !industry ||
      !roleHiringFor ||
      !requiredSkills ||
      !experienceRequired ||
      !companyDescription
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ Handle array/string
    const skillsArray = Array.isArray(requiredSkills)
      ? requiredSkills
      : requiredSkills.split(",").map((s) => s.trim());

    const userId = req.user.id;

    let profile = await RecruiterProfile.findOne({ user: userId });

    if (profile) {
      // 🔄 UPDATE
      profile = await RecruiterProfile.findOneAndUpdate(
        { user: userId },
        {
          companyName,
          industry,
          roleHiringFor,
          requiredSkills: skillsArray,
          experienceRequired,
          companyDescription,
        },
        { new: true }
      );
    } else {
      // 🆕 CREATE
      profile = await RecruiterProfile.create({
        user: userId,
        companyName,
        industry,
        roleHiringFor,
        requiredSkills: skillsArray,
        experienceRequired,
        companyDescription,
      });
    }

    res.status(200).json({
      success: true,
      message: "Recruiter profile saved successfully",
      data: profile,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ GET recruiter profile
exports.getRecruiterProfile = async (req, res) => {
  try {
    const profile = await RecruiterProfile.findOne({
      user: req.user.id,
    }).populate("user", "name email");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Recruiter profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ GET ALL CANDIDATES (basic list)
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await CandidateProfile.find()
      .populate("user", "name email role")
      .select("college degree skills experienceLevel user");

    res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ GET SINGLE CANDIDATE PROFILE (FULL VIEW)
exports.getCandidateProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await CandidateProfile.findOne({
      user: id,
    }).populate("user", "name email role");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};