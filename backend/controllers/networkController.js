const { NetworkConnection, Referral } = require("../models/Network");
const User = require("../models/User");

exports.getConnections = async (req, res) => {
  try {
    const connections = await NetworkConnection.find({
      $or: [{ user: req.user.id }, { connectedUser: req.user.id }], status: "accepted",
    }).populate("user", "name email role").populate("connectedUser", "name email role");
    res.json({ success: true, count: connections.length, data: connections });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.sendConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.body;
    const existing = await NetworkConnection.findOne({
      $or: [
        { user: req.user.id, connectedUser: userId },
        { user: userId, connectedUser: req.user.id },
      ],
    });
    if (existing) return res.status(400).json({ success: false, message: "Connection already exists" });
    const connection = await NetworkConnection.create({ user: req.user.id, connectedUser: userId });
    res.status(201).json({ success: true, data: connection });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getMembers = async (req, res) => {
  try {
    const members = await User.find().select("name email role createdAt").sort({ createdAt: -1 });
    res.json({ success: true, count: members.length, data: members });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find({ referrer: req.user.id })
      .populate("referred", "name email").populate("job", "title").sort({ createdAt: -1 });
    res.json({ success: true, count: referrals.length, data: referrals });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createReferral = async (req, res) => {
  try {
    const { referredEmail, referredName, jobTitle, notes } = req.body;
    const referral = await Referral.create({
      referrer: req.user.id, referredEmail, referredName, jobTitle, notes,
    });
    res.status(201).json({ success: true, data: referral });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
