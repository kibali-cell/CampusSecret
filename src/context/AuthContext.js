import React, { createContext, useState, useContext, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUserData = async (firebaseUser) => {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // If user is missing from Firestore, create a default entry
      const defaultUser = {
        email: firebaseUser.email,
        role: 'hero', // Assign default role
        points: 0,
        missionsCompleted: 0,
      };
      await setDoc(userDocRef, defaultUser);
      setUser({ ...firebaseUser, ...defaultUser });
    } else {
      setUser({ ...firebaseUser, ...userDoc.data() });
    }
  };

  const login = async (email, password) => {
    if (!email.endsWith('.com')) {
      throw new Error('Please use your college email');
    }
    const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
    await fetchUserData(firebaseUser); // Fetch user details after login
  };

  const signup = async (email, password) => {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
    const role = Math.random() > 0.7 ? 'chaos' : 'hero';

    // Save user details in Firestore
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      email,
      role,
      points: 0,
      missionsCompleted: 0
    });

    await fetchUserData(firebaseUser); // Fetch user details after signup
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
