import { useState, useEffect } from 'react';
import { subscribeToSubmissions } from '../services/firestore';

export const useSubmissions = (appId, user, isAdminAuthenticated) => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    if (!user || !isAdminAuthenticated) return;

    const unsubscribe = subscribeToSubmissions(
      appId,
      setSubmissions,
      (err) => {
        console.error("Firestore fetch error:", err);
      }
    );

    return () => unsubscribe();
  }, [user, isAdminAuthenticated, appId]);

  return submissions;
};
