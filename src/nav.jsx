import React from 'react';
import icon from './icon.png';
import './nav.css'
function Navbar({signOut, user,groupName}) {
  return (
    <div className="navbar">
      <div className="navbar_container">
        <p>Hello {user.username}</p>
        <p>You are of part of {groupName} Group</p>
        <img src={icon} alt="icon" onClick={signOut} className="icon" />
      </div>
    </div>
  );
}

export default Navbar;