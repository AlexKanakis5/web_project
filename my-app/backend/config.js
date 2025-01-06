const { Pool } = require('pg');

const pool = new Pool({
  user: 'talos',
  host: 'localhost',
  database: 'talos',
  password: 'talos',
  port: 5432,
});

module.exports = pool;