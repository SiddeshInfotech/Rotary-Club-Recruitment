const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");

// GET  /api/applications               — List applications (filter by ?jobId=xxx)
// POST /api/applications               — Create an application
router
  .route("/")
  .get(applicationController.getAllApplications)
  .post(applicationController.createApplication);

// PATCH /api/applications/:id/shortlist — Mark as shortlisted
router.patch("/:id/shortlist", applicationController.shortlistApplication);

// PATCH /api/applications/:id/reject — Mark as rejected
router.patch("/:id/reject", applicationController.rejectApplication);

// GET /api/applications/:id — Get a single application by ID
router.get("/:id", applicationController.getApplicationById);

module.exports = router;
