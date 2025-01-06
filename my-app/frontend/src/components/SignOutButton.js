import React from 'react';
import { useHistory } from 'react-router-dom';

const SignOutButton = ({ setUser }) => {
  const history = useHistory();

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser(null);
    history.push('/login');
  };

  return (
    <button onClick={handleSignOut} className="sign-out-button">
      Sign Out
    </button>
  );
};

export default SignOutButton;