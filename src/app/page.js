'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { store } from '@/lib/store';
import { getGreeting, formatDuration, formatDate } from '@/lib/utils';
import { useTheme } from '@/components/AppShell';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [activity, setActivity] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const u = store.getUser();
    store.updateStreak();
    setUser(store.getUser());
    setStats(store.getWeeklyStats());
    setAchievements(store.getAchievements().filter(a => a.unlocked).slice(0, 4));
    setActivity(store.getRecentActivity().slice(0, 5));
    setSubjects(store.getSubjects().slice(0, 4));
  }, []);

  if (!user) {
    return (
      <div className="page-container">
        <div className="skeleton" style={{ height: 40, width: 300, marginBottom: 32 }} />
        <div className="grid grid-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="skeleton" style={{ height: 100, borderRadius: 14 }} />
          ))}
        </div>
      </div>
    );
  }

  const quizResults = store.getQuizResults();
  const avgScore = quizResults.length > 0
    ? Math.round(quizResults.reduce((s, q) => s + q.score, 0) / quizResults.length)
    : 0;
  const completedTopics = subjects.reduce((s, sub) => s + sub.completedTopics, 0);

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxMinutes = Math.max(...(stats?.dailyMinutes || [1]), 1);

  const quickActions = [
    { label: 'Inter Syllabus', href: '/syllabus', icon: '🎓', color: '#6366f1' },
    { label: 'Ask AI Tutor', href: '/tutor', icon: '🤖', color: '#3b82f6' },
    { label: 'Question Solver', href: '/solver', icon: '🧩', color: '#10b981' },
    { label: 'Take a Quiz', href: '/quizzes', icon: '📝', color: '#8b5cf6' },
  ];

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">{getGreeting()}, {user.name} 👋</h1>
          <p className="page-subtitle">
            {user.streak > 0
              ? `🔥 ${user.streak} day study streak! Keep it going!`
              : "Ready to start learning today? Let's go!"}
          </p>
        </div>
        <button className="btn btn-ghost" onClick={toggleTheme} title="Toggle theme">
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-4" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>🔥</div>
          <div>
            <div className="stat-value">{user.streak || 0}</div>
            <div className="stat-label">Day Streak</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>⏱️</div>
          <div>
            <div className="stat-value">{formatDuration(stats?.totalMinutes || 0)}</div>
            <div className="stat-label">This Week</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>🎯</div>
          <div>
            <div className="stat-value">{avgScore}%</div>
            <div className="stat-label">Quiz Average</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>📚</div>
          <div>
            <div className="stat-value">{completedTopics}</div>
            <div className="stat-label">Topics Done</div>
          </div>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 'var(--space-8)' }}>
        {/* Quick Actions */}
        <div className="card">
          <h2 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>⚡ Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}>
            {quickActions.map(action => (
              <Link key={action.href} href={action.href} style={{ textDecoration: 'none' }}>
                <div className="card card-clickable" style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                  padding: 'var(--space-4)', borderLeft: `3px solid ${action.color}`,
                }}>
                  <span style={{ fontSize: '1.5rem' }}>{action.icon}</span>
                  <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{action.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="card">
          <h2 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>📊 Weekly Study Time</h2>
          <div className="chart-bar">
            {(stats?.dailyMinutes || [0,0,0,0,0,0,0]).map((minutes, idx) => (
              <div
                key={idx}
                className="chart-bar-item"
                style={{
                  height: `${Math.max((minutes / maxMinutes) * 100, 4)}%`,
                  opacity: minutes > 0 ? 1 : 0.3,
                }}
                title={`${dayLabels[idx]}: ${minutes} min`}
              />
            ))}
          </div>
          <div className="chart-bar-label">
            {dayLabels.map(d => <span key={d}>{d}</span>)}
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Subject Progress */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h2 className="card-title" style={{ marginBottom: 0 }}>📚 Your Subjects</h2>
            <Link href="/subjects" className="btn btn-ghost btn-sm">View All →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {subjects.map(subject => (
              <div key={subject.id} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
              }}>
                <span style={{ fontSize: '1.3rem' }}>{subject.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{subject.name}</div>
                  <div className="progress-bar" style={{ marginTop: 4, height: 6 }}>
                    <div className="progress-fill" style={{ width: `${subject.progress}%`, background: subject.color }} />
                  </div>
                </div>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {subject.progress}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements & XP */}
        <div className="card">
          <h2 className="card-title" style={{ marginBottom: 'var(--space-2)' }}>🏆 Level & Achievements</h2>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Level {user.level}</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{user.xp} / {user.xpToNextLevel} XP</span>
            </div>
            <div className="progress-bar" style={{ height: 10 }}>
              <div className="progress-fill" style={{ width: `${(user.xp / user.xpToNextLevel) * 100}%` }} />
            </div>
          </div>

          {achievements.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {achievements.map(a => (
                <div key={a.id} className="achievement">
                  <div className="achievement-icon" style={{ background: 'var(--accent-primary-light)' }}>{a.icon}</div>
                  <div>
                    <div className="achievement-title">{a.name}</div>
                    <div className="achievement-desc">{a.description}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: 'var(--text-sm)' }}>Start learning to unlock achievements! 🎯</p>
            </div>
          )}

          <Link href="/progress" style={{ display: 'block', marginTop: 'var(--space-4)' }}>
            <button className="btn btn-outline w-full">View All Progress →</button>
          </Link>
        </div>
      </div>

      {/* Intermediate / Class 11-12 Streams Showcase */}
      <div className="card" style={{ marginTop: 'var(--space-8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h2 className="card-title" style={{ marginBottom: '2px' }}>🎓 Intermediate / Class 11–12 Syllabus</h2>
            <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
              Choose your stream for tailored notes, step-by-step problem solver, and AI tutor support.
            </p>
          </div>
          <Link href="/syllabus" className="btn btn-outline btn-sm">
            Full Syllabus Tree →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
          {[
            { id: 'mpc', name: 'MPC', full: 'Maths, Physics, Chemistry', icon: '📐⚛️🧪', color: '#6366f1' },
            { id: 'bipc', name: 'BiPC', full: 'Biology, Physics, Chemistry', icon: '🧬⚛️🧪', color: '#10b981' },
            { id: 'mec', name: 'MEC', full: 'Maths, Economics, Commerce', icon: '📐📊💼', color: '#f59e0b' },
            { id: 'cec', name: 'CEC', full: 'Civics, Economics, Commerce', icon: '🏛️📊💼', color: '#ec4899' },
          ].map((st) => (
            <Link key={st.id} href={`/syllabus?stream=${st.id}`} style={{ textDecoration: 'none' }}>
              <div
                className="card card-clickable"
                style={{
                  padding: 'var(--space-4)',
                  borderLeft: `4px solid ${st.color}`,
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 800, fontSize: 'var(--text-base)', color: st.color }}>{st.name}</span>
                  <span style={{ fontSize: '1.2rem' }}>{st.icon}</span>
                </div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>{st.full}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                  1st & 2nd Year • All Chapters
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="card" style={{
        marginTop: 'var(--space-8)',
        background: 'var(--accent-gradient)',
        color: 'white',
        border: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <span style={{ fontSize: '2rem' }}>💡</span>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-1)' }}>AI Recommendation</h3>
            <p style={{ opacity: 0.9, fontSize: 'var(--text-sm)' }}>
              {completedTopics > 0
                ? "Your progress is looking great! Try a quiz to test your knowledge, or explore a new subject."
                : "Welcome! Start by exploring a subject or asking the AI Tutor a question. Every learning journey begins with curiosity! 🚀"}
            </p>
          </div>
          <Link href="/tutor">
            <button className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
              Start Learning →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
