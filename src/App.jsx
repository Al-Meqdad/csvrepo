import React, { useState, useRef, useEffect } from 'react';
import View from './view';
import './App.css';
import Navbar from './nav';
import { Auth } from 'aws-amplify';


function App({signOut,user}) {
  
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [count,setCounter] = useState(0)
  const upload= `${process.env.REACT_APP_BASE}/upload`
  const [groupName,setGroupName]=useState(null)


  useEffect(() => {
    const getGroupName = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        const groups = currentUser.signInUserSession.accessToken.payload['cognito:groups'];
        if (groups && groups.length > 0) {
          setGroupName(groups[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getGroupName();
  }, []);


  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const handleFileView= ()=>{
    setCounter(Math.floor(Math.random() * 100) + 1)
  }


  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    const token = await Auth.currentSession();

    try {
      const response = await fetch(upload, {
        headers: {
          Authorization: `Bearer ${token.getIdToken().getJwtToken()}`,
        },
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
      <Navbar signOut={signOut} user={user} groupName={groupName} />
      <div className="main_app">
        <h1>Upload a csv file</h1>
        <div className="options">
        {groupName === 'Read/Write' || groupName === 'Admins' ? (
          <div className="options">
            <label htmlFor="file_upload" className="file_label">
              {file ? file.name : 'Choose File'}
            </label>
            <input type="file" id="file_upload" ref={fileInputRef} onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Upload File</button>
            <button onClick={handleFileView}>Update File List</button>
          </div>
 
        ) : (
          <div className="only_view">
          <p>You do not have permission to upload files.</p>
          <button onClick={handleFileView}>Update File List</button>
          </div>
        )}
        </div>
        <View groupName={groupName} count={count}/>
      </div>
    </div>
  );
}

export default App;