const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const pool = require('../config');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateUser = async (req, res) => {
  const { id, currentPassword, newPassword, address, phone } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // If newPassword is provided, hash it, otherwise use the current password
    const hashedPassword = newPassword ? await bcrypt.hash(newPassword, 10) : user.password;

    await pool.query(
      'UPDATE users SET password = $1, address = $2, phone = $3 WHERE id = $4',
      [hashedPassword, address, phone, id]
    );

    const updatedUser = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    res.json(updatedUser.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllUsers,
  updateUser,
};