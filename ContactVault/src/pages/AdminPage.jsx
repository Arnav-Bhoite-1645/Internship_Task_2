import React from 'react';
import AdminLogin from '../components/admin/AdminLogin';
import SubmissionsTable from '../components/admin/SubmissionsTable';

const AdminPage = ({ isAuthenticated, submissions, onLogin, onError }) => {
  if (!isAuthenticated) {
    return (
      <AdminLogin onLogin={onLogin} onError={onError} />
    );
  }

  return (
    <SubmissionsTable submissions={submissions} />
  );
};

export default AdminPage;
