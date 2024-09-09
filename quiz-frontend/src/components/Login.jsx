import React, { useState } from 'react';
import { Form, Input, Button, Typography, Switch, Spin, message } from 'antd';
import { Link } from 'react-router-dom';  // Import Link
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import './Login.css';
const { Title } = Typography;

const Login = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false); // State to track loading
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);  // Show spinner
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user details in localStorage
        localStorage.setItem('userId', data.userId);  // Store the user ID
        localStorage.setItem('username', values.username);  // Store the username
        localStorage.setItem('email', values.username);  // Store the email
        navigate('/categories');  // Redirect to categories
      } else {
        message.error(data.message || 'Login failed');  // Show error message
      }
    } catch (error) {
      console.error('Error during login:', error);
      message.error('An error occurred during login');  // Display error message
    } finally {
      setLoading(false);  // Hide spinner
    }
  };

  const toggleDarkMode = (checked) => {
    setDarkMode(checked);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-emerald-700' : 'bg-emerald-300'} flex items-center justify-center`}>
      {/* Toggle Dark/Light Mode */}
      <div className="absolute top-5 right-5">
        <Switch checked={darkMode} onChange={toggleDarkMode} />
        <span style={{ marginLeft: '8px', color: darkMode ? '#fff' : '#065f46' }}>
          {darkMode ? 'Dark Mode' : 'Light Mode'}
        </span>
      </div>

      {/* Login Form Container */}
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg" style={{ backgroundColor: darkMode ? '#065f46' : '#fff' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <LoginOutlined style={{ fontSize: '36px', color: darkMode ? '#fff' : '#065f46' }} />
          <Title level={3} style={{ color: darkMode ? '#fff' : '#065f46' }}>Login</Title>
        </div>

        <Spin spinning={loading}> {/* Spinner wraps the form */}
          <Form
            name="login_form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            style={{ color: darkMode ? '#fff' : '#065f46' }}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your Username!' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Username" 
                style={{ borderColor: darkMode ? '#fff' : '#065f46', color: darkMode ? '#fff' : '#065f46' }} 
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Password" 
                style={{ borderColor: darkMode ? '#fff' : '#065f46', color: darkMode ? '#fff' : '#065f46' }} 
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                style={{ width: '100%', backgroundColor: darkMode ? '#065f46' : '#38a169', borderColor: darkMode ? '#065f46' : '#38a169' }} 
                disabled={loading}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Spin>

        <div style={{ textAlign: 'center' }}>
          <span style={{ color: darkMode ? '#fff' : '#065f46' }}>Don't have an account? </span><br/>
          <Link to="/signup" style={{ color: '#38a169' }}>Sign Up</Link> {/* Link to Sign Up page */}
        </div>
      </div>
    </div>
  );
};

export default Login;
