import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './StudentPage.css';

const StudentPage = ({ user }) => {
  const [diplomas, setDiplomas] = useState([]);
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

  return (
    <div className="student-page">
      <h1>Welcome, {user.name}</h1>
      <h2>Your Diplomas</h2>
      <div className="diplomas-grid">
        {diplomas.map((diploma) => (
          <div key={diploma.id} className="diploma-item">
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