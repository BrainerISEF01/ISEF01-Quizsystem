import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from "./components/LoginPage";
import QuizLobby from "./components/QuizLobby";
import QuizPage from "./components/QuizPage";
import QuizStart from "./components/QuizStart";
import QuizEnde from "./components/QuizEnde";
import Leaderboard from "./components/Leaderboard";
import Questions from "./components/Questions";
import QuestionsMultiple from "./components/QuestionsMultiple";
import FrageErfolgreich from './components/FrageErfolgreich';
import Quiz1v1 from './components/Quiz1v1';
import Quiz1v1Page from './components/Quiz1v1Page';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/quizlobby" element={<QuizLobby />} />
        <Route path="/quizpage" element={<QuizPage />} />
        <Route path="/quizstart" element={<QuizStart />} /> 
        <Route path="/quizende" element={<QuizEnde />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/questionsmultiple" element={<QuestionsMultiple />} /> 
        <Route path="/frageerfolgreich" element={<FrageErfolgreich />} />
        <Route path="/quiz1v1" element={<Quiz1v1 />} />
        <Route path="/quiz1v1page" element={<Quiz1v1Page />} />
      </Routes>
    </Router>
  );
}

export default App;