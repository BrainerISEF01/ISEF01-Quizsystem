import React, { useEffect, useState } from "react";
import Header from "./Header";

const Leaderboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://03c0-93-207-154-98.ngrok-free.app/leaderboard")
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Received non-JSON response");
        }
        return response.json();
      })
      .then((data) => {
        //console.log(data);
        setData(data);
      })
      .catch((error) => console.error("Error fetching leaderboard data:", error));
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
                <th className="border p-3">User ID</th>
                <th className="border p-3">Score</th>
              </tr>
            </thead>
            <tbody>
              {data.map(({ user_id, score }, index) => (
                <tr key={index}>
                  <td className="border p-3">{user_id}</td>
                  <td className="border p-3">{score}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr></hr>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;