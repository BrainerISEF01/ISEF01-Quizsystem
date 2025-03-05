import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/logo.png";

const Header = () => {
  return (
    <header className="bg-light shadow-sm px-4 py-3 d-flex justify-content-between align-items-end position-relative" style={{ width: "100%" }}>
      <div className="d-flex align-items-center">
        <img src={logo} alt="Brainer Logo" style={{ height: "50px", marginRight: "15px" }} />
        <h2 className="mb-0 fw-bold">Brainer Quiz Platform</h2>
      </div>
      <div className="position-absolute bottom-0 end-0 pb-2 pe-4">
        <a href="#" className="text-dark text-decoration-none me-3">Quiz-Lobby</a>
        <a href="#" className="text-dark text-decoration-none">Log out</a>
      </div>
    </header>
  );
};

export default Header;
