import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from "./components/LoginPage";
import QuizLobby from "./components/QuizLobby";
import QuizPage from "./components/QuizPage";
import QuizEnde from "./components/QuizEnde";
import Leaderboard from "./components/Leaderboard";
import Questions from "./components/Questions";
import QuestionsMultiple from "./components/QuestionsMultiple";
import FrageErfolgreich from './components/FrageErfolgreich';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/quizlobby" element={<QuizLobby />} />
        <Route path="/quizpage" element={<QuizPage />} /> 
        <Route path="/quizende" element={<QuizEnde />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/questionsmultiple" element={<QuestionsMultiple />} /> 
        <Route path="/frageerfolgreich" element={<FrageErfolgreich />} />
      </Routes>
    </Router>
  );
}

export default App;