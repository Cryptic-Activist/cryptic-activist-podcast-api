const mongoose = require('mongoose');

const PostCommentReply = require('./PostCommentReply')

const PostCommentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  post: {
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
      ref: 'CommentReply',
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

const PostComment = mongoose.model('PostComment', PostCommentSchema);

module.exports = PostComment;
