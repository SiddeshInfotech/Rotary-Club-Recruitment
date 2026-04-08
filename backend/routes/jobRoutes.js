const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");

// GET    /api/jobs      — List all jobs
// POST   /api/jobs      — Create a new job
router.route("/").get(jobController.getAllJobs).post(jobController.createJob);

// GET    /api/jobs/:id  — Get single job
// PUT    /api/jobs/:id  — Update a job
// DELETE /api/jobs/:id  — Delete a job
router
  .route("/:id")
  .get(jobController.getJobById)
  .put(jobController.updateJob)
  .delete(jobController.deleteJob);

// PATCH  /api/jobs/:id/pause — Toggle pause/active
router.patch("/:id/pause", jobController.pauseJob);

module.exports = router;
