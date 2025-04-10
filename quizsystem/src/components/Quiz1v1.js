import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { BASE_URL } from '../fetchApi';
import { io } from "socket.io-client";

const Quiz1v1 = () => {
    const base_url = BASE_URL;
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state;

    const [msg, setMsg] = useState("");
    const [gameId, setGameId] = useState([]);
    const [gameIdData, setGameIdData] = useState("");

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }

        setMsg("Test");

        gameData();
        const interval = setInterval(() => {
            gameData();
        }, 3000);
    
        return () => clearInterval(interval);

    }, [navigate]);

    // Show list gamedata
    const gameData = async () => {
        try {
            const response = await fetch(`${base_url}/matchmaking/list`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            setGameId(result);
        } catch (error) {
            console.error("Error fetching game data:", error);
        }
    };

    const startQuiz = async (arr,arr1) => {
        try {
            const response = await fetch(`${base_url}/quiz/start`, {
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
            result.gameId = arr1.gameId;
            result.opponentId = sessionStorage.getItem('user_id');
            result.timerDuration = arr.timerDuration;
            //console.log(result);
            navigate(`/quiz1v1page`, { state: result });
        } catch (error) {
            console.error("Error starting the quiz:", error);
        }
    };

    const startGame = async (arr) => {
        try {
            const response = await fetch(`${base_url}/matchmaking/update-op`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(arr)
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            const resultGame = result.updatedGame;
            const dataStart = {
                mode: resultGame.mode,
                user_id: resultGame.userId,
                opponent_id: resultGame.opponentId,
                timerDuration: resultGame.timerDuration
            };
            //console.log(dataStart);
            return startQuiz(dataStart,arr);
        } catch (error) {
            console.error("Error starting the game:", error);
        }
    };

    return (
        <div className="container-fluid d-flex flex-column min-vh-100 px-0">
            <Header />
            <main className="d-flex flex-column align-items-center flex-grow-1 mt-5">
                <div className="card p-4 shadow-sm" style={{ width: "95%" }}>
                    <div className="card-header bg-light">Finde dein Quiz-Duell</div>
                    <div className="card-body">
                        <div className="row table-responsive">
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>Game ID</th>
                                        <th>Ersteller</th>
                                        <th>Modus</th>
                                        <th>Zeitdauer</th>
                                        <th>Erstellt am</th>
                                        <th>Aktion</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gameId.map((game) => (
                                        <tr key={game.id}>
                                            <td>{game.gameId}</td>
                                            <td>{game.userEmail}</td>
                                            <td>{game.mode}</td>
                                            <td>{game.timerDuration}</td>
                                            <td>{new Date(game.createdAt).toISOString().slice(0, 19).replace('T', ' ')}</td>
                                            <td>
                                                {game.userId !== sessionStorage.getItem('user_id') && game.mode === "1v1" && (
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => startGame({gameId: game.gameId, opponentId: sessionStorage.getItem('user_id'),opponentEmail: sessionStorage.getItem('email')})}
                                                    >
                                                        Beitreten
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Quiz1v1;