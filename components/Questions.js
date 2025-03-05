import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header"; 

const Questions = () => {
  return (
    <div className="container-fluid px-0">
      <Header />

      {/* Hauptcontainer */}
      <div className="d-flex flex-column align-items-center bg-light min-vh-100 pt-4">
        <div className="card p-4 shadow-sm" style={{ width: "50%" }}>
          <h2 className="text-center">Neue Fragen hinzufügen</h2>
          <p>Füge eine Frage mit Single-Choice-Antworten hinzu, die im Quiz verwendet werden kann.</p>

          {/* Eingabefeld für die Frage */}
          <div className="mb-3">
            <label htmlFor="frage" className="form-label">Frage</label>
            <input type="text" id="frage" className="form-control" placeholder="Gib hier deine Frage ein" />
          </div>

          {/* Antwortmöglichkeiten */}
          <p>Antwortmöglichkeiten</p>
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="d-flex align-items-center mb-2">
              <input type="radio" name="antwort" disabled className="me-2" />
              <input type="text" className="form-control" placeholder={`Antwort ${num}`} />
            </div>
          ))}

          {/* Auswahl für die richtige Antwort */}
          <div className="mb-3">
            <label htmlFor="richtige-antwort" className="form-label">Wähle die richtige Antwort aus</label>
            <select id="richtige-antwort" className="form-select">
              <option>Antwort 1</option>
              <option>Antwort 2</option>
              <option>Antwort 3</option>
              <option>Antwort 4</option>
            </select>
          </div>

          {/* Speichern-Button */}
          <div className="text-center">
            <button className="btn btn-primary">Frage speichern</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questions;
