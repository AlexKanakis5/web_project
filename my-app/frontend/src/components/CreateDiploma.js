import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './CreateDiploma.css';

const CreateDiploma = ({ user }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + 3);

    const diplomaData = {
      title,
      description,
      document_folder_number: '',
      am_student: null,
      email_main_professor: user.email,
      email_second_professor: null,
      email_third_professor: null,
      status: 'Pending',
      grade: null,
      created_date: new Date(),
      finished_date: null,
      due_date: dueDate,
    };

    const response = await fetch('http://localhost:5000/api/diplomas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(diplomaData),
    });

    if (response.ok) {
      history.push('/');
    } else {
      const errorData = await response.json();
      setError(errorData.message || 'Failed to create diploma');
    }
  };

  return (
    <div className="create-diploma-container">
      <form className="create-diploma-form" onSubmit={handleSubmit}>
        <h2>Create Diploma</h2>
        {error && <div className="error">{error}</div>}
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Diploma</button>
      </form>
    </div>
  );
};

export default CreateDiploma;