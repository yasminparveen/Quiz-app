import React, { useState } from 'react';
import { Card, Button, Typography, Space, Avatar, Dropdown, Menu, message } from 'antd';
import { CheckCircleOutlined, RightOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import categories from '../assets/categories';  // Import the categories array
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const CategorySelection = ({ onCategorySelect }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const navigate = useNavigate();

  // Example user profile from localStorage
  const userProfile = {
    name: localStorage.getItem('username') || 'Guest',
    avatarUrl: localStorage.getItem('avatarUrl') || '', // Placeholder for avatar URL
  };

  // Function to get user initials if avatarUrl is not available
  const getUserInitials = (name) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    const initials = nameParts.map((part) => part[0].toUpperCase()).join('');
    return initials;
  };

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

  const handleLogout = () => {
    localStorage.clear(); // Clear user session
    message.success('Logged out successfully');
    navigate('/'); // Redirect to login page
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-emerald-300 py-10">
      {/* User profile and avatar on the top right */}
      <div className="absolute top-5 right-5 flex items-center">
        <Dropdown overlay={userMenu} placement="bottomRight">
          <Avatar
            size="large"
            src={userProfile.avatarUrl || null} // If avatarUrl is empty, use initials
            style={{ cursor: 'pointer', border: '2px solid white', backgroundColor: userProfile.avatarUrl ? 'transparent' : '#87d068' }} // Green background for initials
          >
            {!userProfile.avatarUrl && getUserInitials(userProfile.name)} {/* Display initials if no avatar URL */}
          </Avatar>
        </Dropdown>
        <Text strong style={{ color: '#fff', marginLeft: '10px' }}>
          {userProfile.name}
        </Text>
      </div>

      <Card bordered={false} className="bg-emerald-100 shadow-lg p-10 rounded-lg">
        <div className="text-center mb-8">
          <Title level={2} style={{ color: '#065f46', fontWeight: 'bold', fontSize: '32px' }}>
            <CheckCircleOutlined className="text-emerald-500 text-3xl" /> Select a Category
          </Title>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Card
              hoverable
              key={index}
              onClick={() => handleCategoryChange({ target: { value: category.name } })}
              className={`p-6 text-center transition duration-300 transform hover:scale-105 rounded-lg shadow-lg ${
                selectedCategory === category.name
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-white text-emerald-900'
              } hover:bg-emerald-500 hover:text-white`}
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
              <Title level={4} style={{ color: '#065f46' }}>Select Difficulty Level</Title>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
              {categories
                .find((cat) => cat.name === selectedCategory)
                .levels.map((level, index) => (
                  <Card
                    hoverable
                    key={index}
                    onClick={() => handleLevelChange({ target: { value: level.level } })}
                    className={`p-6 text-center transition duration-300 transform hover:scale-105 rounded-lg shadow-lg ${
                      selectedLevel === level.level
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-white text-emerald-900'
                    } hover:bg-emerald-500 hover:text-white`}
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
            className="bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-500 hover:border-emerald-500 rounded-lg px-6 py-2"
            style={{ visibility: selectedCategory && selectedLevel ? 'visible' : 'hidden' }}
          >
            Continue
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CategorySelection;
