import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();

  return (
    <nav style={{
      background: 'var(--color-background-primary)',
      borderBottom: '0.5px solid var(--color-border-tertiary)',
      padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
          <rect x="4" y="20" width="6" height="12" rx="2" fill="#e8590c" opacity="0.5"/>
          <rect x="13" y="13" width="6" height="19" rx="2" fill="#e8590c" opacity="0.75"/>
          <rect x="22" y="7" width="6" height="25" rx="2" fill="#e8590c"/>
        </svg>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)' }}>DSA Sheet</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Theme toggle */}
        <button onClick={toggle} style={{
          background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--color-text-secondary)',
        }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            {dark ? <><circle cx="8" cy="8" r="3.5"/><line x1="8" y1="1" x2="8" y2="2.5"/><line x1="8" y1="13.5" x2="8" y2="15"/><line x1="1" y1="8" x2="2.5" y2="8"/><line x1="13.5" y1="8" x2="15" y2="8"/></> :
            <path d="M13 8.5a5.5 5.5 0 0 1-7.5-7.5 6.5 6.5 0 1 0 7.5 7.5z"/>}
          </svg>
        </button>

        {user && (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, background: 'var(--color-background-secondary)',
              border: '0.5px solid var(--color-border-tertiary)', borderRadius: 20, padding: '5px 12px 5px 6px',
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%', background: 'rgba(232,89,12,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 600, color: '#e8590c',
              }}>
                {user.name.charAt(0).toUpperCase()}{user.name.split(' ')[1]?.charAt(0).toUpperCase() || ''}
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>{user.name}</span>
            </div>
            <button onClick={logout} style={{
              background: 'transparent', border: '0.5px solid var(--color-border-secondary)',
              borderRadius: 8, padding: '5px 12px', fontSize: 13, color: 'var(--color-text-secondary)',
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
              Sign out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
