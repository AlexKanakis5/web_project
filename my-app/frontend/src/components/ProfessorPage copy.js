import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './ProfessorPage.css';

const ProfessorPage = ({ user }) => {
  const [diplomas, setDiplomas] = useState([]);
  const [selectedDiploma, setSelectedDiploma] = useState(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [receiverEmail, setReceiverEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDiplomas = async () => {
      const response = await fetch(`http://localhost:5000/api/diplomas/professor/${user.email}`);
      const data = await response.json();
      setDiplomas(data);
    };

    fetchDiplomas();
  }, [user.email]);

  const handleInviteClick = (diploma) => {
    setSelectedDiploma(diploma);
    setShowInviteForm(true);
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          diploma_title: selectedDiploma.title,
          sender_email: user.email,
          receiver_email: receiverEmail,
          type: 'professor',
        }),
      });

      if (response.ok) {
        alert('Invite sent successfully');
        setShowInviteForm(false);
        setReceiverEmail('');
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to send invite');
    }
  };

  const handleFileUpload = async (diplomaId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`http://localhost:5000/api/diplomas/${diplomaId}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const updatedDiploma = await response.json();
        setDiplomas((prevDiplomas) =>
          prevDiplomas.map((diploma) =>
            diploma.id === updatedDiploma.id ? updatedDiploma : diploma
          )
        );
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to upload file');
      }
    } catch (error) {
      setError('Failed to upload file');
    }
  };

  const shouldShowInviteButton = (diploma) => {
    const allEmailsFilled = diploma.email_main_professor && diploma.email_second_professor && diploma.email_third_professor;
    const isUserAuthorized = user.email === diploma.email_main_professor || user.am === diploma.am_student;
    return !allEmailsFilled && isUserAuthorized;
  };

  return (
    <div className="professor-page">
      <h1>Welcome, Professor {user.name}</h1>
      <h2>Your Diplomas</h2>
      <div className="diplomas-grid">
        {diplomas.map((diploma) => (
          <div key={diploma.id} className="diploma-item">
            <h3>{diploma.title}</h3>
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
            <div className="file-upload-container">
              <label>Upload PDF:</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileUpload(diploma.id, e.target.files[0])}
              />
            </div>
            <Link to={`/diplomas/${diploma.id}/files`}>
              <button>View Files</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

ProfessorPage.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    am: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProfessorPage;