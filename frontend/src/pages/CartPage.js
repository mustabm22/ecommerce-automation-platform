import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Button, Space, Empty, Row, Col, Card } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { removeFromCart, updateQuantity } from '../slices/cartSlice';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const dispatch = useDispatch();
  const { items, total } = useSelector(state => state.cart);

  if (items.length === 0) return <Empty description="السلة فارغة" />;

  const columns = [
    {
      title: 'المنتج',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'السعر',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price} درهم`
    },
    {
      title: 'الكمية',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <Space>
          <Button 
            size="small" 
            icon={<MinusOutlined />}
            onClick={() => dispatch(updateQuantity({ productId: record.productId, quantity: quantity - 1 }))}
          />
          <span>{quantity}</span>
          <Button 
            size="small" 
            icon={<PlusOutlined />}
            onClick={() => dispatch(updateQuantity({ productId: record.productId, quantity: quantity + 1 }))}
          />
        </Space>
      )
    },
    {
      title: 'الإجمالي',
      render: (_, record) => `${(record.price * record.quantity).toFixed(2)} درهم`
    },
    {
      title: 'الإجراءات',
      render: (_, record) => (
        <Button 
          danger 
          icon={<DeleteOutlined />}
          onClick={() => dispatch(removeFromCart(record.productId))}
        >
          حذف
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>🛒 سلة التسوق</h1>
      <Table columns={columns} dataSource={items} pagination={false} />
      
      <Row style={{ marginTop: '20px' }} justify="end">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <h3>الملخص</h3>
            <p>الإجمالي: <strong>{total.toFixed(2)} درهم</strong></p>
            <Link to="/checkout">
              <Button type="primary" size="large" block>المتابعة للدفع</Button>
            </Link>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartPage;
