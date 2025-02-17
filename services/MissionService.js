import { db, storage } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as Location from 'expo-location';

export const getMissions = async (role) => {
  const missionsRef = collection(db, 'missions');
  const q = query(missionsRef, where('role', '==', role));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const verifyMissionLocation = async (missionId) => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission denied');
  }

  const location = await Location.getCurrentPositionAsync({});
  const missionDoc = await getDoc(doc(db, 'missions', missionId));
  const missionData = missionDoc.data();

  // Check if user is within 50 meters of required location
  const distance = calculateDistance(
    location.coords.latitude,
    location.coords.longitude,
    missionData.required_latitude,
    missionData.required_longitude
  );

  return distance <= 0.05; // 50 meters
};

export const uploadMissionEvidence = async (userId, missionId, image) => {
  const timestamp = Date.now();
  const storageRef = ref(storage, `mission-evidence/${userId}/${missionId}_${timestamp}`);
  
  // Convert image to blob
  const response = await fetch(image.uri);
  const blob = await response.blob();
  
  // Upload image
  await uploadBytes(storageRef, blob);
  const downloadURL = await getDownloadURL(storageRef);
  
  // Update mission status
  await addDoc(collection(db, 'mission-submissions'), {
    userId,
    missionId,
    evidenceUrl: downloadURL,
    timestamp: new Date().toISOString(),
    status: 'pending'
  });

  return downloadURL;
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  // Haversine formula to calculate distance between two points
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}