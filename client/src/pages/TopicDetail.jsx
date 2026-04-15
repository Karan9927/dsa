import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

export default function TopicDetail() {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/topics/${id}/problems`)
      .then((res) => { setTopic(res.data.topic); setProblems(res.data.problems); })
      .catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const toggleProgress = (problemId) => {
    // Update UI instantly (optimistic)
    setProblems((prev) => prev.map((p) => p._id === problemId ? { ...p, completed: !p.completed } : p));
    // Then call API in background
    API.put(`/progress/${problemId}`).catch((err) => {
      console.error(err);
      // Revert on failure
      setProblems((prev) => prev.map((p) => p._id === problemId ? { ...p, completed: !p.completed } : p));
    });
  };

  const completedCount = problems.filter((p) => p.completed).length;
  const progress = problems.length > 0 ? Math.round((completedCount / problems.length) * 100) : 0;
  const strokeTotal = 125.7;
  const strokeOffset = strokeTotal - (progress / 100) * strokeTotal;

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

      <div style={{ padding: 24, maxWidth: 860, margin: '0 auto' }}>
        {/* Back */}
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13,
          color: 'var(--color-text-secondary)', marginBottom: 20, cursor: 'pointer', textDecoration: 'none',
        }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="11,3 5,8 11,13"/></svg>
          All topics
        </Link>

        {/* Topic Header */}
        <div style={{
          background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 16, padding: '20px 22px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: 18,
        }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 500, color: 'var(--color-text-primary)' }}>{topic?.name}</h1>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4 }}>{topic?.description}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <svg width="52" height="52" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="20" fill="none" stroke="var(--color-background-secondary)" strokeWidth="5"/>
              <circle cx="26" cy="26" r="20" fill="none" stroke="#e8590c" strokeWidth="5"
                strokeDasharray={strokeTotal} strokeDashoffset={strokeOffset} strokeLinecap="round"
                transform="rotate(-90 26 26)"/>
              <text x="26" y="30" textAnchor="middle" fontSize="10" fontWeight="500" fill="#e8590c"
                fontFamily="Inter,-apple-system,sans-serif">{completedCount}/{problems.length}</text>
            </svg>
            <div>
              <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-primary)' }}>{completedCount} / {problems.length}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{progress}% solved</div>
            </div>
          </div>
        </div>

        {/* Problem Table */}
        <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 16, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '36px 1fr 90px 200px', gap: 12,
            padding: '11px 18px', borderBottom: '0.5px solid var(--color-border-tertiary)',
          }}>
            {['done', 'problem', 'level', 'resources'].map((h) => (
              <div key={h} style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          {problems.map((problem, index) => {
            const diffStyle = problem.difficulty === 'Easy'
              ? { background: '#eaf3de', color: '#3b6d11' }
              : problem.difficulty === 'Medium'
              ? { background: '#faeeda', color: '#854f0b' }
              : { background: '#fcebeb', color: '#a32d2d' };

            return (
              <div key={problem._id} style={{
                display: 'grid', gridTemplateColumns: '36px 1fr 90px 200px', gap: 12,
                padding: '13px 18px', borderBottom: index < problems.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none',
                alignItems: 'center', cursor: 'pointer', transition: 'background 0.1s',
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-background-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>

                {/* Checkbox */}
                <div onClick={() => toggleProgress(problem._id)} style={{
                  width: 20, height: 20, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0,
                  background: problem.completed ? '#e8590c' : 'transparent',
                  border: problem.completed ? '1.5px solid #e8590c' : '1.5px solid var(--color-border-secondary)',
                  transform: problem.completed ? 'scale(1)' : 'scale(1)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  animation: problem.completed ? 'checkPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
                }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1.5,5 4,7.5 8.5,2" className={`check-path ${problem.completed ? 'drawn' : ''}`}/>
                  </svg>
                </div>

                {/* Problem title */}
                <div>
                  <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginRight: 6 }}>
                    {String(problem.order).padStart(2, '0')}.
                  </span>
                  <span style={{
                    fontSize: 13, color: problem.completed ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
                    textDecoration: problem.completed ? 'line-through' : 'none',
                  }}>
                    {problem.title}
                  </span>
                </div>

                {/* Badge */}
                <div>
                  <span style={{
                    display: 'inline-block', fontSize: 11, fontWeight: 500, padding: '3px 9px', borderRadius: 20,
                    ...diffStyle,
                  }}>
                    {problem.difficulty}
                  </span>
                </div>

                {/* Resources */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {problem.articleUrl && (
                    <a href={problem.articleUrl} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 11, fontWeight: 500, padding: '3px 9px', borderRadius: 20, textDecoration: 'none', border: '0.5px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)', color: 'var(--color-text-secondary)' }}>
                      Article
                    </a>
                  )}
                  {problem.youtubeUrl && (
                    <a href={problem.youtubeUrl} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 11, fontWeight: 500, padding: '3px 9px', borderRadius: 20, textDecoration: 'none', border: '0.5px solid rgba(163,45,45,0.2)', background: '#fcebeb', color: '#a32d2d' }}>
                      Video
                    </a>
                  )}
                  {problem.leetcodeUrl && (
                    <a href={problem.leetcodeUrl} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 11, fontWeight: 500, padding: '3px 9px', borderRadius: 20, textDecoration: 'none', border: '0.5px solid rgba(232,89,12,0.25)', background: 'rgba(232,89,12,0.1)', color: '#c74a08' }}>
                      Solve
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
