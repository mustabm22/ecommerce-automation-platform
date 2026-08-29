import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PaymentOptions = ({ value, onChange }) => {
  const options = [
    { label: 'Stripe', value: 'stripe', icon: 'credit-card' },
    { label: 'PayPal', value: 'paypal', icon: 'paypal' },
    { label: 'المحفظة الرقمية', value: 'wallet', icon: 'wallet' }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💳 طريقة الدفع</Text>
      {options.map(option => (
        <TouchableOpacity
          key={option.value}
          style={[styles.option, value === option.value && styles.selectedOption]}
          onPress={() => onChange(option.value)}
        >
          <MaterialCommunityIcons 
            name={option.icon} 
            size={24} 
            color={value === option.value ? '#1890ff' : '#999'}
          />
          <Text style={[styles.optionLabel, value === option.value && styles.selectedLabel]}>
            {option.label}
          </Text>
          {value === option.value && (
            <MaterialCommunityIcons name="check-circle" size={20} color="#1890ff" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
    marginTop: 10,
    borderRadius: 8
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'right'
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10
  },
  selectedOption: {
    borderColor: '#1890ff',
    backgroundColor: '#f0f5ff'
  },
  optionLabel: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginHorizontal: 10,
    textAlign: 'right'
  },
  selectedLabel: {
    color: '#1890ff',
    fontWeight: '600'
  }
});

export default PaymentOptions;
