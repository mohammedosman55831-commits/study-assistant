'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { store } from '@/lib/store';
import { formatDate, formatDuration } from '@/lib/utils';

const SUBJECTS_LIST = [
  { id: 'python', label: 'Python / Coding', icon: '🐍', color: '#f59e0b' },
  { id: 'math', label: 'Mathematics', icon: '📐', color: '#6366f1' },
  { id: 'physics', label: 'Physics', icon: '⚛️', color: '#3b82f6' },
  { id: 'chemistry', label: 'Chemistry', icon: '🧪', color: '#10b981' },
  { id: 'biology', label: 'Biology', icon: '🧬', color: '#22c55e' },
  { id: 'cs', label: 'Computer Science', icon: '💻', color: '#8b5cf6' },
  { id: 'english', label: 'English', icon: '📖', color: '#ec4899' },
  { id: 'general', label: 'General Study', icon: '📚', color: '#64748b' },
];

const TASK_TYPES = [
  { id: 'study', label: '📖 Deep Study' },
  { id: 'practice', label: '✏️ Problem Practice' },
  { id: 'revision', label: '🔄 Flashcards & Revision' },
  { id: 'quiz', label: '📝 Quiz / Mock Test' },
  { id: 'project', label: '💻 Coding / Project' },
];

const DEFAULT_INITIAL_TASKS = [
  {
    id: 't_python_1',
    title: 'Python Functions & Lambda Expressions',
    subject: 'python',
    type: 'study',
    duration: 45,
    date: new Date().toISOString().split('T')[0],
    priority: 'high',
    completed: false,
  },
  {
    id: 't_math_1',
    title: 'Quadratic Equations & Roots Practice',
    subject: 'math',
    type: 'practice',
    duration: 30,
    date: new Date().toISOString().split('T')[0],
    priority: 'medium',
    completed: false,
  },
  {
    id: 't_physics_1',
    title: 'Newton’s Laws Flashcard Revision',
    subject: 'physics',
    type: 'revision',
    duration: 20,
    date: new Date().toISOString().split('T')[0],
    priority: 'low',
    completed: true,
  },
];

function PlannerContent() {
  const searchParams = useSearchParams();
  const initialDate = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [activeTab, setActiveTab] = useState('daily'); // 'daily', 'upcoming', 'ai_generator', 'focus'
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // New task form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('python');
  const [newType, setNewType] = useState('study');
  const [newDuration, setNewDuration] = useState(30);
  const [newDate, setNewDate] = useState(initialDate);
  const [newPriority, setNewPriority] = useState('medium');

  // AI Plan Generator state
  const [aiSelectedSubjects, setAiSelectedSubjects] = useState(['python', 'math']);
  const [aiExamDate, setAiExamDate] = useState('');
  const [aiHoursPerDay, setAiHoursPerDay] = useState(2);
  const [aiLevel, setAiLevel] = useState('Intermediate');
  const [aiLoading, setAiLoading] = useState(false);
  const [generatedSchedule, setGeneratedSchedule] = useState(null);

  // Focus Timer state
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [timerInitialMinutes, setTimerInitialMinutes] = useState(25);
  const [timerTaskTitle, setTimerTaskTitle] = useState('Python Deep Work');

  useEffect(() => {
    setUser(store.getUser());
    const savedTasks = store.getPlanTasks();
    if (savedTasks.length > 0) {
      setTasks(savedTasks);
    } else {
      // Seed initial demo tasks
      store.savePlanTasks(DEFAULT_INITIAL_TASKS);
      setTasks(DEFAULT_INITIAL_TASKS);
    }
  }, []);

  // Timer interval
  useEffect(() => {
    let interval = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(sec => sec - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerActive) {
      setTimerActive(false);
      store.saveStudySession({
        subject: 'General Focus',
        duration: timerInitialMinutes,
        topic: timerTaskTitle,
      });
      store.addXP(timerInitialMinutes >= 25 ? 25 : 10);
      setFeedbackMsg(`🎉 Focus session completed! +${timerInitialMinutes >= 25 ? 25 : 10} XP`);
      setTimeout(() => setFeedbackMsg(''), 5000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds, timerInitialMinutes, timerTaskTitle]);

  const toggleTaskCompleted = (taskId) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        const nextCompleted = !t.completed;
        if (nextCompleted) {
          store.addXP(15);
          store.updateStreak();
          store.logActivity({ type: 'task_completed', title: `Completed: ${t.title}` });
          setFeedbackMsg(`🎯 Task marked complete! +15 XP`);
          setTimeout(() => setFeedbackMsg(''), 3000);
        }
        return { ...t, completed: nextCompleted };
      }
      return t;
    });

    setTasks(updatedTasks);
    store.saveStudyPlan({
      id: 'active_plan',
      title: 'Current Study Plan',
      tasks: updatedTasks,
    });
    setUser(store.getUser());
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask = {
      id: 'task_' + Date.now(),
      title: newTitle.trim(),
      subject: newSubject,
      type: newType,
      duration: Number(newDuration) || 30,
      date: newDate || selectedDate,
      priority: newPriority,
      completed: false,
    };

    const updated = [newTask, ...tasks];
    setTasks(updated);
    store.savePlanTasks(updated);

    setShowAddModal(false);
    setNewTitle('');
    setFeedbackMsg('✨ Task added to your schedule');
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const handleDeleteTask = (taskId, e) => {
    e?.stopPropagation();
    const remaining = tasks.filter(t => t.id !== taskId);
    setTasks(remaining);
    store.savePlanTasks(remaining);
  };

  // AI Plan Generation
  const handleGenerateAiPlan = async () => {
    if (aiSelectedSubjects.length === 0) {
      alert('Please select at least one subject for your schedule');
      return;
    }

    setAiLoading(true);
    setGeneratedSchedule(null);

    try {
      const res = await fetch('/api/ai/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjects: aiSelectedSubjects,
          examDate: aiExamDate,
          hoursPerDay: aiHoursPerDay,
          knowledgeLevel: aiLevel,
        }),
      });

      const data = await res.json();
      if (data.plan) {
        setGeneratedSchedule(data.plan);
      } else {
        alert('Failed to generate study plan. Please try again.');
      }
    } catch (err) {
      console.error('Planner error:', err);
      alert('Temporary error while contacting AI planner.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyAiPlan = () => {
    if (!generatedSchedule || !Array.isArray(generatedSchedule)) return;

    const today = new Date();
    const newTasksFromSchedule = [];

    generatedSchedule.forEach((dayPlan, dayIdx) => {
      const targetDate = new Date();
      targetDate.setDate(today.getDate() + dayIdx);
      const dateStr = targetDate.toISOString().split('T')[0];

      if (Array.isArray(dayPlan.tasks)) {
        dayPlan.tasks.forEach((item, itemIdx) => {
          newTasksFromSchedule.push({
            id: `ai_task_${Date.now()}_${dayIdx}_${itemIdx}`,
            title: item.topic || `${item.subject} Deep Session`,
            subject: (item.subject || 'general').toLowerCase(),
            type: item.type || 'study',
            duration: item.duration || 45,
            date: dateStr,
            priority: dayIdx === 0 ? 'high' : 'medium',
            completed: false,
          });
        });
      }
    });

    const combined = [...newTasksFromSchedule, ...tasks];
    setTasks(combined);
    store.savePlanTasks(combined);

    setActiveTab('daily');
    setFeedbackMsg(`🚀 Applied ${newTasksFromSchedule.length} AI study tasks to your planner!`);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  // Timer controls
  const handleStartTimer = (mins) => {
    setTimerInitialMinutes(mins);
    setTimerSeconds(mins * 60);
    setTimerActive(true);
  };

  const formatTimerDisplay = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Filter tasks
  const todayStr = new Date().toISOString().split('T')[0];
  const dailyTasks = tasks.filter(t => t.date === selectedDate);
  const completedTodayCount = dailyTasks.filter(t => t.completed).length;
  const totalDailyMinutes = dailyTasks.reduce((acc, t) => acc + (t.duration || 0), 0);
  const completedDailyMinutes = dailyTasks.filter(t => t.completed).reduce((acc, t) => acc + (t.duration || 0), 0);

  return (
    <div className="page-container animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Top Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '1.8rem' }}>📅</span>
            <h1 className="page-title" style={{ margin: 0 }}>Smart Study Planner</h1>
          </div>
          <p className="page-subtitle">
            Organize daily tasks, track revision milestones, and build AI-optimized study schedules.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>➕</span> Add Task
          </button>
          <button
            className={`btn ${activeTab === 'ai_generator' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab(activeTab === 'ai_generator' ? 'daily' : 'ai_generator')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <span>✨</span> AI Scheduler
          </button>
          <button
            className={`btn ${activeTab === 'focus' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab(activeTab === 'focus' ? 'daily' : 'focus')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <span>⏱️</span> Pomodoro Timer
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div style={{
          padding: '0.75rem 1.2rem',
          borderRadius: '10px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#10b981',
          marginBottom: '1.2rem',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          {feedbackMsg}
        </div>
      )}

      {/* Overview Stats Bar */}
      <div className="grid grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>🎯</div>
          <div>
            <div className="stat-value">{completedTodayCount} / {dailyTasks.length}</div>
            <div className="stat-label">Tasks Done for Date</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>⏱️</div>
          <div>
            <div className="stat-value">{completedDailyMinutes}m / {totalDailyMinutes}m</div>
            <div className="stat-label">Study Time Scheduled</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>🔥</div>
          <div>
            <div className="stat-value">{user?.streak || 0} Days</div>
            <div className="stat-label">Current Streak</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>⭐</div>
          <div>
            <div className="stat-value">{user?.xp || 0} XP</div>
            <div className="stat-label">Total Experience</div>
          </div>
        </div>
      </div>

      {/* Main Mode View */}
      {activeTab === 'ai_generator' ? (
        /* AI Schedule Generator Panel */
        <div style={{
          background: 'var(--card-bg, rgba(255,255,255,0.04))',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          padding: '1.8rem',
          marginBottom: '2rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>✨</span> AI Weekly Study Schedule Generator
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                Provide your target subjects and available study hours, and let AI build a balanced timetable.
              </p>
            </div>
            <button className="btn btn-sm btn-ghost" onClick={() => setActiveTab('daily')}>
              ✕ Close
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Select Subjects:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {SUBJECTS_LIST.map(s => {
                  const isSel = aiSelectedSubjects.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        if (isSel) {
                          setAiSelectedSubjects(aiSelectedSubjects.filter(id => id !== s.id));
                        } else {
                          setAiSelectedSubjects([...aiSelectedSubjects, s.id]);
                        }
                      }}
                      style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        border: isSel ? '1px solid var(--primary)' : '1px solid var(--border)',
                        background: isSel ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                        color: isSel ? 'var(--primary)' : 'inherit',
                        cursor: 'pointer',
                      }}
                    >
                      {s.icon} {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Study Hours Per Day: ({aiHoursPerDay} hrs)
              </label>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={aiHoursPerDay}
                onChange={(e) => setAiHoursPerDay(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Target Knowledge Level:
              </label>
              <select
                value={aiLevel}
                onChange={(e) => setAiLevel(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'inherit',
                }}
              >
                <option value="Beginner">Beginner (Foundations first)</option>
                <option value="Intermediate">Intermediate (Balanced)</option>
                <option value="Exam Intensive">Exam Intensive (High revision/mock)</option>
              </select>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleGenerateAiPlan}
            disabled={aiLoading}
            style={{ width: '100%', padding: '0.8rem', fontWeight: '600' }}
          >
            {aiLoading ? 'Generating Optimized Schedule...' : '🪄 Generate 7-Day Study Schedule'}
          </button>

          {/* Render Schedule Preview if generated */}
          {generatedSchedule && (
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>📅 AI Generated Weekly Plan</h4>
                <button className="btn btn-primary btn-sm" onClick={handleApplyAiPlan}>
                  📥 Add to My Schedule
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                {generatedSchedule.map((dayPlan, idx) => (
                  <div key={idx} style={{ padding: '0.8rem', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
                      {dayPlan.day || `Day ${idx + 1}`}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {dayPlan.tasks?.map((t, tidx) => (
                        <div key={tidx} style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.04)' }}>
                          <div style={{ fontWeight: '500' }}>{t.topic || t.subject}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{t.duration}m · {t.type}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : activeTab === 'focus' ? (
        /* Focus Pomodoro Timer Panel */
        <div style={{
          background: 'var(--card-bg, rgba(255,255,255,0.04))',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          padding: '2.5rem',
          textAlign: 'center',
          marginBottom: '2rem',
          maxWidth: '560px',
          margin: '0 auto 2rem auto',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏱️</div>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Focus Study Session</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Study without distractions. Complete a 25m session to earn 25 XP!
          </p>

          <div style={{
            fontSize: '4.5rem',
            fontWeight: '800',
            fontFamily: 'monospace',
            letterSpacing: '2px',
            color: timerActive ? 'var(--primary, #6366f1)' : 'inherit',
            margin: '1rem 0',
          }}>
            {formatTimerDisplay(timerSeconds)}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <button className="btn btn-sm btn-ghost" onClick={() => handleStartTimer(15)}>15 Min</button>
            <button className="btn btn-sm btn-ghost" onClick={() => handleStartTimer(25)}>25 Min (Pomodoro)</button>
            <button className="btn btn-sm btn-ghost" onClick={() => handleStartTimer(45)}>45 Min (Deep Work)</button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem' }}>
            {!timerActive ? (
              <button className="btn btn-primary" onClick={() => setTimerActive(true)} style={{ minWidth: '130px', padding: '0.7rem' }}>
                ▶ Start Focus
              </button>
            ) : (
              <button className="btn btn-secondary" onClick={() => setTimerActive(false)} style={{ minWidth: '130px', padding: '0.7rem' }}>
                ⏸ Pause
              </button>
            )}
            <button
              className="btn btn-ghost"
              onClick={() => {
                setTimerActive(false);
                setTimerSeconds(timerInitialMinutes * 60);
              }}
            >
              🔄 Reset
            </button>
          </div>
        </div>
      ) : null}

      {/* Date Navigation Strip & Tasks Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Date Selector / Filter Sidebar */}
        <div style={{
          background: 'var(--card-bg, rgba(255,255,255,0.03))',
          borderRadius: '14px',
          border: '1px solid var(--border)',
          padding: '1.2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>
              Select Date:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.8rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--background)',
                color: 'inherit',
                fontSize: '0.9rem',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <button
              className={`btn btn-sm ${selectedDate === todayStr ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setSelectedDate(todayStr)}
              style={{ justifyContent: 'flex-start' }}
            >
              📌 Today ({formatDate(todayStr)})
            </button>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => {
                const tmrw = new Date();
                tmrw.setDate(tmrw.getDate() + 1);
                setSelectedDate(tmrw.toISOString().split('T')[0]);
              }}
              style={{ justifyContent: 'flex-start' }}
            >
              ⏩ Tomorrow
            </button>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />

          {/* Direct Shortcuts */}
          <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>
            STUDY TOOLS SHORTCUTS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <Link href="/notes" className="btn btn-sm btn-ghost" style={{ justifyContent: 'flex-start', fontSize: '0.8rem' }}>
              📒 My Study Notes
            </Link>
            <Link href="/flashcards" className="btn btn-sm btn-ghost" style={{ justifyContent: 'flex-start', fontSize: '0.8rem' }}>
              🃏 Revision Flashcards
            </Link>
            <Link href="/coding" className="btn btn-sm btn-ghost" style={{ justifyContent: 'flex-start', fontSize: '0.8rem' }}>
              🐍 Python Workspace
            </Link>
            <Link href="/quizzes" className="btn btn-sm btn-ghost" style={{ justifyContent: 'flex-start', fontSize: '0.8rem' }}>
              📝 Practice Quizzes
            </Link>
          </div>
        </div>

        {/* Scheduled Tasks List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
              Tasks for {selectedDate === todayStr ? 'Today' : formatDate(selectedDate)}
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {dailyTasks.length} task{dailyTasks.length === 1 ? '' : 's'} scheduled
            </span>
          </div>

          {dailyTasks.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1.5rem',
              background: 'var(--card-bg, rgba(255,255,255,0.02))',
              borderRadius: '14px',
              border: '1px dashed var(--border)',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>☕</div>
              <h4>No tasks scheduled for this day</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.2rem' }}>
                Add a study objective, quiz, or python challenge to stay on track.
              </p>
              <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
                ➕ Add Task for {selectedDate}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {dailyTasks.map(task => {
                const subj = SUBJECTS_LIST.find(s => s.id === task.subject) || { icon: '📚', label: task.subject, color: '#64748b' };
                const typeObj = TASK_TYPES.find(t => t.id === task.type) || { label: '📖 Study' };

                return (
                  <div
                    key={task.id}
                    onClick={() => toggleTaskCompleted(task.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem 1.2rem',
                      borderRadius: '12px',
                      border: task.completed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border)',
                      background: task.completed ? 'rgba(16, 185, 129, 0.05)' : 'var(--card-bg, rgba(255,255,255,0.03))',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {/* Checkbox Icon */}
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      border: task.completed ? '2px solid #10b981' : '2px solid var(--border)',
                      background: task.completed ? '#10b981' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      flexShrink: 0,
                    }}>
                      {task.completed ? '✓' : ''}
                    </div>

                    {/* Task Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'rgba(255,255,255,0.07)', color: subj.color }}>
                          {subj.icon} {subj.label}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {typeObj.label}
                        </span>
                        {task.priority === 'high' && (
                          <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.35rem', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
                            HIGH
                          </span>
                        )}
                      </div>

                      <div style={{
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? 'var(--text-muted)' : 'inherit',
                      }}>
                        {task.title}
                      </div>
                    </div>

                    {/* Duration & Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        ⏱️ {task.duration}m
                      </span>
                      <button
                        onClick={(e) => handleDeleteTask(task.id, e)}
                        title="Delete task"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--text-muted)',
                          fontSize: '0.9rem',
                          padding: '0.2rem',
                          opacity: 0.6,
                        }}
                        onMouseEnter={(e) => e.target.style.opacity = 1}
                        onMouseLeave={(e) => e.target.style.opacity = 0.6}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem',
        }}>
          <form
            onSubmit={handleAddTask}
            style={{
              background: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '500px',
              padding: '1.8rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>➕ Add Study Task</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                Task Title / Topic:
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Solve 10 Calculus problems or Review Python Loops"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--card-bg, rgba(255,255,255,0.05))',
                  color: 'inherit',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                  Subject:
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--background)',
                    color: 'inherit',
                  }}
                >
                  {SUBJECTS_LIST.map(s => (
                    <option key={s.id} value={s.id}>{s.icon} {s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                  Category / Type:
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--background)',
                    color: 'inherit',
                  }}
                >
                  {TASK_TYPES.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.8rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                  Date:
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.5rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--background)',
                    color: 'inherit',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                  Duration (mins):
                </label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  step="5"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.6rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--background)',
                    color: 'inherit',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                  Priority:
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.5rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--background)',
                    color: 'inherit',
                    fontSize: '0.85rem',
                  }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function PlannerPage() {
  return (
    <Suspense fallback={<div className="page-container"><p>Loading Study Planner...</p></div>}>
      <PlannerContent />
    </Suspense>
  );
}
