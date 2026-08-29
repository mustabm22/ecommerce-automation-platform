import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';

const LoginForm = ({ onSubmit, onRegisterPress, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (!email || !password) {
      alert('يرجى ملء جميع الحقول');
      return;
    }
    onSubmit(email, password);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔐 تسجيل الدخول</Text>
      
      <TextInput
        style={styles.input}
        placeholder="البريد الإلكتروني"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        editable={!loading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="كلمة المرور"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'جاري التحميل...' : 'دخول'}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={onRegisterPress} disabled={loading}>
        <Text style={styles.registerLink}>ليس لديك حساب؟ سجل الآن</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'right'
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    textAlign: 'right'
  },
  button: {
    backgroundColor: '#1890ff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15
  },
  buttonDisabled: {
    opacity: 0.6
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  registerLink: {
    color: '#1890ff',
    textAlign: 'center',
    fontSize: 14
  }
});

export default LoginForm;
