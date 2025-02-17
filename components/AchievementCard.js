import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Award } from 'lucide-react';
import styles from '../styles';

const AchievementCard = ({ achievement, progress, unlocked }) => {
  const progressPercent = Math.min((progress / achievement.requirement) * 100, 100);
  
  return (
    <View style={[styles.achievementCard, unlocked && styles.unlockedCard]}>
      {/* <Award 
        size={24} 
        color={unlocked ? '#FFD700' : '#A9A9A9'} 
      /> */}
      <View style={styles.achievementInfo}>
        <Text style={styles.achievementTitle}>{achievement.title}</Text>
        <Text style={styles.achievementDesc}>{achievement.description}</Text>
        <View style={styles.progressBar}>
          <View 
            style={[styles.progressFill, { width: `${progressPercent}%` }]} 
          />
        </View>
        <Text style={styles.progressText}>
          {progress} / {achievement.requirement}
        </Text>
      </View>
      <Text style={styles.points}>+{achievement.points}</Text>
    </View>
  );
};

export default AchievementCard;