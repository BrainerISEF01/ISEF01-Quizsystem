import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { BASE_URL } from "../fetchApi";

const LoginPage = () => {
  const base_url = BASE_URL;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {

    try {
      const response = await fetch(`${base_url}/auth/login`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login fehlgeschlagen');
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
      const data = await handleLogin(email, password);
      //console.log('Login successful: '+data);
      // Save token to session storage
      const tokenParts = data.token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        
        sessionStorage.setItem('user_id', payload.id); // Save user_id from token payload
        sessionStorage.setItem('email', payload.email); // Save user_name from token payload
      }
      sessionStorage.setItem('token', data.token);
      // Redirect to QuizPage
      navigate('/quizlobby');
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
          <button type="submit" className="btn btn-primary w-100">Login</button><br/>
          <button type="button" className="btn btn-secondary w-100 mt-2" onClick={() => navigate('/register')}>Registrieren</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
