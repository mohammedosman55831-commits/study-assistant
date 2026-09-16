'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { store } from '@/lib/store';
import { getMockQuizQuestions } from '@/lib/mock-ai';

const PRESET_QUIZZES = [
  {
    id: 'python_basics',
    title: 'Python Programming Essentials',
    subject: 'programming',
    subjectLabel: 'Python',
    icon: 'ðŸ',
    badgeColor: '#f59e0b',
    difficulty: 'beginner',
    questionCount: 5,
    description: 'Variables, data types, print statements, loops, and functions in Python.',
  },
  {
    id: 'python_data_structures',
    title: 'Python Lists, Tuples & Dicts',
    subject: 'programming',
    subjectLabel: 'Python',
    icon: 'ðŸ“‹',
    badgeColor: '#f59e0b',
    difficulty: 'intermediate',
    questionCount: 5,
    description: 'List manipulation, dictionary lookups, immutability, and set operations.',
  },
  {
    id: 'math_algebra',
    title: 'Algebra & Equations',
    subject: 'math',
    subjectLabel: 'Mathematics',
    icon: 'ðŸ“',
    badgeColor: '#6366f1',
    difficulty: 'intermediate',
    questionCount: 5,
    description: 'Quadratic equations, polynomials, inequalities, and linear systems.',
  },
  {
    id: 'physics_mechanics',
    title: 'Physics: Forces & Laws of Motion',
    subject: 'physics',
    subjectLabel: 'Physics',
    icon: 'âš›ï¸',
    badgeColor: '#3b82f6',
    difficulty: 'intermediate',
    questionCount: 5,
    description: 'Newtonâ€™s three laws, gravity, friction, and kinetic energy calculations.',
  },
  {
    id: 'chemistry_atoms',
    title: 'Chemistry: Atomic Structure & Bonds',
    subject: 'chemistry',
    subjectLabel: 'Chemistry',
    icon: 'ðŸ§ª',
    badgeColor: '#10b981',
    difficulty: 'intermediate',
    questionCount: 5,
    description: 'Protons, neutrons, covalent bonds, ionic bonding, and periodic table trends.',
  },
  {
    id: 'biology_cells',
    title: 'Biology: Cell Structure & Genetics',
    subject: 'biology',
    subjectLabel: 'Biology',
    icon: 'ðŸ§¬',
    badgeColor: '#22c55e',
    difficulty: 'beginner',
    questionCount: 5,
    description: 'Plant and animal cells, DNA, organelles, and basic genetics.',
  },
];

function QuizzesContent() {
  const searchParams = useSearchParams();
  const subjectQuery = searchParams.get('subject') || 'all';

  const [activeTab, setActiveTab] = useState('presets'); // 'presets' | 'custom' | 'history'
  const [selectedCategory, setSelectedCategory] = useState(subjectQuery === 'python' ? 'programming' : 'all');
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pastResults, setPastResults] = useState([]);
  const [user, setUser] = useState(null);

  // Custom AI quiz generator form state
  const [customSubject, setCustomSubject] = useState(subjectQuery === 'python' ? 'Python' : 'Mathematics');
  const [customTopic, setCustomTopic] = useState('');
  const [customDifficulty, setCustomDifficulty] = useState('medium');
  const [customCount, setCustomCount] = useState(5);

  useEffect(() => {
    setUser(store.getUser());
    setPastResults(store.getQuizResults());
  }, []);

  useEffect(() => {
    if (subjectQuery === 'python') {
      setSelectedCategory('programming');
      setCustomSubject('Python');
    }
  }, [subjectQuery]);

  const handleStartPreset = async (quiz) => {
    setActiveQuiz(quiz);
    setCurrentIdx(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: quiz.subject,
          difficulty: quiz.difficulty,
          count: quiz.questionCount || 5,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        } else {
          setQuestions(getMockQuizQuestions(quiz.subject, 5, quiz.difficulty));
        }
      } else {
        setQuestions(getMockQuizQuestions(quiz.subject, 5, quiz.difficulty));
      }
    } catch {
      setQuestions(getMockQuizQuestions(quiz.subject, 5, quiz.difficulty));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCustomQuiz = async (e) => {
    if (e) e.preventDefault();
    const quizTitle = customTopic ? `${customSubject}: ${customTopic}` : `${customSubject} Quiz`;
    const newQuiz = {
      id: `custom_${Date.now()}`,
      title: quizTitle,
      subject: customSubject.toLowerCase(),
      subjectLabel: customSubject,
      icon: customSubject.toLowerCase().includes('python') ? 'ðŸ' : 'ðŸŽ¯',
      badgeColor: '#8b5cf6',
      difficulty: customDifficulty,
      questionCount: customCount,
      description: `Custom quiz generated for ${customSubject} (${customDifficulty}).`,
    };

    setActiveQuiz(newQuiz);
    setCurrentIdx(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: customSubject.toLowerCase(),
          topic: customTopic,
          difficulty: customDifficulty,
          count: customCount,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        } else {
          setQuestions(getMockQuizQuestions(customSubject.toLowerCase(), customCount, customDifficulty));
        }
      } else {
        setQuestions(getMockQuizQuestions(customSubject.toLowerCase(), customCount, customDifficulty));
      }
    } catch {
      setQuestions(getMockQuizQuestions(customSubject.toLowerCase(), customCount, customDifficulty));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qIdx, optIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx,
    }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        correctCount++;
      }
    });

    const finalPercent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    setScore(finalPercent);
    setIsSubmitted(true);

    // Save results and award XP
    const newResults = store.saveQuizResult({
      subject: activeQuiz.subjectLabel || activeQuiz.subject,
      topic: activeQuiz.title,
      score: finalPercent,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
    });

    store.addXP(correctCount * 10 + (finalPercent >= 80 ? 20 : 5));
    if (finalPercent === 100) {
      store.unlockAchievement('quiz_master');
    }
    store.logActivity({
      type: 'quiz',
      title: `Completed ${activeQuiz.title} (${finalPercent}%)`,
    });

    setPastResults(newResults);
    setUser(store.getUser());
  };

  const filteredPresets = PRESET_QUIZZES.filter((q) => {
    if (selectedCategory === 'all') return true;
    return q.subject === selectedCategory;
  });

  return (
    <div className="page-container animate-fade-in" style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '2.2rem' }}>ðŸ“</span>
            <h1 className="page-title" style={{ margin: 0 }}>Quizzes & Knowledge Checks</h1>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                background: 'rgba(139, 92, 246, 0.12)',
                color: '#8b5cf6',
                padding: '4px 10px',
                borderRadius: '9999px',
                border: '1px solid rgba(139, 92, 246, 0.25)',
              }}
            >
              AI-Powered Assessment
            </span>
          </div>
          <p className="page-subtitle" style={{ margin: 0 }}>
            Test your knowledge with pre-built concept quizzes, generate custom AI quizzes, and track your scores.
          </p>
        </div>

        {/* Quick Nav Links */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link href="/coding" className="btn btn-outline btn-sm">
            ðŸ Python Coding Hub
          </Link>
          <Link href="/practice" className="btn btn-ghost btn-sm">
            âœï¸ Practice Center
          </Link>
          <Link href="/tutor" className="btn btn-ghost btn-sm">
            ðŸ¤– Ask Furqan NovaAI
          </Link>
        </div>
      </div>

      {/* Main Mode Tabs */}
      {!activeQuiz && (
        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '20px',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '10px',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: activeTab === 'presets' ? '1px solid var(--accent-primary)' : '1px solid var(--border)',
              background: activeTab === 'presets' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
              color: activeTab === 'presets' ? '#ffffff' : 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            ðŸ“š Standard Topic Quizzes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: activeTab === 'custom' ? '1px solid var(--accent-primary)' : '1px solid var(--border)',
              background: activeTab === 'custom' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
              color: activeTab === 'custom' ? '#ffffff' : 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            âœ¨ Custom AI Quiz Generator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: activeTab === 'history' ? '1px solid var(--accent-primary)' : '1px solid var(--border)',
              background: activeTab === 'history' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
              color: activeTab === 'history' ? '#ffffff' : 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            ðŸ“Š Past Results ({pastResults.length})
          </button>
        </div>
      )}

      {/* QUIZ PLAYER SCREEN */}
      {activeQuiz ? (
        <div className="card animate-fade-in" style={{ padding: '28px' }}>
          {/* Header Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setActiveQuiz(null)}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '12px' }}
              >
                â† Exit Quiz
              </button>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                  {activeQuiz.title}
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                  Question {currentIdx + 1} of {questions.length} Â· {activeQuiz.difficulty}
                </div>
              </div>
            </div>

            {isSubmitted && (
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  padding: '6px 16px',
                  borderRadius: '20px',
                  background: score >= 70 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: score >= 70 ? '#059669' : '#d97706',
                }}
              >
                Score: {score}%
              </div>
            )}
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div className="skeleton" style={{ height: 24, width: '40%', margin: '0 auto 16px' }} />
              <div className="skeleton" style={{ height: 16, width: '60%', margin: '0 auto 12px' }} />
              <div className="skeleton" style={{ height: 16, width: '50%', margin: '0 auto' }} />
              <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                Preparing your quiz questions...
              </p>
            </div>
          ) : questions.length > 0 ? (
            <div>
              {/* Question Index Pills */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {questions.map((_, idx) => {
                  const isAnswered = selectedAnswers[idx] !== undefined;
                  const isCurrent = currentIdx === idx;
                  let bg = 'var(--bg-tertiary)';
                  let color = 'var(--text-primary)';

                  if (isSubmitted) {
                    const isCorrect = selectedAnswers[idx] === questions[idx].correct;
                    bg = isCorrect ? '#10b981' : '#ef4444';
                    color = '#ffffff';
                  } else if (isCurrent) {
                    bg = 'var(--accent-primary)';
                    color = '#ffffff';
                  } else if (isAnswered) {
                    bg = 'var(--accent-primary-light)';
                    color = 'var(--accent-primary)';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentIdx(idx)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        border: isCurrent ? '2px solid var(--accent-primary)' : '1px solid var(--border)',
                        background: bg,
                        color,
                        fontWeight: 700,
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Active Question Box */}
              {(() => {
                const q = questions[currentIdx];
                if (!q) return null;

                return (
                  <div>
                    <div
                      style={{
                        padding: '20px',
                        borderRadius: '12px',
                        background: 'var(--bg-tertiary)',
                        marginBottom: '20px',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-primary)' }}>
                        Question {currentIdx + 1} of {questions.length}
                      </span>
                      <h3 style={{ margin: '8px 0 0 0', fontSize: '16px', fontWeight: 600, lineHeight: '1.5' }}>
                        {q.question}
                      </h3>
                    </div>

                    {/* Options Grid */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                      {q.options?.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[currentIdx] === optIdx;
                        let border = '1px solid var(--border)';
                        let bg = 'var(--bg-secondary)';

                        if (isSubmitted) {
                          if (optIdx === q.correct) {
                            border = '1.5px solid #10b981';
                            bg = 'rgba(16, 185, 129, 0.12)';
                          } else if (isSelected) {
                            border = '1.5px solid #ef4444';
                            bg = 'rgba(239, 68, 68, 0.12)';
                          }
                        } else if (isSelected) {
                          border = '1.5px solid var(--accent-primary)';
                          bg = 'var(--accent-primary-light)';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectOption(currentIdx, optIdx)}
                            disabled={isSubmitted}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '14px 18px',
                              borderRadius: '10px',
                              border,
                              background: bg,
                              color: 'var(--text-primary)',
                              fontSize: '13px',
                              fontWeight: 500,
                              textAlign: 'left',
                              cursor: isSubmitted ? 'default' : 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <span
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '11px',
                                fontWeight: 700,
                                background: isSelected ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                                color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                              }}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span style={{ flex: 1 }}>{opt}</span>
                            {isSubmitted && optIdx === q.correct && (
                              <span style={{ color: '#10b981', fontWeight: 700 }}>âœ“ Correct</span>
                            )}
                            {isSubmitted && isSelected && optIdx !== q.correct && (
                              <span style={{ color: '#ef4444', fontWeight: 700 }}>âœ— Incorrect</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation if submitted */}
                    {isSubmitted && q.explanation && (
                      <div
                        style={{
                          padding: '16px',
                          borderRadius: '10px',
                          background: 'var(--bg-tertiary)',
                          borderLeft: '4px solid var(--accent-primary)',
                          marginBottom: '20px',
                          fontSize: '13px',
                          lineHeight: '1.6',
                        }}
                      >
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}

                    {/* Bottom Navigation */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
                        disabled={currentIdx === 0}
                        className="btn btn-ghost btn-sm"
                      >
                        â† Previous
                      </button>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        {currentIdx < questions.length - 1 ? (
                          <button
                            type="button"
                            onClick={() => setCurrentIdx((p) => Math.min(questions.length - 1, p + 1))}
                            className="btn btn-outline btn-sm"
                          >
                            Next â†’
                          </button>
                        ) : !isSubmitted ? (
                          <button
                            type="button"
                            onClick={handleSubmitQuiz}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '8px 20px', background: '#10b981', borderColor: '#10b981' }}
                          >
                            Submit Quiz âœ“
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No quiz questions available. Please try another quiz preset.
            </div>
          )}
        </div>
      ) : (
        /* TAB 1: PRESET QUIZZES */
        activeTab === 'presets' && (
          <div>
            {/* Category Ribbon */}
            <div
              className="card"
              style={{
                padding: '14px 20px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                Subject:
              </span>
              {[
                { id: 'all', label: 'All Subjects' },
                { id: 'programming', label: 'ðŸ Python' },
                { id: 'math', label: 'ðŸ“ Mathematics' },
                { id: 'physics', label: 'âš›ï¸ Physics' },
                { id: 'chemistry', label: 'ðŸ§ª Chemistry' },
                { id: 'biology', label: 'ðŸ§¬ Biology' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: selectedCategory === cat.id ? '1px solid var(--accent-primary)' : '1px solid var(--border)',
                    background: selectedCategory === cat.id ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                    color: selectedCategory === cat.id ? '#ffffff' : 'var(--text-primary)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Quiz Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
              {filteredPresets.map((quiz) => (
                <div
                  key={quiz.id}
                  className="card card-clickable"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderLeft: `4px solid ${quiz.badgeColor}`,
                    padding: '22px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.8rem' }}>{quiz.icon}</span>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: quiz.badgeColor, textTransform: 'uppercase' }}>
                            {quiz.subjectLabel}
                          </div>
                          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                            {quiz.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 16px 0' }}>
                      {quiz.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                      âš¡ {quiz.questionCount} Questions Â· {quiz.difficulty}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleStartPreset(quiz)}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '12px', padding: '6px 14px' }}
                    >
                      Start Quiz â†’
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      {/* TAB 2: CUSTOM AI QUIZ GENERATOR */}
      {!activeQuiz && activeTab === 'custom' && (
        <div className="card" style={{ padding: '28px', maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '1.8rem' }}>âœ¨</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                Generate Custom AI Quiz
              </h2>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                Target any exact topic or chapter and generate an interactive multiple-choice quiz.
              </p>
            </div>
          </div>

          <form onSubmit={handleGenerateCustomQuiz} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                Subject
              </label>
              <select
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                }}
              >
                <option value="Python">Python Programming</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Economics">Economics</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                Specific Topic / Chapter (Optional)
              </label>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g. Lists and Dictionaries, Quadratic Equations, Newton's Laws..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                  Difficulty
                </label>
                <select
                  value={customDifficulty}
                  onChange={(e) => setCustomDifficulty(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                  }}
                >
                  <option value="easy">Easy / Beginner</option>
                  <option value="medium">Medium / Standard</option>
                  <option value="hard">Hard / Advanced</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                  Number of Questions
                </label>
                <select
                  value={customCount}
                  onChange={(e) => setCustomCount(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                  }}
                >
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ marginTop: '10px', padding: '12px 20px', fontSize: '14px', fontWeight: 600 }}
            >
              ðŸš€ Generate and Start Quiz
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: QUIZ HISTORY */}
      {!activeQuiz && activeTab === 'history' && (
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700 }}>
            ðŸ“Š Past Quiz Results
          </h2>

          {pastResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '10px' }}>ðŸŽ¯</span>
              <p style={{ margin: 0, fontSize: '14px' }}>
                You haven&apos;t completed any quizzes yet! Choose a quiz from the presets to test yourself.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pastResults.map((res, i) => (
                <div
                  key={res.id || i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 18px',
                    borderRadius: '10px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                      {res.topic || res.subject}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                      {res.date ? new Date(res.date).toLocaleDateString() : 'Recent'} Â· {res.subject}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        padding: '4px 12px',
                        borderRadius: '20px',
                        background: res.score >= 70 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: res.score >= 70 ? '#059669' : '#d97706',
                      }}
                    >
                      {res.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function QuizzesPage() {
  return (
    <Suspense fallback={<div className="page-container" style={{ padding: '40px', textAlign: 'center' }}>Loading Quizzes...</div>}>
      <QuizzesContent />
    </Suspense>
  );
}

