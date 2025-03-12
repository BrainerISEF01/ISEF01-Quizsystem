import React from "react";
import Header from "./Header";

const Leaderboard = () => {
  return (
    <div className="container-fluid d-flex flex-column min-vh-100 px-0">
      <Header />
      <div className="flex-grow d-flex justify-content-center" style={{marginTop: '50px'}}>
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center mx-auto" style={{ width: '1200px' }}> {/* Hier wurde w-full hinzugefügt */}
          <h2 className="text-2xl font-bold" style={{marginTop: '30px'}}>Leaderboard</h2>
          <table className="w-full border-collapse mt-5 mx-auto" style={{ width: '800px' }}>
            <thead>
              <tr className="bg-gray-300">
                <th className="border p-3">Rank</th>
                <th className="border p-3">Name</th>
                <th className="border p-3">Punkte</th>
                <th className="border p-3">Modus</th>
              </tr>
            </thead>
            <tbody>
              {[
                [1, "PaulMarlo", 10, "PvC"],
                [2, "KlaraFischer", 8, "PvP"],
                [3, "MiaBecker", 7, "PvC"],
                [4, "JonasMeier", 6, "PvP"],
                [5, "SarahLenz", 5, "PvC"],
              ].map(([rank, name, points, mode], index) => (
                <tr key={index}>
                  <td className="border p-3">{rank}</td>
                  <td className="border p-3">{name}</td>
                  <td className="border p-3">{points}</td>
                  <td className="border p-3">{mode}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-5 text-sm">
            <p>
              <strong>Modus</strong>
              <br /> PvC: Player vs Computer
              <br /> PvP: Player vs Player
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;