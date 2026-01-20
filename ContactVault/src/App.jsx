import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, serverTimestamp } from 'firebase/firestore';

/**
 * ContactVault - Secure Lead Capture System
 * Logic updated to use Firestore for environment compatibility.
 */

// Firebase Configuration from environment
const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'contact-vault';

const App = () => {
  const [view, setView] = useState('home'); 
  const [user, setUser] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submissions, setSubmissions] = useState([]);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  // Styling - Plain CSS
  const css = `
    :root {
      --primary-blue: #2563eb;
      --hover-blue: #1d4ed8;
      --bg-white: #ffffff;
      --bg-gray: #f9fafb;
      --text-dark: #1f2937;
      --text-gray: #6b7280;
      --border-gray: #e5e7eb;
      --error-red: #dc2626;
      --success-green: #16a34a;
    }

    body {
      margin: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: var(--bg-gray);
      color: var(--text-dark);
    }

    .navbar {
      background: var(--bg-white);
      border-bottom: 1px solid var(--border-gray);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 700;
      font-size: 1.25rem;
      color: var(--primary-blue);
      text-decoration: none;
    }

    .nav-links button {
      background: none;
      border: none;
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-weight: 500;
      color: var(--text-gray);
      transition: color 0.2s;
    }

    .nav-links button.active {
      color: var(--primary-blue);
    }

    .container {
      max-width: 800px;
      margin: 3rem auto;
      padding: 0 1rem;
    }

    .card {
      background: var(--bg-white);
      padding: 2.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--border-gray);
    }

    .header-text {
      text-align: center;
      margin-bottom: 2rem;
    }

    .header-text h1 { margin: 0; font-size: 2rem; }
    .header-text p { color: var(--text-gray); margin-top: 0.5rem; }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .form-group input, .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-gray);
      border-radius: 6px;
      box-sizing: border-box;
      font-size: 1rem;
    }

    .form-group input:focus, .form-group textarea:focus {
      outline: 2px solid var(--primary-blue);
      border-color: transparent;
    }

    .btn-submit {
      width: 100%;
      padding: 0.875rem;
      background: var(--primary-blue);
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-submit:hover { background: var(--hover-blue); }
    .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

    .toast {
      padding: 1rem;
      border-radius: 6px;
      margin-bottom: 1.5rem;
      text-align: center;
      font-weight: 500;
    }

    .toast-error { background: #fee2e2; color: var(--error-red); }
    .toast-success { background: #dcfce7; color: var(--success-green); }

    .admin-login {
      max-width: 400px;
      margin: 5rem auto;
    }

    .table-container {
      overflow-x: auto;
      background: white;
      border-radius: 8px;
      border: 1px solid var(--border-gray);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    th {
      background: var(--bg-gray);
      padding: 1rem;
      font-size: 0.75rem;
      text-transform: uppercase;
      color: var(--text-gray);
      border-bottom: 1px solid var(--border-gray);
    }

    td {
      padding: 1rem;
      border-bottom: 1px solid var(--border-gray);
      font-size: 0.875rem;
    }

    .badge {
      padding: 0.25rem 0.5rem;
      background: var(--bg-gray);
      border-radius: 4px;
      font-size: 0.75rem;
    }
  `;

  // Initialize Auth
  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Fetch Submissions (Only when admin is authenticated)
  useEffect(() => {
    if (!user || !isAdminAuthenticated) return;

    const submissionsRef = collection(db, 'artifacts', appId, 'public', 'data', 'submissions');
    const unsubscribe = onSnapshot(submissionsRef, (snapshot) => {
      const docs = [];
      snapshot.forEach(doc => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      // Sort in memory by timestamp
      docs.sort((a, b) => (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0));
      setSubmissions(docs);
    }, (err) => {
      console.error("Firestore fetch error:", err);
    });

    return () => unsubscribe();
  }, [user, isAdminAuthenticated]);

  const validate = () => {
    if (formData.name.trim().length < 2) return "Name is too short.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "Invalid email address.";
    if (formData.message.trim().length < 10) return "Message must be at least 10 chars.";
    return null;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setStatus({ type: 'error', message: error });
      return;
    }

    if (!user) {
      setStatus({ type: 'error', message: 'System initializing. Please wait.' });
      return;
    }

    setLoading(true);
    try {
      const submissionsRef = collection(db, 'artifacts', appId, 'public', 'data', 'submissions');
      await addDoc(submissionsRef, {
        ...formData,
        created_at: serverTimestamp(),
        userId: user.uid
      });

      setStatus({ type: 'success', message: 'Message sent securely to the Vault!' });
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error("Submission error:", err);
      setStatus({ type: 'error', message: 'Failed to secure lead. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === 'admin123') {
      setIsAdminAuthenticated(true);
      setStatus({ type: '', message: '' });
    } else {
      setStatus({ type: 'error', message: 'Unauthorized access.' });
    }
  };

  return (
    <div>
      <style>{css}</style>
      
      <nav className="navbar">
        <div className="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          ContactVault
        </div>
        <div className="nav-links">
          <button className={view === 'home' ? 'active' : ''} onClick={() => setView('home')}>Form</button>
          <button className={view === 'admin' ? 'active' : ''} onClick={() => { setView('admin'); setStatus({type:'', message:''}); }}>Admin</button>
        </div>
      </nav>

      <div className="container">
        {status.message && (
          <div className={`toast ${status.type === 'error' ? 'toast-error' : 'toast-success'}`}>
            {status.message}
          </div>
        )}

        {view === 'home' ? (
          <section className="card">
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
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Alex Smith"
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="alex@example.com"
                />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea 
                  rows="5"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="How can we help you today?"
                ></textarea>
              </div>
              <button className="btn-submit" disabled={loading}>
                {loading ? 'Securing...' : 'Send to Vault'}
              </button>
            </form>
          </section>
        ) : (
          !isAdminAuthenticated ? (
            <section className="card admin-login">
              <div className="header-text">
                <h1>Admin Access</h1>
                <p>Restricted to system administrators only.</p>
              </div>
              <form onSubmit={handleAdminLogin}>
                <div className="form-group">
                  <label>Vault Key (Password)</label>
                  <input 
                    type="password" 
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter admin password"
                  />
                </div>
                <button className="btn-submit">Unlock Dashboard</button>
              </form>
            </section>
          ) : (
            <section>
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
            </section>
          )
        )}
      </div>
    </div>
  );
};

export default App;