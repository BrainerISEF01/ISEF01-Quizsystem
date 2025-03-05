import React from "react";
import Header from "./Header";

const QuizEnde = ({ modus, spielerErgebnis, gegnerErgebnis }) => {

  let pvpErgebnisText = "";
  if (modus === "PvP") {
    if (spielerErgebnis > gegnerErgebnis) {
      pvpErgebnisText = "Herzlichen Glückwunsch, du hast gewonnen!";
    } else if (spielerErgebnis < gegnerErgebnis) {
      pvpErgebnisText = "Leider hast du verloren, aber gut gemacht!";
    } else {
      pvpErgebnisText = "Es ist unentschieden! Gut gemacht!";
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-2xl  w-1/2 text-center">
            <br />
            <br />
            <br />
          <h2 className="text-2xl font-bold" >Quiz beendet!</h2>

          {modus === "PvC" ? (
            <p className="mt-4">Du hast {spielerErgebnis} von 10 Fragen richtig beantwortet!</p>
          ) : (
            <p className="mt-4">
                <br />
                <br />
              Du hast {spielerErgebnis}/10 Fragen richtig beantwortet.
              <br />
            <p> Dein Gegner hat {gegnerErgebnis}/10 Fragen richtig beantwortet. </p>
            </p>
          )}

          {modus === "PvP" && <p className="mt-4 font-bold">{pvpErgebnisText}</p>}

          <div className=" mt-6 flex justify-center space-x-4" style={{marginTop: '250px'}}>
            <button className="btn btn-primary me-5">
              Neues Spiel starten
            </button>
            <button className="btn btn-primary">
              Leaderboard sehen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizEnde;
