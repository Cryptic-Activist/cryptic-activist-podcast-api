const express = require('express');

const app = express();
const cors = require('cors');
const uuidv4 = require('uuid/v4');

app.use(cors());

const Podcast = require('../../models/podcast/Podcast');
const User = require('../../models/user/User');
const Comment = require('../../models/podcast/PodcastComment');
const CommentReply = require('../../models/podcast/PodcastCommentReply');

app.post('/comment/podcast', async (req, res) => {
  const {
    podcastId,
    userId,
    content,
  } = req.body;

  console.log('podcastId:', podcastId);
  console.log('userId:', userId);
  console.log('content:', content);

  const errors = [];
  if (!podcastId || !userId || !content) {
    errors.push({
      errorMsg: 'Please enter all fields.',
    })
  }


  if (errors.length > 0) {
    res.json({
      error: errors,
    })
  } else {
    const id = uuidv4();
    const publishedOn = Date.now();
    const updatedOn = null;
    let commentObj;
    let commentId;
    const newComment = new Comment({
      id,
      author: userId,
      podcast: podcastId,
      content,
      publishedOn,
      updatedOn,
      likes: 0,
      dislikes: 0,
      replies: [],
    });
    await newComment
      .save()
      .then((comment) => {
        // console.log('comment:', comment)
        commentObj = comment;
        commentId = comment._id;
      })
      .catch((err) => {
        console.log('err:', err)
        res.json({
          err,
        })
      })

    try {
      const PodcastObj = await Podcast.findOne({
        _id: podcastId,
      });

      console.log('PodcastObj.comments:', PodcastObj)

      let postObjComments = await PodcastObj.comments;
      // console.log('postObjComments:', postObjComments)
      
      const CommentObj = await Comment.findOne({
        _id: commentId,
      }).populate({
        path: 'author',
        populate: {
          path: 'profileImage',
          model: 'UserProfileImage',
        },
      })

      postObjComments.push(commentId)
      await Podcast.updateOne({
        _id: podcastId,
      }, {
        comments: postObjComments,
      }, {
        runValidation: true,
      })
      res.status(200).send(CommentObj)
    } catch(err) {
      console.log('err:', err)
      res.json({
        err,
      })
    }
  }
});

app.post('/comment/reply', async (req, res) => {
  const {
    podcastId,
    commentId,
    userId,
    content,
  } = req.body;

  console.log('commentId:', commentId)

  const errors = [];
  if (!podcastId || !userId || !content || !commentId) {
    errors.push({
      errorMsg: 'Please enter all fields.',
    })
  }

  if (errors.length > 0) {
    res.json({
      error: errors,
    })
  } else {
    const id = uuidv4();
    const publishedOn = Date.now();
    const updatedOn = null;
    let commentIdVar;
    const newCommentReply = new CommentReply({
      id,
      author: userId,
      podcast: podcastId,
      comment: commentId,
      content,
      publishedOn,
      updatedOn,
      likes: 0,
      dislikes: 0,
    });
    await newCommentReply
    .save()
    .then((comment) => {
      commentIdVar = comment._id;
    })
    .catch((err) => {
      console.log('err:', err)
      res.json({
        err,
      })
    })

    try {
      const PodcastObj = await Podcast.findOne({
        _id: podcastId,
      });
      const CommentObj = await Comment.findOne({
        _id: commentId,
      });
      let commentObjReplies = await CommentObj.replies;
      console.log('commentObjReplies:', commentObjReplies)
      commentObjReplies.push(commentIdVar)
      console.log('commentObjReplies:', commentObjReplies)
      await Comment.updateOne({
        _id: podcastId,
      }, {
        replies: commentObjReplies,
      }, {
        runValidation: true,
      })
      res.status(200).send({ok: true})
    } catch(err) {
      console.log('err:', err)
      res.json({
        err,
      })
    }
  }

})

app.get('/verify/exist/podcast/:podcastId',  async (req, res) => {
  const {
    podcastId,
  } = req.params;

  const errors = [];
  if (!podcastId) {
    errors.push({
      errorMsg: 'Please enter all fields.',
    })
  }

  Podcast.findOne({
    _id: podcastId,
  })
    .then((podcast) => {
        res.status(200).json(podcast)
    })
    .catch((err) => {
      res.json({
        err,
      })
    })
});

app.get('/verify/exist/comment/:commentId',  async (req, res) => {
  const {
    commentId,
  } = req.params;

  const errors = [];
  if (!commentId) {
    errors.push({
      errorMsg: 'Please enter all fields.',
    })
  }

  Comment.findOne({
    _id: commentId,
  })
    .then((podcast) => {
        res.status(200).json(podcast)
    })
    .catch((err) => {
      res.json({
        err,
      })
    })
});

module.exports = app;