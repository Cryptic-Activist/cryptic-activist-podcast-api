const express = require('express');

const app = express();
const cors = require('cors');
const uuidv4 = require('uuid/v4');
const multer = require('multer');
const multerConfig = require('../config/multer');

app.use(cors());

// Load Podcast model
const Podcast = require('../models/podcast/Podcast');
const User = require('../models/user/User');
const UserProfileImage = require('../models/user/UserProfileImage');
const PodcastComment = require('../models/podcast/PodcastComment')
const PodcastAudioFile = require('../models/podcast/PodcastAudioFile');
const PodcastCover = require('../models/podcast/PodcastCover');

const configMulter = require('../config/multerConfig');

// Get All Podcasts
app.get('/', (req, res) => {
  // const pagination = req.query.pagination ? parseInt(req.query.pagination, 10) : 10;
  // const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  global.gConfigMulter.folderName = 'New Destination';
  const podcastList = [];
  Podcast.find().populate('audioFile')
    // .skip((page - 1) * pagination)
    // .limit(pagination)
    .populate('cover')
    .then((podcasts) => {
      if (podcasts.length === 0) {
        res.status(200).send([]);
      } else if (podcasts.length > 0) {
        podcasts.reverse().map((podcast) => {
          podcastList.push({
            id: podcast.id,
            slug: podcast.slug,
            category: podcast.category,
            title: podcast.title,
            cover: podcast.cover,
            uploadedOn: podcast.uploadedOn,
            updatedOn: podcast.updatedOn,
          });
          console.log(podcastList);
        });
        res.status(200).send(podcastList);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  console.log('Getting all podcasts...');
});

app.get('/short', (req, res) => {
  // const pagination = req.query.pagination ? parseInt(req.query.pagination, 10) : 10;
  // const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  global.gConfigMulter.folderName = 'New Destination';
  const podcastList = [];
  Podcast.find()
    .sort({ publishedOn: -1 })
    // .skip((page - 1) * pagination)
    // .limit(pagination)
    .populate('audioFile')
    .populate('cover')
    .then((podcasts) => {
      if (podcasts.length === 0) {
        res.status(200).send({
          found: false,
        });
      } else if (podcasts.length > 0) {
        podcasts.reverse().map((podcast) => {
          podcastList.push({
            id: podcast.id,
            slug: podcast.slug,
            category: podcast.category,
            title: podcast.title,
            cover: podcast.cover,
            uploadedOn: podcast.uploadedOn,
            updatedOn: podcast.updatedOn,
          });
          console.log(podcastList);
        });
        res.status(200).send(podcastList);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  console.log('Getting all podcasts...');
});

app.get('/get/categories/newest/:number', async (req, res) => {
  const { number } = req.params;
  const podcastsList = [];
  Podcast.find()
    .sort({ publishedOn: -1 })
    .then((podcasts) => {
      podcasts.map((podcast) => {
        podcastsList.push(podcast.category);
      });
      const uniquePostsList = podcastsList.filter((v, i, a) => a.indexOf(v) === i);
      res.status(200).send(uniquePostsList.splice(0, number));
    })
    .catch((err) => {
      res.json({
        err,
      });
    });
});

app.get('/audio', async (req, res) => {
  const {
    title,
  } = req.params.title;
  console.log('AUDIO MAROTO:', title);

  const podcastFile = await PodcastAudioFile.find({
    title,
  });

  return res.json(podcastFile);
});

app.get('/cover', async (req, res) => {
  const {
    title,
  } = req.params.title;

  const podcastCover = await PodcastCover.find({
    title,
  });

  return res.json(podcastCover);
});

app.post('/comments/', async (req, res) => {
  const {
    podcastId
  } = req.body;

  console.log('podcastId comments:', podcastId)

  PodcastComment.find({
    podcast: podcastId,
  })
    .populate({
      path: 'author',
      populate: {
        path: 'profileImage',
        model: 'UserProfileImage',
      },
    })
    .then((commentsArray) => {
      res.json(commentsArray)
    })
    .catch((err) => {
      res.json({
        err,
      })
    })

});

// Get Podcast by id
app.get('/:id', (req, res) => {
  const { id } = req.params;
  Podcast.findOne({
    id,
  })
    .then((podcast) => {
      res.status(200).send({
        msg: 'Requested Podcast has been found.',
        id: podcast.id,
        type: podcast.type,
        category: podcast.category,
        title: podcast.title,
        description: podcast.description,
        tags: podcast.tags,
        uploadedOn: podcast.uploadedOn,
        updatedOn: podcast.updatedOn,
      });
    })
    .catch((err) => {
      res.json(err);
    });
});

// Get Podcast by slug
app.get('/get/slug/:year/:month/:day/:slug', (req, res) => {
  const {
    year,
    month,
    day,
    slug,
  } = req.params;

  const fullSlug = `${year}/${month}/${day}/${slug}`;
  const podcastList = [];
  Podcast.find({
    slug: fullSlug,
  }).populate('audioFile')
    .populate('cover')
    .then((podcasts) => {
      podcasts.map((podcast) => {
        podcastList.push({
          _id: podcast._id,
          id: podcast.id,
          type: podcast.type,
          slug: podcast.slug,
          category: podcast.category,
          cover: podcast.cover,
          title: podcast.title,
          description: podcast.description,
          googleEpisodeUrl: podcast.googleEpisodeUrl,
          spotifyEpisodeUrl: podcast.spotifyEpisodeUrl,
          itunesEpisodeUrl: podcast.itunesEpisodeUrl,
          tags: podcast.tags,
          uploadedOn: podcast.uploadedOn,
          updatedOn: podcast.updatedOn,
        });
      });
      res.status(200).send(podcastList);
    })
    .catch((err) => {
      res.json({
        found: false,
        error: err,
      });
    });
});

// Get Audio Podcast by slug
app.get('/get/slug/:year/:month/:day/:slug', (req, res) => {
  const {
    year,
    month,
    day,
    slug,
  } = req.params;

  const fullSlug = `${year}/${month}/${day}/${slug}`;
  const podcastList = [];
  Podcast.find({
    slug: fullSlug,
  }).populate('audioFile')
    .populate('cover')
    .then((podcasts) => {
      res.status(200).send(podcasts);
    })
    .catch((err) => {
      res.json({
        found: false,
        error: err,
      });
    });
});

app.get('/get/category/:category', async (req, res) => {
  const { category } = req.params;
  const podcastList = [];
  const pagination = req.query.pagination ? parseInt(req.query.pagination, 10) : 10;
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  console.log('categoy:', category);
  Podcast.find(
    { category: { $regex: `${category}`, $options: 'i' } },
    (err, docs) => {
      console.log('err:', err);
    },
  )
    .skip((page - 1) * pagination)
    .limit(pagination)
    .populate('cover')
    .then((podcasts) => {
      podcasts.map((podcast) => {
        podcastList.push({
          title: podcast.title,
          slug: podcast.slug,
          category: podcast.category,
          cover: podcast.cover,
          publishedOn: podcast.publishedOn,
          updateOn: podcast.updateOn,
        });
      });
      res.status(200).send(podcasts);
    })
    .catch((err) => {
      res.json({
        err,
      });
    });
});

app.get('/get/tag/:tag', async (req, res) => {
  const { tag } = req.params;
  console.log('get/tag:', tag)
  const pagination = req.query.pagination ? parseInt(req.query.pagination, 10) : 10;
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  const podcastsList = [];
  let newTag;
  if (tag.indexOf('-') !== -1) {
    newTag = tag.split('-').join(' ');
  } else if (tag.indexOf('-') === -1) {
    newTag = tag;
  }
  console.log('newtag:', newTag)
  Podcast.find({
    tags: newTag,
  })
    .skip((page - 1) * pagination)
    .limit(pagination)
    .sort()
    .populate('cover')
    .then((podcasts) => {
      res.status(200).send(podcasts);
    })
    .catch((err) => {
      res.json({
        err,
      });
    });
});

app.get('/get/category/newest/:category/:year/:month/:day/:slug', async (req, res) => {
  const {
    year,
    month,
    day,
    slug,
    category,
  } = req.params;
  const fullSlug = `${year}/${month}/${day}/${slug}`;
  let podcastList = [];
  console.log('categoy:', category);
  Podcast.find(
    { category: { $regex: `${category}`, $options: 'i' } },
    (err, docs) => {

    },
  )
    .populate('cover')
    .then((podcasts) => {
      podcasts.map((podcast) => {
        if (fullSlug !== podcast.slug) {
          podcastList.push({
            id: podcast.id,
            type: podcast.type,
            slug: podcast.slug,
            category: podcast.category,
            title: podcast.title,
            description: podcast.description,
            tags: podcast.tags,
            audioFile: podcast.audioFile,
            cover: podcast.cover,
            uploadedOn: podcast.uploadedOn,
            updatedOn: podcast.updatedOn,
          });
        }
      });
      podcastList = podcastList.reverse();
      console.log('podcastList:', podcastList);
      if (podcastList.length > 4) {
        podcastList = podcastList.slice(0, 4);
      }
      res.status(200).send(podcastList);
    })
    .catch((err) => {
      res.json({
        err,
      });
    });
});

// Check if Podcast slug is valid
app.get('/validation/slug/:slug', (req, res) => {
  const { slug } = req.params;
  const podcastList = [];
  Podcast.find({
    slug,
  })
    .then((podcasts) => {
      podcasts.map((podcast) => {
        podcastList.push({
          id: podcast.id,
          type: podcast.type,
          slug: podcast.slug,
          category: podcast.category,
          title: podcast.title,
          description: podcast.description,
          tags: podcast.tags,
          uploadedOn: podcast.uploadedOn,
          updatedOn: podcast.updatedOn,
        });
      });
      let valid = true;
      if (podcastList.length > 0) {
        valid = false;
        res.json({
          valid,
        });
      } else if (podcastList.length === 0) {
        res.json({
          valid,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// Update Podcast
app.post('/upload', (req, res) => {
  const {
    isSlugValid,
    slug,
    category,
    title,
    description,
    googleEpisodeUrl,
    spotifyEpisodeUrl,
    itunesEpisodeUrl,
    tags,
    audioFile,
    cover,
  } = req.body;
  console.log('audioFile:', audioFile);
  const errors = [];
  if (
    !isSlugValid
    || !category
    || !title
    || !description
    || !tags.length === 0) {
    errors.push({
      errorMsg: 'Please enter all fields.',
    });
  }

  if (errors.length > 0) {
    console.log('Errors:', errors);
    res.json({
      error: errors,
    });
  } else {
    const id = uuidv4();
    const type = 'Podcast';
    const uploadedOn = Date.now();
    const updatedOn = null;
    if (isSlugValid) {
      const date = new Date();
      const fullSlug = `${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}/${slug}`;
      const newPodcast = new Podcast({
        id,
        slug: fullSlug,
        type,
        category,
        title,
        description,
        googleEpisodeUrl,
        spotifyEpisodeUrl,
        itunesEpisodeUrl,
        tags,
        audioFile,
        cover,
        uploadedOn,
        updatedOn,
      });
      newPodcast
        .save()
        .then(() => {
          res.status(201).send({
            msg: 'Podcast successfully uploaded!',
            id,
            slug,
            type,
            category,
            title,
            description,
            googleEpisodeUrl,
            spotifyEpisodeUrl,
            itunesEpisodeUrl,
            tags,
            audioFile,
            cover,
            uploadedOn,
            updatedOn,
            uploaded: true,
          });
        })
        .catch((err) => {
          res.json({
            errorMsg: err,
          });
        });
    } else {
      res.json({
        errorMsg: 'Slug is invalid',
      });
    }
  }
});

app.post('/upload/cover', multer(multerConfig).single('file'), async (req, res) => {
  const {
    originalname: name,
    size,
    key,
    location: url = '',
  } = req.file;
  const id = uuidv4();
  console.log('id:', id);

  const cover = await PodcastCover.create({
    id,
    name,
    size,
    key,
    url,
  });

  return res.json(cover);
});

app.post('/upload/audio', multer(multerConfig).single('file'), async (req, res) => {
  const {
    originalname: name,
    size,
    key,
    location: url = '',
  } = req.file;
  const id = uuidv4();
  console.log('id:', id);

  const audioFile = await PodcastAudioFile.create({
    id,
    name,
    size,
    key,
    url,
  });

  return res.json(audioFile);
});

app.post('/set/global-variable', async (req, res) => {
  const {
    type,
    title,
  } = req.body;
  global.gConfigMulter.type = type;
  global.gConfigMulter.title = title;
  global.gConfigMulter.folder_name = global.gConfigMulter.title;
  global.gConfigMulter.destination = `${global.gConfigMulter.type}/${global.gConfigMulter.folder_name}`;
  res.status(200).send({
    ok: true,
  });
});

// Update Podcast Info
app.put('/update/:id', (req, res) => {
  const {
    slug,
    category,
    title,
    description,
    tags,
  } = req.body;
  const { id } = req.params;
  console.log('SLUG:', slug);
  Podcast.updateOne({
    id,
  }, {
    slug,
    category,
    title,
    description,
    tags,
    updatedOn: Date.now(),
  }, {
    runValidators: true,
  })
    .then(() => {
      console.log('res:', {
        msg: 'Podcast details has been successfully updated.',
        id,
        slug,
        category,
        title,
        description,
        tags,
        updated: true,
      });
      res.json({
        msg: 'Podcast details has been successfully updated.',
        id,
        category,
        title,
        description,
        tags,
        updated: true,
      });
    })
    .catch((err) => {
      res.json({
        errorMsg: err,
      });
    });
});

// Delete Podcast
app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  Podcast.deleteOne({
    id,
  }).then(() => {
    res.json({
      msg: 'Podcast deleted successfully!',
    });
  }).catch((err) => {
    res.json({
      errorMgs: err,
    });
  });
});

app.delete('/delete/audio/:id', async (req, res) => {
  const audioFile = await PodcastAudioFile.findById(req.params.id);

  await audioFile.remove();

  return res.send({
    msg: 'Pocast audio file successfully deleted.',
  });
});

app.delete('/delete/cover/:id', async (req, res) => {
  const coverFile = await PodcastCover.findById(req.params.id);
  console.log('coverFile:', coverFile);
  await coverFile.remove();

  return res.send({
    msg: 'Podcast cover file successfully deleted',
  });
});


module.exports = app;
