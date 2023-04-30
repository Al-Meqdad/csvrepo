import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './view.css';

function FileList() {
  const [file, setFiles] = useState([]);
  const [fileContent, setFileContent] = useState(null);
  const view= `${process.env.REACT_APP_BASE}/view`
  const del= `${process.env.REACT_APP_BASE}/delete`
  const download= `${process.env.REACT_APP_BASE}/download`

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(view);
        const responseData = await response.json();
        setFiles(responseData.body);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);
  const toggleDelete = async (name) => {
    try {
      const response = await fetch(`${del}?name=${name}`, {
        method: 'DELETE',
      });
      const responseData = await response.json();
      console.log(responseData.message); 
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleDownload = async (name) => {
    try {
      const response = await fetch(`${download}?name=${name}`, {
        method: 'GET',
        responseType: 'blob',
      });
      const body = await response.json(); 
      const file_content = body.body;
      const fileBlob = new Blob([file_content], { type: 'text/csv' });
      const fileUrl = URL.createObjectURL(fileBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = fileUrl;
      downloadLink.download = name;
        downloadLink.click();
    } catch (error) {
      console.error(error);
    }
  };


  const handleView = async (name) => {
    try {
      const response = await fetch(`${download}?name=${name}`, {
        method: 'GET',
        responseType: 'blob',
      });
      const blob = await response.blob();
      Papa.parse(blob, {
        complete: (results) => {
          setFileContent(results.data);
        },
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="view-container">
      <div className="file-info">
        <div className="file-data">
          <h2>File List</h2>
          <table>
            <thead>
              <tr>
                <th>File Name</th>
                <th>Size (bytes)</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {file.map((file) => (
                <tr key={file.name}>
                  <td>{file.name}</td>
                  <td>{file.size}</td>
                  <td>{file.createdAt}</td>
                  <td className="buttons">
                    <button className="view_button bt1" onClick={() => handleView(file.name)}>View as JSON</button>
                    <button className="view_button bt2" onClick={() => handleDownload(file.name)}>Download</button>
                    <button className="view_button bt3" onClick={() => toggleDelete(file.name)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {fileContent && (
          <div className="file-json-format">
            <h2>File Content</h2>
            <div className="json-content">
              <pre>{JSON.stringify(fileContent, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default FileList;