const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Email not configured. Set EMAIL_USER and EMAIL_PASS environment variables.');
    }
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

const sendEmail = async ({ to, subject, html }) => {
  const t = getTransporter();
  await t.sendMail({
    from: `"DSA Sheet" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/verify/${token}`;
  await sendEmail({
    to: email,
    subject: 'Verify your email - DSA Sheet',
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #1d1d1f; font-size: 20px; margin-bottom: 16px;">Verify your email</h2>
        <p style="color: #6e6e73; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
          Thanks for signing up for DSA Sheet! Click the button below to verify your email address.
        </p>
        <a href="${url}" style="display: inline-block; background: #e8590c; color: #fff; text-decoration: none; padding: 12px 32px; border-radius: 10px; font-size: 14px; font-weight: 500;">
          Verify Email
        </a>
        <p style="color: #aeaeb2; font-size: 12px; margin-top: 32px;">
          This link expires in 24 hours. If you didn't create an account, ignore this email.
        </p>
      </div>
    `,
  });
};

const sendResetEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/reset-password/${token}`;
  await sendEmail({
    to: email,
    subject: 'Reset your password - DSA Sheet',
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #1d1d1f; font-size: 20px; margin-bottom: 16px;">Reset your password</h2>
        <p style="color: #6e6e73; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
          We received a request to reset your password. Click the button below to choose a new one.
        </p>
        <a href="${url}" style="display: inline-block; background: #e8590c; color: #fff; text-decoration: none; padding: 12px 32px; border-radius: 10px; font-size: 14px; font-weight: 500;">
          Reset Password
        </a>
        <p style="color: #aeaeb2; font-size: 12px; margin-top: 32px;">
          This link expires in 1 hour. If you didn't request this, ignore this email.
        </p>
      </div>
    `,
  });
};

module.exports = { sendVerificationEmail, sendResetEmail };
