const mongoose = require("mongoose");

const networkConnectionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    connectedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

const referralSchema = new mongoose.Schema(
  {
    referrer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    referred: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    referredEmail: { type: String, required: true },
    referredName: { type: String, default: "" },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    jobTitle: { type: String, default: "" },
    status: { type: String, enum: ["Sent", "Viewed", "Applied", "Hired"], default: "Sent" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const NetworkConnection = mongoose.model("NetworkConnection", networkConnectionSchema);
const Referral = mongoose.model("Referral", referralSchema);

module.exports = { NetworkConnection, Referral };
