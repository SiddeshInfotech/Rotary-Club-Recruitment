const mongoose = require("mongoose");

const supportTicketSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    category: { type: String, enum: ["General", "Technical", "Billing", "Account", "Other"], default: "General" },
    status: { type: String, enum: ["Open", "In Progress", "Resolved", "Closed"], default: "Open" },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupportTicket", supportTicketSchema);
