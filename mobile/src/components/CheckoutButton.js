import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CheckoutButton = ({ onPress, total }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <MaterialCommunityIcons name="cash-check" size={20} color="#fff" />
      <Text style={styles.text}>الدفع الآن - {total.toFixed(2)} درهم</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1890ff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8
  }
});

export default CheckoutButton;
