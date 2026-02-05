import { signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

export const initializeAuth = async (initialToken) => {
  if (initialToken) {
    await signInWithCustomToken(auth, initialToken);
  } else {
    await signInAnonymously(auth);
  }
};

export const subscribeToAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const getAuth_ = () => auth;
