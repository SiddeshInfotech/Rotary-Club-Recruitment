const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const checkRole = require("../middleware/role");
const adminController = require("../controllers/adminController");

router.get("/stats", protect, checkRole("admin"), adminController.getAdminStats);

module.exports = router;
