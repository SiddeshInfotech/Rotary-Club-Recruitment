require('dotenv').config();
const mongoose = require('mongoose');
const Application = require('./models/Application');
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/eq-hire-recruiter";

async function run() {
  await mongoose.connect(MONGO_URI);
  require('./models/User');
  require('./models/Job');
  const Interview = require('./models/Interview');
  const apps = await Application.find().populate('candidateId').populate('jobId');
  console.log("Total apps:", apps.length);
  for (const app of apps) {
    const interviews = await Interview.find({ candidate: app.candidateId, job: app.jobId });
    console.log(`\nApplication ID: ${app._id}`);
    console.log(`Candidate: ${app.candidateId ? app.candidateId.name : 'N/A'} (${app.candidateId ? app.candidateId.email : 'N/A'})`);
    console.log(`Job: ${app.jobId ? app.jobId.title : 'N/A'}`);
    console.log(`Status: ${app.status}`);
    console.log(`Current Round: ${app.currentRound || 'N/A'}`);
    console.log(`Weighted Match Score: ${app.eqMatchScore}%`);
    console.log(`Tech Fit Score: ${app.technicalScore}%`);
    console.log(`EQ Fit Score: ${app.eqScore}%`);
    console.log(`Interviews Scheduled: ${interviews.length}`);
    for (const iv of interviews) {
      console.log(`  - Interview: Round: ${iv.round}, Status: ${iv.status}, Date/Time: ${iv.date} ${iv.time}`);
    }
  }
  process.exit(0);
}
run();
