import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/userSlice';
import { Layout, Menu, Badge, Button, Avatar } from 'antd';
import { ShoppingCartOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import './Navbar.css';

const { Header } = Layout;

const Navbar = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.user);
  const { items } = useSelector(state => state.cart);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Header className="navbar" style={{ background: '#001529' }}>
      <div className="navbar-logo">
        <Link to="/">
          <h2 style={{ color: '#fff', margin: 0 }}>🛍️ منصة التجارة</h2>
        </Link>
      </div>

      <Menu theme="dark" mode="horizontal" style={{ flex: 1 }}>
        <Menu.Item key="1">
          <Link to="/">الرئيسية</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/">المنتجات</Link>
        </Menu.Item>
      </Menu>

      <div className="navbar-actions">
        <Link to="/cart">
          <Badge count={items.length}>
            <Button type="primary" shape="circle" icon={<ShoppingCartOutlined />} size="large" />
          </Badge>
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/dashboard">
              <Button type="primary" icon={<UserOutlined />}>لوحة التحكم</Button>
            </Link>
            <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>تسجيل الخروج</Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button type="primary">تسجيل الدخول</Button>
            </Link>
            <Link to="/register">
              <Button>التسجيل</Button>
            </Link>
          </>
        )}
      </div>
    </Header>
  );
};

export default Navbar;
