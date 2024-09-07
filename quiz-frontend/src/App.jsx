import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import CategorySelection from './components/CategorySelection';
import Quiz from './components/quiz/Quiz';
import Result from './components/quiz/Result';

const App = () => {
  const [quizUrl, setQuizUrl] = useState(null);
  const [score, setScore] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(null);
  const navigate = useNavigate();

  const handleCategorySelect = (categoryUrl) => {
    setQuizUrl(categoryUrl);
    setScore(null);
    navigate('/quiz');
  };

  const handleQuizComplete = (finalScore) => {
    if (finalScore !== null) {
      setScore(finalScore);
      setTotalQuestions(10); // Assuming each quiz has 10 questions; adjust accordingly
      navigate('/result');
    }
  };

  const handleRetry = () => {
    setQuizUrl(null);
    setScore(null);
    navigate('/quiz');
  };

  const handleReturnToCategories = () => {
    setQuizUrl(null);
    setScore(null);
    navigate('/categories');
  };

  return (
    <Routes>
      <Route path="/" element={<Login onLoginSuccess={() => navigate('/categories')} />} />
      <Route path="/signup" element={<SignUp onSignUpSuccess={() => navigate('/categories')} />} />
      <Route path="/categories" element={<CategorySelection onCategorySelect={handleCategorySelect} />} />
      <Route path="/quiz" element={<Quiz quizUrl={quizUrl} onQuizComplete={handleQuizComplete} />} />
      <Route
        path="/result"
        element={
          <Result
            score={score}
            totalQuestions={totalQuestions}
            onRetry={handleRetry}
            onReturnToCategories={handleReturnToCategories}
          />
        }
      />
    </Routes>
  );
};

export default App;
