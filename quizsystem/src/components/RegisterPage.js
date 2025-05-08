import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { BASE_URL } from "../fetchApi";

const RegisterPage = () => {
  const base_url = BASE_URL;

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (username, email, password) => {

    try {
      const response = await fetch(`${base_url}/auth/register`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Register fehlgeschlagen');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await handleRegister(username, email, password);
      //console.log(data);
      alert(data.message);
      // refresh
      navigate(0);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "320px" }}>
        <h3 className="text-center mb-3">Anmeldung</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">E-Mail-Adresse</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Passwort</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" className="btn btn-primary w-100">Register</button><br/>
          <button type="button" className="btn btn-secondary w-100 mt-2" onClick={() => navigate('/login')}>Zurück zum Login</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
