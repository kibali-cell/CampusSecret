import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { TEAM_MISSIONS } from '../../models/teamMissions';
import { useAuth } from '../context/AuthContext';
import * as Location from 'expo-location';
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, collection, addDoc } from 'firebase/firestore';
import styles from '../../styles';

const TeamMissionScreen = () => {
  const { user } = useAuth();
  const [activeMission, setActiveMission] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    loadActiveMission();
  }, [user]);

  const loadActiveMission = async () => {
    const missionRef = doc(db, 'team-missions', user.uid);
    const missionDoc = await getDoc(missionRef);
    if (missionDoc.exists()) {
      setActiveMission(missionDoc.data());
      loadTeamMembers(missionDoc.data().teamMembers);
    }
  };

  const startTeamMission = async (mission) => {
    try {
      // Check location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'This mission requires location access');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      
      // Create new team mission
      const missionRef = doc(collection(db, 'team-missions'));
      await setDoc(missionRef, {
        ...mission,
        leaderId: user.uid,
        teamMembers: [user.uid],
        status: 'recruiting',
        startLocation: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        },
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + (mission.timeLimit * 60 * 60 * 1000)).toISOString()
      });

      setActiveMission(mission);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const joinTeamMission = async (mission) => {
    if (mission.teamMembers.length >= mission.maxPlayers) {
      Alert.alert('Team Full', 'This mission team is already full');
      return;
    }

    try {
      const missionRef = doc(db, 'team-missions', mission.id);
      await updateDoc(missionRef, {
        teamMembers: arrayUnion(user.uid)
      });

      // Notify team leader
      await addDoc(collection(db, 'notifications'), {
        userId: mission.leaderId,
        type: 'team_join',
        message: `${user.email.split('@')[0]} joined your team mission!`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Team Missions</Text>
      {activeMission ? (
        <View style={styles.activeMission}>
          <Text style={styles.missionTitle}>{activeMission.title}</Text>
          <Text style={styles.missionDescription}>
            {activeMission.description}
          </Text>
          <Text style={styles.teamCount}>
            Team: {teamMembers.length}/{activeMission.maxPlayers}
          </Text>
          <FlatList
            data={teamMembers}
            renderItem={({ item }) => (
              <View style={styles.teamMember}>
                <Text>{item.email.split('@')[0]}</Text>
                <Text style={styles.roleText}>{item.role}</Text>
              </View>
            )}
            keyExtractor={item => item.uid}
          />
        </View>
      ) : (
        <FlatList
          data={TEAM_MISSIONS}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.missionCard}
              onPress={() => startTeamMission(item)}
            >
              <Text style={styles.missionTitle}>{item.title}</Text>
              <Text style={styles.missionDescription}>{item.description}</Text>
              <Text style={styles.missionDetails}>
                {item.minPlayers}-{item.maxPlayers} players • {item.points} points
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
};

export default TeamMissionScreen;