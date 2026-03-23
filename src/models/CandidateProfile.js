const mongoose = require("mongoose");

const candidateProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    college: String,
    degree: String,
    skills: [String],
    interests: [String],
    experienceLevel: String,
    preferredJobRole: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("CandidateProfile", candidateProfileSchema);