import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";
import { useNavigate, useLocation } from 'react-router-dom';
import { BASE_URL } from '../fetchApi';
import { io } from "socket.io-client";

const Quiz1v1Page = () => {
  const base_url = BASE_URL;
  const location = useLocation();
  const data = location.state;
  const socket = io(base_url);

  const [question, setQuestion] = useState({});
  const [timeLeft, setTimeLeft] = useState(data.timerDuration);
  const navigate = useNavigate();

  const gameId = data.gameId;
  const opponentId = data.opponentId;
  var quizId = '';

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }else{
      submitQuiz();
    }
  }, [timeLeft]);

  const loopQuestion = data.questions || [];

  const handleOptionChange = (questionId, value) => {
    setQuestion((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const updateScore = async (arr) => {
    try {
      const response = await fetch(`${base_url}/quiz/updateOpponentScore`, {
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
      console.log(result.msg);
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  const submitQuiz = async () => {
    try {
      var aTrue = 0;
      var uScore = 0;
      for (const item of loopQuestion) {
        const dataPost = {
          quizId: data.quizId,
          questionId: item.id,
          answer: question[item.id] || null, // Send the selected answer or null if not answered
          userId: sessionStorage.getItem('user_id')
        };

        const response = await fetch(`${base_url}/quiz/submit`, {
          method: "POST",
          headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataPost)
        });

        if (!response.ok) {
          console.log(`Error submitting question ${item.id}: ` + response.statusText);
          alert(`Failed to submit answer for question ${item.id}`);
          return;
        }

        const result = await response.json();
        //console.log(result);
        if(result.score > 0){
          // aTrue++;
          // uScore += result.score;
        }
        quizId = result.quizId;
      }

      // Update score
      const resScore = await fetch(`${base_url}/quiz/getFinalScores`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({quizId:quizId})
      });

      if (!resScore.ok) {
        throw new Error(`Error: ${resScore.statusText}`);
      }

      const resScoreEnde = await resScore.json();
      resScoreEnde.finalScores.forEach((item) => {
        if(item.user_id === sessionStorage.getItem('user_id')){
          //console.log(`User: ${item.user_id}, Score: ${item.score}`);
          if(item.score > 0){
            uScore += item.score;
          }
        }
      });

      // Update score in gamedata
      const dataPostScore = {
        gameId: gameId,
        opponentId: opponentId,
        score: uScore
      };
      await updateScore(dataPostScore);

      socket.emit("gameDone",{
        username:sessionStorage.getItem('email'),
        gameId: gameId
      });

      //alert("All answers submitted successfully");
      navigate("/quizende", { state: {gameId:gameId,quizId:quizId} });
    } catch (error) {
      console.log(error);
      alert("An error occurred while submitting the answers");
    }
  };

  return (
    <div className="container-fluid d-flex flex-column min-vh-100 px-0">
      <Header />
      <main className="d-flex flex-column align-items-center flex-grow-1 mt-5">
        <div className="d-flex justify-content-end w-50 mb-2">
          <span className="badge bg-danger fs-5">{timeLeft} Sekunden, {data.mode}</span>
        </div>

        {(() => {
          const elements = [];
          for (let index = 0; index < loopQuestion.length; index++) {
            const item = loopQuestion[index];
            elements.push(
              <div key={item.id} className="card p-4 shadow-sm mb-4" style={{ width: "50%" }}>
              <div className="card-header bg-light">Frage {index + 1}</div>
              <div className="card-body">
                <p>{item.question}</p>
                <form>
                {(() => {
                  const options = [];
                  const parsedOptions = Array.isArray(item.options)
                  ? item.options
                  : JSON.parse(item.options || "[]"); // Parse options if it's a string
                  for (let optIndex = 0; optIndex < parsedOptions.length; optIndex++) {
                  const option = parsedOptions[optIndex];
                  options.push(
                    <div className="form-check" key={optIndex}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`question-${item.id}`}
                      id={`option-${item.id}-${optIndex}`}
                      value={option}
                      onChange={(e) => handleOptionChange(item.id, e.target.value)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`option-${item.id}-${optIndex}`}
                    >
                      {option}
                    </label>
                    </div>
                  );
                  }
                  return options;
                })()}
                </form>
              </div>
              </div>
            );
          }
          return elements;
        })()}

        <div className="d-flex text-center mt-3">
          <button className="btn btn-primary" onClick={submitQuiz}>Antwort bestätigen</button>
        </div>
      </main>
    </div>
  );
};

export default Quiz1v1Page;