const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const pool = require('./config'); // Assuming you have a config.js for your PostgreSQL connection
const bodyParser = require('body-parser');

const pgSession = require('connect-pg-simple')(session);

const app = express();
const authRoutes = require('./routes/authRoutes');
const diplomaRoutes = require('./routes/diplomaRoutes');
const inviteRoutes = require('./routes/inviteRoutes');
const routes = require('./routes/index');

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS with specific options
// It needs to be like that for the statistics page
// If not it will throw a cors error
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend's local IP address and port
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure session management
app.use(session({
  store: new pgSession({
      pool: pool, // Connection pool
      tableName: 'session' // whatever works
  }),
  secret: 'secret', // whatever works
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // false for now because we're not using HTTPS
}));

// API routes
app.use('/api', authRoutes);
app.use('/api', diplomaRoutes);
app.use('/api', inviteRoutes);

// Use the routes defined in index.js
app.use('/', routes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../my-app/frontend/build')));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../my-app/frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});