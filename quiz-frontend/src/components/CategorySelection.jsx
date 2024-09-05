import React, { useState } from 'react';
import { Card, Radio, Button } from 'antd';
import './CategorySelection.css';
import categories from '../assets/categories';  // Import the categories array

const CategorySelection = ({ onCategorySelect }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedLevel(null); // Reset level when category changes
    playSound('click');
  };

  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
    playSound('click');
  };

  const handleSubmit = () => {
    if (selectedCategory && selectedLevel) {
      const selectedCategoryData = categories.find((cat) => cat.name === selectedCategory);
      const selectedLevelData = selectedCategoryData.levels.find((lvl) => lvl.level === selectedLevel);
      onCategorySelect(selectedLevelData.url); // Pass the selected API URL to the parent component
      playSound('submit');
    }
  };

  const playSound = (type) => {
    const sound = new Audio(type === 'click' ? '/sounds/click.mp3' : '/sounds/submit.mp3');
    sound.play();
  };

  return (
    <div className="category-container">
      <Card title="Select a Category" bordered={false} className="category-card">
        <Radio.Group onChange={handleCategoryChange} value={selectedCategory}>
          {categories.map((category, index) => (
            <Radio key={index} value={category.name}>
              {category.name}
            </Radio>
          ))}
        </Radio.Group>

        {selectedCategory && (
          <Radio.Group
            onChange={handleLevelChange}
            value={selectedLevel}
            style={{ marginTop: '20px' }}
          >
            {categories
              .find((cat) => cat.name === selectedCategory)
              .levels.map((level, index) => (
                <Radio key={index} value={level.level}>
                  {level.level.charAt(0).toUpperCase() + level.level.slice(1)} Level
                </Radio>
              ))}
          </Radio.Group>
        )}

        <Button
          type="primary"
          onClick={handleSubmit}
          disabled={!selectedCategory || !selectedLevel}
          style={{ marginTop: '20px' }}
        >
          Continue
        </Button>
      </Card>
    </div>
  );
};

export default CategorySelection;
