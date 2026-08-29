import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../slices/userSlice';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', values);
      dispatch(setToken(response.data.token));
      dispatch(setUser(response.data.user));
      message.success('✅ تم تسجيل الدخول بنجاح!');
      navigate('/dashboard');
    } catch (error) {
      message.error('❌ البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card title="تسجيل الدخول" style={{ width: 400 }}>
        <Form onFinish={handleLogin} form={form} layout="vertical">
          <Form.Item name="email" label="البريد الإلكتروني" rules={[{ required: true, type: 'email' }]}>
            <Input type="email" />
          </Form.Item>
          <Form.Item name="password" label="كلمة المرور" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            دخول
          </Button>
        </Form>
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          ليس لديك حساب؟ <Link to="/register">سجل الآن</Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
