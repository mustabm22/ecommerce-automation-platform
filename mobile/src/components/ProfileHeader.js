import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ProfileHeader = ({ user }) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: user?.avatar || 'https://via.placeholder.com/100' }}
        style={styles.avatar}
      />
      <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <Text style={styles.role}>{user?.role === 'customer' ? 'عميل' : 'بائع'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  email: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5
  },
  role: {
    fontSize: 12,
    backgroundColor: '#1890ff',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden'
  }
});

export default ProfileHeader;
