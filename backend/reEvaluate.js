require('dotenv').config();
const mongoose = require('mongoose');
const Application = require('./models/Application');
const Job = require('./models/Job');
const User = require('./models/User');
const axios = require('axios');

async function run() {
  const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/eq-hire-recruiter";
  await mongoose.connect(MONGO_URI);
  console.log("Connected to DB");

  const apps = await Application.find({});
  console.log(`Found ${apps.length} applications to evaluate.`);

  for (const app of apps) {
    try {
      const candidate = await User.findById(app.candidateId);
      const job = await Job.findById(app.jobId);

      if (candidate && job) {
        console.log(`Evaluating Candidate ${candidate.name} for Job ${job.title}...`);
        
        // Ensure AI service is running or mock it if not
        const matchRes = await axios.post('http://localhost:5001/api/assessment/evaluate-match', {
          candidate: {
            name: candidate.name,
            currentTitle: candidate.currentTitle,
            skills: candidate.skills,
            eqScores: candidate.eqScores,
            technicalScores: candidate.technicalScores
          },
          job: {
            title: job.title,
            description: job.description,
            skillsRequired: job.skillsRequired,
            experienceLevel: job.experienceLevel
          }
        });

        if (matchRes.data && matchRes.data.success) {
          const score = matchRes.data.data.matchScore;
          app.eqMatchScore = score;
          app.technicalScore = matchRes.data.data.details.technicalScore !== undefined ? matchRes.data.data.details.technicalScore : 0;
          app.eqScore = matchRes.data.data.details.eqScore !== undefined ? matchRes.data.data.details.eqScore : 0;
          app.matchReasoning = matchRes.data.data.details.reasoning || "";
          await app.save();
          console.log(`-> Saved score: ${score}%`);
        }
      } else {
        console.log(`Skipping app ${app._id}: Missing candidate/job or eqScores`);
      }
    } catch (err) {
      console.error(`Error on app ${app._id}:`, err.message);
    }
  }

  console.log("Done!");
  process.exit(0);
}

run();
