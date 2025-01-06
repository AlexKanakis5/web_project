exports = require('express').Router();
const router = require('express').Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const announcementController = require('../controllers/announcementController');

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/users', userController.getAllUsers);
router.get('/announcements', announcementController.getAllAnnouncements);
router.post('/updateUser', userController.updateUser);

module.exports = router;