import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getFirestore, collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import styles from '../../styles';

const MissionHistoryScreen = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      const db = getFirestore();
      const q = query(
        collection(db, 'mission-submissions'),
        where('userId', '==', user.uid),
        where('status', '==', 'completed'),
        orderBy('timestamp', 'desc'),
        limit(50)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setHistory(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const renderMissionItem = ({ item }) => (
    <View style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>{item.missionTitle}</Text>
        <Text style={styles.historyPoints}>+{item.points} pts</Text>
      </View>
      {item.evidenceUrl && (
        <Image
          source={{ uri: item.evidenceUrl }}
          style={styles.evidenceImage}
        />
      )}
      <Text style={styles.historyDate}>
        Completed on {new Date(item.timestamp).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mission History</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading history...</Text>
      ) : (
        <FlatList
          data={history}
          renderItem={renderMissionItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No completed missions yet</Text>
          }
        />
      )}
    </View>
  );
};

export default MissionHistoryScreen;