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
    setQuizUrl(categoryUrl); // Set the quiz URL for selected category
    setScore(null); // Reset score
    navigate('/quiz'); // Navigate to the quiz page
  };

  const handleQuizComplete = (finalScore) => {
    if (finalScore !== null) {
      setScore(finalScore);
      setTotalQuestions(10); // Assuming each quiz has 10 questions; adjust as needed
      navigate('/result'); // Navigate to the result page
    }
  };

  const handleRetry = () => {
    setScore(null); // Reset score for retry
    navigate('/quiz'); // Stay on the quiz page for retry
  };

  const handleReturnToCategories = () => {
    setQuizUrl(null); // Reset the quiz selection so a new category can be selected
    setScore(null); // Reset the score to allow fresh category selection
    navigate('/categories'); // Navigate back to category selection page
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
            onReturnToCategories={handleReturnToCategories} // Ensure the function is passed correctly
          />
        }
      />
    </Routes>
  );
};

export default App;
