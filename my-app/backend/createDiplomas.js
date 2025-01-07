const { Pool } = require('pg');
const { faker } = require('@faker-js/faker');

const pool = new Pool({
  user: 'talos',
  host: 'localhost',
  database: 'talos',
  password: 'talos',
  port: 5432,
});

const mainProfessorEmail = 'akomninos@ceid.upatras.gr';

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const createRandomDate = (start, end) => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date;
};

const createDiplomas = async () => {
  try {
    const client = await pool.connect();

    // Get random professors for second and third professor emails
    const professorsQuery = `
      SELECT email FROM users WHERE user_type = 'professor' AND email != $1
    `;
    const professorsResult = await client.query(professorsQuery, [mainProfessorEmail]);
    const professors = professorsResult.rows.map(row => row.email);

    for (let i = 0; i < 20; i++) {
      const title = faker.lorem.words(3);
      const description = faker.lorem.sentence();
      const amStudent = getRandomInt(4, 40);
      const status = i < 2 ? 'cancelled' : i < 10 ? 'finished' : 'pending';
      const grade = status === 'finished' ? getRandomInt(5, 10) : null;
      const createdDate = createRandomDate(new Date(2023, 0, 1), new Date());
      const dueDate = new Date(createdDate);
      dueDate.setMonth(dueDate.getMonth() + 6);
      if (status === 'finished') {
        dueDate.setDate(dueDate.getDate() - 1);
      }
      const emailSecondProfessor = professors[getRandomInt(0, professors.length - 1)];
      const emailThirdProfessor = professors[getRandomInt(0, professors.length - 1)];

      const query = `
        INSERT INTO diplomas (title, description, am_student, email_main_professor, email_second_professor, email_third_professor, status, grade, created_date, due_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `;
      const values = [title, description, amStudent, mainProfessorEmail, emailSecondProfessor, emailThirdProfessor, status, grade, createdDate, dueDate];

      await client.query(query, values);
    }

    client.release();
    console.log('20 diplomas created successfully');
  } catch (error) {
    console.error('Error creating diplomas:', error);
  } finally {
    pool.end();
  }
};

createDiplomas();