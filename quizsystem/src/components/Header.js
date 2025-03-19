import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from session storage
    sessionStorage.removeItem('token');
    // Redirect to LoginPage
    navigate('/');
  };

  return (
    <header className="bg-light shadow-sm px-4 py-3 d-flex justify-content-between align-items-end position-relative" style={{ width: "100%" }}>
      <div className="d-flex align-items-center">
        <img src={logo} alt="Brainer Logo" style={{ height: "50px", marginRight: "15px" }} />
        <h2 className="mb-0 fw-bold">Brainer Quiz Platform</h2>
      </div>
      <div className="position-absolute bottom-0 end-0 pb-2 pe-4">
        <Link to="/quizlobby" className="me-3">Quiz lobby</Link>
        <button onClick={handleLogout} className="btn btn-link text-dark text-decoration-none p-0">Log out</button>
      </div>
    </header>
  );
};

export default Header;
