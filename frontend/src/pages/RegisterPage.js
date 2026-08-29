import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Select } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../slices/userSlice';
import axios from 'axios';

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', values);
      dispatch(setToken(response.data.token));
      dispatch(setUser(response.data.user));
      message.success('✅ تم التسجيل بنجاح!');
      navigate('/dashboard');
    } catch (error) {
      message.error('❌ ' + error.response?.data?.error || 'حدث خطأ في التسجيل');
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card title="التسجيل" style={{ width: 400 }}>
        <Form onFinish={handleRegister} form={form} layout="vertical">
          <Form.Item name="firstName" label="الاسم الأول" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="الاسم الأخير" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="البريد الإلكتروني" rules={[{ required: true, type: 'email' }]}>
            <Input type="email" />
          </Form.Item>
          <Form.Item name="password" label="كلمة المرور" rules={[{ required: true, min: 6 }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="role" label="نوع الحساب" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="customer">عميل</Select.Option>
              <Select.Option value="seller">بائع</Select.Option>
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            تسجيل
          </Button>
        </Form>
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          هل لديك حساب؟ <Link to="/login">سجل الدخول</Link>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;
