import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = ({ user, setUser }) => {
  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <Link to="/">Home</Link>
      </div>
      <div className="navbar-right">
        {user && (
          <>
            <span>{user.username}</span>
            {user.user_type === 'professor' && (
              <Link to="/create-diploma">
                <button className="navbar-button">Create Diploma</button>
              </Link>
            )}
            <Link to="/invites">
              <button className="navbar-button">View Invites</button>
            </Link>
            <Link to="/update">
              <button className="navbar-button">Update Info</button>
            </Link>
            <button className="navbar-button" onClick={handleSignOut}>Sign Out</button>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;