import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import styles from '../../styles';

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  if (!user) {
    // Option 1: Show a simple message
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No user is logged in.</Text>
      </View>
    );
    
    // Option 2: Alternatively, you can navigate to the login screen
    // or show a loading indicator until a user is available.
  }

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
