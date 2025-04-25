import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header"; 
import { Link } from 'react-router-dom';

const QuestionsMultiple = () => {
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].correctAnswer = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = questions.map((q) => ({
      ...q,
      created_by: 1,
    }));

    try {
      const data_json = JSON.stringify(data);
      console.log(data_json);
      const response = await fetch("https://03c0-93-207-154-98.ngrok-free.app/questions/addMultiple", {
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
      alert(`Fragen hinzugefügt: ${result.msg}`);
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
          <p>Füge Fragen mit Single-Choice-Antworten hinzu, die im Quiz verwendet werden können.</p>

          <form onSubmit={handleSubmit}>
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="mb-4">
                {/* Eingabefeld für die Frage */}
                <div className="mb-3">
                  <label htmlFor={`frage-${qIndex}`} className="form-label">Frage {qIndex + 1}</label>
                  <input
                    type="text"
                    id={`frage-${qIndex}`}
                    className="form-control"
                    placeholder="Gib hier deine Frage ein"
                    value={q.question}
                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                    required
                  />
                </div>

                {/* Antwortmöglichkeiten */}
                <p>Antwortmöglichkeiten</p>
                {q.options.map((option, oIndex) => (
                  <div key={oIndex} className="d-flex align-items-center mb-2">
                    <input type="radio" name={`antwort-${qIndex}`} disabled className="me-2" />
                    <input
                      type="text"
                      className="form-control"
                      placeholder={`Antwort ${oIndex + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      required
                    />
                  </div>
                ))}

                {/* Auswahl für die richtige Antwort */}
                <div className="mb-3">
                  <label htmlFor={`richtige-antwort-${qIndex}`} className="form-label">Gib die richtige Antwort ein</label>
                  <input
                    type="text"
                    id={`richtige-antwort-${qIndex}`}
                    className="form-control"
                    placeholder="Gib hier die richtige Antwort ein"
                    value={q.correctAnswer}
                    onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                    required
                  />
                </div>
              </div>
            ))}

            {/* Button zum Hinzufügen einer neuen Frage */}
            <div className="text-center mb-3">
              <button type="button" className="btn btn-secondary" onClick={addQuestion}>Weitere Frage hinzufügen</button>
            </div>

            {/* Speichern-Button */}
            <div className="text-center">
              <Link to="/questions" className="me-3">Question</Link>
              <button type="submit" className="btn btn-primary">Fragen speichern</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuestionsMultiple;
