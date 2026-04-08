const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["Rotary", "Lions", "BNI", "Other"], default: "Rotary" },
    location: { type: String, default: "" },
    members: { type: Number, default: 0 },
    description: { type: String, default: "" },
    founded: { type: String, default: "" },
    meetingSchedule: { type: String, default: "" },
    president: { type: String, default: "" },
    website: { type: String, default: "" },
    tags: [String],
    rating: { type: Number, default: 4.5 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Club", clubSchema);
