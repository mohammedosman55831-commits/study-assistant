'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { store } from '@/lib/store';
import { formatDuration, formatDate } from '@/lib/utils';

function ProgressContent() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [activities, setActivities] = useState([]);
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'subjects', 'quizzes', 'achievements'

  useEffect(() => {
    store.updateStreak();
    setUser(store.getUser());
    setStats(store.getWeeklyStats());
    setSubjects(store.getSubjects());
    setQuizResults(store.getQuizResults());
    setAchievements(store.getAchievements());
    setActivities(store.getRecentActivity());
    setFlashcardSets(store.getFlashcards());
  }, []);

  if (!user) {
    return (
      <div className="page-container">
        <div className="skeleton" style={{ height: 40, width: 300, marginBottom: 32 }} />
        <div className="grid grid-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: 100, borderRadius: 14 }} />
          ))}
        </div>
      </div>
    );
  }

  const xpPercent = Math.round((user.xp / user.xpToNextLevel) * 100);
  const avgQuizScore = quizResults.length > 0
    ? Math.round(quizResults.reduce((acc, q) => acc + q.score, 0) / quizResults.length)
    : 0;

  const totalTopicsCompleted = subjects.reduce((sum, s) => sum + (s.completedTopics || 0), 0);
  const totalTopicsAll = subjects.reduce((sum, s) => sum + (s.totalTopics || 25), 0);
  const overallSubjectProgress = totalTopicsAll > 0 ? Math.round((totalTopicsCompleted / totalTopicsAll) * 100) : 0;

  const unlockedAchievementsCount = achievements.filter(a => a.unlocked).length;

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxWeeklyMinutes = Math.max(...(stats?.dailyMinutes || [1]), 1);

  return (
    <div className="page-container animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '1.8rem' }}>📈</span>
            <h1 className="page-title" style={{ margin: 0 }}>Learning Progress & Analytics</h1>
          </div>
          <p className="page-subtitle">
            Comprehensive analytics of your study time, subject mastery, quiz scores, and achievements.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <Link href="/practice" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>✏️</span> Practice
          </Link>
          <Link href="/coding" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🐍</span> Python Workspace
          </Link>
          <Link href="/quizzes" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>📝</span> Quizzes
          </Link>
        </div>
      </div>

      {/* Hero Profile & Level Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(59, 130, 246, 0.08))',
        borderRadius: '16px',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        padding: '1.8rem',
        marginBottom: '1.8rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--primary, #6366f1)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)',
          }}>
            {user.name?.charAt(0)?.toUpperCase() || 'S'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.4rem' }}>{user.name}</h2>
              <span style={{
                background: 'var(--primary, #6366f1)',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '0.2rem 0.6rem',
                borderRadius: '20px',
              }}>
                LEVEL {user.level}
              </span>
            </div>
            <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Studying since {formatDate(user.joinedDate || new Date().toISOString())}
            </p>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
            <span><strong>{user.xp} XP</strong> Earned</span>
            <span style={{ color: 'var(--text-muted)' }}>{user.xpToNextLevel - user.xp} XP to Level {user.level + 1}</span>
          </div>
          <div style={{
            width: '100%',
            height: '10px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${Math.min(xpPercent, 100)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #6366f1, #3b82f6)',
              borderRadius: '10px',
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Key Metric Cards Grid */}
      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>🔥</div>
          <div>
            <div className="stat-value">{user.streak || 0} Days</div>
            <div className="stat-label">Daily Study Streak</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>⏱️</div>
          <div>
            <div className="stat-value">{formatDuration(user.totalStudyMinutes || stats?.totalMinutes || 0)}</div>
            <div className="stat-label">Total Time Studied</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>🎯</div>
          <div>
            <div className="stat-value">{avgQuizScore}%</div>
            <div className="stat-label">Average Quiz Score</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>🏆</div>
          <div>
            <div className="stat-value">{unlockedAchievementsCount} / {achievements.length}</div>
            <div className="stat-label">Achievements Unlocked</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: '0.6rem',
        borderBottom: '1px solid var(--border)',
        marginBottom: '1.5rem',
        overflowX: 'auto',
      }}>
        {[
          { id: 'overview', label: '📊 Weekly Activity & Subjects' },
          { id: 'quizzes', label: '📝 Quizzes & Performance' },
          { id: 'achievements', label: '🏆 Badges & Milestones' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75rem 1.2rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--primary, #6366f1)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--primary, #6366f1)' : 'var(--text-muted)',
              fontWeight: activeTab === tab.id ? '600' : '500',
              fontSize: '0.95rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview (Weekly Chart + Subject Mastery) */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Weekly Activity Bar Chart */}
          <div style={{
            background: 'var(--card-bg, rgba(255,255,255,0.03))',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            padding: '1.8rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>📅 Weekly Study Activity</h3>
                <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Total {formatDuration(stats?.totalMinutes || 0)} spent learning this week
                </p>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Last 7 Days</span>
            </div>

            {/* Custom CSS Bar Chart */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: '180px',
              paddingTop: '20px',
              borderBottom: '1px solid var(--border)',
              gap: '0.5rem',
            }}>
              {dayLabels.map((day, idx) => {
                const minutes = stats?.dailyMinutes?.[idx] || 0;
                const heightPercent = maxWeeklyMinutes > 0 ? (minutes / maxWeeklyMinutes) * 100 : 0;
                return (
                  <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      {minutes > 0 ? `${minutes}m` : '-'}
                    </div>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '36px',
                        height: `${Math.max(heightPercent, 6)}%`,
                        background: minutes > 0 ? 'linear-gradient(180deg, #6366f1, #3b82f6)' : 'rgba(255,255,255,0.05)',
                        borderRadius: '6px 6px 0 0',
                        transition: 'height 0.3s ease',
                      }}
                    />
                    <div style={{ fontSize: '0.8rem', fontWeight: '500', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                      {day}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subject Mastery Progress Grid */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>📚 Subject Mastery</h3>
                <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Progress tracked across syllabus chapters and practice topics
                </p>
              </div>
              <Link href="/subjects" className="btn btn-sm btn-ghost">
                View All Syllabus →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {subjects.map(subj => {
                const prog = subj.progress || 0;
                return (
                  <div
                    key={subj.id}
                    style={{
                      padding: '1.2rem',
                      borderRadius: '14px',
                      background: 'var(--card-bg, rgba(255,255,255,0.03))',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.8rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '1.4rem' }}>{subj.icon}</span>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{subj.name}</h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {subj.completedTopics || 0} / {subj.totalTopics || 25} topics
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: '700', color: subj.color || 'var(--primary)' }}>
                        {prog}%
                      </span>
                    </div>

                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ width: `${prog}%`, height: '100%', background: subj.color || 'var(--primary)', borderRadius: '6px' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem', marginTop: '0.2rem' }}>
                      <Link href={`/practice?category=${subj.id}`} className="btn btn-sm btn-ghost" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
                        Practice
                      </Link>
                      <Link href={`/tutor?subject=${subj.id}`} className="btn btn-sm btn-ghost" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
                        Ask AI
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Quizzes & Detailed Scores */}
      {activeTab === 'quizzes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{
            background: 'var(--card-bg, rgba(255,255,255,0.03))',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            padding: '1.5rem',
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.15rem' }}>📝 Quiz History & Assessments</h3>

            {quizResults.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '1.1rem', marginBottom: '0.8rem' }}>No quizzes completed yet</p>
                <Link href="/quizzes" className="btn btn-primary btn-sm">
                  Take Your First Quiz
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {quizResults.map((result, idx) => (
                  <div
                    key={result.id || idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>
                        {result.topic || result.subject || 'Comprehensive Knowledge Quiz'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {formatDate(result.date || new Date().toISOString())} · {result.totalQuestions || 5} questions
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        color: result.score >= 80 ? '#10b981' : result.score >= 50 ? '#f59e0b' : '#ef4444',
                      }}>
                        {result.score}%
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {result.score >= 80 ? '🌟 Excellent' : result.score >= 50 ? '👍 Passed' : '🔄 Needs Review'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Achievements Showcase */}
      {activeTab === 'achievements' && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.2rem',
          }}>
            {achievements.map(ach => (
              <div
                key={ach.id}
                style={{
                  padding: '1.4rem',
                  borderRadius: '14px',
                  background: ach.unlocked
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(16, 185, 129, 0.08))'
                    : 'var(--card-bg, rgba(255,255,255,0.02))',
                  border: ach.unlocked ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  opacity: ach.unlocked ? 1 : 0.6,
                }}
              >
                <div style={{
                  fontSize: '2rem',
                  filter: ach.unlocked ? 'none' : 'grayscale(100%)',
                }}>
                  {ach.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600' }}>{ach.name}</h4>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: ach.unlocked ? '#10b981' : 'var(--text-muted)',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px',
                      background: ach.unlocked ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.05)',
                    }}>
                      +{ach.xp} XP
                    </span>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {ach.description}
                  </p>

                  {ach.unlocked && (
                    <div style={{ fontSize: '0.7rem', color: '#10b981', marginTop: '0.4rem' }}>
                      ✓ Unlocked
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProgressPage() {
  return (
    <Suspense fallback={<div className="page-container"><p>Loading Progress Analytics...</p></div>}>
      <ProgressContent />
    </Suspense>
  );
}
