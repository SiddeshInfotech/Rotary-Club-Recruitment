require('dotenv').config();
const mongoose = require('mongoose');
const Application = require('./models/Application');
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/eq-hire-recruiter";

async function run() {
  await mongoose.connect(MONGO_URI);
  const apps = await Application.find().populate('candidateId').populate('jobId');
  console.log("Total apps:", apps.length);
  const validApps = apps.filter(a => a.candidateId && a.jobId);
  console.log("Valid apps (with candidate and job):", validApps.length);
  process.exit(0);
}
run();
