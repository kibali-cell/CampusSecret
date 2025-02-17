import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getFirestore, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { ACHIEVEMENTS } from '../../models/achievements';
import AchievementCard from '../../components/AchievementCard';
import styles from '../../styles';

const AchievementsScreen = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  
  useEffect(() => {
    if (user?.uid) {
      const db = getFirestore();
      const statsRef = doc(db, 'user_stats', user.uid);
      const unsubscribe = onSnapshot(statsRef, (doc) => {
        setStats(doc.data());
      });
      
      // Load unlocked achievements
      const achievementsRef = doc(db, 'user_achievements', user.uid);
      getDoc(achievementsRef).then((doc) => {
        if (doc.exists()) {
          setUnlockedAchievements(doc.data().unlocked || []);
        }
      });
      
      return () => unsubscribe();
    }
  }, [user]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Achievements</Text>
      
      <Text style={styles.sectionTitle}>Mission Achievements</Text>
      {ACHIEVEMENTS.MISSIONS.map(achievement => (
        <AchievementCard
          key={achievement.id}
          achievement={achievement}
          progress={stats?.missionsCompleted || 0}
          unlocked={unlockedAchievements.includes(achievement.id)}
        />
      ))}
      
      <Text style={styles.sectionTitle}>Point Achievements</Text>
      {ACHIEVEMENTS.POINTS.map(achievement => (
        <AchievementCard
          key={achievement.id}
          achievement={achievement}
          progress={stats?.totalPoints || 0}
          unlocked={unlockedAchievements.includes(achievement.id)}
        />
      ))}
      
      <Text style={styles.sectionTitle}>Streak Achievements</Text>
      {ACHIEVEMENTS.STREAKS.map(achievement => (
        <AchievementCard
          key={achievement.id}
          achievement={achievement}
          progress={stats?.currentStreak || 0}
          unlocked={unlockedAchievements.includes(achievement.id)}
        />
      ))}
    </ScrollView>
  );
};

export default AchievementsScreen;