import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import styles from '../../styles';

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.text}>Email: {user.email}</Text>
      <Text style={styles.text}>Role: {user.role}</Text>
      <Text style={styles.text}>Points: {user.points}</Text>
      <Text style={styles.text}>Missions Completed: {user.missionsCompleted}</Text>
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;