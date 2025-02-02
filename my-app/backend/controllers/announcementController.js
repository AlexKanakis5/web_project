const Announcement = require('../models/userModel');

const getAllAnnouncements = async (req, res) => {
  try {
    // userModel.js contains the query to fetch all announcements  
    const announcements = await Announcement.getAllAnnouncements();
    res.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllAnnouncements,
};

