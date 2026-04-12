const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import routes — YOUR routes (recruiter dashboard)
const dashboardRoutes = require("./routes/dashboardRoutes");
const jobRoutes = require("./routes/jobRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const recruiterProfileRoutes = require("./routes/recruiterProfileRoutes");
const candidateDashboardRoutes = require("./routes/candidateDashboardRoutes");

// Import routes — TEAMMATES' routes (auth, profiles, team recruiter)
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const recruiterTeamRoutes = require("./routes/recruiterTeamRoutes");

// Import routes — NEW FRONTEND PAGES
const communityRoutes = require("./routes/communityRoutes");
const clubRoutes = require("./routes/clubRoutes");
const storyRoutes = require("./routes/storyRoutes");
const messageRoutes = require("./routes/messageRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const supportRoutes = require("./routes/supportRoutes");
const networkRoutes = require("./routes/networkRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Import controllers — Job matching (from backend_job branch)
const jobMatchController = require("./controllers/jobMatchController");
const protect = require("./middleware/auth");
const checkRole = require("./middleware/role");

const app = express();

// ── Middleware ──────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes (Your Recruiter Dashboard) ──────────────────
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/recruiter-profile", recruiterProfileRoutes);
app.use("/api/candidate-dashboard", candidateDashboardRoutes);

// ── Routes (Teammates' Auth & Profiles) ────────────────
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/recruiter", recruiterTeamRoutes);

// ── Routes (Job Match / Search / Details — from backend_job) ──
app.get("/api/jobs/search", jobMatchController.searchJobs);
app.get("/api/jobs/job/:id", jobMatchController.getJobDetails);
app.get("/api/jobs/:jobId/match", protect, checkRole("candidate"), jobMatchController.getMatchScore);

// ── Routes (New Frontend Pages) ────────────────
app.use("/api/community", communityRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/network", networkRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "EQ-Hire Full Backend API",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        me: "GET /api/auth/me (protected)",
      },
      dashboard: {
        stats: "GET /api/dashboard/stats",
        jobs: "GET /api/dashboard/jobs",
        topCandidates: "GET /api/dashboard/top-candidates",
      },
      jobs: "CRUD /api/jobs",
      jobSearch: "GET /api/jobs/search?keyword=...",
      jobDetails: "GET /api/jobs/job/:id",
      jobMatch: "GET /api/jobs/:jobId/match (candidate, protected)",
      candidates: "CRUD /api/candidates",
      applications: "CRUD /api/applications",
      recruiterProfile: "CRUD /api/recruiter-profile/:id",
      candidateProfile: "POST|GET|PUT /api/profile (protected)",
      recruiterTeamProfile: "POST|GET|PUT /api/recruiter (protected)",
      viewCandidate: "GET /api/recruiter/candidate/:id (recruiter, protected)",
      community: "CRUD /api/community",
      clubs: "CRUD /api/clubs",
      stories: "CRUD /api/stories",
      messages: "CRUD /api/messages",
      interviews: "CRUD /api/interviews",
      support: "CRUD /api/support",
      network: "CRUD /api/network",
      notifications: "CRUD /api/notifications",
      admin: "CRUD /api/admin",
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
