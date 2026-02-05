import { useState, useEffect } from 'react';
import { initializeAuth, subscribeToAuthState } from '../services/auth';

export const useAuth = (initialToken) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      await initializeAuth(initialToken);
    };
    initAuth();
    const unsubscribe = subscribeToAuthState(setUser);
    return () => unsubscribe();
  }, [initialToken]);

  return user;
};
