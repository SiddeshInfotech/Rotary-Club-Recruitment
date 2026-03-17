const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/jwt");

// 🔹 Register
exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};