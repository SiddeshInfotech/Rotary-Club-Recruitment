require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const CandidateProfile = require("./models/CandidateProfile");

async function migrate() {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is missing in your .env file.");
      process.exit(1);
    }

    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to DB.");

    // Find all users who are marked as Premium
    const profiles = await CandidateProfile.find({ isPremium: true }).populate("user", "name");
    
    if (profiles.length === 0) {
      console.log("No premium profiles found to migrate.");
      process.exit(0);
    }

    console.log(`Found ${profiles.length} premium profiles to update. Starting migration...`);

    const AISERVICE_URL = process.env.AISERVICE_URL || "http://localhost:5001";

    for (const profile of profiles) {
      const candidateName = profile.user ? profile.user.name : "Candidate";
      console.log(`\nRegenerating insights for: ${candidateName}`);

      try {
        const response = await fetch(`${AISERVICE_URL}/api/assessment/generate-insights`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: candidateName,
            eqScores: profile.eqScores || {},
          }),
        });

        if (response.ok) {
          const json = await response.json();
          if (json.success && json.data) {
            
            // Preserve their existing interview prep if they generated it
            const existingInterviewPrep = profile.premiumInsights?.interviewPrep;
            const existingInterviewPrepGeneratedAt = profile.premiumInsights?.interviewPrepGeneratedAt;

            profile.premiumInsights = {
              ...json.data,
              interviewPrep: existingInterviewPrep,
              interviewPrepGeneratedAt: existingInterviewPrepGeneratedAt,
            };

            await profile.save();
            console.log(`✅ Successfully updated insights for ${candidateName}`);
          } else {
            console.log(`❌ AI service failed to generate insights for ${candidateName}`);
          }
        } else {
          console.log(`❌ Failed to connect to AI service for ${candidateName} (Status: ${response.status})`);
        }
      } catch (err) {
        console.error(`❌ Error updating ${candidateName}:`, err.message);
      }

      // 2-second delay to prevent hitting Gemini rate limits
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    console.log("\n🎉 Migration complete!");
    process.exit(0);

  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
