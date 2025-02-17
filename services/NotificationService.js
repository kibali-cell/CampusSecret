// src/services/NotificationService.js
import { messaging, db } from '../config/firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { doc, updateDoc } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';

export const initializeNotifications = async (userId) => {
  // Request permission for push notifications
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    throw new Error('Failed to get push token for push notification!');
  }

  // Get Expo push token
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  
  // Store token in Firestore
  await updateDoc(doc(db, 'users', userId), {
    pushToken: token
  });

  // Configure notification handler
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  return token;
};

export const sendNotification = async (userId, title, body, data = {}) => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  const userData = userDoc.data();

  if (!userData.pushToken) return;

  const message = {
    to: userData.pushToken,
    sound: 'default',
    title,
    body,
    data,
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
};

// Setup notification listeners
export const setupNotificationListeners = () => {
  // Handle notifications when app is foregrounded
  const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
    console.log('Received notification:', notification);
  });

  // Handle notifications when app is backgrounded/closed
  const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Background notification response:', response);
  });

  return () => {
    foregroundSubscription.remove();
    backgroundSubscription.remove();
  };
};