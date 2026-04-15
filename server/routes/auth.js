const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = require('../middleware/auth');
const { sendVerificationEmail, sendResetEmail } = require('../lib/email');

const router = express.Router();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Register — creates unverified user, sends verification email
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = new User({ name, email, password });
    const token = user.createVerificationToken();
    await user.save();

    await sendVerificationEmail(email, token);

    res.status(201).json({
      message: 'Account created! Check your email to verify.',
      needsVerification: true,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Verify email
router.get('/verify/:token', async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ verificationToken: hashedToken }).select('+verificationToken');

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link' });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save({ validateBeforeSave: false });

    const jwtToken = signToken(user._id);

    res.json({
      message: 'Email verified successfully!',
      token: jwtToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Resend verification email
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: 'If that email exists, a verification link has been sent.' });
    }
    if (user.verified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    const token = user.createVerificationToken();
    await user.save({ validateBeforeSave: false });
    await sendVerificationEmail(email, token);

    res.json({ message: 'Verification email sent! Check your inbox.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login — only verified users
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.verified) {
      return res.status(403).json({ message: 'Please verify your email before logging in', needsVerification: true });
    }

    const token = signToken(user._id);

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Forgot password — sends reset email
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always return same message (prevent email enumeration)
    if (!user) {
      return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }

    const token = user.createResetToken();
    await user.save({ validateBeforeSave: false });
    await sendResetEmail(email, token);

    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reset password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpires +password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset link' });
    }

    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const jwtToken = signToken(user._id);

    res.json({
      message: 'Password reset successfully!',
      token: jwtToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', protect, async (req, res) => {
  res.json({
    user: { id: req.user._id, name: req.user.name, email: req.user.email },
  });
});

module.exports = router;
