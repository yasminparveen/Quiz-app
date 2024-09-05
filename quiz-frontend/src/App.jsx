import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/Signup';
import CategorySelection from './components/CategorySelection';

const App = () => {
  const navigate = useNavigate();

  const handleCategorySelect = (category) => {
    console.log('Selected category:', category);
    // Navigate to the quiz or other functionality based on selected category
    // Example: navigate('/quiz');
  };

  const handleLoginSuccess = () => {
    navigate('/categories');
  };

  return (
    <Routes>
      <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/signup" element={<SignUp onSignUpSuccess={handleLoginSuccess} />} />
      <Route path="/categories" element={<CategorySelection onCategorySelect={handleCategorySelect} />} />
    </Routes>
  );
};

export default App;
