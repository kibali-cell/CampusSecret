import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text } from 'react-native';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import styles from '../../styles';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        userId: user.uid,
        role: user.role,
        timestamp: new Date().toISOString()
      });
      setNewMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={[
            styles.messageContainer,
            item.userId === user.uid ? styles.sentMessage : styles.receivedMessage
          ]}>
            <Text style={styles.messageRole}>{item.role}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
        inverted
      />
      <TextInput
        style={styles.input}
        value={newMessage}
        onChangeText={setNewMessage}
        onSubmitEditing={sendMessage}
        placeholder="Send a secret message..."
      />
    </View>
  );
};

export default ChatScreen;