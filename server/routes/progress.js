const express = require('express');
const UserProgress = require('../models/UserProgress');
const protect = require('../middleware/auth');
const { deleteCache } = require('../lib/cache');

const router = express.Router();

router.put('/:problemId', protect, async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user._id;

    let progress = await UserProgress.findOne({ userId, problemId });

    if (progress) {
      progress.completed = !progress.completed;
      progress.completedAt = progress.completed ? new Date() : null;
      await progress.save();
    } else {
      progress = await UserProgress.create({
        userId,
        problemId,
        completed: true,
        completedAt: new Date(),
      });
    }

    // Invalidate user's topic cache so dashboard reflects updated counts
    await deleteCache(`topics:${userId}`);

    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const progress = await UserProgress.find({
      userId: req.user._id,
      completed: true,
    }).lean();
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
