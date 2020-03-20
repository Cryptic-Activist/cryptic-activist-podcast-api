const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  profileImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserProfileImage',
    required: false,
  },
  isAdmin: {
    type: Boolean,
    require: true,
  },
  origin: {
    type: String,
    required: true,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    }
  ],
  quote: {
    type: String,
    required: false,
  },
  following: {
    type: [],
    required: false,
  },
  followers: {
    type: [],
    required: false,
  },
  socialMedia: {
    github: {
      type: String,
      required: false,
    },
    linkedin: {
      type: String,
      required: false,
    },
    twitter: {
      type: String,
      required: false,
    },
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
