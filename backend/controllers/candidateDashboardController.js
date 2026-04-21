const CandidateProfile = require("../models/CandidateProfile");
const Application = require("../models/Application");
const Job = require("../models/Job");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Trait labels for display
const TRAIT_LABELS = {
  leadership: "Leadership",
  loyalty: "Loyalty",
  adaptability: "Adaptability",
  growthMindset: "Growth Mindset",
  reliability: "Reliability",
  teamwork: "Teamwork",
  collaboration: "Collaboration",
  problemSolving: "Problem Solving",
};

// Descriptions keyed by trait
const TRAIT_DESCRIPTIONS = {
  leadership:
    "You excel in decisive capability and empathetic strategic thinking. Your ability to guide teams through ambiguity is your strongest differentiator.",
  loyalty:
    "Your deep commitment to people and organizations sets you apart. Teams trust you because you consistently show up and follow through.",
  adaptability:
    "You thrive in changing environments. Your flexibility and openness to new approaches make you invaluable during transitions.",
  growthMindset:
    "You embrace challenges as learning opportunities. Your hunger for continuous improvement drives both personal and team growth.",
  reliability:
    "You are the cornerstone others depend on. Your consistency and dependability create a foundation of trust in any team.",
  teamwork:
    "You bring out the best in collaborative settings. Your ability to align diverse perspectives toward shared goals is exceptional.",
  collaboration:
    "You excel at building bridges across teams. Your cross-functional communication skills drive better outcomes for everyone.",
  problemSolving:
    "You approach complex challenges with clarity and creativity. Your analytical thinking combined with intuition makes you a natural troubleshooter.",
};

/**
 * Helper: compute average of 8 EQ scores
 */
function computeAverage(eqScores) {
  const values = Object.values(eqScores || {}).filter(
    (v) => typeof v === "number"
  );
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Helper: compute standard deviation
 */
function computeStdDev(eqScores) {
  const values = Object.values(eqScores || {}).filter(
    (v) => typeof v === "number"
  );
  if (values.length === 0) return 0;
  const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance =
    values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * GET /api/candidate-dashboard
 * Returns all metrics for the candidate dashboard in a single call.
 */
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Fetch candidate profile
    const profile = await CandidateProfile.findOne({ user: userId });

    if (!profile) {
      // Return defaults if no profile exists yet
      return res.json({
        success: true,
        data: {
          eliteScore: 0,
          globalRank: "N/A",
          primaryAnchor: {
            trait: "Not Assessed",
            label: "Not Assessed",
            score: 0,
            description:
              "Complete your EQ assessment to unlock your Core DNA analysis.",
          },
          strengthRating: 0,
          peerPercentile: 0,
          traitStability: "N/A",
          eqScores: {
            leadership: 0,
            loyalty: 0,
            adaptability: 0,
            growthMindset: 0,
            reliability: 0,
            teamwork: 0,
            collaboration: 0,
            problemSolving: 0,
          },
        },
      });
    }

    const eq = profile.eqScores || {};
    const scores = {
      leadership: eq.leadership || 0,
      loyalty: eq.loyalty || 0,
      adaptability: eq.adaptability || 0,
      growthMindset: eq.growthMindset || 0,
      reliability: eq.reliability || 0,
      teamwork: eq.teamwork || 0,
      collaboration: eq.collaboration || 0,
      problemSolving: eq.problemSolving || 0,
    };

    // 2. Compute Elite Score (sum of all 8 traits, max 800 → scale to ~1000)
    const rawSum = Object.values(scores).reduce((a, b) => a + b, 0);
    const eliteScore = Math.round((rawSum / 800) * 1000);

    // 3. Find primary anchor (highest scoring trait)
    let primaryTrait = "leadership";
    let primaryScore = 0;
    for (const [trait, val] of Object.entries(scores)) {
      if (val > primaryScore) {
        primaryScore = val;
        primaryTrait = trait;
      }
    }

    // 4. Strength Rating (average of all 8)
    const strengthRating = Math.round(computeAverage(scores));

    // 5. Trait Stability (based on standard deviation)
    const stdDev = computeStdDev(scores);
    let traitStability = "High";
    if (stdDev > 20) traitStability = "Low";
    else if (stdDev > 10) traitStability = "Medium";

    // 6. Peer Percentile — compare against all other candidates
    const allProfiles = await CandidateProfile.find({}).select("eqScores user");
    const myAvg = computeAverage(scores);
    let belowCount = 0;
    
    // Count how many OTHER candidates we scored higher than
    const otherProfiles = allProfiles.filter(p => !p.user || p.user.toString() !== userId);
    for (const p of otherProfiles) {
      const otherAvg = computeAverage(p.eqScores || {});
      if (otherAvg < myAvg) belowCount++;
    }
    
    const peerPercentile = otherProfiles.length > 0
        ? Math.round((belowCount / otherProfiles.length) * 100)
        : 99;

    // 7. Global Rank
    const topPercent = 100 - peerPercentile;
    let globalRank;
    if (topPercent <= 1) globalRank = "Top 1%";
    else if (topPercent <= 2) globalRank = "Top 2%";
    else if (topPercent <= 5) globalRank = "Top 5%";
    else if (topPercent <= 10) globalRank = "Top 10%";
    else if (topPercent <= 25) globalRank = "Top 25%";
    else if (topPercent <= 50) globalRank = "Top 50%";
    else globalRank = `Top ${topPercent}%`;

    res.json({
      success: true,
      data: {
        eliteScore,
        globalRank,
        primaryAnchor: {
          trait: primaryTrait,
          label: TRAIT_LABELS[primaryTrait] || primaryTrait,
          score: primaryScore,
          description:
            TRAIT_DESCRIPTIONS[primaryTrait] || "Your strongest EQ trait.",
        },
        strengthRating,
        peerPercentile,
        traitStability,
        eqScores: scores,
        isPremium: profile.isPremium || false,
        premiumInsights: profile.premiumInsights || null,
      },
    });
  } catch (error) {
    console.error("Candidate dashboard error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/candidate-dashboard/applications
 * Returns applications for the logged-in candidate with job details.
 */
exports.getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await Application.find({ userId })
      .populate("jobId", "title companyName company type jobType location status")
      .sort({ createdAt: -1 });

    const formatted = applications.map((app) => {
      const job = app.jobId;
      return {
        _id: app._id,
        jobTitle: job ? job.title : "Unknown Position",
        company: job ? job.companyName || job.company || "Unknown Company" : "Unknown Company",
        status: app.status,
        eqMatchScore: app.eqMatchScore,
        appliedAt: app.createdAt,
      };
    });

    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/candidate-dashboard/match-scores
 * Computes real EQ match scores for given job IDs against the logged-in candidate.
 * Query: ?jobIds=id1,id2,id3
 */
exports.getMatchScores = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobIds } = req.query;

    if (!jobIds) {
      return res.json({ success: true, data: {} });
    }

    const profile = await CandidateProfile.findOne({ user: userId });
    if (!profile) {
      return res.json({ success: true, data: {} });
    }

    const ids = jobIds.split(",").filter(Boolean);
    const jobs = await Job.find({ _id: { $in: ids } });

    const candidateSkills = profile.skills?.technical || [];
    const eq = profile.eqScores || {};
    const eqValues = Object.values(eq).filter((v) => typeof v === "number");
    const eqAvg =
      eqValues.length > 0
        ? eqValues.reduce((a, b) => a + b, 0) / eqValues.length
        : 0;

    const scores = {};
    for (const job of jobs) {
      const jobSkills = job.skillsRequired || [];
      const matchedSkills = jobSkills.filter((skill) =>
        candidateSkills.some(
          (cs) => cs.toLowerCase() === skill.toLowerCase()
        )
      );
      const skillsMatch =
        jobSkills.length > 0
          ? (matchedSkills.length / jobSkills.length) * 100
          : 50; // default 50% if job has no skills listed

      const matchScore = Math.round((skillsMatch + eqAvg) / 2);
      scores[job._id.toString()] = matchScore;
    }

    res.json({ success: true, data: scores });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Internal helper: generate AI insights and set isPremium on a profile.
 */
async function applyPremiumUpgrade(profile, plan) {
  const AISERVICE_URL = process.env.AISERVICE_URL || "http://localhost:5002";
  let insights = null;

  try {
    const response = await fetch(`${AISERVICE_URL}/api/assessment/generate-insights`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: profile.user ? profile.user.name : "Candidate",
        eqScores: profile.eqScores || {},
      }),
    });
    if (response.ok) {
      const json = await response.json();
      if (json.success) insights = json.data;
    } else {
      console.warn("AI service returned non-200 for generate-insights:", response.status);
    }
  } catch (err) {
    console.warn("Failed to contact ai-service for insights:", err.message);
  }

  if (!insights) {
    insights = {
      strengths: ["Shows strong foundational EQ matching most roles."],
      weaknesses: ["Can further develop core collaboration under pressure."],
      recommendations: ["Actively participate in difficult team conversations."],
    };
  }

  // Calculate expiry date based on plan
  const now = new Date();
  const expiryMap = {
    trial: 30,
    "1month": 30,
    "6months": 180,
    "12months": 365,
  };
  const days = expiryMap[plan] || 30;
  const expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  profile.isPremium = true;
  profile.premiumPlan = plan || "1month";
  profile.premiumExpiresAt = expiresAt;
  profile.premiumInsights = insights;
  await profile.save();
  return { insights, expiresAt };
}

/**
 * POST /api/candidate-dashboard/start-trial
 * Activates a free 1-month trial for the candidate (no payment required).
 */
exports.startTrial = async (req, res) => {
  try {
    const profile = await CandidateProfile.findOne({ user: req.user.id }).populate("user", "name");
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found." });
    }
    if (profile.isPremium) {
      return res.status(400).json({ success: false, message: "Already a premium member." });
    }

    const { insights, expiresAt } = await applyPremiumUpgrade(profile, "trial");
    profile.isTrial = true;
    await profile.save();

    res.json({
      success: true,
      message: "Free trial activated! Enjoy 1 month of Premium.",
      data: { isPremium: true, isTrial: true, premiumPlan: "trial", premiumExpiresAt: expiresAt, premiumInsights: insights },
    });
  } catch (error) {
    console.error("Error starting trial:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/candidate-dashboard/create-order
 * Creates a Razorpay order. Body: { plan: '1month' | '6months' | '12months' }
 */
exports.createOrder = async (req, res) => {
  try {
    const profile = await CandidateProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found." });
    }
    if (profile.isPremium) {
      return res.status(400).json({ success: false, message: "Already a premium member." });
    }

    // Plan → amount in paise (INR). $10/mo ≈ ₹830
    const planAmounts = {
      "trial":    100,    // ₹1 — refundable auth charge for free trial
      "1month":   83000,  // ₹830
      "6months":  415000, // ₹4,150 (save ₹830)
      "12months": 747000, // ₹7,470 (save ₹3,090)
    };

    const plan = req.body.plan || "1month";
    const amount = planAmounts[plan];
    if (typeof amount !== "number") {
      return res.status(400).json({ success: false, message: "Invalid plan selected." });
    }

    const options = {
      amount,
      currency: "INR",
      receipt: `rcpt_${req.user.id.substring(18)}_${Date.now()}`,
      notes: { userId: req.user.id, plan },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/candidate-dashboard/verify-payment
 * Verifies the Razorpay payment signature and upgrades the candidate to premium.
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan }
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment details." });
    }

    // Cryptographically verify the payment signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed. Invalid signature." });
    }

    // Signature is valid — upgrade the user
    const profile = await CandidateProfile.findOne({ user: req.user.id }).populate("user", "name");
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found." });
    }
    if (profile.isPremium) {
      return res.json({ success: true, message: "Already a premium member.", data: { isPremium: true } });
    }

    const { insights, expiresAt } = await applyPremiumUpgrade(profile, plan || "1month");

    // Mark as trial if applicable
    if (plan === "trial") {
      profile.isTrial = true;
      await profile.save();
    }

    res.json({
      success: true,
      message: "Payment verified! Successfully upgraded to premium tier.",
      data: {
        isPremium: true,
        premiumPlan: plan || "1month",
        premiumExpiresAt: expiresAt,
        premiumInsights: insights,
        paymentId: razorpay_payment_id,
      },
    });
  } catch (error) {
    console.error("Error verifying payment:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
