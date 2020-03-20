const mongoose = require('mongoose');

const PodcastSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  slug: {
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
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: [],
    required: false,
  },
  audioFile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PodcastAudioFile',
    required: true,
  },
  cover: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PodcastCover',
    required: true,
  },
  googleEpisodeUrl: {
    type: String,
    required: false,
    default: '',
  },
  spotifyEpisodeUrl: {
    type: String,
    required: false,
    default: '',
  },
  itunesEpisodeUrl: {
    type: String,
    required: false,
    default: '',
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      required: false,
    }
  ],
  uploadedOn: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updatedOn: {
    type: Date,
    default: null,
    required: false,
  },
});

const Podcast = mongoose.model('Podcast', PodcastSchema);

module.exports = Podcast;
