const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const clubController = require("../controllers/clubController");

router.get("/", protect, clubController.getAllClubs);
router.get("/:id", protect, clubController.getClubById);
router.post("/", protect, clubController.createClub);

module.exports = router;
