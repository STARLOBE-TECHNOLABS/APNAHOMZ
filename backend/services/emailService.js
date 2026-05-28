const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

async function sendEmail({ to, subject, html, text, fromName = 'FloorLite Support' }) {
  const smtpUser = process.env.SMTP_USER;
  if (!smtpUser || !process.env.SMTP_PASS || !process.env.SMTP_HOST) {
    throw new Error('SMTP is not configured');
  }

  return getTransporter().sendMail({
    from: `"${fromName}" <${smtpUser}>`,
    to,
    subject,
    html,
    text,
  });
}

module.exports = {
  sendEmail,
};
