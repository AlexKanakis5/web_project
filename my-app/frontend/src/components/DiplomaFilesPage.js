import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './DiplomaFilesPage.css';

const DiplomaFilesPage = ({ user }) => {
  const { id } = useParams();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => { // useEffect because we want to fetch data when the component mounts
    const fetchFiles = async () => {
      // fetch the files for the diploma with the given ID
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
    // download the file with the given name when the file name is clicked
    const response = await fetch(`http://localhost:5000/api/diplomas/${id}/files/${fileName}`);
    if (response.ok) {
      // create a URL for the file and download it
      const blob = await response.blob(); // create the blob data (raw) from the response
      const url = window.URL.createObjectURL(blob); // generate a URL for the blob data
      const a = document.createElement('a'); // create a link element
      a.href = url; // set the href attribute of the link to the URL
      a.download = fileName; // set the download attribute of the link to the file name
      document.body.appendChild(a); // append the link to the body
      a.click(); // simulate a click on the link
      a.remove(); // remove the link from the body
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