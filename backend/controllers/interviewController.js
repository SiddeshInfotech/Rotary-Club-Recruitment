const Interview = require("../models/Interview");
const Application = require("../models/Application");
const createNotification = require("../utils/createNotification");


exports.getInterviews = async (req, res) => {
  try {
    const filter = req.user.role === "recruiter" ? { recruiter: req.user.id } : { candidate: req.user.id };
    const interviews = await Interview.find(filter).sort({ date: 1 })
      .populate("recruiter", "name email").populate("candidate", "name email").populate("job", "title");
    res.json({ success: true, count: interviews.length, data: interviews });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createInterview = async (req, res) => {
  try {
    const { candidateName, candidateEmail, jobTitle, date, time, duration, type, round, notes, meetingLink, candidate, job, recruiter } = req.body;
    
    let recruiterId = recruiter;
    let candidateId = candidate;

    if (req.user.role === "recruiter") {
      recruiterId = req.user.id;
    } else if (req.user.role === "candidate") {
      candidateId = req.user.id;
    }

    const interview = await Interview.create({
      recruiter: recruiterId, candidate: candidateId, candidateName, candidateEmail, job, jobTitle,
      date, time, duration: duration || 30, type: type || "Video", round: round || "General Interview", notes, meetingLink,
    });

    if (candidateId && job) {
      const app = await Application.findOne({ candidateId, jobId: job });
      if (app) {
        const isAssessment = round === "Online Assessment";
        if (isAssessment && app.status !== "Interview Scheduled") {
          app.status = "Shortlisted";
        } else if (!isAssessment) {
          app.status = "Interview Scheduled";
        }
        app.currentRound = round || "General Interview";
        await app.save();
      }
    }

    if (candidateId) {
      const isAssessment = round === "Online Assessment";
      // Send notification to candidate
      await createNotification({
        user: candidateId,
        type: "interview",
        title: isAssessment ? "Online Assessment Scheduled" : "Interview Scheduled",
        message: `Your ${round || "General Interview"} for ${jobTitle} is scheduled on ${date} at ${time}.`,
        actorName: req.user.name || "Recruiter",
        link: "/my-jobs"
      });
    }

    res.status(201).json({ success: true, data: interview });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findOneAndUpdate(
      { _id: req.params.id, recruiter: req.user.id }, req.body, { new: true }
    );
    if (!interview) return res.status(404).json({ success: false, message: "Interview not found" });

    // Update Application status / round if sent
    if (interview.candidate && interview.job) {
      const updateFields = {};
      if (req.body.applicationStatus) {
        updateFields.status = req.body.applicationStatus;
      }
      if (req.body.currentRound) {
        updateFields.currentRound = req.body.currentRound;
      }
      if (Object.keys(updateFields).length > 0) {
        await Application.findOneAndUpdate(
          { candidateId: interview.candidate, jobId: interview.job },
          updateFields
        );
      }


    }

    res.json({ success: true, data: interview });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.cancelInterview = async (req, res) => {
  try {
    const interview = await Interview.findOneAndUpdate(
      { _id: req.params.id, recruiter: req.user.id }, { status: "Cancelled" }, { new: true }
    );
    if (!interview) return res.status(404).json({ success: false, message: "Interview not found" });

    // Reset application status if it was "Interview Scheduled"
    if (interview.candidate && interview.job) {
      const app = await Application.findOne({ candidateId: interview.candidate, jobId: interview.job });
      if (app && app.status === "Interview Scheduled") {
        app.status = "Shortlisted";
        await app.save();
      }


    }

    res.json({ success: true, data: interview });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
