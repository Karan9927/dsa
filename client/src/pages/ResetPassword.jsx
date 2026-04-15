import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setUserFromToken } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      const res = await API.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
      // Auto-login
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUserFromToken(res.data.user);
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', background: 'var(--color-background-secondary)',
    border: '0.5px solid var(--color-border-secondary)', borderRadius: 10,
    padding: '10px 14px', fontSize: 14, color: 'var(--color-text-primary)',
    outline: 'none', fontFamily: 'inherit',
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", minHeight: '100vh', background: 'var(--color-background-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 400, textAlign: 'center' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect x="4" y="20" width="6" height="12" rx="2" fill="#e8590c" opacity="0.5"/>
            <rect x="13" y="13" width="6" height="19" rx="2" fill="#e8590c" opacity="0.75"/>
            <rect x="22" y="7" width="6" height="25" rx="2" fill="#e8590c"/>
          </svg>
          <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text-primary)' }}>DSA Sheet</span>
        </div>

        {!success ? (
          <>
            <h2 style={{ fontSize: 18, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 8 }}>Set new password</h2>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 24 }}>Enter your new password below.</p>

            {error && (
              <div style={{ background: 'rgba(220,38,38,0.06)', border: '0.5px solid rgba(220,38,38,0.15)', borderRadius: 10, padding: '9px 14px', marginBottom: 14, fontSize: 13, color: '#dc2626', textAlign: 'left' }}>{error}</div>
            )}

            <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 6 }}>New password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle} placeholder="••••••••" required minLength={6} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 6 }}>Confirm password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  style={inputStyle} placeholder="••••••••" required minLength={6} />
              </div>
              <button type="submit" disabled={loading}
                style={{ width: '100%', background: '#e8590c', border: 'none', borderRadius: 10, padding: 11, fontSize: 14, fontWeight: 500, color: '#fff', cursor: 'pointer', marginTop: 6, fontFamily: 'inherit', opacity: loading ? 0.6 : 1 }}>
                {loading ? 'Resetting...' : 'Reset password'}
              </button>
            </form>
          </>
        ) : (
          <>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 8 }}>Password reset!</h2>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Redirecting to dashboard...</p>
          </>
        )}
      </div>
    </div>
  );
}
