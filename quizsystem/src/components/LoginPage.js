import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "320px" }}>
        <h3 className="text-center mb-3">Login</h3>
        
        <div className="mb-3">
          <label className="form-label">Benutzername</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Passwort</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <button className="btn btn-primary w-100" onClick={onLogin}>
          Anmelden
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

