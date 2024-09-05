import React, { useState } from 'react';
import { Card, Radio, Button } from 'antd';
import './CategorySelection.css';

const categories = [
  'Entertainment: Japanese Anime & Manga',
  'Geography',
  'General Knowledge',
  'Science',
  'History',
  'Sports',
];

const CategorySelection = ({ onCategorySelect }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    playSound('click');
  };

  const handleSubmit = () => {
    if (selectedCategory) {
      onCategorySelect(selectedCategory);
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
            <Radio key={index} value={category}>
              {category}
            </Radio>
          ))}
        </Radio.Group>
        <Button
          type="primary"
          onClick={handleSubmit}
          disabled={!selectedCategory}
          style={{ marginTop: '20px' }}
        >
          Continue
        </Button>
      </Card>
    </div>
  );
};

export default CategorySelection;
