const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // If no email user is configured, mock the email (great for dev/testing before config)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("===================================");
    console.log(`[MOCK EMAIL] TO: ${options.email}`);
    console.log(`[MOCK EMAIL] SUBJECT: ${options.subject}`);
    console.log(`[MOCK EMAIL] HTML: \n${options.html}`);
    console.log("===================================");
    return;
  }

  // Create a transporter using Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"EQ Hire Platform" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
