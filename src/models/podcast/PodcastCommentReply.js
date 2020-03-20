const mongoose = require('mongoose');

const PodcastCommentReplySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  podcast: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Podcast',
    required: true,
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PodcastComment',
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
  dislike: {
    type: Number,
    required: false,
  },
  publishedOn: {
    type: Date,
    default: Date.now,
  },
  updatedOn: {
    type: Date,
    default: null,
  },
});

const PodcastCommentReply = mongoose.model('PodcastCommentReply', PodcastCommentReplySchema);

module.exports = PodcastCommentReply;
