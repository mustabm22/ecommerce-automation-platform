import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Row, Col, Statistic, Table, Empty } from 'antd';
import { UserOutlined, ShoppingCartOutlined, DollarOutlined } from '@ant-design/icons';

const UserDashboard = () => {
  const { user } = useSelector(state => state.user);

  const orders = [
    {
      key: '1',
      orderNumber: 'ORD-001',
      status: 'تم التسليم',
      total: '500 درهم',
      date: '2026-08-20'
    }
  ];

  const columns = [
    { title: 'رقم الطلب', dataIndex: 'orderNumber', key: 'orderNumber' },
    { title: 'الحالة', dataIndex: 'status', key: 'status' },
    { title: 'الإجمالي', dataIndex: 'total', key: 'total' },
    { title: 'التاريخ', dataIndex: 'date', key: 'date' }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>👋 مرحباً {user?.firstName}</h1>

      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="إجمالي الطلبات"
              value={3}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="إجمالي الإنفاق"
              value={1500}
              suffix="درهم"
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="رصيد المحفظة"
              value={200}
              suffix="درهم"
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="📋 الطلبات الأخيرة">
        <Table columns={columns} dataSource={orders} pagination={false} />
      </Card>
    </div>
  );
};

export default UserDashboard;
