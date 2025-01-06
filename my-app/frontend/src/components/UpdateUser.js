import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './UpdateUser.css';

const UpdateUser = ({ user, setUser }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [address, setAddress] = useState(user.address || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const response = await fetch('http://localhost:5000/api/updateUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        id: user.id,
        currentPassword, 
        newPassword, 
        address, 
        phone 
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Update successful:', data);
      setUser(data);
      history.push('/');
    } else {
      const errorData = await response.json();
      setError(errorData.message || 'Update failed');
    }
  };

  return (
    <div className="update-user-container">
      <form className="update-user-form" onSubmit={handleSubmit}>
        <h2>Update Your Information</h2>
        {error && <div className="error">{error}</div>}
        <div>
          <label>Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateUser;