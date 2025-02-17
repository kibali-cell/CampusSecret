import { auth, db } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendEmailVerification 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const signUp = async (email, password) => {
  if (!email.endsWith('.com')) {
    throw new Error('Please use your college email');
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(userCredential.user);
  
  // Assign role (70% heroes, 30% chaos)
  const role = Math.random() > 0.7 ? 'chaos' : 'hero';
  
  // Create user profile in Firestore
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    email,
    role,
    points: 0,
    missionsCompleted: 0,
    createdAt: new Date().toISOString()
  });

  return userCredential.user;
};

export const signIn = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
  if (!userCredential.user.emailVerified) {
    throw new Error('Please verify your email first');
  }

  const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
  return { ...userCredential.user, ...userDoc.data() };
};