const express = require('express');
const router = express.Router();
const diplomaController = require('../controllers/diplomaController');

router.post('/diplomas', diplomaController.createDiploma);
router.get('/diplomas/professor/:email', diplomaController.getDiplomasByProfessorEmail);

module.exports = router;