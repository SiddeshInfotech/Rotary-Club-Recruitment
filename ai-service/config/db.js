const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const MONGO_URI =
      process.env.MONGO_URI || "mongodb://localhost:27017/eq-hire-recruiter";
    await mongoose.connect(MONGO_URI);
    console.log("AI Service: MongoDB connected successfully");
  } catch (error) {
    console.error("AI Service: MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
