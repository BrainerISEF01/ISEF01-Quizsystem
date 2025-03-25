import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header"; // Importiere den Header
import { Link,useNavigate } from 'react-router-dom';

const Questions = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      question,
      options,
      correctAnswer,
      created_by: 1,
    };

    try {
      //const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
      //console.log('hello');
      // const data_json = JSON.stringify(data);
      // console.log(data_json);
      const response = await fetch("https://03c0-93-207-154-98.ngrok-free.app/questions/add", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      //alert(`Frage hinzugefügt: ${result.msg}`);

      navigate('/frageerfolgreich',{state: result.msg});
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container-fluid px-0">
      {/* Header */}
      <Header />

      {/* Hauptcontainer */}
      <div className="d-flex flex-column align-items-center bg-light min-vh-100 pt-4">
        <div className="card p-4 shadow-sm" style={{ width: "50%" }}>
          <h2 className="text-center">Neue Fragen hinzufügen</h2>
          <p>Füge eine Frage mit Single-Choice-Antworten hinzu, die im Quiz verwendet werden kann.</p>

          <form onSubmit={handleSubmit}>
            {/* Eingabefeld für die Frage */}
            <div className="mb-3">
              <label htmlFor="frage" className="form-label">Frage</label>
              <input
                type="text"
                id="frage"
                className="form-control"
                placeholder="Gib hier deine Frage ein"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
            </div>

            {/* Antwortmöglichkeiten */}
            <p>Antwortmöglichkeiten</p>
            {options.map((option, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <input type="radio" name="antwort" disabled className="me-2" />
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Antwort ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                />
              </div>
            ))}

            {/* Auswahl für die richtige Antwort */}
            <div className="mb-3">
              <label htmlFor="richtige-antwort" className="form-label">Gib die richtige Antwort ein</label>
              <input
                type="text"
                id="richtige-antwort"
                className="form-control"
                placeholder="Gib hier die richtige Antwort ein"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                required
              />
            </div>

            {/* Speichern-Button */}
            <div className="text-center">
              <button type="submit" className="btn btn-primary">Frage speichern</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Questions;
