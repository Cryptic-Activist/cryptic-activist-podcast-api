const mongoose = require('mongoose');

const PodcastCommentReply = require('./PodcastCommentReply')

const PodcastCommentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  podcast: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: false,
  },
  dislikes: {
    type: Number,
    required: false,
  },
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PodcastCommentReply',
      required: false,
    }
  ],
  publishedOn: {
    type: Date,
    default: Date.now,
  },
  updatedOn: {
    type: Date,
    default: null,
  },
});

const PodcastComment = mongoose.model('PodcastComment', PodcastCommentSchema);

module.exports = PodcastComment;
