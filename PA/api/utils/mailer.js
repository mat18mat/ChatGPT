const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true pour 465, false pour autres ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.sendMail = async ({ to, subject, html, attachments }) => {
  return transporter.sendMail({
    from: '"EcoDeli" <noreply@ecodeli.com>',
    to,
    subject,
    html,
    attachments
  });
}; 