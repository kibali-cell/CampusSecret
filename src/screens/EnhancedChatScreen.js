import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const EnhancedChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatRoom, setChatRoom] = useState('general');
  const { user } = useAuth();

  useEffect(() => {
    const q = query(
      collection(db, 'messages'),
      where('chatRoom', '==', chatRoom),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [chatRoom]);

  const sendMessage = async (messageType = 'text', mediaUrl = null) => {
    if ((messageType === 'text' && !newMessage.trim()) || 
        (messageType === 'media' && !mediaUrl)) return;

    await addDoc(collection(db, 'messages'), {
      text: newMessage,
      userId: user.uid,
      role: user.role,
      chatRoom,
      mediaUrl,
      messageType,
      timestamp: new Date().toISOString()
    });

    setNewMessage('');
  };

  const sendImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUrl = await uploadImage(result.assets[0].uri);
      await sendMessage('media', imageUrl);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.chatRoomSelector}>
        <TouchableOpacity 
          style={[styles.roomButton, chatRoom === 'general' && styles.activeRoom]}
          onPress={() => setChatRoom('general')}>
          <Text>General</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.roomButton, chatRoom === user.role && styles.activeRoom]}
          onPress={() => setChatRoom(user.role)}>
          <Text>{user.role} Room</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={[
            styles.messageContainer,
            item.userId === user.uid ? styles.sentMessage : styles.receivedMessage
          ]}>
            <Text style={styles.messageRole}>{item.role}</Text>
            {item.messageType === 'media' && (
              <Image 
                source={{ uri: item.mediaUrl }} 
                style={styles.messageImage} 
              />
            )}
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
        inverted
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={sendImage}>
          <Icon name="image" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Send a message..."
          multiline
        />
        <TouchableOpacity onPress={() => sendMessage('text')}>
          <Icon name="send" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};