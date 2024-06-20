const express = require('express');
const AppController = require('../controllers/AppController');

const router = express.Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);


const UsersController = require('../controllers/UsersController');
router.post('/users', UsersController.postNew);

const AuthController = require('../controllers/AuthController');

router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', AuthController.getMe);

const FilesController = require('../controllers/FilesController');

router.post('/files', FilesController.postUpload);
router.get('/files/:id', FilesController.getShow);
router.get('/files', FilesController.getIndex);
router.put('/files/:id/publish', FilesController.putPublish);
router.put('/files/:id/unpublish', FilesController.putUnpublish);
router.get('/files/:id/data', FilesController.getFile);


export default router;
