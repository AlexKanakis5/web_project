const pool = require('../config');

const getProfessorStatistics = async (req, res) => {
  const { email } = req.params;

  try {
    // Query for average grade per year
    const averageGradeQuery = `
      SELECT EXTRACT(YEAR FROM finished_date) AS year,
             AVG(grade) AS average_grade
      FROM diplomas
      WHERE (email_main_professor = $1 OR email_second_professor = $1 OR email_third_professor = $1)
        AND status = 'finished'
      GROUP BY year
      ORDER BY year;
    `;
    const averageGradeValues = [email];
    const averageGradeResult = await pool.query(averageGradeQuery, averageGradeValues);

    // Query for average time to complete per year
    const averageTimeQuery = `
      SELECT EXTRACT(YEAR FROM finished_date) AS year,
             AVG(EXTRACT(EPOCH FROM (finished_date - created_date)) / 86400) AS average_time
      FROM diplomas
      WHERE (email_main_professor = $1 OR email_second_professor = $1 OR email_third_professor = $1)
        AND status = 'finished'
      GROUP BY year
      ORDER BY year;
    `;
    const averageTimeValues = [email];
    const averageTimeResult = await pool.query(averageTimeQuery, averageTimeValues);

    // Query for correlation between grade and time to complete
    const correlationQuery = `
      SELECT EXTRACT(EPOCH FROM (finished_date - created_date)) / 86400 AS time_to_complete,
             grade
      FROM diplomas
      WHERE (email_main_professor = $1 OR email_second_professor = $1 OR email_third_professor = $1)
        AND status = 'finished';
    `;
    const correlationValues = [email];
    const correlationResult = await pool.query(correlationQuery, correlationValues);

    res.status(200).json({
      averageGrades: averageGradeResult.rows,
      averageTimes: averageTimeResult.rows,
      correlation: correlationResult.rows,
    });
  } catch (error) {
    console.error('Error fetching professor statistics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getProfessorStatistics,
};