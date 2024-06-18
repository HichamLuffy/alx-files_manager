const { ObjectId } = require('mongodb');
const mime = require('mime-types');
const fs = require('fs');
const path = require('path');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class FilesController {
  static async postUpload(req, res) {
    const { name, type, parentId = 0, isPublic = false, data } = req.body;
    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const tokenKey = `auth_${token}`;
    const userId = await redisClient.get(tokenKey);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }

    if (!type || !['folder', 'file', 'image'].includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }

    if (!data && type !== 'folder') {
      return res.status(400).json({ error: 'Missing data' });
    }

    let parentFile = null;

    if (parentId) {
      parentFile = await dbClient.db.collection('files').findOne({ _id: new ObjectId(parentId) });

      if (!parentFile) {
        return res.status(400).json({ error: 'Parent not found' });
      }

      if (parentFile.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }

    const fileData = {
      userId: new ObjectId(userId),
      name,
      type,
      isPublic,
      parentId: parentFile ? new ObjectId(parentId) : 0,
      localPath: '',
    };

    if (type !== 'folder') {
      const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
      const fileName = `${uuidv4()}.${mime.extension(mime.lookup(name))}`;
      const localPath = path.join(folderPath, fileName);

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      fs.writeFileSync(localPath, Buffer.from(data, 'base64'));
      fileData.localPath = localPath;
    }

    const result = await dbClient.db.collection('files').insertOne(fileData);
    const newFile = result.ops[0];

    return res.status(201).json({
      id: newFile._id,
      userId: newFile.userId,
      name: newFile.name,
      type: newFile.type,
      isPublic: newFile.isPublic,
      parentId: newFile.parentId,
    });
  }
}

module.exports = FilesController;
