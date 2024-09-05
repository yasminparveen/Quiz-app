import React, { useState } from 'react';
import CategorySelection from './CategorySelection';
import Quiz from './Quiz';

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const handleCategorySelect = (category, level) => {
    setSelectedCategory(category);
    setSelectedLevel(level);
  };

  return (
    <div>
      {!selectedCategory ? (
        <CategorySelection onCategorySelect={handleCategorySelect} />
      ) : (
        <Quiz selectedCategory={selectedCategory} selectedLevel={selectedLevel} />
      )}
    </div>
  );
};

export default App;
