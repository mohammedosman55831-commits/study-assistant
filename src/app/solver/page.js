'use client';

import { useState } from 'react';

const EXAMPLE_QUERIES = [
  { label: 'cos(90Â°) + sin(90Â°)', type: 'trig', query: 'cos(90Â°) + sin(90Â°)' },
  { label: 'sin(30Â°)', type: 'trig', query: 'sin(30Â°)' },
  { label: 'cos(60Â°)', type: 'trig', query: 'cos(60Â°)' },
  { label: 'tan(45Â°)', type: 'trig', query: 'tan(45Â°)' },
  { label: '2sin(30Â°) + cos(60Â°)', type: 'trig', query: '2sin(30Â°) + cos(60Â°)' },
  { label: 'sinâ»Â¹(0.5)', type: 'trig', query: 'sinâ»Â¹(0.5)' },
  { label: '25% of 80', type: 'math', query: '25% of 80' },
  { label: 'x + 5 = 12', type: 'algebra', query: 'x + 5 = 12' },
];

export default function SolverPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [problemType, setProblemType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSolve(e, overrideText = null) {
    if (e) e.preventDefault();

    const textToSolve = (overrideText !== null ? overrideText : question).trim();
    if (!textToSolve) return;

    setLoading(true);
    setAnswer('');
    setProblemType(null);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: textToSolve,
            },
          ],
          type: 'solver',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setAnswer(data.content);
      if (data.problemType) {
        setProblemType(data.problemType);
      } else if (data.content.includes('PROBLEM TYPE: Trigonometry')) {
        setProblemType('trigonometry');
      } else if (data.content.includes('PROBLEM TYPE: Arithmetic')) {
        setProblemType('arithmetic');
      } else if (data.content.includes('PROBLEM TYPE: Algebra')) {
        setProblemType('algebra');
      } else if (data.content.includes('Furqan NovaAI')) {
        setProblemType('tutor');
      }
    } catch (error) {
      setAnswer('âŒ Sorry, something went wrong. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleExampleClick(q) {
    setQuestion(q);
    handleSolve(null, q);
  }

  function copyAnswer() {
    if (!answer) return;
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function getCategoryBadge(type) {
    switch (type) {
      case 'trigonometry':
        return { label: 'ðŸ“ Trigonometry', bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' };
      case 'arithmetic':
        return { label: 'ðŸ”¢ Arithmetic', bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' };
      case 'algebra':
        return { label: 'ðŸ§® Algebra', bg: '#fdf4ff', color: '#9333ea', border: '#f5d0fe' };
      case 'tutor':
        return { label: 'ðŸ¤– Furqan NovaAI Explanation', bg: '#fffbeb', color: '#d97706', border: '#fde68a' };
      default:
        return null;
    }
  }

  const badge = getCategoryBadge(problemType);

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        padding: '40px 20px',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '860px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '2rem' }}>ðŸ§ </span>
            <h1 style={{ color: '#0f172a', margin: 0, fontSize: '1.875rem', fontWeight: '700' }}>
              Question Solver
            </h1>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                padding: '4px 10px',
                borderRadius: '9999px',
                background: '#e0e7ff',
                color: '#4338ca',
                letterSpacing: '0.025em',
              }}
            >
              Trig & Math Engine
            </span>
          </div>

          <p style={{ color: '#64748b', margin: 0, fontSize: '1rem', lineHeight: '1.5' }}>
            Enter any math problem, trigonometry expression, or concept question for an instant, step-by-step solution.
          </p>
        </div>

        {/* Quick Example Chips */}
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              fontSize: '0.8125rem',
              fontWeight: '600',
              color: '#64748b',
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            âš¡ Quick Examples (Click to Solve):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {EXAMPLE_QUERIES.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleExampleClick(item.query)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  color: '#334155',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#6366f1';
                  e.currentTarget.style.color = '#4f46e5';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.color = '#334155';
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Input Form */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0',
            marginBottom: '28px',
          }}
        >
          <form onSubmit={handleSolve}>
            <label
              htmlFor="solver-input"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#334155',
                marginBottom: '8px',
              }}
            >
              Enter Problem or Expression:
            </label>

            <textarea
              id="solver-input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. cos(90Â°) + sin(90Â°), sin(30Â°), 2sin(30Â°) + cos(60Â°), arcsin(0.5), 25% of 80, or x + 5 = 12..."
              rows={4}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '12px',
                border: '1.5px solid #cbd5e1',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box',
                outline: 'none',
                color: '#0f172a',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
              onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
            />

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '16px',
              }}
            >
              <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                Supports degrees (e.g. <code>90Â°</code> or <code>90</code>) & radians (e.g. <code>pi/2 rad</code>)
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                {question && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuestion('');
                      setAnswer('');
                      setProblemType(null);
                    }}
                    style={{
                      padding: '10px 18px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      background: '#f1f5f9',
                      color: '#475569',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                    }}
                  >
                    Clear
                  </button>
                )}

                <button
                  type="submit"
                  disabled={loading || !question.trim()}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '0.9375rem',
                    cursor: 'pointer',
                    opacity: loading || !question.trim() ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
                    transition: 'opacity 0.2s',
                  }}
                >
                  {loading ? 'ðŸ¤” Calculating...' : 'ðŸš€ Solve Step-by-Step'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Answer Display */}
        {answer && (
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.06), 0 8px 10px -6px rgba(0,0,0,0.04)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
            }}
          >
            {/* Answer Header Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 24px',
                background: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '1rem' }}>
                  Solution & Steps
                </span>
                {badge && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      padding: '3px 10px',
                      borderRadius: '6px',
                      background: badge.bg,
                      color: badge.color,
                      border: `1px solid ${badge.border}`,
                    }}
                  >
                    {badge.label}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={copyAnswer}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontSize: '0.8125rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                {copied ? 'âœ… Copied!' : 'ðŸ“‹ Copy Solution'}
              </button>
            </div>

            {/* Answer Content */}
            <div
              style={{
                padding: '28px',
                color: '#1e293b',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.7',
                fontSize: '0.96rem',
              }}
            >
              {answer}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
