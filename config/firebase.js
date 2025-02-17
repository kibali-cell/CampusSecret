import { initializeApp, getApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyClgcnzYllZawghpTFKy4bPrPg3pDg2Ixs",
  authDomain: "campussecretlife.firebaseapp.com",
  projectId: "campussecretlife",
  storageBucket: "campussecretlife.firebasestorage.app",
  messagingSenderId: "810369300863",
  appId: "1:810369300863:web:0d4c4014e923237a31424a",
  measurementId: "G-P9JDS9C4YF"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const db = getFirestore(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { db, auth, firestore, storage };