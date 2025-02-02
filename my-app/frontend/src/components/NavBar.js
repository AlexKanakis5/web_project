import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = ({ user, setUser }) => {
  const handleSignOut = () => {
    localStorage.removeItem('user'); // remove the user from local storage when sign out is pressed
    setUser(null);  // ...and set the user state to null
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
            {user.user_type === 'professor' && ( // only professors can create diplomas
              <Link to="/create-diploma">
                <button className="navbar-button">Create Diploma</button>
              </Link>
            )}
            {user.user_type !== 'secretary' && ( // secretaries can't view invites or update info
              <>
                <Link to="/invites">
                  <button className="navbar-button">View Invites</button>
                </Link>
                <Link to="/update">
                  <button className="navbar-button">Update Info</button>
                </Link>
              </>
            )}
            <button className="navbar-button" onClick={handleSignOut}>Sign Out</button>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
