import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './LoginForm.css';

// useEffect not used because we dont need to fetch data when the component mounts
const LoginForm = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const response = await fetch('http://localhost:5000/api/login', {
      // send the username and password as JSON
      // POST request - send the data in the body
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Login successful:', data);
      // no cookies, just local storage, so the user stays logged in even after refreshing the page
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      history.push('/');
    } else {
      const errorData = await response.json();
      setError(errorData.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {/* show error message if there is one */}
        {error && <div className="error">{error}</div>}
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            // update the username state when the input changes
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;