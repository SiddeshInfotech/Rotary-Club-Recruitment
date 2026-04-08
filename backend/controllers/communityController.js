const CommunityPost = require("../models/CommunityPost");

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find().sort({ createdAt: -1 }).populate("author", "name email role");
    res.json({ success: true, count: posts.length, data: posts });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createPost = async (req, res) => {
  try {
    const { content, image, tags } = req.body;
    const post = await CommunityPost.create({
      author: req.user.id, authorName: req.user.name, authorRole: req.user.role,
      content, image, tags: tags || [],
    });
    res.status(201).json({ success: true, data: post });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.likePost = async (req, res) => {
  try {
    const post = await CommunityPost.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    res.json({ success: true, data: post });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
