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
  const { id, status, email, userType, am } = req.body;

  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');

    const updateInviteQuery = `
      UPDATE invites
      SET reply = $1
      WHERE id = $2
      RETURNING *;
    `;
    const updateInviteValues = [status, id];
    const inviteResult = await client.query(updateInviteQuery, updateInviteValues);

    if (status === 'accepted') {
      const diplomaTitle = inviteResult.rows[0].diploma_title;
      console.log(diplomaTitle);
      const getDiplomaQuery = `
        SELECT email_main_professor, email_second_professor, email_third_professor
        FROM diplomas
        WHERE title = $1
        FOR UPDATE
      `;
      const getDiplomaValues = [diplomaTitle];
      const diplomaResult = await client.query(getDiplomaQuery, getDiplomaValues);
      const diploma = diplomaResult.rows[0];

      if (userType === 'professor') {
        if (!diploma.email_main_professor) {
          const updateDiplomaQuery = `
            UPDATE diplomas
            SET email_main_professor = $1
            WHERE title = $2
          `;
          const updateDiplomaValues = [email, diplomaTitle];
          await client.query(updateDiplomaQuery, updateDiplomaValues);
        } else if (!diploma.email_second_professor) {
          const updateDiplomaQuery = `
            UPDATE diplomas
            SET email_second_professor = $1
            WHERE title = $2
          `;
          const updateDiplomaValues = [email, diplomaTitle];
          await client.query(updateDiplomaQuery, updateDiplomaValues);
        } else if (!diploma.email_third_professor) {
          const updateDiplomaQuery = `
            UPDATE diplomas
            SET email_third_professor = $1
            WHERE title = $2
          `;
          const updateDiplomaValues = [email, diplomaTitle];
          await client.query(updateDiplomaQuery, updateDiplomaValues);
        }
      } else if (userType === 'student') {
        console.log(am)
        const updateDiplomaQuery = `
          UPDATE diplomas
          SET am_student = $1
          WHERE title = $2
        `;
        const updateDiplomaValues = [am, diplomaTitle];
        await client.query(updateDiplomaQuery, updateDiplomaValues);
      }
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'Invite status updated successfully' });
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK');
    }
    console.error('Error updating invite status:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (client) {
      client.release();
    }
  }
};

module.exports = {
  createInvite,
  getSentInvites,
  getReceivedInvites,
  updateInviteStatus,
};