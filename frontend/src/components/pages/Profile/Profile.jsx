import React, { useState } from 'react';
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "Janez Novak",
    email: "janez.novak@example.com",
    role: "User",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    alert(`Podatki shranjeni:\nIme: ${userData.name}\nE-pošta: ${userData.email}`);
  };

  return (
      <div className="profile-container">
        <h2>Profil uporabnika</h2>
        <form className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Ime:</label>
            <input
                type="text"
                id="name"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-pošta:</label>
            <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Vloga:</label>
            <input
                type="text"
                id="role"
                name="role"
                value={userData.role}
                className="form-control"
                disabled
            />
          </div>
          <button type="button" onClick={handleSave} className="btn btn-primary">
            Shrani
          </button>
        </form>
      </div>
  );
};

export default Profile;
