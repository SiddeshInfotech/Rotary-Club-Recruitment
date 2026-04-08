const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const supportController = require("../controllers/supportController");

router.post("/", protect, supportController.createTicket);
router.get("/my", protect, supportController.getMyTickets);

module.exports = router;
