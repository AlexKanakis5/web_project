// used this to get the professors from the website
// used something similar for students, deleted it idk
const { Pool } = require('pg');
const fetch = require('node-fetch');

const pool = new Pool({
  user: 'talos',
  host: 'localhost',
  database: 'talos',
  password: 'talos',
  port: 5432,
});

const insertProfessors = async () => {
  try {
    await pool.connect();

    const response = await fetch('http://usidas.ceid.upatras.gr/web/2024/export.php');
    const data = await response.json();

    const professors = data.professors;

    for (const professor of professors) {
      const query = `
        INSERT INTO professors (id, name, surname, email, topic, landline, mobile, department, university)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;
      const values = [
        professor.id,
        professor.name,
        professor.surname,
        professor.email,
        professor.topic,
        professor.landline,
        professor.mobile,
        professor.department,
        professor.university,
      ];

      await pool.query(query, values);
    }

    console.log('Professors table updated successfully');
  } catch (error) {
    console.error('Error updating professors table:', error);
  } finally {
    await pool.end();
  }
};

insertProfessors();