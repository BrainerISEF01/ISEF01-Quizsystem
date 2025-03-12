import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import { Link } from "react-router-dom";

import iconComputer from "../assets/icon-computer.png";
import icon1v1 from "../assets/icon-1v1.png";
import iconLeague from "../assets/icon-league.png";
import iconQuestions from "../assets/icon-questions.png";

const QuizLobby = () => {
  const username = "[Benutzername]"; // Später dynamisch ersetzen

  return (
    <div className="container-fluid d-flex flex-column min-vh-100 px-0">
      {/* Header: Vollbreit + Fixes Layout */}
      <Header />

      {/* Hauptinhalt */}
      <main className="d-flex flex-column align-items-center flex-grow-1 mt-5"> {/* 🔹 Inhalt weiter nach unten verschoben */}
        <h2 className="mb-5">Willkommen, {username}</h2> 

        {/* Quiz-Optionen */}
        <div className="row justify-content-center w-100">
          <QuizOption text="Gegen den Computer spielen" icon={iconComputer} link="/quizpage"/>
          <QuizOption text="1 vs 1 spielen" icon={icon1v1} link="/quizpage"/>
          <QuizOption text="Ligamodus" icon={iconLeague} link="/leaderboard"/>
          <QuizOption text="Eigene Fragen hinzufügen" icon={iconQuestions} link="/questions"/>
        </div>
      </main>
    </div>
  );
};

// Button-Komponente für Quiz-Optionen mit gleicher Höhe
const QuizOption = ({ text, icon, link }) => {
  return (
    <div className="col-md-3 mb-3 d-flex">
      <Link
        to={link} // Link zum angegebenen Pfad
        className="btn btn-light w-100 p-4 shadow-sm d-flex flex-column align-items-center justify-content-center rounded"
        style={{ height: "250px" }}
      >
        <img src={icon} alt="Icon" style={{ height: "50px", marginBottom: "10px" }} />
        <span className="text-center">{text}</span>
      </Link>
    </div>
  );
};

export default QuizLobby;




