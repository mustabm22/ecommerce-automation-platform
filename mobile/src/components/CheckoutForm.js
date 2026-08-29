import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';

const CheckoutForm = ({ onSubmit, loading }) => {
  const [fullName, setFullName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const handleSubmit = () => {
    if (!fullName || !street || !city || !phone) {
      alert('يرجى ملء جميع الحقول');
      return;
    }
    onSubmit({ fullName, street, city, phone, postalCode });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📋 بيانات الشحن</Text>
      
      <TextInput
        style={styles.input}
        placeholder="الاسم الكامل"
        placeholderTextColor="#999"
        value={fullName}
        onChangeText={setFullName}
        editable={!loading}
        textAlign="right"
      />
      
      <TextInput
        style={styles.input}
        placeholder="الشارع"
        placeholderTextColor="#999"
        value={street}
        onChangeText={setStreet}
        editable={!loading}
        textAlign="right"
      />
      
      <TextInput
        style={styles.input}
        placeholder="المدينة"
        placeholderTextColor="#999"
        value={city}
        onChangeText={setCity}
        editable={!loading}
        textAlign="right"
      />
      
      <TextInput
        style={styles.input}
        placeholder="رقم الهاتف"
        placeholderTextColor="#999"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        editable={!loading}
        textAlign="right"
      />
      
      <TextInput
        style={styles.input}
        placeholder="الرمز البريدي"
        placeholderTextColor="#999"
        value={postalCode}
        onChangeText={setPostalCode}
        editable={!loading}
        textAlign="right"
      />
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'جاري المعالجة...' : 'متابعة الدفع'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'right'
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  button: {
    backgroundColor: '#1890ff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10
  },
  buttonDisabled: {
    opacity: 0.6
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default CheckoutForm;
