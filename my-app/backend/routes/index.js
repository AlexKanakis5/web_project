const express = require('express');
const router = express.Router();

const diplomaRoutes = require('./diplomaRoutes');
const inviteRoutes = require('./inviteRoutes');
const statisticsRoutes = require('./statisticsRoutes');

router.use('/api', diplomaRoutes);
router.use('/api', inviteRoutes);
router.use('/api', statisticsRoutes);

module.exports = router;