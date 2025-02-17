import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  setDoc, 
  doc, 
  updateDoc,
  increment 
} from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as Notifications from 'expo-notifications';
import styles from '../../styles';

// Mission templates by role
const MISSION_TEMPLATES = {
  hero: [
    {
      title: 'Library Helper',
      description: 'Help someone in the library and take a selfie together (with permission)',
      points: 50,
      requiresPhoto: true,
      timeLimit: 24 // hours
    },
    {
      title: 'Note Sharing',
      description: 'Share your class notes with 3 new people',
      points: 30,
      requiresPhoto: true,
      timeLimit: 48
    }
  ],
  chaos: [
    {
      title: 'Trend Starter',
      description: 'Start a harmless trend like "Walking backwards on Wednesdays"',
      points: 45,
      requiresPhoto: true,
      timeLimit: 24
    },
    {
      title: 'Chair Artist',
      description: 'Rearrange study room chairs in a funny pattern',
      points: 35,
      requiresPhoto: true,
      timeLimit: 12
    }
  ]
};

const MissionScreen = () => {
  const { user } = useAuth();
  const [missions, setMissions] = useState([]);
  const [activeMissions, setActiveMissions] = useState([]);
  const db = getFirestore();
  const storage = getStorage();

  // Initialize notifications
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
          }),
        });
      }
    })();
  }, []);

  // Load available and active missions
  useEffect(() => {
    if (user?.role) {
      // Listen for available missions
      const missionsQuery = query(collection(db, 'missions'), where('role', '==', user.role));
      const missionsUnsubscribe = onSnapshot(missionsQuery, (snapshot) => {
        setMissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      // Listen for user's active missions
      const activeMissionsQuery = query(
        collection(db, 'mission-submissions'),
        where('userId', '==', user.uid),
        where('status', 'in', ['active', 'pending'])
      );
      const activeMissionsUnsubscribe = onSnapshot(activeMissionsQuery, (snapshot) => {
        setActiveMissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      return () => {
        missionsUnsubscribe();
        activeMissionsUnsubscribe();
      };
    }
  }, [user]);

  // Generate new mission if none active
  useEffect(() => {
    if (user?.role && activeMissions.length === 0) {
      generateNewMission();
    }
  }, [activeMissions, user]);

  const generateNewMission = async () => {
    const templates = MISSION_TEMPLATES[user.role.toLowerCase()];
    const randomMission = templates[Math.floor(Math.random() * templates.length)];
    
    const missionRef = doc(collection(db, 'missions'));
    await setDoc(missionRef, {
      ...randomMission,
      role: user.role,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (randomMission.timeLimit * 60 * 60 * 1000)).toISOString()
    });

    // Send notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'New Mission Available! 🎯',
        body: `Your mission: ${randomMission.title}`,
      },
      trigger: null,
    });
  };

  const handleMissionComplete = async (mission) => {
    try {
      const image = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!image.canceled) {
        const response = await fetch(image.assets[0].uri);
        const blob = await response.blob();
        const storageRef = ref(storage, `mission-evidence/${user.uid}/${mission.id}`);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);

        // Update mission submission
        const submissionRef = doc(db, 'mission-submissions', `${user.uid}_${mission.id}`);
        await setDoc(submissionRef, {
          userId: user.uid,
          missionId: mission.id,
          evidenceUrl: downloadURL,
          status: 'completed',
          timestamp: new Date().toISOString()
        });

        // Update user points
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          points: increment(mission.points),
          missionsCompleted: increment(1)
        });

        Alert.alert(
          'Mission Completed! 🎉',
          `You earned ${mission.points} points!`,
          [{ text: 'OK', onPress: () => generateNewMission() }]
        );

        // Send completion notification
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Mission Accomplished! 🎯',
            body: `You earned ${mission.points} points for completing "${mission.title}"!`,
          },
          trigger: null,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to complete mission: ' + error.message);
    }
  };

  const getRemainingTime = (mission) => {
    const expiresAt = new Date(mission.expiresAt);
    const now = new Date();
    const hours = Math.max(0, Math.floor((expiresAt - now) / (1000 * 60 * 60)));
    return `${hours} hours remaining`;
  };

  return (
    <View style={styles.container}>
      {user?.role && (
        <Text style={styles.roleText}>Role: {user.role.toUpperCase()}</Text>
      )}
      <FlatList
        data={missions}
        renderItem={({ item }) => (
          <View style={styles.missionCard}>
            <Text style={styles.missionTitle}>{item.title}</Text>
            <Text style={styles.missionDescription}>{item.description}</Text>
            <Text style={styles.missionPoints}>Points: {item.points}</Text>
            <Text style={styles.missionTime}>{getRemainingTime(item)}</Text>
            <TouchableOpacity 
              style={[
                styles.completeButton,
                activeMissions.some(m => m.missionId === item.id) && styles.completedButton
              ]}
              onPress={() => handleMissionComplete(item)}
              disabled={activeMissions.some(m => m.missionId === item.id)}
            >
              <Text style={styles.buttonText}>
                {activeMissions.some(m => m.missionId === item.id) 
                  ? 'Mission Completed'
                  : 'Complete Mission'
                }
              </Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default MissionScreen;