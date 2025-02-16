const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');

router.get('/statistics/professor/:email', statisticsController.getProfessorStatistics);

module.exports = router;