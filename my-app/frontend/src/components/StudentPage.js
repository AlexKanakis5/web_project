import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './StudentPage.css';

const StudentPage = ({ user }) => {
  const [diplomas, setDiplomas] = useState([]);
  const [selectedDiploma, setSelectedDiploma] = useState(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
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
  }, [user.am]);


  const handleInviteClick = (diploma) => {
    setSelectedDiploma(diploma);
    setShowInviteForm(true);
  };

  const shouldShowInviteButton = (diploma) => {
    const allEmailsFilled = diploma.email_main_professor && diploma.email_second_professor && diploma.email_third_professor;
    const isNotCancelled = diploma.status !== 'cancelled';
    return !allEmailsFilled && isNotCancelled;
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

    try {
      const response = await fetch('http://localhost:5000/api/invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inviteData),
      });

      if (response.ok) {
        alert('Invite sent successfully');
        setShowInviteForm(false);
        setReceiverEmail('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to send invite');
      }
    } catch (error) {
      console.error('Error sending invite:', error);
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
        alert('File uploaded successfully');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload file');
    }
  };

  const handleFileChange = (diplomaId, event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(diplomaId, file);
    }
  };

  const handleDiplomaClick = (diploma) => {
    setSelectedDiploma(diploma);
  };

  return (
    <div className="student-page">
      <h1>Welcome, {user.name}</h1>
      <h2>Your Diplomas</h2>
      {selectedDiploma && (
        <div className="diploma-details">
          <h2>Diploma Details</h2>
          <p><strong>Title:</strong> {selectedDiploma.title}</p>
          <p><strong>Description:</strong> {selectedDiploma.description}</p>
          <p><strong>Student AM:</strong> {selectedDiploma.am_student}</p>
          <p><strong>Main Professor Email:</strong> {selectedDiploma.email_main_professor}</p>
          <p><strong>Second Professor Email:</strong> {selectedDiploma.email_second_professor}</p>
          <p><strong>Third Professor Email:</strong> {selectedDiploma.email_third_professor}</p>
          <p><strong>Created Date:</strong> {new Date(selectedDiploma.created_date).toLocaleDateString('en-GB')}</p>
          <p><strong>Due Date:</strong> {new Date(selectedDiploma.due_date).toLocaleDateString('en-GB')}</p>
          <button onClick={
            () => setSelectedDiploma(null)
          }>Hide details</button>
        </div>
      )}
      <div className="diplomas-grid">
        {diplomas.map((diploma) => (
          <div key={diploma.id} className="diploma-item" onClick={() => handleDiplomaClick(diploma)}>
            <h3>{diploma.title}</h3>
            <p>Status: {diploma.status}</p>
            <p>Due Date: {new Date(diploma.due_date).toLocaleDateString('en-GB')}</p>
            <Link to={`/diplomas/${diploma.id}/files`}>
              <button>View Files</button>
            </Link>
            <div className="file-upload-container">
              <label>Upload PDF:</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileChange(diploma.id, e)}
              />
            </div>
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