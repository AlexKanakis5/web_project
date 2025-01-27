import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './SecretaryPage.css';

const SecretaryPage = ({ user }) => {
  const [diplomas, setDiplomas] = useState([]);
  const [selectedDiploma, setSelectedDiploma] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPendingDiplomas = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/diplomas/pending');
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

    fetchPendingDiplomas();
  }, []);

  const handleDiplomaClick = (diploma) => {
    setSelectedDiploma(diploma);
  };

  const handleCancelDiploma = async (diplomaId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/diplomas/${diplomaId}/cancel`, {
        method: 'PUT',
      });

      if (response.ok) {
        setDiplomas(diplomas.filter(diploma => diploma.id !== diplomaId));
        setSelectedDiploma(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to cancel diploma');
      }
    } catch (error) {
      setError('Failed to cancel diploma');
    }
  };

  const handleFinishDiploma = async (diplomaId) => {
    try {
      const finishedDate = new Date().toISOString(); // Get the current date in ISO format
      const response = await fetch(`http://localhost:5000/api/diplomas/${diplomaId}/finish`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ finished_date: finishedDate }),
      });

      if (response.ok) {
        const updatedDiploma = await response.json();
        setDiplomas(diplomas.map(diploma => diploma.id === diplomaId ? updatedDiploma : diploma));
        setSelectedDiploma(updatedDiploma);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to finish diploma');
      }
    } catch (error) {
      setError('Failed to finish diploma');
    }
  };

  return (
    <div className="secretary-page">
      <h1>Welcome, Secretary</h1>
      <h2>Pending Diplomas</h2>
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
          <p><strong>Main Professor Grade:</strong> {selectedDiploma.grade_main_professor || 'Not submitted'}</p>
          <p><strong>Second Professor Grade:</strong> {selectedDiploma.grade_second_professor || 'Not submitted'}</p>
          <p><strong>Third Professor Grade:</strong> {selectedDiploma.grade_third_professor || 'Not submitted'}</p>
          <button onClick={() => setSelectedDiploma(null)}>Hide details</button>
          <button onClick={() => handleCancelDiploma(selectedDiploma.id)}>Cancel Diploma</button>
          {selectedDiploma.grade_main_professor && selectedDiploma.grade_second_professor && selectedDiploma.grade_third_professor && (
            <button onClick={() => handleFinishDiploma(selectedDiploma.id)}>Finish Diploma</button>
          )}
        </div>
      )}
      <div className="diplomas-grid">
        {diplomas.map((diploma) => (
          <div key={diploma.id} className="diploma-item" onClick={() => handleDiplomaClick(diploma)}>
            <h3>{diploma.title}</h3>
            <p>Status: {diploma.status}</p>
            <p>Due Date: {new Date(diploma.due_date).toLocaleDateString('en-GB')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

SecretaryPage.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
};

export default SecretaryPage;