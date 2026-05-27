const mongoose = require("mongoose");

async function clearCooldown() {
  try {
    await mongoose.connect("mongodb://localhost:27017/eq-hire-recruiter");
    
    const db = mongoose.connection.db;
    const candidateId = new mongoose.Types.ObjectId("69d73b343f6d73aa92d393d1");

    // 1. Unset lastTechAssessedAt on the user
    await db.collection("users").updateOne(
      { _id: candidateId },
      { $unset: { lastTechAssessedAt: "" } }
    );

    // 2. Make all past TechnicalAssessments for this user appear to be 32 days old
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 32);

    const result = await db.collection("technicalassessments").updateMany(
      { candidateId: candidateId, status: "completed" },
      { $set: { completedAt: pastDate } }
    );
    
    console.log("Modified technical assessments count:", result.modifiedCount);
    
    await mongoose.disconnect();
    console.log("Done");
  } catch (e) {
    console.error(e);
  }
}

clearCooldown();
