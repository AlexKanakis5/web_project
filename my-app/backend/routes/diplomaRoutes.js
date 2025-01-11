const express = require('express');
const router = express.Router();
const diplomaController = require('../controllers/diplomaController');
const uploadController = require('../controllers/uploadController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/diplomas', diplomaController.createDiploma);
router.get('/diplomas/professor/:email', diplomaController.getDiplomasByProfessorEmail);
router.get('/diplomas/student/:am', diplomaController.getDiplomasByStudentAm);
router.post('/diplomas/:id/upload', upload.single('file'), diplomaController.uploadFile);
router.get('/diplomas/:id/files', uploadController.listFiles);
router.get('/diplomas/:id/files/:fileName', uploadController.getFile);
router.put('/diplomas/:id/grades', diplomaController.addGradesToDiploma);
router.get('/diplomas/pending', diplomaController.getPendingDiplomas);
router.put('/diplomas/:id/cancel', diplomaController.cancelDiploma);

router.get('/diplomas/pending', diplomaController.getPendingDiplomas);
router.put('/diplomas/:id/cancel', diplomaController.cancelDiploma);
router.post('/diplomas/:id/upload', upload.single('file'), diplomaController.uploadFile);

module.exports = router;