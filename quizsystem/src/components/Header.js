import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../fetchApi';

const Header = () => {
  const base_url = BASE_URL;
  //console.log(base_url);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      
      const headToSend = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      };

      try {
        const response = await fetch(`${base_url}/auth/logout`, {
          method: 'POST',
          headers: headToSend,
          body: JSON.stringify({})
        });

        if (response.ok) {
          // Remove token from session storage
          sessionStorage.removeItem('token');
          // Show success message
          alert('Logout successful');
          // Redirect to LoginPage
          navigate('/');
        } else {
          // Handle error response
          const errorData = await response.json();
          alert(`Logout failed: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error during logout:', error);
        alert('An error occurred during logout.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert(error.message);
    }
  };

  return (
    <header className="bg-light shadow-sm px-4 py-3 d-flex justify-content-between align-items-end position-relative" style={{ width: "100%" }}>
      <div className="d-flex align-items-center">
        <img src={logo} alt="Brainer Logo" style={{ height: "50px", marginRight: "15px" }} />
        <h2 className="mb-0 fw-bold">Brainer Quiz Platform</h2>
      </div>
      <div className="position-absolute bottom-0 end-0 pb-2 pe-4">
        <Link to="/quizlobby" className="me-3">Quiz lobby</Link>
        <a href="#" onClick={handleLogout} className="btn btn-link me-3">Log out</a>
      </div>
    </header>
  );
};

export default Header;
