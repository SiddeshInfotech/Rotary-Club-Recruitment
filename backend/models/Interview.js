const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    candidateName: { type: String, default: "" },
    candidateEmail: { type: String, default: "" },
    candidateAvatar: { type: String, default: "" },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    jobTitle: { type: String, default: "" },
    date: { type: Date, required: true },
    time: { type: String, default: "" },
    duration: { type: Number, default: 30 },
    type: { type: String, enum: ["Video", "Phone", "In-person", "Panel"], default: "Video" },
    status: { type: String, enum: ["Scheduled", "Completed", "Cancelled", "Rescheduled"], default: "Scheduled" },
    notes: { type: String, default: "" },
    meetingLink: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);
