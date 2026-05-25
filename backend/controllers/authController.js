const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/jwt");
const sendEmail = require("../utils/emailService");
const crypto = require("crypto");
const createNotification = require("../utils/createNotification");

// Register
exports.register = async (req, res) => {
  try {
    const { 
      name, email, password, role,
      phone, location, skills, resumeLink, // Candidate fields
      company, website, hiringNeeds // Recruiter fields
    } = req.body;

    // Check if user exists

    let user = await User.findOne({ email });
    if (user) {
      // IF user exists AND is already verified, block registration
      if (user.isVerified) {
        return res.status(400).json({ 
          success: false, 
          message: "User already exists and is verified. Please login." 
        });
      }
      
      // IF user exists but NOT verified, UPDATE their info for the retry
      user.name = name;
      user.password = await bcrypt.hash(password, 10);
      user.role = role || "candidate";
      user.phone = phone;
      user.location = location;
      
      // Role-specific updates
      if (role === 'candidate') {
        user.skills = skills;
        user.resumeLink = resumeLink;
      } else if (role === 'recruiter') {
        user.company = company;
        user.website = website;
        user.hiringNeeds = hiringNeeds;
      }
    } else {
      // 2. Create NEW unverified user
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({
        name,
        email,
        password: hashedPassword,
        role: role || "candidate",
        phone,
        location,
        skills,
        resumeLink,
        company,
        website,
        hiringNeeds,
        isVerified: false
      });
    }
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await user.save();

    // Create user but marking as NOT verified
    // const user = await User.create({
    //   name,
    //   email,
    //   password: hashedPassword,
    //   role: role || "candidate",
    //   phone,
    //   location,
    //   skills,
    //   resumeLink,
    //   company,
    //   website,
    //   hiringNeeds,
    //   isVerified: false,
    //   otp,
    //   otpExpires
    // });

    // Send email
    await sendEmail({
      email: user.email,
      subject: "Verify Your EQ Hire Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #2563eb;">Welcome to EQ Hire!</h2>
          <p>Hi ${user.name},</p>
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

    res.status(201).json({
      success: true,
      message: "Please check your email for the OTP.",
      requiresOtp: true,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // if (!user.isVerified) {
    //   return res.status(401).json({ success: false, message: "Account is not verified. Please verify your email first.", requiresOtp: true });
    // }

    // Gatekeeper: Reject unverified users
    if (!user.isVerified) {
      return res.status(401).json({ 
        success: false, 
        message: "Account is not verified. Please verify your email first.", 
        requiresOtp: true 
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        currentTitle: user.currentTitle,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        skills: user.skills,
        experience: user.experience,
        eqScores: user.eqScores,
        technicalScores: user.technicalScores,
        resumeLink: user.resumeLink,
        company: user.company,
        website: user.website,
        hiringNeeds: user.hiringNeeds,
        lastAssessedAt: user.lastAssessedAt,
        lastTechAssessedAt: user.lastTechAssessedAt,
        emailNotifications: user.emailNotifications,
        inAppNotifications: user.inAppNotifications,
        isPublicProfile: user.isPublicProfile,
        updatedAt: user.updatedAt
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 1. FORGOT PASSWORD (Sends 6-digit OTP) ---
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "No account found with this email." });
    }

    // Generate 6-digit OTP
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = resetOtp; 
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 mins

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

    res.status(200).json({ success: true, message: "OTP sent to your email!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 2. VERIFY RESET OTP (The Bridge) ---
exports.verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({
      email,
      resetPasswordToken: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "OTP is incorrect or has expired." });
    }

    res.status(200).json({ success: true, message: "OTP matched!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 3. RESET PASSWORD (Final Step) ---
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    // Use trim() to ensure no accidental spaces cause a mismatch
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      resetPasswordToken: otp,
      resetPasswordExpires: { $gt: Date.now() } // Add this for security!
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid session or OTP has expired. Please try again." 
      });
    }

    // Hash the new password
    user.password = await bcrypt.hash(password, 10);
    
    // Clear the reset fields so the same OTP can't be used twice
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get current user (protected)
exports.getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.isVerified) return res.status(400).json({ success: false, message: "User already verified" });
    
    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP has expired" });
    }

    // Mark as verified and clear OTP fields
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Create welcome notification
    await createNotification({
      user: user._id,
      type: "success",
      title: "Welcome to EQ-Hire! 🎉",
      message: user.role === "candidate"
        ? "Your account is verified. Complete your profile and take the EQ Assessment to get matched with top roles."
        : "Your recruiter account is verified. Start posting jobs and discovering high-EQ candidates.",
      link: user.role === "candidate" ? "/profile" : "/recruiter",
    });

    const token = generateToken(user);

    res.json({
      success: true,
      message: "Email verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        currentTitle: user.currentTitle,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        skills: user.skills,
        experience: user.experience,
        eqScores: user.eqScores,
        technicalScores: user.technicalScores,
        resumeLink: user.resumeLink,
        company: user.company,
        website: user.website,
        hiringNeeds: user.hiringNeeds,
        lastAssessedAt: user.lastAssessedAt,
        lastTechAssessedAt: user.lastTechAssessedAt
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Resend OTP
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.isVerified) return res.status(400).json({ success: false, message: "User already verified" });

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await user.save();

    await sendEmail({
      email: user.email,
      subject: "Your New Verification Code - EQ Hire",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #2563eb;">New Code Requested</h2>
          <p>Hi ${user.name},</p>
          <p>Here is your new verification code:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1e293b;">${otp}</span>
          </div>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    });

    res.json({ success: true, message: "New OTP sent to email" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Me
exports.updateMe = async (req, res) => {
  try {
    const { name, currentTitle, location, bio, experience, email, currentPassword, newPassword, phone, skills, resumeLink, emailNotifications, inAppNotifications, isPublicProfile } = req.body;
    const user = req.user;

    // --- Basic profile fields ---
    if (name) user.name = name;
    if (currentTitle) user.currentTitle = currentTitle;
    if (location) user.location = location;
    if (bio !== undefined) user.bio = bio;
    if (experience !== undefined) user.experience = experience;
    if (phone !== undefined) user.phone = phone;
    if (skills !== undefined) user.skills = skills;
    if (resumeLink !== undefined) user.resumeLink = resumeLink;
    if (emailNotifications !== undefined) user.emailNotifications = emailNotifications;
    if (inAppNotifications !== undefined) user.inAppNotifications = inAppNotifications;
    if (isPublicProfile !== undefined) user.isPublicProfile = isPublicProfile;

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
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Current password is incorrect." });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: "New password must be at least 6 characters." });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

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
        eqScores: user.eqScores,
        technicalScores: user.technicalScores,
        resumeLink: user.resumeLink,
        company: user.company,
        website: user.website,
        hiringNeeds: user.hiringNeeds,
        lastAssessedAt: user.lastAssessedAt,
        lastTechAssessedAt: user.lastTechAssessedAt,
        emailNotifications: user.emailNotifications,
        inAppNotifications: user.inAppNotifications,
        isPublicProfile: user.isPublicProfile,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

