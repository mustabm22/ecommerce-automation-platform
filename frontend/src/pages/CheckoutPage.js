import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Row, Col, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../slices/cartSlice';
import axios from 'axios';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const { items, total } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.user);
  const [loading, setLoading] = false;
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  const handleCheckout = async (values) => {
    if (items.length === 0) {
      message.error('السلة فارغة!');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customerId: user?.id,
        items: items.map(item => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: values,
        billingAddress: values,
        paymentMethod
      };

      const response = await axios.post('http://localhost:5000/api/orders/create', orderData);
      message.success('✅ تم إنشاء الطلب بنجاح!');
      dispatch(clearCart());
      form.resetFields();
    } catch (error) {
      message.error('❌ حدث خطأ: ' + error.response?.data?.error);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[20, 20]}>
        <Col xs={24} md={12}>
          <Card title="📋 بيانات الشحن" bordered={false}>
            <Form onFinish={handleCheckout} form={form} layout="vertical">
              <Form.Item name="fullName" label="الاسم الكامل" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="street" label="الشارع" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="city" label="المدينة" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="postalCode" label="الرمز البريدي" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="phone" label="رقم الهاتف" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                متابعة الدفع
              </Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="💳 طريقة الدفع" bordered={false}>
            <Select 
              value={paymentMethod} 
              onChange={setPaymentMethod}
              style={{ marginBottom: '20px' }}
            >
              <Select.Option value="stripe">Stripe</Select.Option>
              <Select.Option value="paypal">PayPal</Select.Option>
              <Select.Option value="wallet">المحفظة الرقمية</Select.Option>
            </Select>

            <Card title="الملخص">
              <p>عدد المنتجات: {items.length}</p>
              <p>الإجمالي: <strong>{total.toFixed(2)} درهم</strong></p>
            </Card>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutPage;
