const SuccessStory = require("../models/SuccessStory");

exports.getAllStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find().sort({ createdAt: -1 });
    res.json({ success: true, count: stories.length, data: stories });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getStoryById = async (req, res) => {
  try {
    const story = await SuccessStory.findById(req.params.id);
    if (!story) return res.status(404).json({ success: false, message: "Story not found" });
    res.json({ success: true, data: story });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createStory = async (req, res) => {
  try {
    const story = await SuccessStory.create(req.body);
    res.status(201).json({ success: true, data: story });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
