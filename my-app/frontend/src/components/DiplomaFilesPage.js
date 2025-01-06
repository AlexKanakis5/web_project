import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './DiplomaFilesPage.css';

const DiplomaFilesPage = ({ user }) => {
  const { id } = useParams();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      const response = await fetch(`http://localhost:5000/api/diplomas/${id}/files`);
      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch files');
      }
    };

    fetchFiles();
  }, [id]);

  const handleDownload = async (fileName) => {
    const response = await fetch(`http://localhost:5000/api/diplomas/${id}/files/${fileName}`);
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      const errorData = await response.json();
      setError(errorData.message || 'Failed to download file');
    }
  };

  return (
    <div className="diploma-files-page">
      <h1>Diploma Files</h1>
      {error && <div className="error">{error}</div>}
      <ul className="files-list">
        {files.map((file) => (
          <li key={file} className="file-item">
            <button onClick={() => handleDownload(file)}>{file}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DiplomaFilesPage;