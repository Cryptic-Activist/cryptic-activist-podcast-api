const express = require('express');

const app = express();
const cors = require('cors');
const uuidv4 = require('uuid/v4');
const multer = require('multer');
const multerConfig = require('../../../config/multer');
const _ = require('lodash')

app.use(cors());

const UserProfileImage = require('../../../models/user/UserProfileImage');
const User = require('../../../models/user/User');

app.post('/verify/su', (req, res) => {
  const {
    user,
    password,
  } = req.body;
  const su = {
    user: 'su',
    password: 'su',
  };
  if (user === su.user && password === su.password) {
    res.status(200).send({
      isSU: true,
    });
  } else {
    res.status(200).send({
      isSU: false,
    });
  }
});

app.get('/verify/admin/username/:username', (req, res) => {
  const { username } = req.params;
  let valid = true;
  User.find({
    username,
  })
    .then((users) => {
      console.log('users:', users);
      if (users.length > 0) {
        valid = false;
      }
      res.json({
        valid,
      });
    })
    .catch((err) => {
      res.json({
        err,
      });
    });
});

app.post('/register/admin', async (req, res) => {
  const {
    adminRegisterInfo,
    profilePictureId,
  } = req.body;
  console.log('adminRegisterInfo:', adminRegisterInfo)
  console.log('profilePictureId:', profilePictureId)
  const errors = [];
  if (!adminRegisterInfo || !profilePictureId) {
    errors.push({
      errorMsg: 'Please enter all fields.',
    });
  }

  if (errors.length > 0) {
    res.json({
      error: errors,
    });
  } else {

    try {
      await UserProfileImage.updateOne({
        id: profilePictureId,
      }, {
        name: `${adminRegisterInfo.name} profile picture`,
      }, {
        runValidators: true,
      })

      const profileImage = await UserProfileImage.findOne({
        id: profilePictureId,
      })

      console.log('profileImage._id:', profileImage);
      const id = uuidv4();
      const newUser = new User({
        id,
        name: adminRegisterInfo.name,
        username: adminRegisterInfo.user,
        profileImage: profileImage,
        email: '',
        quote: '',
        password: adminRegisterInfo.password,
        isAdmin: true,
        origin: 'Local',
        socialMedia: {
          github: '',
          linkedin: '',
          twitter: '',
        },
      });
      newUser
        .save()
        .then(async (user) => {
          const userinfo = await User.findOne({
            id: user.id,
          })
          .populate('profileImage')
          res.status(200).send(userinfo);
        });
    } catch(err) {
      console.log(err)
    }
  }
});

app.post('/login/admin', (req, res) => {
  const {
    adminUser: username,
    adminPassword: password,
  } = req.body;

  User.findOne({
    username,
    password
  })
    .populate('profileImage')
    .then((user) => {
      console.log('user:', user)
      if (user === null || user === undefined) {
        res.json({});
      } else if (!_.isEmpty(user)) {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post('/upload/profile-image', multer(multerConfig).single('file'), async (req, res) => {
  const {
    id,
    url,
  } = req.file;
  console.log('id:', id);
  console.log('url:', url);

  let name = '';
  try {
    const res = await User.findOne({
      id
    });
    name = `${res.name} profile picture`;
    const profileImage = await UserProfileImage.create({
      id,
      name,
      url,
      origin: 'Local'
    });
    return res.json(profileImage);
  } catch(err) {
    console.log(err)
  }
});

app.put('/post/to/author', (req, res) => {
  const {
    userId,
    postsArray,
  } = req.body;
  console.log('userId author:', userId);
  console.log('postsArray:', postsArray);
  let user;
  User.updateOne({
    _id: userId,
  }, {
    posts: postsArray,
  }, {
    runValidators: true,
  })
    .then(() => {
      res.status(200);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = app;
