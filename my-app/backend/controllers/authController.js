const User = require('../models/userModel');
const bcrypt = require('bcrypt');


exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Usermodel.js contains the query to fetch a user by username
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        req.session.userId = user.id;
        // Send the user object back to the client to store in local storage
        res.json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => { // Destroy the session to log the user out
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.json({ message: 'Logout successful' });
    });
};