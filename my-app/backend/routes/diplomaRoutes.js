const express = require('express');
const router = express.Router();
const diplomaController = require('../controllers/diplomaController');
const uploadController = require('../controllers/uploadController');

router.post('/diplomas', diplomaController.createDiploma);
router.get('/diplomas/professor/:email', diplomaController.getDiplomasByProfessorEmail);
router.get('/diplomas/student/:am', diplomaController.getDiplomasByStudentAm);
router.post('/diplomas/:id/upload', uploadController.upload.single('file'), uploadController.uploadFile);
router.get('/diplomas/:id/files', uploadController.listFiles);
router.get('/diplomas/:id/files/:fileName', uploadController.getFile);
router.put('/diplomas/:id/grades', diplomaController.addGradesToDiploma);

module.exports = router;