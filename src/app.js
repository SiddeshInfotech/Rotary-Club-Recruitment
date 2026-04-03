const express = require("express");
const cors = require("cors");

const app = express();

// ✅ MIDDLEWARE FIRST
app.use(cors());
app.use(express.json());


// ✅ ROUTES
const profileRoutes = require("./routes/profile.routes");
const recruiterRoutes = require("./routes/recruiter.routes"); // ✅ ADD THIS
const jobRoutes = require("./routes/job.routes");

app.use("/api/profile", profileRoutes);
app.use("/api/recruiter", recruiterRoutes); // ✅ ADD THIS
app.use("/api/jobs", jobRoutes); // ✅ ADD THIS


app.use("/api/auth", require("./routes/auth.routes"));

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;