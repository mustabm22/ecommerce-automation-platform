import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, Button, Empty, Spin } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import axios from 'axios';
import { setProducts, setLoading } from '../slices/productSlice';
import { addToCart } from '../slices/cartSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector(state => state.products);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      dispatch(setProducts({
        products: response.data.products,
        pagination: response.data.pagination
      }));
    } catch (error) {
      console.error('خطأ في جلب المنتجات:', error);
    }
    dispatch(setLoading(false));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      productId: product._id,
      name: product.name,
      price: product.price.original,
      image: product.images[0]?.url
    }));
  };

  if (loading) return <Spin size="large" />;
  if (products.length === 0) return <Empty description="لا توجد منتجات" />;

  return (
    <div style={{ padding: '20px' }}>
      <h1>🛍️ المنتجات المتاحة</h1>
      <Row gutter={[16, 16]}>
        {products.map(product => (
          <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={<img alt={product.name} src={product.images[0]?.url} height={200} />}
            >
              <h3>{product.name}</h3>
              <p>{product.description.substring(0, 50)}...</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                {product.price.original} درهم
              </p>
              <Button 
                type="primary" 
                block 
                icon={<ShoppingCartOutlined />}
                onClick={() => handleAddToCart(product)}
              >
                أضف إلى السلة
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HomePage;
