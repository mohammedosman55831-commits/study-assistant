'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SyllabusSelector from '@/components/SyllabusSelector';
import {
  getSubjectById,
  getChapterById,
  SYLLABUS_ACTIONS,
  SYLLABUS_STREAMS,
  SYLLABUS_YEARS,
} from '@/lib/syllabus-data';

function TutorContent() {
  const searchParams = useSearchParams();

  // Syllabus context state
  const [year, setYear] = useState('1st_year');
  const [stream, setStream] = useState('mpc');
  const [subject, setSubject] = useState('physics');
  const [chapter, setChapter] = useState('mechanics');
  const [topic, setTopic] = useState("Newton's Laws of Motion and Friction");
  const [showSyllabusSelector, setShowSyllabusSelector] = useState(true);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "👋 Hi! I'm your Intermediate AI Tutor. Select your Stream, Year, Subject, and Topic above, or ask me any question directly! Try clicking 'Simple Explanation' or 'Generate MCQs' below.",
    },
  ]);

  const [input, setInput] = useState('');
  const [mode, setMode] = useState('standard');
  const [loading, setLoading] = useState(false);

  // Sync with searchParams on mount
  useEffect(() => {
    const pYear = searchParams.get('year');
    const pStream = searchParams.get('stream');
    const pSubject = searchParams.get('subject');
    const pChapter = searchParams.get('chapter');
    const pTopic = searchParams.get('topic');
    const pAction = searchParams.get('action');

    if (pYear) setYear(pYear);
    if (pStream) setStream(pStream);
    if (pSubject) setSubject(pSubject);
    if (pChapter) setChapter(pChapter);
    if (pTopic) setTopic(pTopic);

    if (pTopic && pAction) {
      const actObj = SYLLABUS_ACTIONS.find((a) => a.id === pAction) || SYLLABUS_ACTIONS[0];
      const initialPrompt = `${actObj.promptPrefix}${pTopic}`;
      executePrompt(initialPrompt, {
        year: pYear || year,
        stream: pStream || stream,
        subject: pSubject || subject,
        chapter: pChapter || chapter,
        topic: pTopic,
        action: actObj.label,
      });
    }
  }, [searchParams]);

  const activeSubjectObj = getSubjectById(subject);
  const activeChapterObj = getChapterById(subject, year, chapter);
  const activeStreamObj = SYLLABUS_STREAMS.find((s) => s.id === stream);
  const activeYearObj = SYLLABUS_YEARS.find((y) => y.id === year);

  async function executePrompt(promptText, customContext = null) {
    if (!promptText.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: promptText.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    const contextPayload = customContext || {
      year: activeYearObj?.label || '1st Year / Class 11',
      yearBadge: activeYearObj?.badge || '11th',
      stream: activeStreamObj?.name || 'MPC',
      streamFullName: activeStreamObj?.fullName || 'Mathematics, Physics, Chemistry',
      subject: activeSubjectObj?.name || 'Physics',
      chapter: activeChapterObj?.name || 'Mechanics',
      topic: topic || "Newton's Laws",
      action: mode,
    };

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          mode,
          type: 'chat',
          syllabusContext: contextPayload,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: data.content || 'I could not generate a response.',
        },
      ]);
    } catch (error) {
      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: `❌ ${error.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    await executePrompt(input);
  }

  const handleActionSelect = ({ actionId, actionLabel, promptPrefix }) => {
    const promptText = `${promptPrefix}${topic || activeChapterObj?.name || 'this topic'}`;
    executePrompt(promptText, {
      year: activeYearObj?.label || '1st Year / Class 11',
      yearBadge: activeYearObj?.badge || '11th',
      stream: activeStreamObj?.name || 'MPC',
      streamFullName: activeStreamObj?.fullName || '',
      subject: activeSubjectObj?.name || 'Physics',
      chapter: activeChapterObj?.name || 'Mechanics',
      topic: topic || '',
      action: actionLabel,
    });
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary, #f7f8fc)',
        padding: '24px 16px',
        color: 'var(--text-primary, #172033)',
      }}
    >
      <div
        style={{
          maxWidth: '1050px',
          margin: '0 auto',
        }}
      >
        {/* Tutor Header Card */}
        <div
          style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '20px',
            padding: '20px 24px',
            boxShadow: 'var(--shadow-md, 0 8px 30px rgba(0,0,0,0.06))',
            border: '1px solid var(--border, #e2e5f0)',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'var(--accent-gradient, linear-gradient(135deg, #6366f1, #8b5cf6))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: '#ffffff',
              }}
            >
              🤖
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>
                Intermediate AI Tutor
              </h1>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary, #5a5f7a)' }}>
                MPC • BiPC • MEC • CEC (1st & 2nd Year)
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setShowSyllabusSelector(!showSyllabusSelector)}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border, #d8dce8)',
                background: showSyllabusSelector ? 'var(--accent-primary-light, rgba(99,102,241,0.1))' : 'var(--bg-secondary, #ffffff)',
                color: showSyllabusSelector ? 'var(--accent-primary, #6366f1)' : 'var(--text-primary, #1a1d2e)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              📚 {showSyllabusSelector ? 'Hide Syllabus Drawer' : 'Change Stream & Topic'}
            </button>

            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              style={{
                padding: '9px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border, #d8dce8)',
                background: 'var(--bg-secondary, #ffffff)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <option value="standard">📚 Standard</option>
              <option value="beginner">🌱 Simple / Beginner</option>
              <option value="deep">🧠 Deep Learning</option>
              <option value="exam">🎯 Exam Mode</option>
              <option value="socratic">💡 Socratic</option>
            </select>
          </div>
        </div>

        {/* Collapsible Syllabus Selector */}
        {showSyllabusSelector && (
          <SyllabusSelector
            year={year}
            stream={stream}
            subject={subject}
            chapter={chapter}
            topic={topic}
            onYearChange={setYear}
            onStreamChange={setStream}
            onSubjectChange={setSubject}
            onChapterChange={setChapter}
            onTopicChange={setTopic}
            onActionSelect={handleActionSelect}
            compact={true}
          />
        )}

        {/* Chat Card */}
        <div
          style={{
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: 'var(--shadow-md, 0 8px 30px rgba(0,0,0,0.08))',
            border: '1px solid var(--border, #e2e5f0)',
          }}
        >
          {/* Active Context Banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'var(--bg-tertiary, #f0f2f8)',
              fontSize: '12px',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 700, color: 'var(--accent-primary, #6366f1)' }}>Context:</span>
              <span style={{ fontWeight: 600 }}>
                {activeYearObj?.shortLabel} • {activeStreamObj?.name} • {activeSubjectObj?.name} → {activeChapterObj?.name}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() =>
                  executePrompt("Explain Newton's laws of motion in simple terms.")
                }
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border, #d8dce8)',
                  background: 'var(--bg-secondary, #ffffff)',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: 'var(--accent-primary, #6366f1)',
                }}
              >
                ⚡ Try: Newton's Laws in Simple Terms
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div
            style={{
              height: '480px',
              overflowY: 'auto',
              padding: '12px',
              background: 'var(--bg-tertiary, #f8f9fd)',
              borderRadius: '16px',
              marginBottom: '18px',
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '14px',
                }}
              >
                <div
                  style={{
                    maxWidth: '82%',
                    padding: '14px 18px',
                    borderRadius: '16px',
                    background: message.role === 'user' ? 'var(--accent-primary, #6366f1)' : 'var(--bg-card, #ffffff)',
                    color: message.role === 'user' ? '#ffffff' : 'var(--text-primary, #172033)',
                    boxShadow: message.role === 'assistant' ? '0 2px 10px rgba(0,0,0,0.06)' : 'none',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.6',
                    fontSize: '14px',
                  }}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {loading && (
              <div
                style={{
                  padding: '12px 18px',
                  background: 'var(--bg-card, #ffffff)',
                  borderRadius: '16px',
                  display: 'inline-block',
                  color: 'var(--text-secondary, #687386)',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                  fontSize: '14px',
                }}
              >
                🤔 Thinking & preparing Intermediate syllabus answer...
              </div>
            )}
          </div>

          {/* Chat Input Form */}
          <form
            onSubmit={sendMessage}
            style={{
              display: 'flex',
              gap: '10px',
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask a question about ${topic || 'your Intermediate syllabus'}...`}
              disabled={loading}
              style={{
                flex: 1,
                padding: '14px 18px',
                borderRadius: '12px',
                border: '1px solid var(--border, #d8dce8)',
                background: 'var(--bg-secondary, #ffffff)',
                color: 'var(--text-primary, #172033)',
                fontSize: '15px',
                outline: 'none',
              }}
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                padding: '14px 24px',
                border: 'none',
                borderRadius: '12px',
                background: 'var(--accent-primary, #6366f1)',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '15px',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !input.trim() ? 0.6 : 1,
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? '...' : 'Send 🚀'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function TutorPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '40px', textAlign: 'center' }}>
          Loading Intermediate AI Tutor...
        </div>
      }
    >
      <TutorContent />
    </Suspense>
  );
}