import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import { useNavigate } from 'react-router-dom';

const QuizPage = () => {
  const [timeLeft, setTimeLeft] = useState(30);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }

    const fetchData = async () => {
      try {
        const response = await fetch("https://03c0-93-207-154-98.ngrok-free.app/quiz/start ",{
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({mode:"computer",user_id:1,opponent_id:""})
        });
        if (!response.ok) {
          console.log('Error: '+response.statusText);
          //throw new Error(`Error: ${response.statusText}`);
        }
        const result = await response.json();
        // Process the fetched data as needed
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    };



    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  return (
    <div className="container-fluid d-flex flex-column min-vh-100 px-0">
      {/* Header: Vollbreit + Fixes Layout */}
      <Header />
      
      {/* Hauptinhalt */}
      
      <main className="d-flex flex-column align-items-center flex-grow-1 mt-5">
        {/* Timer rechts oberhalb des Quiz-Kastens */}
        <div className="d-flex justify-content-end w-50 mb-2">
          <span className="badge bg-danger fs-5">{timeLeft} Sekunden</span>
        </div>

        <div className="card p-4 shadow-sm" style={{ width: "50%" }}>
          <div className="card-header bg-light">Frage 5</div>
          <div className="card-body">
            <p>Wie lautet die Hauptstadt von Deutschland?</p>
            <form>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="question" id="option1" />
                <label className="form-check-label" htmlFor="option1">Madrid</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="question" id="option2" />
                <label className="form-check-label" htmlFor="option2">Berlin</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="question" id="option3" />
                <label className="form-check-label" htmlFor="option3">Paris</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="question" id="option4" />
                <label className="form-check-label" htmlFor="option4">Rom</label>
              </div>
            </form>
          </div>
        </div>
        
        {/* Navigationslinks und Button außerhalb des Frage-Kastens */}
        <div className="d-flex justify-content-between w-50 mt-3">
          <div>
            <a href="#" className="text-dark text-decoration-none me-3">Zurück</a>
            <a href="#" className="text-dark text-decoration-none">|     Nächste Frage</a>
          </div>
          <button className="btn btn-primary">Antwort bestätigen</button>
        </div>
      </main>
    </div>
  );
};

export default QuizPage;
