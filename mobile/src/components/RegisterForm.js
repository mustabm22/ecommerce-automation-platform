import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, Picker } from 'react-native';

const RegisterForm = ({ onSubmit, onLoginPress, loading }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');

  const handleSubmit = () => {
    if (!firstName || !lastName || !email || !password) {
      alert('يرجى ملء جميع الحقول');
      return;
    }
    onSubmit(firstName, lastName, email, password, role);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📝 التسجيل</Text>
      
      <TextInput
        style={styles.input}
        placeholder="الاسم الأول"
        placeholderTextColor="#999"
        value={firstName}
        onChangeText={setFirstName}
        editable={!loading}
        textAlign="right"
      />
      
      <TextInput
        style={styles.input}
        placeholder="الاسم الأخير"
        placeholderTextColor="#999"
        value={lastName}
        onChangeText={setLastName}
        editable={!loading}
        textAlign="right"
      />
      
      <TextInput
        style={styles.input}
        placeholder="البريد الإلكتروني"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        editable={!loading}
        textAlign="right"
      />
      
      <TextInput
        style={styles.input}
        placeholder="كلمة المرور"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
        textAlign="right"
      />
      
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>نوع الحساب:</Text>
        <Picker
          selectedValue={role}
          onValueChange={setRole}
          style={styles.picker}
          enabled={!loading}
        >
          <Picker.Item label="عميل" value="customer" />
          <Picker.Item label="بائع" value="seller" />
        </Picker>
      </View>
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'جاري التحميل...' : 'تسجيل'}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={onLoginPress} disabled={loading}>
        <Text style={styles.loginLink}>هل لديك حساب؟ سجل الدخول</Text>
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
    borderColor: '#ddd'
  },
  pickerContainer: {
    marginBottom: 15
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'right'
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd'
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
  loginLink: {
    color: '#1890ff',
    textAlign: 'center',
    fontSize: 14
  }
});

export default RegisterForm;
