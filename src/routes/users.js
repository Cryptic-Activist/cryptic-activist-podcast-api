const express = require('express');

const router = express.Router();
// const bcrypt = require('bcryptjs');
// const passport = require('passport');

// Load User model
const User = require('../models/user/User');
const Post = require('../models/blog/Post');

const multer = require('multer');
const multerConfig = require('../config/multer');
const uuidv4 = require('uuid/v4');
const UserProfileImage = require('../models/user/UserProfileImage');

const user = {};

router.get('/all', (req, res) => {
  const usersList = [];
  User.find()
    .populate('profileImage')
    .then((users) => {
      users.map((user) => {
        usersList.push({
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          profileImage: user.profileImage,
          isAdmin: user.isAdmin,
          origin: user.origin,
          createdOn: user.createdOn,
        });
        console.log(usersList);
      });
      res.json(usersList);
    })
    .catch((err) => {
      console.log(err);
    });
  console.log('Get All Users');
});

// Get User
router.post('/user', (req, res) => {
  const { email } = req.body;
  User.findOne({ email }, (err, user) => {
    console.log('Mongoose user:', user);
    res.status(200).send({
      name: user.name,
      email: user.email,
      created_on: user.created_on,
    });
  }).catch((err) => console.log(err));
});

router.get('/public-profile/:username', (req, res) => {
  const { username } = req.params;
  User.findOne({
    username,
  })
    .populate('profileImage')
    .then((userInfo) => {
      res.json(userInfo);
    })
    .catch((err) => {
      console.log(err);
    });
});


router.put('/update', (req, res) => {
  const { userId } = req.body;
  let {
    quote,
    email,
    github,
    linkedin,
    twitter,
  } = req.body;

  if (quote === undefined) {
    quote = '';
  }
  if (email === undefined) {
    email = '';
  }
  if (github === undefined) {
    github = '';
  }
  if (linkedin === undefined) {
    linkedin = '';
  }
  if (twitter === undefined) {
    twitter = '';
  }

  User.updateOne({
    _id: userId,
  }, {
    quote,
    email,
    socialMedia: {
      github,
      linkedin,
      twitter,
    },
  }, {
    runValidators: true,
  })
    .then(() => {
      res.status(200).send({
        quote,
        email,
        github,
        linkedin,
        twitter,
      });
    })
    .catch((err) => {
      res.json({
        updated: false,
        err,
      });
    });
});

router.post('/verify/following/author', async (req, res) => {
  const {
    userId,
    authorId,
  } = req.body;

  const user = await User.findOne({ _id: userId });

  res.json({
    following: user.followers.indexOf(authorId),
    followers: user.following.indexOf(authorId),
  });
});

router.put('/update/follow/author', async (req, res) => {
  const {
    userId,
    authorId,
  } = req.body;
  const user = await User.findOne({ _id: userId });
  const author = await User.findOne({ _id: authorId });

  const userFollowingArray = user.following;
  const authorFollowersArray = author.followers;
  userFollowingArray.push(authorId);
  authorFollowersArray.push(userId);
  await User.updateOne({
    _id: userId,
  }, {
    following: userFollowingArray,
  }, {
    runValidators: true,
  })
    .then(() => {
      isFollowing = true;
    })
    .catch((err) => {
      res.json({
        updated: false,
        err,
      });
    });

  await User.updateOne({
    _id: authorId,
  }, {
    followers: authorFollowersArray,
  }, {
    runValidators: true,
  })
    .then(() => {
      isFollowers = true;
    })
    .catch((err) => {
      res.json({
        updated: false,
        err,
      });
    });

  res.status(200).send({
    authorId,
  });
});

router.put('/update/unfollow/author', async (req, res) => {
  const {
    userId,
    authorId,
  } = req.body;
  const user = await User.findOne({ _id: userId });
  const author = await User.findOne({ _id: authorId });
  let userFollowingArray = author.following;
  let authorFollowersArray = user.followers;

  userFollowingArray.splice(userFollowingArray.indexOf(authorId), 1);
  authorFollowersArray.splice(authorFollowersArray.indexOf(userId), 1);

  await User.updateOne({
    _id: authorId,
  }, {
    following: authorFollowersArray,
  }, {
    runValidators: true,
  })
    .then(() => {
      isFollowing = true;
    })
    .catch((err) => {
      res.json({
        updated: false,
        err,
      });
    });

  await User.updateOne({
    _id: userId,
  }, {
    followers: userFollowingArray,
  }, {
    runValidators: true,
  })
    .then(() => {
      isFollowers = true;
    })
    .catch((err) => {
      res.json({
        updated: false,
        err,
      });
    });

  res.status(200).send({
    userFollowingArray,
  });
});

router.post('/upload/profile-picture', multer(multerConfig).single('file'), async (req, res) => {
  const {
    originalname: name,
    size,
    key,
    location: url = '',
  } = req.file;
  const id = uuidv4();

  const profilePicture = await UserProfileImage.create({
    id,
    name,
    size,
    key,
    url,
    origin: 'Local',
  });
  console.log('profilePicture:', profilePicture)

  return res.json(profilePicture);
});

router.delete('/delete/profile-picture/:id', async (req, res) => {
  const { id } = req.params;
  const profilePicture = await UserProfileImage.findOne({
    id,
  });
  await profilePicture.remove();
  return res.send({
    msg: 'Blog Post cover file successfully deleted',
  });
});

router.post('/get/user/activities', (req, res) => {
  const {
    posts,
  } = req.body;

  console.log('posts activities:', posts)

  Post.find({
    _id: { $in: posts }
  })
    .populate('cover')
    .sort({ publishedOn: -1 })
    .limit(6)
    .then((activities) => {
      console.log('activities:', activities)
      res.status(200).send(activities);
    })
    .catch((err) => {
      res.json(err);
    });
});


module.exports = router;
