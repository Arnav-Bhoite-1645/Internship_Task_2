import { collection, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const getSubmissionsRef = (appId) => {
  return collection(db, 'artifacts', appId, 'public', 'data', 'submissions');
};

export const subscribeToSubmissions = (appId, callback, onError) => {
  const submissionsRef = getSubmissionsRef(appId);
  return onSnapshot(submissionsRef, (snapshot) => {
    const docs = [];
    snapshot.forEach(doc => {
      docs.push({ id: doc.id, ...doc.data() });
    });
    // Sort by timestamp descending
    docs.sort((a, b) => (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0));
    callback(docs);
  }, onError);
};

export const addSubmission = async (appId, formData, userId) => {
  const submissionsRef = getSubmissionsRef(appId);
  return await addDoc(submissionsRef, {
    ...formData,
    created_at: serverTimestamp(),
    userId
  });
};
