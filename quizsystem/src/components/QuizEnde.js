import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate,useLocation } from "react-router-dom";
import { BASE_URL } from '../fetchApi';

const QuizEnde = () => {
  const base_url = BASE_URL;
  const location = useLocation();
  const data = location.state;
  const navigate = useNavigate();

  const gameId = data.gameId;
  const [mode,setMode] = useState("");
  const [userName,setUsername] = useState("");
  const [scoreUser, setScoreUser] = useState("");
  const [opName, setOpName] = useState("");
  const [opScore, setOpScore] = useState("");
  const [status,setStatus]= useState("");

  useEffect(() => {
    ende();
    const interval = setInterval(() => {
      ende();
    }, 3000);

    return () => clearInterval(interval);
  });

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }

  },[navigate]);

  const ende = async () => {
    try {
      const response = await fetch(`${base_url}/matchmaking/ende`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameId: gameId })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

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

  // Update status : 0
  const updateStatus = async () => {
    const arr = {
      gameId: gameId,
      status: 0
    };
    try {
      const response = await fetch(`${base_url}/matchmaking/updateStatus`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arr),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      navigate(0);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleBack = () => {
    navigate("/quizstart");
  };

  const handleLeaderboard = () => {
    navigate("/leaderboard");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-2xl  w-1/2 text-center">
          <br />
          <br />
          <br />
          <h2 className="text-2xl font-bold">So hast du abgeschnitten!</h2>
          <br></br>
          <div className="row">
            
            <div className="col-md-2"></div>
            <div className="col-md-8">
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>Mode</th>
                      <td>{mode}</td>
                    </tr>
                    <tr>
                      <th>Dein Benutzername</th>
                      <td>{userName} {scoreUser > opScore && mode === "1v1" && (<><span class="badge bg-success text-light">Du hast gewonnen!</span></>)} {scoreUser == opScore && mode === "1v1" && (<><span class="badge bg-warning text-dark">Draw</span></>)} {scoreUser < opScore && mode === "1v1" && (<><span class="badge bg-danger text-light">Du hast verloren!</span></>)}</td>
                    </tr>
                    <tr>
                      <th>Deine Punkte</th>
                      <td>{scoreUser}</td>
                    </tr>
                    {mode === "1v1" && (
                      <>
                        <tr>
                          <th>Gegnername</th>
                          <td>{opName} {opName != "" && opScore > scoreUser && (<><span class="badge bg-success text-light">Du hast gewonnen!</span></>)} {opName != "" && scoreUser == opScore && (<><span class="badge bg-warning text-dark">Draw</span></>)} {opName != "" && opScore < scoreUser && (<><span class="badge bg-danger text-light">Du hast verloren!</span></>)}</td>
                        </tr>
                        <tr>
                          <th>Gegnerpunkte</th>
                          <td>{opScore}</td>
                        </tr>
                      </>
                    )}
                    <tr>
                      <td colSpan={2} className="text-center">
                        {mode === "computer" && status === 1 && (<><button className="btn btn-primary" onClick={updateStatus}>Quiz beenden</button></>)}
                        {mode === "1v1" && userName && opName && status === 1 && (<><button className="btn btn-primary" onClick={updateStatus}>Quiz beenden</button></>)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-md-2"></div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-center space-x-4" style={{ marginTop: '250px' }}>
            <button className="btn btn-primary me-5" onClick={handleBack}>
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
