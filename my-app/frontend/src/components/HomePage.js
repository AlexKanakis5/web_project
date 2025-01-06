import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    let isMounted = true; // Track if the component is mounted

    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/announcements');
        const data = await response.json();
        if (isMounted) {
          setAnnouncements(data);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching announcements:', error);
        }
      }
    };

    fetchAnnouncements();

    return () => {
      isMounted = false; // Cleanup function to set isMounted to false
    };
  }, []);

  return (
    <div className="container">
      <h1>Welcome to the Home Page</h1>
      <Link to="/login">
        <button>Go to Login</button>
      </Link>
      <h2>Announcements</h2>
      <ul className="announcements-grid">
        {announcements.map((announcement) => (
          <li key={announcement.id} className="announcement-item">
            <h3>{announcement.title}</h3>
            <p>{announcement.description}</p>
            <p>{new Date(announcement.presentation_date).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;