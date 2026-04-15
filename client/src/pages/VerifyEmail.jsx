import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setUserFromToken } = useAuth();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    API.get(`/auth/verify/${token}`)
      .then((res) => {
        setStatus('success');
        setMessage(res.data.message);
        // Auto-login after verification
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          setUserFromToken(res.data.user);
          setTimeout(() => navigate('/'), 2000);
        }
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed');
      });
  }, [token]);

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", minHeight: '100vh', background: 'var(--color-background-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 400, textAlign: 'center' }}>
        {status === 'verifying' && (
          <>
            <div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid var(--color-border-secondary)', borderTopColor: '#e8590c', borderRadius: '50%', margin: '0 auto 20px' }}></div>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Verifying your email...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 8 }}>{message}</h2>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Redirecting to dashboard...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(220,38,38,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 8 }}>{message}</h2>
            <button onClick={() => navigate('/login')}
              style={{ marginTop: 16, background: '#e8590c', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 14, fontWeight: 500, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
              Back to login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
