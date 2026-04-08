const Club = require("../models/Club");

exports.getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find().sort({ name: 1 });
    res.json({ success: true, count: clubs.length, data: clubs });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ success: false, message: "Club not found" });
    res.json({ success: true, data: club });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createClub = async (req, res) => {
  try {
    const club = await Club.create(req.body);
    res.status(201).json({ success: true, data: club });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
