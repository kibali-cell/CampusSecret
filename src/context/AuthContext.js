// context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase'; // Import Firebase services from config

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    if (!email.endsWith('.com')) {
      throw new Error('Please use your college email');
    }
    const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    const userData = userDoc.data();
    setUser({ ...firebaseUser, ...userData });
  };

  const signup = async (email, password) => {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
    const role = Math.random() > 0.7 ? 'chaos' : 'hero';
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      email,
      role,
      points: 0,
      missionsCompleted: 0
    });
    setUser({ ...firebaseUser, role });
  };

  const logout = () => {
    auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
