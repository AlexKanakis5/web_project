const pool = require('../config');
const fs = require('fs');
const path = require('path');

const createDiploma = async (req, res) => {
  // Get the body data from the request
  const {
    title,
    description,
    document_folder_number,
    am_student,
    email_main_professor,
    email_second_professor,
    email_third_professor,
    status,
    grade,
    created_date,
    finished_date,
    due_date,
  } = req.body;

  try {
    const query = `
      INSERT INTO diplomas (title, description, document_folder_number, am_student, email_main_professor, email_second_professor, email_third_professor, status, grade, created_date, finished_date, due_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;
    // The values ($1, $2, etc.) are placeholders for the values below in the values array
    // The values must be in the same order as the columns in the query
    const values = [
      title,
      description,
      document_folder_number,
      am_student,
      email_main_professor,
      email_second_professor,
      email_third_professor,
      status,
      grade,
      created_date,
      finished_date,
      due_date,
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating diploma:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getDiplomasByProfessorEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const query = `
      SELECT * FROM diplomas
      WHERE email_main_professor = $1
      OR email_second_professor = $1
      OR email_third_professor = $1
    `;
    const values = [email];

    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching diplomas:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getDiplomasByStudentAm = async (req, res) => {
  const { am } = req.params;

  try {
    const query = `
      SELECT * FROM diplomas
      WHERE am_student = $1
    `;
    const values = [am];

    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching diplomas:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addGradesToDiploma = async (req, res) => {
  const { id } = req.params; // The diploma id is in the request params because the route is /diplomas/:id/grades
  const { grade, email } = req.body; // Include email in the request body

  try {
    // Check if the diploma is pending
    const checkQuery = 'SELECT * FROM diplomas WHERE id = $1 AND status = $2';
    const checkValues = [id, 'pending'];
    const checkResult = await pool.query(checkQuery, checkValues);

    if (checkResult.rows.length === 0) {
      return res.status(400).json({ message: 'Only pending diplomas can be updated' });
    }

    // Determine which grade field to update based on the professor's email
    let updateQuery = '';
    let updateValues = [];

    // CheckResult contains the diploma from the query above
    if (email === checkResult.rows[0].email_main_professor) { 
      updateQuery = 'UPDATE diplomas SET grade_main_professor = $1 WHERE id = $2';
      updateValues = [grade, id];
    } else if (email === checkResult.rows[0].email_second_professor) {
      updateQuery = 'UPDATE diplomas SET grade_second_professor = $1 WHERE id = $2';
      updateValues = [grade, id];
    } else if (email === checkResult.rows[0].email_third_professor) {
      updateQuery = 'UPDATE diplomas SET grade_third_professor = $1 WHERE id = $2';
      updateValues = [grade, id];
    } else {
      return res.status(403).json({ message: 'You are not authorized to update this diploma' });
    }

    await pool.query(updateQuery, updateValues);
    res.status(200).json({ message: 'Grade updated successfully' });
  } catch (error) {
    console.error('Error updating grades:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPendingDiplomas = async (req, res) => {
  try {
    const query = 'SELECT * FROM diplomas WHERE status = $1';
    const values = ['pending'];
    const result = await pool.query(query, values);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching pending diplomas:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const cancelDiploma = async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'UPDATE diplomas SET status = $1 WHERE id = $2';
    const values = ['cancelled', id];
    await pool.query(query, values);

    // Create a text file with cancellation details
    // The cancellation reason is randomly selected from the reasons array
    const reasons = ["Cancelled on professors request", "Cancelled on students request"];
    const reason = reasons[Math.floor(Math.random() * reasons.length)];
    const date = new Date().toLocaleString('en-GB');
    const uniqueNumber = Math.floor(Math.random() * 1000000);
    const content = `Cancelled on ${date}. ${reason}. This decision was taken on the general assembly ${uniqueNumber}`;

    // Create the diploma directory if it doesn't exist
    const diplomaDir = path.join(__dirname, `../uploads/diplomas/${id}`);
    if (!fs.existsSync(diplomaDir)) {
      fs.mkdirSync(diplomaDir, { recursive: true });
    }

    // Save the cancellation file in the diploma directory
    const filePath = path.join(diplomaDir, `diploma_${id}_cancellation.txt`);
    fs.writeFileSync(filePath, content);

    res.status(200).json({ message: 'Diploma cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling diploma:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const finishDiploma = async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'SELECT grade_main_professor, grade_second_professor, grade_third_professor FROM diplomas WHERE id = $1';
    const values = [id];
    const result = await pool.query(query, values);
    const diploma = result.rows[0];

    if (!diploma.grade_main_professor || !diploma.grade_second_professor || !diploma.grade_third_professor) {
      return res.status(400).json({ message: 'All professors must submit grades before finishing the diploma' });
    }

    const finalGrade = (diploma.grade_main_professor + diploma.grade_second_professor + diploma.grade_third_professor) / 3;
    const finishedDate = new Date().toISOString(); // Get the current date in ISO format

    const updateQuery = 'UPDATE diplomas SET status = $1, grade = $2, finished_date = $3 WHERE id = $4 RETURNING *';
    const updateValues = ['finished', finalGrade, finishedDate, id];
    const updateResult = await pool.query(updateQuery, updateValues);

    res.status(200).json(updateResult.rows[0]);
  } catch (error) {
    console.error('Error finishing diploma:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// const uploadFile = async (req, res) => {
//   const { id } = req.params;

//   if (!req.file) {
//     return res.status(400).json({ message: 'No file uploaded' });
//   }

//   const filePath = path.join(__dirname, '../uploads', req.file.filename);

//   try {
//     const query = 'INSERT INTO diploma_files (diploma_id, file_path) VALUES ($1, $2)';
//     const values = [id, filePath];
//     await pool.query(query, values);

//     res.status(200).json({ message: 'File uploaded successfully' });
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

module.exports = {
  createDiploma,
  getDiplomasByProfessorEmail,
  getDiplomasByStudentAm,
  addGradesToDiploma,
  getPendingDiplomas,
  cancelDiploma,
  finishDiploma,

};