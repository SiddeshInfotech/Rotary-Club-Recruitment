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

  // Append a no-reply footer to all outgoing emails
  const htmlWithFooter = `${options.html}
    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center;">
      <p style="font-size: 12px; color: #9ca3af; font-family: Arial, sans-serif;">
        This is an automated message from EQ Hire. Please do not reply to this email.
      </p>
    </div>`;

  const mailOptions = {
    from: `"EQ Hire Platform (No Reply)" <${process.env.EMAIL_USER}>`,
    replyTo: "noreply@eqhire.com",
    to: options.email,
    subject: options.subject,
    html: htmlWithFooter,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
