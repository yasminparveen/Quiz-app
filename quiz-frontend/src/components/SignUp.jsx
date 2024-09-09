import React, { useState } from 'react';
import { Form, Input, Button, Typography, Switch, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined, MailOutlined, UserAddOutlined } from '@ant-design/icons';
import './SignUp.css';

const { Title } = Typography;

const SignUp = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Sign up successful!');
        navigate('/'); // Redirect to login page
      } else {
        throw new Error(data.message || 'Sign up failed');
      }
    } catch (error) {
      message.error(error.message || 'Sign up failed');
    } finally {
      setLoading(false); // Stop the spinner
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

      {/* Form Container */}
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg" style={{ backgroundColor: darkMode ? '#065f46' : '#fff' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <UserAddOutlined style={{ fontSize: '36px', color: darkMode ? '#fff' : '#065f46' }} />
          <Title level={3} style={{ color: darkMode ? '#fff' : '#065f46' }}>Sign Up</Title>
        </div>

        <Form
          name="signup_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          style={{ color: darkMode ? '#fff' : '#065f46' }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" style={{ borderColor: darkMode ? '#fff' : '#065f46', color: darkMode ? '#fff' : '#065f46' }} />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your Email!', type: 'email' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" style={{ borderColor: darkMode ? '#fff' : '#065f46', color: darkMode ? '#fff' : '#065f46' }} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" style={{ borderColor: darkMode ? '#fff' : '#065f46', color: darkMode ? '#fff' : '#065f46' }} />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" style={{ borderColor: darkMode ? '#fff' : '#065f46', color: darkMode ? '#fff' : '#065f46' }} />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              style={{ width: '100%', backgroundColor: darkMode ? '#065f46' : '#38a169', borderColor: darkMode ? '#065f46' : '#38a169' }} 
              loading={loading}
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <span style={{ color: darkMode ? '#fff' : '#065f46' }}>Already have an account? </span><br/>
          <Link to="/" style={{ color: '#38a169' }}>Log in</Link> {/* Link to Login page */}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
