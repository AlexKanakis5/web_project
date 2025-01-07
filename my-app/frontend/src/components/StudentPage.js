import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './StudentPage.css';

const StudentPage = ({ user }) => {
  const [diplomas, setDiplomas] = useState([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [selectedDiploma, setSelectedDiploma] = useState(null);
  const [receiverEmail, setReceiverEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setError('User is not defined');
      return;
    }

    const fetchDiplomas = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/diplomas/student/${user.am}`);
        if (response.ok) {
          const data = await response.json();
          setDiplomas(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch diplomas');
        }
      } catch (error) {
        setError('Failed to fetch diplomas');
      }
    };

    fetchDiplomas();
  }, [user]);

  const handleInviteClick = (diploma) => {
    setSelectedDiploma(diploma);
    setShowInviteForm(true);
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const inviteData = {
      diploma_title: selectedDiploma.title,
      sender_email: user.email,
      receiver_email: receiverEmail,
      type: 'professor',
    };

    const response = await fetch('http://localhost:5000/api/invites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inviteData),
    });

    if (response.ok) {
      setShowInviteForm(false);
      setReceiverEmail('');
    } else {
      const errorData = await response.json();
      setError(errorData.message || 'Failed to create invite');
    }
  };

  const shouldShowInviteButton = (diploma) => {
    const allEmailsFilled = diploma.email_main_professor && diploma.email_second_professor && diploma.email_third_professor;
    return !allEmailsFilled;
  };

  if (!user) {
    return <div className="error">User is not defined</div>;
  }

  return (
    <div className="container">
      <h1>Welcome, {user.name}</h1>
      <p>This is the student-specific page.</p>
      {error && <div className="error">{error}</div>}
      <h2>Your Diplomas</h2>
      <div className="diplomas-grid">
        {diplomas.map((diploma) => (
          <div key={diploma.id} className="diploma-item">
            <h3>{diploma.title}</h3>
            <p>{diploma.description}</p>
            <p>Status: {diploma.status}</p>
            <p>Due Date: {new Date(diploma.due_date).toLocaleDateString('en-GB')}</p>
            {shouldShowInviteButton(diploma) && (
              <button onClick={() => handleInviteClick(diploma)}>Invite</button>
            )}
            {showInviteForm && selectedDiploma && selectedDiploma.id === diploma.id && (
              <div className="invite-form-container">
                <form className="invite-form" onSubmit={handleInviteSubmit}>
                  <h2>Create Invite</h2>
                  {error && <div className="error">{error}</div>}
                  <div>
                    <label>Receiver Email:</label>
                    <input
                      type="email"
                      value={receiverEmail}
                      onChange={(e) => setReceiverEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit">Send Invite</button>
                  <button type="button" onClick={() => setShowInviteForm(false)}>Cancel</button>
                </form>
              </div>
            )}
            <Link to={`/diplomas/${diploma.id}/files`}>
              <button>View Files</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

StudentPage.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    am: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
};

export default StudentPage;