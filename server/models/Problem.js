const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  youtubeUrl: {
    type: String,
    default: '',
  },
  leetcodeUrl: {
    type: String,
    default: '',
  },
  articleUrl: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 0,
  },
});

problemSchema.index({ topicId: 1, order: 1 });

module.exports = mongoose.model('Problem', problemSchema);
