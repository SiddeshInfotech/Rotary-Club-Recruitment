const CandidateProfile = require("../models/CandidateProfile");

// CREATE or UPDATE profile
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const {
      college,
      degree,
      summary,
      highlights,
      skills,
      interests,
      experienceLevel,
      preferredJobRole,
      resumeUrl,
      coverLetterUrl,
      eqScores,
    } = req.body;

    if (!college || !degree || !skills || !experienceLevel) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const userId = req.user.id;

    let profile = await CandidateProfile.findOne({ user: userId });

    if (profile) {
      profile = await CandidateProfile.findOneAndUpdate(
        { user: userId },
        { college, degree, summary, highlights, skills, interests, experienceLevel, preferredJobRole, resumeUrl, coverLetterUrl, eqScores },
        { new: true }
      );
    } else {
      profile = await CandidateProfile.create({
        user: userId,
        college,
        degree,
        summary,
        highlights,
        skills,
        interests,
        experienceLevel,
        preferredJobRole,
        resumeUrl,
        coverLetterUrl,
        eqScores,
      });
    }

    res.status(200).json({ success: true, message: "Profile saved successfully", data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET PROFILE (candidate self view)
exports.getProfile = async (req, res) => {
  try {
    const profile = await CandidateProfile.findOne({ user: req.user.id }).populate("user", "name email");

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
