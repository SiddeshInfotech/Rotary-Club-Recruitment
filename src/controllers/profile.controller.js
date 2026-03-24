const CandidateProfile = require("../models/CandidateProfile");

// CREATE or UPDATE profile
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const {
      college,
      degree,
      skills,
      interests,
      experienceLevel,
      preferredJobRole,
    } = req.body;

     // ✅ VALIDATION
    if (
      !college ||
      !degree ||
      !skills ||
      !interests ||
      !experienceLevel ||
      !preferredJobRole
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ HANDLE STRING OR ARRAY INPUT
    const skillsArray = Array.isArray(skills)
      ? skills
      : skills.split(",").map((s) => s.trim());

    const interestsArray = Array.isArray(interests)
      ? interests
      : interests.split(",").map((i) => i.trim());

    const userId = req.user.id; // ✅ FIXED

    let profile = await CandidateProfile.findOne({ user: userId });

    if (profile) {
      // UPDATE
      profile = await CandidateProfile.findOneAndUpdate(
        { user: userId },
        {
          college,
          degree,
          skills,
          interests,
          experienceLevel,
          preferredJobRole,
        },
        { new: true }
      );
    } else {
      // CREATE
      profile = await CandidateProfile.create({
        user: userId,
        college,
        degree,
        skills,
        interests,
        experienceLevel,
        preferredJobRole,
      });
    }

    res.json({
      message: "Profile saved successfully",
      profile,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET profile
exports.getProfile = async (req, res) => {
  try {
    const profile = await CandidateProfile.findOne({
      user: req.user.id, // ✅ FIXED
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};