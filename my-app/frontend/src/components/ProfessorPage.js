import React, { useEffect, useState } from 'react';
import './ProfessorPage.css';

const ProfessorPage = ({ user }) => {
  const [diplomas, setDiplomas] = useState([]);

  useEffect(() => {
    const fetchDiplomas = async () => {
      const response = await fetch(`http://localhost:5000/api/diplomas/professor/${user.email}`);
      const data = await response.json();
      setDiplomas(data);
    };

    fetchDiplomas();
  }, [user.email]);

  return (
    <div className="professor-page">
      <h1>Welcome, Professor {user.name}</h1>
      <h2>Your Diplomas</h2>
      <ul className="diplomas-list">
        {diplomas.map((diploma) => (
          <li key={diploma.id} className="diploma-item">
            <h3>{diploma.title}</h3>
            <p>{diploma.description}</p>
            <p>Status: {diploma.status}</p>
            <p>Due Date: {new Date(diploma.due_date).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfessorPage;