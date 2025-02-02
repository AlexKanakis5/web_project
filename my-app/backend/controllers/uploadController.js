const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pool = require('../config');

// this is the way multer want the storage to be configured
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const diplomaId = req.params.id;
    const dir = `uploads/diplomas/${diplomaId}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });
const uploadFile = async (req, res) => {
  const diplomaId = req.params.id;
  const filePath = req.file.path;
  try {
    const query = `
      UPDATE diplomas
      SET document_folder_number = $1
      WHERE id = $2
      RETURNING *;
    `;
    const values = [filePath, diplomaId];
    const result = await pool.query(query, values);

    // Respond with the updated diploma 
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const listFiles = async (req, res) => {
  const diplomaId = req.params.id;
  try {
    const dir = `uploads/diplomas/${diplomaId}`;
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      res.status(200).json(files);
    } else {
      res.status(404).json({ message: 'No files found' });
    }
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getFile = async (req, res) => {
  const diplomaId = req.params.id;
  const fileName = req.params.fileName;
  try {
    const filePath = path.join(__dirname, `../uploads/diplomas/${diplomaId}/${fileName}`);
    res.download(filePath);
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
module.exports = {
  upload,
  uploadFile,
  listFiles,
  getFile,
};