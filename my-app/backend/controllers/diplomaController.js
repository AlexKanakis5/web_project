const pool = require('../config');

const createDiploma = async (req, res) => {
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

module.exports = {
  createDiploma,
  getDiplomasByProfessorEmail,
};