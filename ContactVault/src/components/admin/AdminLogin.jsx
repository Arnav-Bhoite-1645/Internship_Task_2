import React from 'react';
import { useForm } from '../../hooks/useForm';
import { validateAdminPassword } from '../../utils/validation';
import Card from '../common/Card';
import '../styles/components.css';

const AdminLogin = ({ onLogin, onError }) => {
  const { formData, handleChange } = useForm({ password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateAdminPassword(formData.password)) {
      onLogin();
    } else {
      onError('Unauthorized access.');
    }
  };

  return (
    <Card className="admin-login">
      <div className="header-text">
        <h1>Admin Access</h1>
        <p>Restricted to system administrators only.</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Vault Key (Password)</label>
          <input 
            type="password" 
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="Enter admin password"
          />
        </div>
        <button className="btn-submit">Unlock Dashboard</button>
      </form>
    </Card>
  );
};

export default AdminLogin;
