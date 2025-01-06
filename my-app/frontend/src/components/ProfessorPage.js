import React, { useEffect, useState } from 'react';
import './ProfessorPage.css';

const ProfessorPage = ({ user }) => {
  const [diplomas, setDiplomas] = useState([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [selectedDiploma, setSelectedDiploma] = useState(null);
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
            <p>{diploma.description}</p>
            <p>Status: {diploma.status}</p>
            <p>Due Date: {new Date(diploma.due_date).toLocaleDateString()}</p>
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

export default ProfessorPage;