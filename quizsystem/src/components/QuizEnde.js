import React, { useEffect, useState, useRef } from "react";
import Header from "./Header";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../fetchApi";
import { io } from "socket.io-client";

const QuizEnde = () => {
  const base_url = BASE_URL;
  const socketRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const data = location?.state;

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [score, setScore] = useState(0);
  const [mode, setMode] = useState("");
  const [userName, setUsername] = useState("");
  const [scoreUser, setScoreUser] = useState("");
  const [opName, setOpName] = useState("");
  const [opScore, setOpScore] = useState("");
  const [status, setStatus] = useState("");

  const gameId = data?.gameId;
  const quizId = data?.quizId;

  // Init socket connection once
  useEffect(() => {
    socketRef.current = io(base_url);
    const socket = socketRef.current;

    socket.emit("gameDone", {
      username: sessionStorage.getItem("email"),
      gameId,
    });

    socket.on("gameDoneOk", (data) => {
      if (data.status === 1) {
        fetchGameEndData();
        fetchLeaderboards();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [base_url, gameId]);

  // Check login
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Initial fetch
  useEffect(() => {
    if (gameId && quizId) {
      fetchGameEndData();
      fetchLeaderboards();
    }
  }, [gameId, quizId]);

  const fetchGameEndData = async () => {
    try {
      const response = await fetch(`${base_url}/matchmaking/ende`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId }),
      });

      if (!response.ok) throw new Error("Fehler beim Abrufen der Spieldaten");

      const result = await response.json();
      setMode(result.mode);
      setUsername(result.userEmail);
      setScoreUser(result.scoreUser);
      setOpName(result.opponentEmail);
      setOpScore(result.scoreOpponent);
      setStatus(result.status);
    } catch (error) {
      console.error("Error fetching game data:", error);
    }
  };

  const fetchLeaderboards = async () => {
    try {
      const response = await fetch(`${base_url}/leaderboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Fehler beim Abrufen des Leaderboards");

      const data = await response.json();

      if (Array.isArray(data) && quizId) {
        const filtered = data.filter((item) => item.quiz_id === quizId);
        setLeaderboardData(filtered);

        const totalScore = filtered.reduce((sum, item) => sum + item.score, 0);
        setScore(totalScore);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const updateStatus = async () => {
    try {
      const response = await fetch(`${base_url}/matchmaking/updateStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId, status: 0 }),
      });

      if (!response.ok)
        throw new Error("Status konnte nicht aktualisiert werden");

      await response.json();
      navigate(0); // Reload page
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleBack = () => navigate("/quizstart");
  const handleLeaderboard = () => navigate("/leaderboard");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-2xl w-1/2 text-center">
          <h2 className="text-2xl font-bold mb-6">So hast du abgeschnitten!</h2>

          <table className="table table-bordered table-striped mb-6">
            <tbody>
              <tr>
                <th>Mode</th>
                <td>{mode}</td>
              </tr>
              <tr>
                <th>Dein Benutzername</th>
                <td>
                  {userName}{" "}
                  {mode === "1v1" && (
                    <>
                      {scoreUser > opScore && (
                        <span className="badge bg-success text-light">
                          Du hast gewonnen!
                        </span>
                      )}
                      {scoreUser === opScore && (
                        <span className="badge bg-warning text-dark">
                          Unentschieden
                        </span>
                      )}
                      {scoreUser < opScore && (
                        <span className="badge bg-danger text-light">
                          Du hast verloren!
                        </span>
                      )}
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <th>Deine Punkte</th>
                <td>{scoreUser}</td>
              </tr>
              {mode === "1v1" && (
                <>
                  <tr>
                    <th>Gegnername</th>
                    <td>
                      {opName}{" "}
                      {opName && (
                        <>
                          {opScore > scoreUser && (
                            <span className="badge bg-success text-light">
                              Hat gewonnen
                            </span>
                          )}
                          {opScore === scoreUser && (
                            <span className="badge bg-warning text-dark">
                              Unentschieden
                            </span>
                          )}
                          {opScore < scoreUser && (
                            <span className="badge bg-danger text-light">
                              Hat verloren
                            </span>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Gegnerpunkte</th>
                    <td>{opScore}</td>
                  </tr>
                </>
              )}
              {status === 1 && (
                <tr>
                  <td colSpan={2}>
                    <button className="btn btn-primary" onClick={updateStatus}>
                      Quiz beenden
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <h3 className="text-xl font-semibold mb-4">Deine Antworten</h3>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Frage</th>
                <th>Richtige Antwort</th>
                <th>Punktzahl</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((item, index) => (
                <tr key={index}>
                  <td>{item.question?.question}</td>
                  <td>{item.question?.correctAnswer}</td>
                  <td>{item.score}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            className="mt-6 flex justify-center gap-6"
            style={{ marginTop: "150px" }}
          >
            <button className="btn btn-primary" onClick={handleBack}>
              Neues Spiel starten
            </button>
            <button className="btn btn-primary" onClick={handleLeaderboard}>
              Leaderboard sehen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizEnde;
