const pool = require('../config');

const getAllUsers = async () => {
  const result = await pool.query('SELECT * FROM public.users;');
  return result.rows;
};

const findByUsername = async (username) => {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
};
  
const getAllAnnouncements = async () => {
  const result = await pool.query('SELECT * FROM announcements ORDER BY presentation_date DESC');
  return result.rows;
};

module.exports = {
  getAllUsers,
  findByUsername,
  getAllAnnouncements,
};