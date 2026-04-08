const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const networkController = require("../controllers/networkController");

router.get("/connections", protect, networkController.getConnections);
router.post("/connect", protect, networkController.sendConnectionRequest);
router.get("/members", protect, networkController.getMembers);
router.get("/referrals", protect, networkController.getReferrals);
router.post("/referrals", protect, networkController.createReferral);

module.exports = router;
