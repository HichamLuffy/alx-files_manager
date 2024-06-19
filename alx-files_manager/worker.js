const Bull = require('bull');
const { ObjectId } = require('mongodb');
const imageThumbnail = require('image-thumbnail');
const dbClient = require('./utils/db');
const { fileQueue, userQueue } = require('./utils/queue');
const fs = require('fs');

fileQueue.process(async (job, done) => {
  const { userId, fileId } = job.data;

  if (!fileId) {
    return done(new Error('Missing fileId'));
  }

  if (!userId) {
    return done(new Error('Missing userId'));
  }

  const file = await dbClient.db.collection('files').findOne({ _id: new ObjectId(fileId), userId: new ObjectId(userId) });

  if (!file) {
    return done(new Error('File not found'));
  }

  if (file.type !== 'image') {
    return done();
  }

  const sizes = [500, 250, 100];
  const filePath = file.localPath;

  for (const size of sizes) {
    try {
      const thumbnail = await imageThumbnail(filePath, { width: size });
      fs.writeFileSync(`${filePath}_${size}`, thumbnail);
    } catch (error) {
      return done(new Error(`Error generating thumbnail: ${error.message}`));
    }
  }

  done();
});

userQueue.process(async (job, done) => {
  const { userId } = job.data;

  if (!userId) {
    return done(new Error('Missing userId'));
  }

  const user = await dbClient.db.collection('users').findOne({ _id: new ObjectId(userId) });

  if (!user) {
    return done(new Error('User not found'));
  }

  console.log(`Welcome ${user.email}!`);

  done();
});
