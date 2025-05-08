import React, { useEffect, useState } from "react";
import Header from "./Header";
import { BASE_URL } from "../fetchApi";
import { useNavigate } from "react-router-dom";

const Leaderboard = () => {
  const navigate = useNavigate();
  const base_url = BASE_URL;
  //console.log(base_url);
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }

    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${base_url}/leaderboard/result`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="container-fluid d-flex flex-column min-vh-100 px-0">
      <Header />
      <div className="flex-grow d-flex justify-content-center" style={{ marginTop: '50px' }}>
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center mx-auto" style={{ width: '1200px' }}>
          <h2 className="text-2xl font-bold" style={{ marginTop: '30px' }}>Leaderboard</h2>
          <table className="w-full border-collapse mt-5 mx-auto" style={{ width: '800px' }}>
            <thead>
              <tr className="bg-gray-300">
                <th className="border p-3">Modus</th>
                <th className="border p-3">Spieler</th>
                <th className="border p-3">Punktzahl</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map(({ MODE,USER,score }, index) => (
                  <tr key={index}>
                    <td className="border p-3">{MODE}</td>
                    <td className="border p-3">{USER}</td>
                    <td className="border p-3">{score}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="border p-3 text-center">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <hr></hr>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;