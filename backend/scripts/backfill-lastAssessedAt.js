/**
 * One-time backfill script: sets lastAssessedAt for existing users
 * who have eqScores but no lastAssessedAt, using their latest
 * completed Assessment record's completedAt timestamp.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

// We need to reference the Assessment collection from ai-service
const assessmentSchema = new mongoose.Schema({
  candidateId: mongoose.Schema.Types.ObjectId,
  completedAt: Date,
  status: String,
}, { collection: 'assessments', strict: false });
const Assessment = mongoose.model('Assessment', assessmentSchema);

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Find all users with eqScores.aggregate > 0 and no lastAssessedAt
  const users = await User.find({
    'eqScores.aggregate': { $gt: 0 },
    lastAssessedAt: { $exists: false }
  });

  console.log(`Found ${users.length} user(s) to backfill`);

  for (const user of users) {
    // Find their latest completed assessment
    const latest = await Assessment.findOne({
      candidateId: user._id,
      status: 'completed'
    }).sort({ completedAt: -1 });

    if (latest && latest.completedAt) {
      user.lastAssessedAt = latest.completedAt;
      await user.save();
      console.log(`  ✓ ${user.name} (${user.email}) → lastAssessedAt set to ${latest.completedAt}`);
    } else {
      // Fallback: use updatedAt
      user.lastAssessedAt = user.updatedAt;
      await user.save();
      console.log(`  ~ ${user.name} (${user.email}) → fallback to updatedAt: ${user.updatedAt}`);
    }
  }

  console.log('Done!');
  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
