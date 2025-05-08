import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { BASE_URL } from '../fetchApi';
import { io } from "socket.io-client";

const WaitingGame = () => {

    
    const base_url = BASE_URL;
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state;
    const socket = io(base_url);

    const [gameId, setGameId] = useState("");

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to server");
        });

        socket.on("gameJoinPlayer", (data) => {
            console.log(data);
            //navigate(`/quiz1v1`, { state: resData });
        });

        socket.on("computerJoined", (data) => {
            console.log(data);
            //navigate(`/quiz1v1`, { state: resData });
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });
    }, []);

    return (
        <div className="container-fluid d-flex flex-column min-vh-100 px-0">
            <Header />
            <main className="d-flex flex-column align-items-center flex-grow-1 mt-5">
                <div className="text-center">
                    <h1 className="mb-4">Waiting for Player</h1>
                    <p className="lead">Please wait while we find a player to join your game.</p>
                    <Link to="/home" className="btn btn-primary">Back to Home</Link>
                </div>
            </main>
        </div>
    );

}

export default WaitingGame;