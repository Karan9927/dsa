import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    API.get('/topics').then((res) => setTopics(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const totalProblems = topics.reduce((s, t) => s + t.totalProblems, 0);
  const totalCompleted = topics.reduce((s, t) => s + t.completedProblems, 0);
  const overallPct = totalProblems > 0 ? Math.round((totalCompleted / totalProblems) * 100) : 0;
  const strokeDash = (overallPct / 100) * 100.5;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-background-tertiary)' }}>
        <Navbar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
          <div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid var(--color-border-secondary)', borderTopColor: '#e8590c', borderRadius: '50%' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: 'var(--color-background-tertiary)', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ padding: '28px 24px', maxWidth: 860, margin: '0 auto' }}>
        {/* Greeting */}
        <p style={{ fontSize: 20, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 4 }}>
          {greeting()}, {user?.name?.split(' ')[0] || 'there'}
        </p>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 24 }}>
          Keep going — you're making great progress.
        </p>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, marginBottom: 28 }}>
          <StatCard label="Total" value={totalProblems} />
          <StatCard label="Solved" value={totalCompleted} orange />
          <StatCard label="Remaining" value={totalProblems - totalCompleted} />
          <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 14, padding: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Progress</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="16" fill="none" stroke="var(--color-background-secondary)" strokeWidth="4"/>
                <circle cx="20" cy="20" r="16" fill="none" stroke="#e8590c" strokeWidth="4"
                  strokeDasharray="100.5" strokeDashoffset={100.5 - strokeDash} strokeLinecap="round"
                  transform="rotate(-90 20 20)"/>
                <text x="20" y="24" textAnchor="middle" fontSize="9" fontWeight="500" fill="#e8590c" fontFamily="Inter,-apple-system,sans-serif">{overallPct}%</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 12 }}>Topics</p>

        {/* Topic List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {topics.map((topic, i) => {
            const pct = topic.totalProblems > 0 ? Math.round((topic.completedProblems / topic.totalProblems) * 100) : 0;
            return (
              <Link key={topic._id} to={`/topic/${topic._id}`}
                style={{
                  background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)',
                  borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14,
                  cursor: 'pointer', textDecoration: 'none', transition: 'border-color 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-border-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border-tertiary)'}
              >
                <span style={{
                  background: 'rgba(232,89,12,0.12)', color: '#e8590c', fontSize: 11, fontWeight: 600,
                  borderRadius: 8, padding: '4px 8px', minWidth: 32, textAlign: 'center', flexShrink: 0,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)' }}>{topic.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>{topic.description}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <div style={{ width: 80, height: 4, background: 'var(--color-background-secondary)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#e8590c', borderRadius: 2, width: `${pct}%`, transition: 'width 0.3s' }}></div>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', minWidth: 28, textAlign: 'right' }}>
                    {topic.completedProblems}/{topic.totalProblems}
                  </span>
                </div>

                <svg style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }} width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="5,3 11,8 5,13"/>
                </svg>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, orange }) {
  return (
    <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 14, padding: 16 }}>
      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 500, color: orange ? '#e8590c' : 'var(--color-text-primary)' }}>{value}</div>
    </div>
  );
}
