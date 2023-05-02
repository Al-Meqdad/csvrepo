import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './view.css';
import { Auth } from 'aws-amplify';

function FileList({groupName,count}) {
  const [file, setFiles] = useState([]);
  const [fileContent, setFileContent] = useState(null);
  const view= `${process.env.REACT_APP_BASE}/view`
  const del= `${process.env.REACT_APP_BASE}/delete`
  const download= `${process.env.REACT_APP_BASE}/download`
  
  const toggleDelete = async (name) => {
    const token = await Auth.currentSession();

    try {
      const response = await fetch(`${del}?name=${name}`, {
        headers: {
          Authorization: `Bearer ${token.getIdToken().getJwtToken()}`,
        },
        method: 'DELETE',
      });
      const responseData = await response.json();
      console.log(responseData)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const token = await Auth.currentSession();

      try {
        const response = await fetch(view,{
          headers: {
            Authorization: `Bearer ${token.getIdToken().getJwtToken()}`,
          },
        });
        const responseData = await response.json();
        setFiles(responseData.body);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const handleDownload = async (name) => {
    const token = await Auth.currentSession();

    try {
      const response = await fetch(`${download}?name=${name}`, {
        headers: {
          Authorization: `Bearer ${token.getIdToken().getJwtToken()}`,
        },
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
    const token = await Auth.currentSession();

    try {
      const response = await fetch(`${download}?name=${name}`, {
        headers: {
          Authorization: `Bearer ${token.getIdToken().getJwtToken()}`,
        },
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
                    {groupName === 'Admins' ? (
                      <button className="view_button bt3" onClick={() => toggleDelete(file.name)}>Delete</button>
                    ) : (groupName === 'Read/Write'  || 'Read' ? (
                      <></>
                    ) : (
                      <></>
                    ))}
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
export default React.memo(FileList);