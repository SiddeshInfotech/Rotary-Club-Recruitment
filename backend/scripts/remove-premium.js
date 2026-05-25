require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const CandidateProfile = require('../models/CandidateProfile');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const result = await CandidateProfile.updateMany(
    { isPremium: true },
    { $set: { isPremium: false, premiumPlan: null, premiumExpiresAt: null } }
  );

  console.log(`Updated ${result.modifiedCount} profile(s) to remove premium status.`);
  
  await mongoose.disconnect();
}

run().catch(console.error);
