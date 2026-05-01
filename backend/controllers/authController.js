const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/jwt");
const sendEmail = require("../utils/emailService");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// --- 1. REGISTER (No DB Save) ---
exports.register = async (req, res) => {
  try {
    const { email, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User already exists. Please login.",
        });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const signupToken = jwt.sign({ ...req.body, otp }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    await sendEmail({
      email: email,
      subject: "Verify Your EQ Hire Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #2563eb;">Welcome to EQ Hire!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for registering. To complete your setup, please use the following verification code:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1e293b;">${otp}</span>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <br/>
          <p>Best regards,<br/>The EQ Hire Team</p>
        </div>
      `,
    });
    res
      .status(200)
      .json({
        success: true,
        message: "OTP sent!",
        requiresOtp: true,
        signupToken,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 2. VERIFY OTP (Saves to DB) ---
exports.verifyOtp = async (req, res) => {
  try {
    const { otp, signupToken } = req.body;
    if (!signupToken)
      return res
        .status(400)
        .json({ success: false, message: "Session expired." });

    const decoded = jwt.verify(signupToken, process.env.JWT_SECRET);
    if (decoded.otp !== otp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    const hashedPassword = await bcrypt.hash(decoded.password, 10);
    const newUser = new User({
      name: decoded.name,
      email: decoded.email,
      password: hashedPassword,
      role: decoded.role || "candidate",
      phone: decoded.phone,
      location: decoded.location,
      skills: decoded.skills,
      resumeLink: decoded.resumeLink,
      company: decoded.company,
      website: decoded.website,
      hiringNeeds: decoded.hiringNeeds,
      isVerified: true,
    });

    await newUser.save();
    const token = generateToken(newUser);
    res.json({ success: true, message: "Verified!", token, user: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Invalid or expired session." });
  }
};

// --- 3. RESEND OTP ---
exports.resendOtp = async (req, res) => {
  try {
   const { email, name } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const signupToken = jwt.sign({ ...req.body, otp }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    await sendEmail({
      email: email,
      subject: "Your New Verification Code - EQ Hire",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #2563eb;">New Code Requested</h2>
          <p>Hi ${name},</p>
          <p>Here is your new verification code:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1e293b;">${otp}</span>
          </div>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    });

    res.json({ success: true, message: "New OTP sent!", signupToken });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- LOGIN & PASS RESET LOGIC ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    if (!user.isVerified)
      return res
        .status(401)
        .json({ success: false, message: "Not verified.", requiresOtp: true });
    const token = generateToken(user);
    res.json({ success: true, token, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- PASSWORD RESET FLOW ---

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "No account found." });
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = resetOtp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    await sendEmail({
      email: user.email,
      subject: "Password Reset Code - EQ Hire",
      html: `
        <div style="font-family: sans-serif; text-align: center; color: #333;">
          <h2>Password Reset Request</h2>
          <p>Your 6-digit verification code is:</p>
          <h1 style="color: #2563eb; letter-spacing: 5px; font-size: 32px;">${resetOtp}</h1>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    });
    res.status(200).json({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Verify Reset OTP ---
exports.verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({
      email,
      resetPasswordToken: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    res.status(200).json({ success: true, message: "OTP matched!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Reset Password ---
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      resetPasswordToken: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Expired session." });
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(200).json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- PROFILE MANAGEMENT ---
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};
// exports.updateMe = async (req, res) => {
//   try {
//     const user = req.user;
//     Object.assign(user, req.body);
//     if (req.body.newPassword)
//       user.password = await bcrypt.hash(req.body.newPassword, 10);
//     await user.save();
//     res.json({ success: true, data: user });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const applicationController = require("./applicationController");

exports.updateMe = async (req, res) => {
  try {
    const { name, currentTitle, location, bio, experience, email, currentPassword, newPassword, phone, skills, resumeLink } = req.body;
    const user = req.user;
    
    // Check if skills, experience, or title changed to trigger re-evaluation
    let needsReEvaluation = false;
    if (skills !== undefined && skills !== user.skills) needsReEvaluation = true;
    if (currentTitle !== undefined && currentTitle !== user.currentTitle) needsReEvaluation = true;
    if (experience !== undefined && JSON.stringify(experience) !== JSON.stringify(user.experience)) needsReEvaluation = true;

    // --- Basic profile fields ---
    if (name) user.name = name;
    if (currentTitle) user.currentTitle = currentTitle;
    if (location) user.location = location;
    if (bio !== undefined) user.bio = bio;
    if (experience !== undefined) user.experience = experience;
    if (phone !== undefined) user.phone = phone;
    if (skills !== undefined) user.skills = skills;
    if (resumeLink !== undefined) user.resumeLink = resumeLink;

    // --- Email change (check uniqueness) ---
    if (email && email !== user.email) {
      const emailTaken = await User.findOne({ email: email.toLowerCase() });
      if (emailTaken) {
        return res.status(400).json({ success: false, message: "That email is already in use by another account." });
      }
      user.email = email.toLowerCase();
    }

    // --- Password change (verify current, hash new) ---
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: "Current password is required to set a new password." });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {return res.status(400).json({ success: false, message: "Current password is incorrect." });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: "New password must be at least 6 characters." });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    // Trigger AI re-evaluation in the background
    if (needsReEvaluation) {
        applicationController.reEvaluateCandidateApplications(user._id).catch(err => {
            console.error("Background re-evaluation failed:", err);
        });
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        currentTitle: user.currentTitle,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        experience: user.experience,
        skills: user.skills,
        resumeLink: user.resumeLink,
        company: user.company,
        website: user.website,
        hiringNeeds: user.hiringNeeds
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};