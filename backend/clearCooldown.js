const mongoose = require("mongoose");

async function clearCooldown() {
  try {
    await mongoose.connect("mongodb://localhost:27017/eq-hire-recruiter");
    
    // We'll unset lastTechAssessedAt for Smith Patel
    const db = mongoose.connection.db;
    const result = await db.collection("users").updateOne(
      { _id: new mongoose.Types.ObjectId("69d73b343f6d73aa92d393d1") },
      { $unset: { lastTechAssessedAt: "" } }
    );
    
    console.log("Modified count:", result.modifiedCount);
    
    await mongoose.disconnect();
    console.log("Done");
  } catch (e) {
    console.error(e);
  }
}

clearCooldown();
