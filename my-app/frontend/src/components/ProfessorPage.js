import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import './ProfessorPage.css';

const ProfessorPage = ({ user }) => {
  const [diplomas, setDiplomas] = useState([]);
  const [selectedDiploma, setSelectedDiploma] = useState(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [receiverEmail, setReceiverEmail] = useState('');
  const [error, setError] = useState('');
  const [filteredDiplomas, setFilteredDiplomas] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const history = useHistory();

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


  const handleDiplomaClick = (diploma) => {
    setSelectedDiploma(diploma);
    setShowDetails(true);
  };

  const handleHideDetails = () => {
    setShowDetails(false);
  };

  const handleGradeChange = (grade) => {
    const gradeField = user.email === selectedDiploma.email_main_professor
      ? 'grade_main_professor'
      : user.email === selectedDiploma.email_second_professor
      ? 'grade_second_professor'
      : 'grade_third_professor';

    setSelectedDiploma({ ...selectedDiploma, [gradeField]: grade });
  };

  const handleSaveGrade = async () => {
    const gradeField = user.email === selectedDiploma.email_main_professor
      ? 'grade_main_professor'
      : user.email === selectedDiploma.email_second_professor
      ? 'grade_second_professor'
      : 'grade_third_professor';

    const response = await fetch(`http://localhost:5000/api/diplomas/${selectedDiploma.id}/grades`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grade: selectedDiploma[gradeField],
        email: user.email
      }),
    });

    if (response.ok) {
      alert('Grade saved successfully');
    } else {
      alert('Failed to save grade');
    }
  };

  

  const handleExportDiplomas = () => {
    const dataStr = JSON.stringify(diplomas, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'diplomas.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="professor-page">
      <h1>Welcome, Professor {user.name}</h1>
      <button onClick={handleExportDiplomas} style={{ float: 'right' }}>Export Diplomas</button>

      <h2>Your Diplomas</h2>
      <button onClick={() => history.push('/statistics')}>Show Stats</button>
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
        <div className="diploma-details" >
          <h2>Diploma Details</h2>
          <p><strong>Title:</strong> {selectedDiploma.title}</p>
          <p><strong>Description:</strong> {selectedDiploma.description}</p>
          <p><strong>Student AM:</strong> {selectedDiploma.am_student}</p>
          <p><strong>Main Professor Email:</strong> {selectedDiploma.email_main_professor}</p>
          <p><strong>Second Professor Email:</strong> {selectedDiploma.email_second_professor}</p>
          <p><strong>Third Professor Email:</strong> {selectedDiploma.email_third_professor}</p>
          <p><strong>Created Date:</strong> {new Date(selectedDiploma.created_date).toLocaleDateString('en-GB')}</p>
          <p><strong>Due Date:</strong> {new Date(selectedDiploma.due_date).toLocaleDateString('en-GB')}</p>
          <p><strong>Main Professor Grade:</strong> {selectedDiploma.grade_main_professor || 'Not submitted'}</p>
          <p><strong>Second Professor Grade:</strong> {selectedDiploma.grade_second_professor || 'Not submitted'}</p>
          <p><strong>Third Professor Grade:</strong> {selectedDiploma.grade_third_professor || 'Not submitted'}</p>
          {selectedDiploma.status === 'pending' && (
            <>
              {user.email === selectedDiploma.email_main_professor && (
                <div>
                  <label>Main Professor Grade:</label>
                  <input 
                    className="grade-input"
                    type="number"
                    value={selectedDiploma.grade_main_professor || ''}
                    onChange={(e) => handleGradeChange(e.target.value)}
                  />
                </div>
              )}
              {user.email === selectedDiploma.email_second_professor && (
                <div>
                  <label>Second Professor Grade:</label>
                  <input 
                    className='grade-input'
                    type="number"
                    value={selectedDiploma.grade_second_professor || ''}
                    onChange={(e) => handleGradeChange(e.target.value)}
                  />
                </div>
              )}
              {user.email === selectedDiploma.email_third_professor && (
                <div>
                  <label>Third Professor Grade:</label>
                  <input
                    className='grade-input'
                    type="number"
                    value={selectedDiploma.grade_third_professor || ''}
                    onChange={(e) => handleGradeChange(e.target.value)}
                  />
                </div>
              )}
              <button onClick={handleSaveGrade}>Save Grade</button>
            </>
          )}
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

ProfessorPage.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    am: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProfessorPage;