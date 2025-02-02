// create a random diploma for a single professor
// run with node createSingleDiploma.js


const { Pool } = require('pg');
const { faker } = require('@faker-js/faker');

const pool = new Pool({
  user: 'talos',
  host: 'localhost',
  database: 'talos',
  password: 'talos',
  port: 5432,
});

const mainProfessorEmail = 'vasfou@ceid.upatras.gr';

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const createRandomDate = (start, end) => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date;
};

const createSingleDiploma = async () => {
  try {
    const client = await pool.connect();

    // Get random professors for second and third professor emails
    const professorsQuery = `
      SELECT email FROM users WHERE user_type = 'professor' AND email != $1
    `;
    const professorsResult = await client.query(professorsQuery, [mainProfessorEmail]);
    const professors = professorsResult.rows.map(row => row.email);

    const title = faker.lorem.words(3);
    const description = faker.lorem.sentence();
    const amStudent = getRandomInt(4, 40);

    // Set status with specified probabilities
    const statusRandom = Math.random();
    let status;
    if (statusRandom < 0.15) {
      status = 'cancelled';
    } else if (statusRandom < 0.80) {
      status = 'finished';
    } else {
      status = 'pending';
    }

    const createdDate = createRandomDate(new Date(2023, 0, 1), new Date());
    const dueDate = new Date(createdDate);
    dueDate.setMonth(dueDate.getMonth() + 18); // 1.5 years after the created date

    const emailSecondProfessor = professors[getRandomInt(0, professors.length - 1)];
    const emailThirdProfessor = professors[getRandomInt(0, professors.length - 1)];

    let query;
    let values;

    if (status === 'finished') {
      const gradeMainProfessor = getRandomInt(5, 10);
      const gradeSecondProfessor = getRandomInt(5, 10);
      const gradeThirdProfessor = getRandomInt(5, 10);
      const finishedDate = createRandomDate(new Date(createdDate.getTime() + 6 * 30 * 24 * 60 * 60 * 1000), dueDate); // Between 6 months after created date and due date

      const grade = ((gradeMainProfessor + gradeSecondProfessor + gradeThirdProfessor) / 3).toFixed(2); // Calculate average grade

      query = `
        INSERT INTO diplomas (title, description, am_student, email_main_professor, email_second_professor, email_third_professor, status, grade_main_professor, grade_second_professor, grade_third_professor, grade, created_date, due_date, finished_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      `;
      values = [title, description, amStudent, mainProfessorEmail, emailSecondProfessor, emailThirdProfessor, status, gradeMainProfessor, gradeSecondProfessor, gradeThirdProfessor, grade, createdDate, dueDate, finishedDate];
    } else {
      query = `
        INSERT INTO diplomas (title, description, am_student, email_main_professor, email_second_professor, email_third_professor, status, created_date, due_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;
      values = [title, description, amStudent, mainProfessorEmail, emailSecondProfessor, emailThirdProfessor, status, createdDate, dueDate];
    }

    await client.query(query, values);

    client.release();
    console.log('Single diploma created successfully');
  } catch (error) {
    console.error('Error creating diploma:', error);
  } finally {
    pool.end();
  }
};

createSingleDiploma();


// UPDATE diplomas
// SET status = 'pending', grade = NULL, finished_date = NULL
// WHERE id = 61;