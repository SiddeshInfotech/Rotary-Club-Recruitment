const Interview = require("../models/Interview");

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
    const { candidateName, candidateEmail, jobTitle, date, time, duration, type, notes, meetingLink, candidate, job, recruiter } = req.body;
    
    let recruiterId = recruiter;
    let candidateId = candidate;

    if (req.user.role === "recruiter") {
      recruiterId = req.user.id;
    } else if (req.user.role === "candidate") {
      candidateId = req.user.id;
    }

    const interview = await Interview.create({
      recruiter: recruiterId, candidate: candidateId, candidateName, candidateEmail, job, jobTitle,
      date, time, duration: duration || 30, type: type || "Video", notes, meetingLink,
    });
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
    res.json({ success: true, data: interview });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
