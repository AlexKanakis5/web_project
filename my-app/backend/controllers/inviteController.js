const pool = require('../config');

const createInvite = async (req, res) => {
  const { diploma_title, sender_email, receiver_email, type } = req.body;

  try {
    const query = `
      INSERT INTO invites (diploma_title, sender_email, receiver_email, reply, type)
      VALUES ($1, $2, $3, 'pending', $4)
      RETURNING *;
    `;
    const values = [diploma_title, sender_email, receiver_email, type];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating invite:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getSentInvites = async (req, res) => {
  const { email } = req.params;

  try {
    const query = `
      SELECT * FROM invites
      WHERE sender_email = $1
    `;
    const values = [email];

    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching invites:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getReceivedInvites = async (req, res) => {
  const { email } = req.params;

  try {
    const query = `
      SELECT * FROM invites
      WHERE receiver_email = $1
    `;
    const values = [email];

    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching invites:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateInviteStatus = async (req, res) => {
  const { id, status } = req.body;

  try {
    const query = `
      UPDATE invites
      SET reply = $1
      WHERE id = $2
      RETURNING *;
    `;
    const values = [status, id];

    const result = await pool.query(query, values);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating invite status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createInvite,
  getSentInvites,
  getReceivedInvites,
  updateInviteStatus,
};