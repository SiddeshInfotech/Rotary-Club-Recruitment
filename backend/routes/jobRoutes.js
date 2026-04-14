// const express = require("express");
// const router = express.Router();
// const jobController = require("../controllers/jobController");

// // GET    /api/jobs      — List all jobs
// // POST   /api/jobs      — Create a new job
// router.route("/").get(jobController.getAllJobs).post(jobController.createJob);

// // GET    /api/jobs/:id  — Get single job
// // PUT    /api/jobs/:id  — Update a job
// // DELETE /api/jobs/:id  — Delete a job
// router
//   .route("/:id")
//   .get(jobController.getJobById)
//   .put(jobController.updateJob)
//   .delete(jobController.deleteJob);

// // PATCH  /api/jobs/:id/pause — Toggle pause/active
// router.patch("/:id/pause", jobController.pauseJob);

// module.exports = router;


const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const protect = require("../middleware/auth");

// --- 1. SEARCH ROUTE ---
// Important: This must stay at the top so it doesn't get confused with /:id
// router.get("/search", jobController.getAllJobs);


// --- 2. BASE ROUTES (/) ---
router.route("/")
  .get(jobController.getAllJobs) // Anyone can view active jobs
  .post(protect, jobController.createJob); // Only logged-in recruiters can post

// --- 3. ID-SPECIFIC ROUTES (/:id) ---
router.route("/:id")
  .get(jobController.getJobById)     // View single job details
  .put(protect, jobController.updateJob)    // UPDATED: Added this to allow editing
  .delete(protect, jobController.deleteJob); // Only owner can delete

// --- 4. ACTION ROUTES ---
// UPDATED: Added this for the Pause/Resume toggle functionality
router.patch("/:id/pause", protect, jobController.pauseJob);

module.exports = router;
