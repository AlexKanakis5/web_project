import React from 'react';
import { Link } from 'react-router-dom';
import './UserDisplay.css';

const UserDisplay = ({ user }) => {
  return (
    <div className="user-display">
      <span>{user.name}</span>
      <span> test</span>
      <Link to="/update">
        <button className="update-button">Update Info</button>
      </Link>
    </div>
  );
};

export default UserDisplay;