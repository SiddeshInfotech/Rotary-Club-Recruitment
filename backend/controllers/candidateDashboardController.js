const CandidateProfile = require("../models/CandidateProfile");
const Application = require("../models/Application");
const Job = require("../models/Job");

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
    const allProfiles = await CandidateProfile.find({}).select("eqScores");
    const myAvg = computeAverage(scores);
    let belowCount = 0;
    for (const p of allProfiles) {
      const otherAvg = computeAverage(p.eqScores || {});
      if (otherAvg < myAvg) belowCount++;
    }
    const peerPercentile =
      allProfiles.length > 1
        ? Math.round((belowCount / (allProfiles.length - 1)) * 100)
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
