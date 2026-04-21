const CommunityPost = require("../models/CommunityPost");
const createNotification = require("../utils/createNotification");

// GET all posts (newest first)
exports.getAllPosts = async (req, res) => {
  try {
    // Only show posts that are published (not scheduled for future)
    const now = new Date();
    const posts = await CommunityPost.find({
      $or: [
        { scheduledAt: null },
        { scheduledAt: { $exists: false } },
        { scheduledAt: { $lte: now } }
      ]
    })
      .sort({ createdAt: -1 })
      .populate("author", "name email role currentTitle")
      .lean();

    // Add helper fields for the frontend (handles old posts where likes/comments may be Numbers)
    const userId = req.user?._id?.toString();
    const enriched = posts.map((post) => {
      const likesArr = Array.isArray(post.likes) ? post.likes : [];
      const commentsArr = Array.isArray(post.comments) ? post.comments : [];
      return {
        ...post,
        likes: likesArr,
        comments: commentsArr,
        likesCount: likesArr.length,
        commentsCount: commentsArr.length,
        isLiked: userId ? likesArr.some((id) => id.toString() === userId) : false,
      };
    });

    res.json({ success: true, count: enriched.length, data: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CREATE a new post
exports.createPost = async (req, res) => {
  try {
    const { content, image, tags, visibility, commentControl, scheduledAt } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: "Post content is required" });
    }

    const avatarName = encodeURIComponent(req.user.name || "User");
    const post = await CommunityPost.create({
      author: req.user._id,
      authorName: req.user.name,
      authorRole: req.user.role,
      authorTitle: req.user.currentTitle || "",
      authorAvatar: `https://ui-avatars.com/api/?name=${avatarName}&background=0F172A&color=fff&bold=true`,
      content: content.trim(),
      image: image || "",
      visibility: visibility || "anyone",
      commentControl: commentControl || "anyone",
      tags: tags || [],
      scheduledAt: scheduledAt || null,
    });

    res.status(201).json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET current user's scheduled posts
exports.getScheduledPosts = async (req, res) => {
  try {
    const now = new Date();
    const posts = await CommunityPost.find({
      author: req.user._id,
      scheduledAt: { $gt: now }
    })
      .sort({ scheduledAt: 1 })
      .lean();
    res.json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE a post (used for editing active or scheduled posts)
exports.updatePost = async (req, res) => {
  try {
    const { content, image, visibility, commentControl, scheduledAt } = req.body;
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (content) post.content = content.trim();
    if (image !== undefined) post.image = image;
    if (visibility) post.visibility = visibility;
    if (commentControl) post.commentControl = commentControl;
    if (scheduledAt !== undefined) post.scheduledAt = scheduledAt;

    await post.save();
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// TOGGLE like on a post
exports.toggleLike = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const userId = req.user._id;
    const alreadyLiked = post.likes.some((id) => id.toString() === userId.toString());

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);

      // Notify post author if not the same person
      if (post.author.toString() !== userId.toString()) {
        const avatarName = encodeURIComponent(req.user.name || "User");
        await createNotification({
          user: post.author,
          type: "community",
          title: "New Like",
          message: `${req.user.name} liked your post.`,
          link: `/community-feed`,
          actorName: req.user.name,
          actorAvatar: `https://ui-avatars.com/api/?name=${avatarName}&background=0F172A&color=fff&bold=true`
        });
      }
    }

    await post.save();

    res.json({
      success: true,
      data: {
        likesCount: post.likes.length,
        isLiked: !alreadyLiked,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ADD a comment to a post
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }

    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const avatarName = encodeURIComponent(req.user.name || "User");
    const comment = {
      author: req.user._id,
      authorName: req.user.name,
      authorAvatar: `https://ui-avatars.com/api/?name=${avatarName}&background=0F172A&color=fff&bold=true`,
      text: text.trim(),
    };

    post.comments.push(comment);
    await post.save();

    // Notify post author if not the same person
    if (post.author.toString() !== req.user._id.toString()) {
      await createNotification({
        user: post.author,
        type: "community",
        title: "New Comment",
        message: `${req.user.name} commented on your post.`,
        link: `/community-feed`,
        actorName: req.user.name,
        actorAvatar: `https://ui-avatars.com/api/?name=${avatarName}&background=0F172A&color=fff&bold=true`
      });
    }

    // Return the newly added comment (last one in the array)
    const newComment = post.comments[post.comments.length - 1];
    res.status(201).json({ success: true, data: newComment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE a post (author only)
exports.deletePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await CommunityPost.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// REPOST a post
exports.repostPost = async (req, res) => {
  try {
    const originalPost = await CommunityPost.findById(req.params.id);
    if (!originalPost) return res.status(404).json({ success: false, message: "Original post not found" });

    const avatarName = encodeURIComponent(req.user.name || "User");
    const repostedContent = `Reposted from ${originalPost.authorName}:\n\n${originalPost.content}`;

    const newPost = await CommunityPost.create({
      author: req.user._id,
      authorName: req.user.name,
      authorRole: req.user.role,
      authorTitle: req.user.currentTitle || "",
      authorAvatar: `https://ui-avatars.com/api/?name=${avatarName}&background=0F172A&color=fff&bold=true`,
      content: repostedContent,
      image: originalPost.image || "",
      visibility: originalPost.visibility || "anyone",
      commentControl: originalPost.commentControl || "anyone",
      tags: originalPost.tags || [],
    });

    // Notify original author
    if (originalPost.author.toString() !== req.user._id.toString()) {
      await createNotification({
        user: originalPost.author,
        type: "community",
        title: "New Repost",
        message: `${req.user.name} reposted your post.`,
        link: `/community-feed`,
        actorName: req.user.name,
        actorAvatar: `https://ui-avatars.com/api/?name=${avatarName}&background=0F172A&color=fff&bold=true`
      });
    }

    res.status(201).json({ success: true, data: newPost });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
