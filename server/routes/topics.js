const express = require('express');
const mongoose = require('mongoose');
const Topic = require('../models/Topic');
const Problem = require('../models/Problem');
const UserProgress = require('../models/UserProgress');
const protect = require('../middleware/auth');
const { getCache, setCache } = require('../lib/cache');

const router = express.Router();

// GET /api/topics — List all topics with problem counts & user progress
// Cached per-user in Redis (5 min TTL), 2 queries on cache miss
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const cacheKey = `topics:${userId}`;

    // Check Redis cache first
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(typeof cached === 'string' ? JSON.parse(cached) : cached);
    }

    const userObjId = new mongoose.Types.ObjectId(userId);

    // Cache miss — run 2 parallel aggregation queries
    const [topics, progressByTopic] = await Promise.all([
      Topic.aggregate([
        { $sort: { order: 1 } },
        {
          $lookup: {
            from: 'problems',
            localField: '_id',
            foreignField: 'topicId',
            as: 'problems',
          },
        },
        {
          $project: {
            name: 1,
            slug: 1,
            description: 1,
            order: 1,
            totalProblems: { $size: '$problems' },
          },
        },
      ]),

      UserProgress.aggregate([
        { $match: { userId: userObjId, completed: true } },
        {
          $lookup: {
            from: 'problems',
            localField: 'problemId',
            foreignField: '_id',
            as: 'problem',
          },
        },
        { $unwind: '$problem' },
        {
          $group: {
            _id: '$problem.topicId',
            completedProblems: { $sum: 1 },
          },
        },
      ]),
    ]);

    const progressMap = {};
    progressByTopic.forEach((p) => {
      progressMap[p._id.toString()] = p.completedProblems;
    });

    const result = topics.map((topic) => ({
      _id: topic._id,
      name: topic.name,
      slug: topic.slug,
      description: topic.description,
      order: topic.order,
      totalProblems: topic.totalProblems,
      completedProblems: progressMap[topic._id.toString()] || 0,
    }));

    // Cache the result for 5 minutes
    await setCache(cacheKey, result, 300);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/topics/:id/problems — Get problems for a topic with user progress
router.get('/:id/problems', protect, async (req, res) => {
  try {
    const [topic, problems, progressRecords] = await Promise.all([
      Topic.findById(req.params.id).lean(),
      Problem.find({ topicId: req.params.id }).sort({ order: 1 }).lean(),
      UserProgress.find({
        userId: req.user._id,
        completed: true,
      }).select('problemId').lean(),
    ]);

    const completedSet = new Set(progressRecords.map((p) => p.problemId.toString()));

    const problemsWithProgress = problems.map((problem) => ({
      ...problem,
      completed: completedSet.has(problem._id.toString()),
    }));

    res.json({ topic, problems: problemsWithProgress });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
