import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ProfessorPage.css';

const ProfessorPage = ({ user }) => {
  const [diplomas, setDiplomas] = useState([]);
  const [filteredDiplomas, setFilteredDiplomas] = useState([]);
  const [selectedDiploma, setSelectedDiploma] = useState(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [receiverEmail, setReceiverEmail] = useState('');
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    const fetchDiplomas = async () => {
      const response = await fetch(`http://localhost:5000/api/diplomas/professor/${user.email}`);
      const data = await response.json();
      setDiplomas(data);
      setFilteredDiplomas(data);
    };

    fetchDiplomas();
  }, [user.email]);

  useEffect(() => {
    filterDiplomas();
  }, [filterStatus, filterRole, diplomas]);

  const filterDiplomas = () => {
    let filtered = diplomas;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(diploma => diploma.status === filterStatus);
    }

    if (filterRole !== 'all') {
      if (filterRole === 'main') {
        filtered = filtered.filter(diploma => diploma.email_main_professor === user.email);
      } else if (filterRole === 'second-third') {
        filtered = filtered.filter(diploma => diploma.email_second_professor === user.email || diploma.email_third_professor === user.email);
      }
    }

    setFilteredDiplomas(filtered);
  };

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
      type: user.user_type === 'professor' ? 'student' : 'professor',
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

  const handleDiplomaClick = (diploma) => {
    setSelectedDiploma(diploma);
    setShowDetails(true);
  };

  const handleHideDetails = () => {
    setShowDetails(false);
  };

  return (
    <div className="professor-page">
      <h1>Welcome, Professor {user.name}</h1>
      <h2>Your Diplomas</h2>
      <div className="filters">
        <label>
          Status:
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="finished">Finished</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
        <label>
          Role:
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="all">All</option>
            <option value="main">Main Professor</option>
            <option value="second-third">Second/Third Professor</option>
          </select>
        </label>
      </div>
      {showDetails && selectedDiploma && (
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
          <p><strong>Grade:</strong> {selectedDiploma.grade}</p>
          <button onClick={handleHideDetails}>Hide</button>
        </div>
      )}
      <div className="diplomas-grid">
        {filteredDiplomas.map((diploma) => (
          <div key={diploma.id} className="diploma-item" onClick={() => handleDiplomaClick(diploma)}>
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
            <Link to={`/diplomas/${diploma.id}/files`}>
              <button>View Files</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessorPage;