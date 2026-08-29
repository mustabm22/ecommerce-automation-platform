import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';

const ProductScreen = ({ route }) => {
  const { productId } = route.params;

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/placeholder.png')}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title}>تفاصيل المنتج</Text>
        <Text style={styles.description}>Product ID: {productId}</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>أضف إلى السلة</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover'
  },
  content: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'right'
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'right',
    lineHeight: 20
  },
  button: {
    backgroundColor: '#1890ff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default ProductScreen;
