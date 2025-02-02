// used to add the students to the user database
// I have a similar file for professors 

const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  user: 'talos',
  host: 'localhost',
  database: 'talos',
  password: 'talos',
  port: 5432,
});

const updateUsers = async () => {
  try {
    await pool.connect();


    // Hash the password
    const plainPassword = 'student123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const query = `
      INSERT INTO users (username, password, user_type, am, phone, address, email, name, surname)
      SELECT 
        split_part(email, '@', 1) AS username, -- Username from email
        $1 AS password,                      -- Use the hashed password
        'student' AS user_type,              -- User type as "student"
        id AS am,                            -- ID from students
        mobile_telephone AS phone,           -- Mobile phone
        CONCAT_WS(', ', street, number, city, postcode) AS address, -- Address
        email,                               -- Email from students
        name,                                -- Name from students
        surname                              -- Surname from students
      FROM 
        students
      WHERE 
        email IS NOT NULL; -- Ensure students with valid emails are processed
    `;

    // Execute the query with the hashed password as a parameter
    await pool.query(query, [hashedPassword]);

    console.log('Users table updated successfully with emails');
  } catch (error) {
    console.error('Error updating users table:', error);
  } finally {
    await pool.end();
  }
};

updateUsers();
