// src/pages/UpdatePassword.js
import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

export default function UpdatePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Get the access_token from URL (hash or query string)
  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const queryParams = new URLSearchParams(window.location.search);
  const accessToken = hashParams.get('access_token') || queryParams.get('access_token');

  const handlePasswordUpdate = async e => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill in both fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!accessToken) {
      setError('Invalid or expired reset link.');
      return;
    }

    // Update password using Supabase
    const { error: updateError } = await supabase.auth.updateUser({
      access_token: accessToken,
      password: newPassword,
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage('Password updated successfully! Redirecting to login...');
      setTimeout(() => navigate('/auth'), 3000);
    }
  };

  return (
    <section className="auth-container">
      <main>
        <header>
          <h1 className="auth-header">Update Password</h1>
        </header>

        <form onSubmit={handlePasswordUpdate}>
          <fieldset style={{ padding: 0, border: 'none' }}>
            <legend style={{ marginBottom: '0.2rem' }}>Set a New Password</legend>

            {/* New Password */}
            <label
              style={{
                display: 'block',
                marginBottom: '2.0rem',
                width: '300px',
                position: 'relative',
              }}
            >
              New Password
              <input
                type={showNew ? 'text' : 'password'}
                placeholder="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="auth-input"
                style={{ width: '100%' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  padding: 0,
                }}
              >
                {showNew ? 'Hide' : 'Show'}
              </button>
            </label>

            {/* Confirm Password */}
            <label
              style={{
                display: 'block',
                marginBottom: '2.5rem',
                width: '300px',
                position: 'relative',
              }}
            >
              Confirm Password
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="auth-input"
                style={{ width: '100%' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  padding: 0,
                }}
              >
                {showConfirm ? 'Hide' : 'Show'}
              </button>
            </label>

            <button type="submit" className="btn-auth" style={{ marginTop: '0.5rem' }}>
              Update Password
            </button>
          </fieldset>

          {/* Messages */}
          {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
          {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        </form>
      </main>
    </section>
  );
}
