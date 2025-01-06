const express = require('express');
const router = express.Router();
const inviteController = require('../controllers/inviteController');

router.post('/invites', inviteController.createInvite);
router.get('/invites/sent/:email', inviteController.getSentInvites);
router.get('/invites/received/:email', inviteController.getReceivedInvites);
router.put('/invites/status', inviteController.updateInviteStatus);

module.exports = router;