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

export default router;
