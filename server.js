const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import routes
const dashboardRoutes = require("./routes/dashboardRoutes");
const jobRoutes = require("./routes/jobRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const recruiterProfileRoutes = require("./routes/recruiterProfileRoutes");

const app = express();

// ── Middleware ──────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ─────────────────────────────────────────────
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/recruiter-profile", recruiterProfileRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "EQ-Hire Recruiter Dashboard API",
    endpoints: {
      dashboard: {
        stats: "GET /api/dashboard/stats",
        jobs: "GET /api/dashboard/jobs",
        topCandidates: "GET /api/dashboard/top-candidates",
      },
      jobs: "CRUD /api/jobs",
      candidates: "CRUD /api/candidates",
      applications: "CRUD /api/applications",
      recruiterProfile: {
        profile: "GET /api/recruiter-profile/:id",
        metrics: "GET /api/recruiter-profile/:id/metrics",
        jobs: "GET /api/recruiter-profile/:id/jobs",
        activity: "GET /api/recruiter-profile/:id/activity",
        eqInsights: "GET /api/recruiter-profile/:id/eq-insights",
      },
    },
  });
});

// ── Connect to MongoDB & Start Server ──────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/eq-hire-recruiter";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
