// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/Signup';
import CategorySelection from './components/CategorySelection';
import Quiz from './components/quiz/Quiz';

const App = () => {
  const [quizUrl, setQuizUrl] = useState(null);
  const navigate = useNavigate();

  const handleCategorySelect = (categoryUrl) => {
    console.log('Selected category:', categoryUrl);
    setQuizUrl(categoryUrl); // Set the selected quiz URL based on the category
    navigate('/quiz'); // Navigate to the quiz route
  };

  const handleLoginSuccess = () => {
    navigate('/categories');
  };

  const handleQuizComplete = (finalScore) => {
    if (finalScore !== null) {
      console.log(`Quiz Completed. Final score: ${finalScore}`);
      navigate('/categories');
    } else {
      setQuizUrl(null);
      navigate('/categories');
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/signup" element={<SignUp onSignUpSuccess={handleLoginSuccess} />} />
      <Route path="/categories" element={<CategorySelection onCategorySelect={handleCategorySelect} />} />
      <Route path="/quiz" element={<Quiz quizUrl={quizUrl} onQuizComplete={handleQuizComplete} />} />
    </Routes>
  );
};

export default App;
