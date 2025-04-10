import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../fetchApi';

const QuizStart = () => {
    const base_url = BASE_URL;
    const [opponent, setOpponent] = useState("");
    const [time, setTime] = useState(0);
    const [gameId, setGameId] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }

        matchmaking();
    }, [navigate]);

    const matchmaking = async () => {
        try {
            const response = await fetch(`${base_url}/matchmaking`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: sessionStorage.getItem('user_id') }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            setGameId(result.gameId);
        } catch (error) {
            console.error("Error fetching game data:", error);
        }
    };

    // Post matchmaking create gameId
    const postMatchmaking = async (arr) => {
        try {
            const response = await fetch(`${base_url}/matchmaking/create`, {
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
            return result;
        } catch (error) {
            console.error("Error fetching game data:", error);
        }
    };

    // Start quiz
    const handleStartQuiz = async (e) => {
        e.preventDefault();
    
        // Validate input
        if (!opponent || time <= 0) {
            alert("Please select an opponent and set a valid time.");
            return;
        }
    
        const data = {
            mode: opponent,
            user_id: sessionStorage.getItem('user_id'),
            opponent_id: null,
            timerDuration: time,
        };

        const dataPostmaking = {
            gameId:gameId,
            userId:sessionStorage.getItem('user_id'),
            userEmail:sessionStorage.getItem('email'),
            opponentId: null,
            opponentEmail: null,
            mode: opponent,
            timerDuration: time,
            status:1
        };
        postMatchmaking(dataPostmaking);

        try {
            const response = await fetch(`${base_url}/quiz/start`, {
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
            
            result.gameId = gameId;
            result.userId = sessionStorage.getItem('user_id');
            
            
            //console.log(result);
            navigate("/quizpage", { state: result });
            //console.log(result);
        } catch (error) {
            console.error("Error starting quiz:", error);
        }
    };

    return (
        <div className="container-fluid d-flex flex-column min-vh-100 px-0">
            <Header />
            <main className="d-flex flex-column align-items-center flex-grow-1 mt-5">
                <div className="d-flex justify-content-end w-50 mb-2">
                    <span className="badge bg-info fs-5">Willkommen, bitte füllen Sie das Formular aus.</span>
                </div>

                <div className="card p-4 shadow-sm" style={{ width: "50%" }}>
                    <div className="card-header bg-light">Neues Quiz starten</div>
                    <div className="card-body">
                        <p>Spielmodus auswählen</p>
                        <form>
                            <div className="form-check">
                                <input 
                                    className="form-check-input" 
                                    type="radio" 
                                    name="opponent" 
                                    id="opponent1" 
                                    value={"computer"}
                                    onChange={(e) => setOpponent(e.target.value)} 
                                />
                                <label className="form-check-label" htmlFor="opponent1">Gegen dem Computer</label>
                            </div>
                            <div className="form-check">
                                <input 
                                    className="form-check-input" 
                                    type="radio" 
                                    name="opponent" 
                                    id="opponent2"
                                    value={"1v1"} 
                                    onChange={(e) => setOpponent(e.target.value)} 
                                />
                                <label className="form-check-label" htmlFor="opponent2">Gegen einem anderen Spieler</label>
                            </div>
                        </form>
                        <br></br>
                        <p>Zeitdauer eingeben</p>
                        <form>
                            <div className="form-check">
                                <input className="form-control" type="number" name="time" id="time" min={1} onChange={(e) => setTime(e.target.value)} />
                            </div>
                        </form>
                        <br></br>
                    </div>
                </div>

                <div className="d-flex justify-content-between w-50 mt-3">
                    <div>&nbsp;</div>
                    <button className="btn btn-primary" onClick={handleStartQuiz}>Los geht's!</button>
                </div>
            </main>
        </div>
    );
};

export default QuizStart;