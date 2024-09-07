import React, { useState } from 'react';
import { Card, Button, Typography, Space } from 'antd';
import { CheckCircleOutlined, RightOutlined } from '@ant-design/icons';
import categories from '../assets/categories';  // Import the categories array

const { Title, Text } = Typography;

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 py-10">
      <Card bordered={false} className="bg-transparent">
        <div className="text-center mb-8">
          <Title level={2} style={{ color: '#E0E0E0' }}>  {/* Updated to light gray */}
            <CheckCircleOutlined className="text-green-500 text-3xl" /> Select a Category
          </Title>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Card
              hoverable
              key={index}
              onClick={() => handleCategoryChange({ target: { value: category.name } })}
              className={`p-6 text-center transition duration-300 rounded-lg shadow-lg ${
                selectedCategory === category.name
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900'
              } hover:bg-blue-500 hover:text-white`}
              style={{ borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
            >
              <Space direction="vertical" size="middle">
                <Text strong>{category.name}</Text>
              </Space>
            </Card>
          ))}
        </div>

        {selectedCategory && (
          <>
            <div className="text-center mt-10">
              <Title level={4} style={{ color: '#E0E0E0' }}> {/* Updated to light gray */}
                Select Difficulty Level
              </Title>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
              {categories
                .find((cat) => cat.name === selectedCategory)
                .levels.map((level, index) => (
                  <Card
                    hoverable
                    key={index}
                    onClick={() => handleLevelChange({ target: { value: level.level } })}
                    className={`p-6 text-center transition duration-300 rounded-lg shadow-lg ${
                      selectedLevel === level.level
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    } hover:bg-green-500 hover:text-white`}
                    style={{ borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                  >
                    <Text strong>{level.level.charAt(0).toUpperCase() + level.level.slice(1)} Level</Text>
                  </Card>
                ))}
            </div>
          </>
        )}

        <div className="flex justify-center mt-10">
          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={!selectedCategory || !selectedLevel}
            icon={<RightOutlined />}
            size="large"
            className="bg-blue-600 border-blue-600 text-white hover:bg-blue-500 hover:border-blue-500 rounded-lg px-6 py-2"
            style={{ visibility: selectedCategory && selectedLevel ? 'visible' : 'hidden' }}  // Ensures visibility when category and level are selected
          >
            Continue
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CategorySelection;
