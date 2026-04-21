const Interview = require("../models/Interview");
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
    const { candidateName, candidateEmail, jobTitle, date, time, duration, type, notes, meetingLink, candidate, job } = req.body;
    const interview = await Interview.create({
      recruiter: req.user.id, candidate, candidateName, candidateEmail, job, jobTitle,
      date, time, duration: duration || 30, type: type || "Video", notes, meetingLink,
    });

    // Notify candidate
    if (candidate) {
      const avatarName = encodeURIComponent(req.user.name || "Recruiter");
      await createNotification({
        user: candidate,
        type: "interview",
        title: "Interview Scheduled",
        message: `An interview for ${jobTitle || "a job"} has been scheduled with ${req.user.name}.`,
        link: `/candidate-dashboard`,
        actorName: req.user.name,
        actorAvatar: `https://ui-avatars.com/api/?name=${avatarName}&background=0F172A&color=fff&bold=true`
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
    res.json({ success: true, data: interview });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.cancelInterview = async (req, res) => {
  try {
    const interview = await Interview.findOneAndUpdate(
      { _id: req.params.id, recruiter: req.user.id }, { status: "Cancelled" }, { new: true }
    );
    if (!interview) return res.status(404).json({ success: false, message: "Interview not found" });

    // Notify candidate
    if (interview.candidate) {
      const avatarName = encodeURIComponent(req.user.name || "Recruiter");
      await createNotification({
        user: interview.candidate,
        type: "warning",
        title: "Interview Cancelled",
        message: `Your interview for ${interview.jobTitle || "a job"} has been cancelled.`,
        link: `/candidate-dashboard`,
        actorName: req.user.name,
        actorAvatar: `https://ui-avatars.com/api/?name=${avatarName}&background=0F172A&color=fff&bold=true`
      });
    }

    res.json({ success: true, data: interview });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
