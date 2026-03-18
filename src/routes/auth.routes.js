const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const protect = require("../middleware/auth.middleware");

// Routes
router.post("/register", authController.register);
router.post("/login", authController.login);


router.get("/me", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

module.exports = router;