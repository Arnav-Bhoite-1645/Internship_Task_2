import React from 'react';
import Card from '../common/Card';
import '../styles/admin.css';

const SubmissionsTable = ({ submissions }) => {
  return (
    <Card>
      <div className="header-text">
        <h1>Lead Dashboard</h1>
        <p>Viewing all captured leads in the secure database.</p>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length > 0 ? submissions.map((sub) => (
              <tr key={sub.id}>
                <td style={{fontWeight: 600}}>{sub.name}</td>
                <td>{sub.email}</td>
                <td style={{color: 'var(--text-gray)'}}>{sub.message}</td>
                <td>
                  <span className="badge">
                    {sub.created_at ? new Date(sub.created_at.seconds * 1000).toLocaleDateString() : 'Pending'}
                  </span>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>No leads found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default SubmissionsTable;
