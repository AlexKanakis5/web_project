// OLD used to add secretary password

const bcrypt = require('bcrypt');

const password = 'secretary123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    console.log('Hashed password:', hash);
  }
});

// INSERT INTO users (username, name, surname, user_type, am, phone, email, address, password)
// VALUES ('secretary', NULL, NULL, 'secretary', NULL, NULL, 'secretary@ceid.upatras.gr', NULL, '$2b$10$Sg1Wb3YglKTpa3eD7KbxaOtmocQhtbevIEaSARJV9mnV2Uufck9Xu');