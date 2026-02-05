import React from 'react';
import ContactForm from '../components/form/ContactForm';
import { addSubmission } from '../services/firestore';
import { APP_ID } from '../config/constants';

const HomePage = ({ user, onStatus }) => {
  const handleFormSubmit = async (formData, error) => {
    if (error) {
      onStatus({ type: 'error', message: error });
      return false;
    }

    if (!user) {
      onStatus({ type: 'error', message: 'System initializing. Please wait.' });
      return false;
    }

    try {
      await addSubmission(APP_ID, formData, user.uid);
      onStatus({ type: 'success', message: 'Message sent securely to the Vault!' });
      return true;
    } catch (err) {
      console.error("Submission error:", err);
      onStatus({ type: 'error', message: 'Failed to secure lead. Please try again.' });
      return false;
    }
  };

  return (
    <ContactForm onSubmit={handleFormSubmit} loading={!user} />
  );
};

export default HomePage;
