import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase';

function Header({ role, setRole, setIsAuthenticated }) {
  const handleLogout = () => {
    auth.signOut();
    setRole(null);
    setIsAuthenticated(false);
  };

  return (
    <header className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">Aplikacija</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/">Nadzorna plošča</Link>
              </li>
            )}
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/workhours">Moje ure</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/leaves">Moji dopusti/bolniške</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/profile">Moj profil</Link>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link text-dark" onClick={handleLogout}>Odjava</button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
