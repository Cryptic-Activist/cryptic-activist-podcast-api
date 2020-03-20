const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tags: {
    type: [],
    required: false,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      required: false,
    }
  ],
  cover: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PostCover',
    required: true,
  },
  howManyRead: {
    type: Number,
    required: true,
    default: 0,
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

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
