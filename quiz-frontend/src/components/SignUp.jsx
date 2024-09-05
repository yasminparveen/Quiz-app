import React, { useState } from 'react';
import { Form, Input, Button, Typography, Switch } from 'antd';
import { Link } from 'react-router-dom';  // Import Link
import { UserOutlined, LockOutlined, MailOutlined, UserAddOutlined } from '@ant-design/icons';
import './SignUp.css';

const { Title } = Typography;

const SignUp = () => {
  const [darkMode, setDarkMode] = useState(false);

  const onFinish = (values) => {
    console.log('Received values from the form: ', values);
    // Handle form submission here
  };

  const toggleDarkMode = (checked) => {
    setDarkMode(checked);
  };

  return (
    <div className={darkMode ? 'signup-container dark-mode' : 'signup-container'}>
      <div className="toggle-container">
        <Switch checked={darkMode} onChange={toggleDarkMode} />
        <span style={{ marginLeft: '8px' }}>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
      </div>
      
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <UserAddOutlined style={{ fontSize: '36px', color: darkMode ? '#fff' : '#1890ff' }} />
        <Title level={3} style={{ color: darkMode ? '#fff' : '#000' }}>Sign Up</Title>
      </div>
      
      <Form
        name="signup_form"
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
          name="email"
          rules={[{ required: true, message: 'Please input your Email!', type: 'email' }]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
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
          <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Sign Up
          </Button>
        </Form.Item>
      </Form>
      
      <div style={{ textAlign: 'center' }}>
        <span style={{ color: darkMode ? '#fff' : '#000' }}>Already have an account? </span>
        <Link to="/">Log in</Link> {/* Link to Login page */}
      </div>
    </div>
  );
};

export default SignUp;
