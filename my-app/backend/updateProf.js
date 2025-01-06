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
    const plainPassword = 'professor123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const query = `
        INSERT INTO users (username, password, user_type, am, phone, address, email, name, surname)
        SELECT 
            split_part(email, '@', 1) AS username, -- Username from email
            $1 AS password,                      -- Use the hashed password
            'professor' AS user_type,              -- User type as "professor"
            '0' as am,
            mobile AS phone,           -- Mobile phone
            university AS address, -- Address
            email,                            -- Email from students
            name,
            surname
        FROM 
            professors 
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
