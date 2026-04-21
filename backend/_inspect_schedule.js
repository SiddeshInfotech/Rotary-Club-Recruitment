const mongoose = require('mongoose');
require('dotenv').config();
const CommunityPost = require('./models/CommunityPost');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const posts = await CommunityPost.find().sort({ createdAt: -1 }).limit(3).lean();
    posts.forEach((p, i) => {
        console.log(`[Post ${i}] id=${p._id} content="${p.content}" scheduledAt=${p.scheduledAt}`);
    });
    mongoose.disconnect();
});
