const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const { initializeAI } = require("./services/aiClient");
const assessmentRoutes = require("./routes/assessmentRoutes");
const jobSuggestionRoutes = require("./routes/jobSuggestionRoutes");

const app = express();

// ── Middleware ──────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Larger limit for answer submissions

// ── Routes ─────────────────────────────────────────────
app.use("/api/assessment", assessmentRoutes);
app.use("/api/suggestions", jobSuggestionRoutes);

// Root route — API documentation
app.get("/", (req, res) => {
  res.json({
    service: "EQ-Hire AI Assessment Service",
    version: "1.0.0",
    description:
      "AI-powered EQ assessment service using Google Gemini. Generates skill-based EQ questions and evaluates candidate responses.",
    endpoints: {
      generateQuestions: {
        method: "POST",
        path: "/api/assessment/generate/:candidateId",
        description:
          "Generate 30 EQ assessment questions based on candidate skills",
      },
      evaluateAnswers: {
        method: "POST",
        path: "/api/assessment/evaluate/:assessmentId",
        description:
          "Submit answers and receive EQ scores (also updates candidate profile)",
        body: '{ "answers": [{ "questionId": 1, "answer": "..." }] }',
      },
      assessmentHistory: {
        method: "GET",
        path: "/api/assessment/history/:candidateId",
        description: "Get all past assessments for a candidate",
      },
      assessmentStatus: {
        method: "GET",
        path: "/api/assessment/status/:candidateId",
        description: "Check if candidate has completed an EQ assessment",
      },
      assessmentDetails: {
        method: "GET",
        path: "/api/assessment/:assessmentId",
        description: "Get full details of a specific assessment",
      },
      suggestJobs: {
        method: "GET",
        path: "/api/suggestions/:candidateId",
        description: "Get top 5 AI-curated job suggestions for a candidate based on skills & EQ scores (jobs from last 48 hrs)",
      },
    },
  });
});

// ── Start Server ───────────────────────────────────────
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  // 1. Connect to MongoDB (same database as the main backend)
  await connectDB();

  // 2. Initialize Gemini AI client
  const aiReady = initializeAI();
  if (!aiReady) {
    console.warn(
      "⚠️  Server starting WITHOUT AI capabilities. Set GEMINI_API_KEY in .env to enable."
    );
  }

  // 3. Start Express server
  app.listen(PORT, () => {
    console.log(`\nAI Assessment Service running on http://localhost:${PORT}`);
    console.log(`Main backend expected on http://localhost:5000\n`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start AI service:", err.message);
  process.exit(1);
});
