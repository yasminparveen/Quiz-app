import React, { useState } from 'react';
import { Card, Typography, Space } from 'antd';
import './LevelSelection.css'; // Import custom CSS

const { Title, Text } = Typography;

const LevelSelection = ({ selectedCategory, categories, onLevelSelect }) => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const category = categories.find((cat) => cat.name === selectedCategory);

  const handleLevelChange = (level) => {
    setSelectedLevel(level.level);
    onLevelSelect(level.level); // Trigger level selection to parent
  };

  return (
    <div className="level-selection-container">
      <Card bordered={false} className="level-selection-card">
        <div className="text-center mb-8">
          <Title level={2} className="level-title">Select Difficulty Level</Title>
        </div>

        <div className="level-grid">
          {category.levels.map((level, index) => (
            <Card
              hoverable
              key={index}
              onClick={() => handleLevelChange(level)}
              className={`level-item ${
                selectedLevel === level.level ? 'level-selected' : ''
              }`}
            >
              <Space direction="vertical" size="small">
                <Text strong>{level.level.charAt(0).toUpperCase() + level.level.slice(1)} Level</Text>
              </Space>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default LevelSelection;
