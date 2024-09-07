import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, Switch } from 'antd';
import { Link } from 'react-router-dom';  // Import Link
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import './Login.css';

const { Title } = Typography;

const Login = () => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const onFinish = async (values) => {
  try {
    // Send login data to the backend
    const response = await fetch('http://localhost:8000/login', {
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
      // If login is successful, redirect to categories
      console.log('Login successful!', data);
      navigate('/categories');  // Redirect to categories
    } else {
      console.log('Login failed', data.message);
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
};


  const toggleDarkMode = (checked) => {
    setDarkMode(checked);
  };

  return (
    <div className={darkMode ? 'login-container dark-mode' : 'login-container'}>
      <div className="toggle-container">
        <Switch checked={darkMode} onChange={toggleDarkMode} />
        <span style={{ marginLeft: '8px' }}>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
      </div>
      
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <LoginOutlined style={{ fontSize: '36px', color: darkMode ? '#fff' : '#1890ff' }} />
        <Title level={3} style={{ color: darkMode ? '#fff' : '#000' }}>Login</Title>
      </div>
      
      <Form
        name="login_form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Log in
          </Button>
        </Form.Item>
      </Form>
      
      <div style={{ textAlign: 'center' }}>
        <span style={{ color: darkMode ? '#fff' : '#000' }}>Don't have an account? </span>
        <Link to="/signup">Sign Up</Link> {/* Link to Sign Up page */}
      </div>
    </div>
  );
};

export default Login;
