const SupportTicket = require("../models/SupportTicket");

exports.createTicket = async (req, res) => {
  try {
    const { name, email, subject, message, category } = req.body;
    const ticket = await SupportTicket.create({
      user: req.user?.id, name, email, subject, message, category: category || "General",
    });
    res.status(201).json({ success: true, message: "Ticket submitted successfully", data: ticket });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: tickets.length, data: tickets });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
