import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { getFirestore, collection, query, orderBy, where, limit } from 'firebase/firestore';
import styles from '../../styles';

const LeaderboardScreen = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'department', 'dorm'
  const db = getFirestore();

  useEffect(() => {
    loadLeaderboard();
  }, [filter]);

  const loadLeaderboard = async () => {
    let q = query(
      collection(db, 'users'),
      orderBy('points', 'desc'),
      limit(50)
    );

    if (filter !== 'all') {
      q = query(q, where('category', '==', filter));
    }

    const snapshot = await getDocs(q);
    setLeaderboard(snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })));
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterButtons}>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text>All Players</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'department' && styles.activeFilter]}
          onPress={() => setFilter('department')}
        >
          <Text>By Department</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'dorm' && styles.activeFilter]}
          onPress={() => setFilter('dorm')}
        >
          <Text>By Dorm</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={leaderboard}
        renderItem={({ item, index }) => (
          <View style={styles.leaderboardItem}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>{item.email.split('@')[0]}</Text>
              <Text style={styles.playerCategory}>
                {filter !== 'all' ? item.category : item.role}
              </Text>
            </View>
            <Text style={styles.points}>{item.points}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};


export default LeaderboardScreen;