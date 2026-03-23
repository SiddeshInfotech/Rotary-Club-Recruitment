const express = require("express");
const cors = require("cors");

const app = express();

// ✅ MIDDLEWARE FIRST
app.use(cors());
app.use(express.json());

// ✅ ROUTES AFTER MIDDLEWARE
const profileRoutes = require("./routes/profile.routes");
app.use("/api/profile", profileRoutes);

app.use("/api/auth", require("./routes/auth.routes"));

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;