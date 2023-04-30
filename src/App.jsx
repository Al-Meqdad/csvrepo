import React, { useState, useRef } from 'react';
import View from './view';
import './App.css';
import Navbar from './nav';


function App({signOut,user}) {
  const [isClicked, setIsClicked] = useState(true);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const upload= `${process.env.REACT_APP_BASE}/upload`

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleButtonClick = () => {
    setIsClicked(true);
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(upload, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const responseData = await response.json();
      console.log(responseData.message); 
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div>
      <Navbar signOut={signOut} user={user} />
      <div className="main_app">
      <h1>Upload a csv file</h1>
        <div className="options">

          <label htmlFor="file_upload" className="file_label">
            {file ? file.name : "Choose File"}
          </label>
          <input type="file" id="file_upload" ref={fileInputRef} onChange={handleFileChange} />
          <button onClick={handleFileUpload}>Upload File</button>
          <button onClick={handleButtonClick}>Show File List</button>
        </div>
        {isClicked && <View />}
      </div>
    </div>
  );
}

export default App;