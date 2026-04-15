import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try { await register(name, email, password); navigate('/'); }
    catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  const inputProps = {
    className: "w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all",
    style: { background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text)' },
    onFocus: (e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-light)'; },
    onBlur: (e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; },
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative" style={{ background: 'var(--bg-secondary)' }}>
      <button onClick={toggle} className="absolute top-5 right-5 w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        {dark ? <FiSun size={15} style={{ color: 'var(--text-secondary)' }} /> : <FiMoon size={15} style={{ color: 'var(--text-secondary)' }} />}
      </button>

      <div className="w-full max-w-[380px]">
        <div className="text-center mb-8">
          <svg width="44" height="44" viewBox="0 0 28 28" fill="none" className="mx-auto mb-5">
            <rect width="28" height="28" rx="8" fill="var(--accent)" />
            <path d="M8 10h4v8H8zM14 8h4v10h-4zM20 12h-1v6h4v-3a3 3 0 0 0-3-3z" fill="white" opacity="0.9"/>
          </svg>
          <h1 className="text-[22px] font-bold mb-1" style={{ color: 'var(--text)' }}>Create your account</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Start solving DSA problems today</p>
        </div>

        <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
          {error && (
            <div className="px-3 py-2.5 rounded-lg mb-4 text-sm font-medium" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.15)', color: '#dc2626' }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} {...inputProps} placeholder="Your name" required />
            </div>
            <div>
              <label className="block text-[13px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} {...inputProps} placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-[13px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} {...inputProps} placeholder="Min 6 characters" required minLength={6} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer disabled:opacity-50 transition-all hover:shadow-lg"
              style={{ background: 'var(--accent)' }}>
              {loading ? 'Creating...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-[13px] mt-5" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: 'var(--accent)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
