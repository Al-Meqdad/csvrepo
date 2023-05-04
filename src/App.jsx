import React, { useState, useRef, useEffect } from "react";
import View from "./view";
import "./App.css";
import Navbar from "./nav";
import { Auth } from "aws-amplify";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function App({ signOut, user }) {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [count, setCounter] = useState(0);
  const upload = `${process.env.REACT_APP_BASE}/upload`;
  const [groupName, setGroupName] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [messageBox,setMessageBox]=useState(false)




  //Function that fetches groupName from the current Auth user once the app is rendered
  useEffect(() => {
    const getGroupName = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        const groups =
          currentUser.signInUserSession.accessToken.payload["cognito:groups"];
        if (groups && groups.length > 0) {
          setGroupName(groups[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getGroupName();
  }, []);

  //funtion that handles the file change in the upload section
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  //function that generates a random number for useState so it can trigger useEffect in view component
  const handleFileView = () => {
    setCounter(Math.floor(Math.random() * 100) + 1);
  };

  //function that handles files upload to the lambda function and to S3 using API gateway and Amplify Auth token
  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    const token = await Auth.currentSession();

    try {
      const response = await fetch(upload, {
        headers: {
          Authorization: `Bearer ${token.getIdToken().getJwtToken()}`,
        },
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const responseData = await response.json();
      console.log(responseData.message);
      setResponseMessage(responseData.message);
      setMessageBox(true)
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    setMessageBox(false)
  };

  return (
    <div>
      <Navbar signOut={signOut} user={user} groupName={groupName} />
      <div className="main_app">
        <h1>Upload a csv file</h1>
        <div className="options">
          {groupName === "Read/Write" || groupName === "Admins" ? (
            <div className="options">
              <label htmlFor="file_upload" className="file_label">
                {file ? file.name : "Choose File"}
              </label>
              <input
                type="file"
                id="file_upload"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
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
        <View groupName={groupName} count={count} />
      </div>
      <div>

      {responseMessage && (
        <div className="modal">
          <p>{responseMessage}</p>
          <button onClick={() => setResponseMessage(null)}>Close</button>
        </div>
      )}


    </div>
    <Modal style={{  width: 'auto', height: 'auto', top: 'auto',left: '50%' }} show={messageBox} onHide={closeModal}>
        <Modal.Header >
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>{responseMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    
  );
}

export default App;
