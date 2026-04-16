const nodemailer = require("nodemailer");

exports.sendEmail = async (to, subject, text) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("⚠️ Email credentials missing in .env. Skipping email.");
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Ensure this is the 16-character APP PASSWORD
      },
    });

    await transporter.sendMail({
      from: `"HR Recruitment Team" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log(`✉️ Notification sent to: ${to}`);
  } catch (error) {
    console.error("Email Service Error:", error.message);
    // 535 error usually means the 16-character code is wrong or expired
  }
};