import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
  const [tab, setTab] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'login') await login(email, password);
      else await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || (tab === 'login' ? 'Login failed' : 'Registration failed'));
    } finally { setLoading(false); }
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", minHeight: '100vh', background: 'var(--color-background-tertiary)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Theme toggle */}
      <button onClick={toggle} style={{
        position: 'absolute', top: 16, right: 16, background: 'var(--color-background-secondary)',
        border: '0.5px solid var(--color-border-secondary)', borderRadius: 20, padding: '6px 12px',
        fontSize: 13, color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          {dark ? <><circle cx="8" cy="8" r="3.5"/><line x1="8" y1="1" x2="8" y2="2.5"/><line x1="8" y1="13.5" x2="8" y2="15"/><line x1="1" y1="8" x2="2.5" y2="8"/><line x1="13.5" y1="8" x2="15" y2="8"/></> :
          <path d="M13 8.5a5.5 5.5 0 0 1-7.5-7.5 6.5 6.5 0 1 0 7.5 7.5z"/>}
        </svg>
        {dark ? 'Light' : 'Dark'}
      </button>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 400 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect x="4" y="20" width="6" height="12" rx="2" fill="#e8590c" opacity="0.5"/>
              <rect x="13" y="13" width="6" height="19" rx="2" fill="#e8590c" opacity="0.75"/>
              <rect x="22" y="7" width="6" height="25" rx="2" fill="#e8590c"/>
            </svg>
            <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text-primary)' }}>DSA Sheet</span>
          </div>

          {/* Tab switcher */}
          <div style={{ display: 'flex', background: 'var(--color-background-secondary)', borderRadius: 12, padding: 3, marginBottom: 28 }}>
            {['login', 'register'].map((t) => (
              <button key={t} onClick={() => { setTab(t); setError(''); }}
                style={{
                  flex: 1, padding: 8, border: tab === t ? '0.5px solid var(--color-border-tertiary)' : 'none',
                  background: tab === t ? 'var(--color-background-primary)' : 'transparent',
                  borderRadius: 9, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  color: tab === t ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  fontFamily: 'inherit', transition: 'all 0.15s',
                }}>
                {t === 'login' ? 'Sign in' : 'Register'}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ background: 'rgba(220,38,38,0.06)', border: '0.5px solid rgba(220,38,38,0.15)', borderRadius: 10, padding: '9px 14px', marginBottom: 14, fontSize: 13, color: '#dc2626' }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            {tab === 'register' && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 6 }}>Full name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-secondary)', borderRadius: 10, padding: '10px 14px', fontSize: 14, color: 'var(--color-text-primary)', outline: 'none', fontFamily: 'inherit' }}
                  placeholder="Arjun Sharma" required />
              </div>
            )}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 6 }}>Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-secondary)', borderRadius: 10, padding: '10px 14px', fontSize: 14, color: 'var(--color-text-primary)', outline: 'none', fontFamily: 'inherit' }}
                placeholder="you@example.com" required />
            </div>
            <div style={{ marginBottom: tab === 'login' ? 6 : 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 6 }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-secondary)', borderRadius: 10, padding: '10px 14px', fontSize: 14, color: 'var(--color-text-primary)', outline: 'none', fontFamily: 'inherit' }}
                placeholder="••••••••" required minLength={6} />
            </div>
            {tab === 'login' && (
              <p style={{ fontSize: 12, color: '#e8590c', textAlign: 'right', marginBottom: 8, cursor: 'pointer' }}>Forgot password?</p>
            )}
            <button type="submit" disabled={loading}
              style={{ width: '100%', background: '#e8590c', border: 'none', borderRadius: 10, padding: 11, fontSize: 14, fontWeight: 500, color: '#fff', cursor: 'pointer', marginTop: 6, fontFamily: 'inherit', opacity: loading ? 0.6 : 1 }}>
              {loading ? (tab === 'login' ? 'Signing in...' : 'Creating...') : (tab === 'login' ? 'Sign in' : 'Create account')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
