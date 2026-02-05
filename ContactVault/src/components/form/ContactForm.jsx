import React from 'react';
import { useForm } from '../../hooks/useForm';
import { validateForm } from '../../utils/validation';
import Card from '../common/Card';
import '../styles/components.css';

const ContactForm = ({ onSubmit, loading }) => {
  const { formData, handleChange, resetForm } = useForm({ 
    name: '', 
    email: '', 
    message: '' 
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm(formData);
    if (error) {
      onSubmit(null, error);
      return;
    }
    
    const result = await onSubmit(formData, null);
    if (result) {
      resetForm();
    }
  };

  return (
    <Card>
      <div className="header-text">
        <h1>Secure Contact</h1>
        <p>Your data is processed and stored in our encrypted vault.</p>
      </div>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input 
            type="text" 
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g. Arnav Bhoite"
          />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="arnav@mail.com"
          />
        </div>
        <div className="form-group">
          <label>Message</label>
          <textarea 
            rows="5"
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            placeholder="How can we help you today?"
          ></textarea>
        </div>
        <button className="btn-submit" disabled={loading}>
          {loading ? 'Securing...' : 'Send to Vault'}
        </button>
      </form>
    </Card>
  );
};

export default ContactForm;
