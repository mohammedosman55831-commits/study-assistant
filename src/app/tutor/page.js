'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SyllabusSelector from '@/components/SyllabusSelector';
import {
  getSubjectById,
  getChapterById,
  SYLLABUS_ACTIONS,
  SYLLABUS_STREAMS,
  SYLLABUS_YEARS,
} from '@/lib/syllabus-data';

// ============================================================
// RICH MARKDOWN & MATH FORMATTER COMPONENT
// ============================================================
function FormattedMessage({ content }) {
  if (!content) return null;

  // Split into lines for structured block rendering
  const lines = content.split('\n');
  const elements = [];
  let tableRows = [];
  let inCodeBlock = false;
  let codeBlockContent = [];
  let codeBlockLang = '';

  const flushTable = (key) => {
    if (tableRows.length === 0) return null;
    const rows = [...tableRows];
    tableRows = [];

    // Filter out markdown divider rows like |---|---|
    const validRows = rows.filter((r) => !r.every((cell) => cell.replace(/[-:]/g, '').trim() === ''));
    if (validRows.length === 0) return null;

    const [headerRow, ...bodyRows] = validRows;

    return (
      <div key={`table-${key}`} style={{ overflowX: 'auto', margin: '14px 0' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px',
            background: 'var(--bg-secondary, #ffffff)',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid var(--border, #e2e5f0)',
          }}
        >
          <thead>
            <tr style={{ background: 'var(--bg-tertiary, #f0f2f8)' }}>
              {headerRow.map((cell, cIdx) => (
                <th
                  key={cIdx}
                  style={{
                    padding: '9px 12px',
                    textAlign: 'left',
                    fontWeight: 700,
                    borderBottom: '2px solid var(--border, #e2e5f0)',
                    color: 'var(--text-primary, #1a1d2e)',
                  }}
                >
                  {formatInlineText(cell)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, rIdx) => (
              <tr
                key={rIdx}
                style={{
                  background: rIdx % 2 === 0 ? 'transparent' : 'var(--bg-tertiary, #f8f9fd)',
                  borderBottom: '1px solid var(--border-light, #eef0f6)',
                }}
              >
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    style={{
                      padding: '8px 12px',
                      color: 'var(--text-secondary, #5a5f7a)',
                    }}
                  >
                    {formatInlineText(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <div
            key={`code-${i}`}
            style={{
              margin: '12px 0',
              padding: '14px 16px',
              borderRadius: '10px',
              background: '#0d1117',
              color: '#e6edf3',
              fontFamily: 'var(--font-mono), Consolas, monospace',
              fontSize: '12.5px',
              lineHeight: '1.6',
              overflowX: 'auto',
              border: '1px solid #30363d',
            }}
          >
            <pre style={{ margin: 0 }}>{codeBlockContent.join('\n')}</pre>
          </div>
        );
        inCodeBlock = false;
        codeBlockContent = [];
      } else {
        const flushed = flushTable(i);
        if (flushed) elements.push(flushed);
        inCodeBlock = true;
        codeBlockLang = line.trim().slice(3);
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Markdown Table rows
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const cells = line
        .split('|')
        .slice(1, -1)
        .map((c) => c.trim());
      tableRows.push(cells);
      continue;
    } else if (tableRows.length > 0) {
      const flushed = flushTable(i);
      if (flushed) elements.push(flushed);
    }

    // Headers
    if (line.startsWith('### ')) {
      elements.push(
        <h3
          key={`h3-${i}`}
          style={{
            fontSize: '16px',
            fontWeight: 800,
            margin: '14px 0 6px 0',
            color: 'var(--text-primary, #1a1d2e)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {formatInlineText(line.slice(4))}
        </h3>
      );
      continue;
    }

    if (line.startsWith('## ')) {
      elements.push(
        <h2
          key={`h2-${i}`}
          style={{
            fontSize: '18px',
            fontWeight: 800,
            margin: '16px 0 8px 0',
            color: 'var(--text-primary, #1a1d2e)',
          }}
        >
          {formatInlineText(line.slice(3))}
        </h2>
      );
      continue;
    }

    // Horizontal Rule
    if (line.trim() === '---' || line.trim() === '***') {
      elements.push(
        <hr
          key={`hr-${i}`}
          style={{
            border: 'none',
            borderTop: '1px solid var(--border-light, #eef0f6)',
            margin: '14px 0',
          }}
        />
      );
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      elements.push(
        <div
          key={`quote-${i}`}
          style={{
            padding: '10px 14px',
            margin: '10px 0',
            borderRadius: '8px',
            background: 'var(--bg-tertiary, #f0f2f8)',
            borderLeft: '4px solid var(--accent-primary, #6366f1)',
            fontSize: '13px',
            fontStyle: 'italic',
            color: 'var(--text-primary, #1a1d2e)',
          }}
        >
          {formatInlineText(line.slice(2))}
        </div>
      );
      continue;
    }

    // Bullet points (* or -)
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      elements.push(
        <div
          key={`bullet-${i}`}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            margin: '4px 0 4px 8px',
            fontSize: '13.5px',
            lineHeight: '1.6',
            color: 'var(--text-primary, #172033)',
          }}
        >
          <span style={{ color: 'var(--accent-primary, #6366f1)', fontWeight: 700 }}>â€¢</span>
          <div>{formatInlineText(line.trim().slice(2))}</div>
        </div>
      );
      continue;
    }

    // Numbered lists (1. , 2. )
    const numMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      elements.push(
        <div
          key={`num-${i}`}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            margin: '4px 0 4px 8px',
            fontSize: '13.5px',
            lineHeight: '1.6',
            color: 'var(--text-primary, #172033)',
          }}
        >
          <span
            style={{
              minWidth: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'var(--accent-primary-light, rgba(99,102,241,0.12))',
              color: 'var(--accent-primary, #6366f1)',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '2px',
            }}
          >
            {numMatch[1]}
          </span>
          <div style={{ flex: 1 }}>{formatInlineText(numMatch[2])}</div>
        </div>
      );
      continue;
    }

    // Empty lines
    if (!line.trim()) {
      elements.push(<div key={`space-${i}`} style={{ height: '6px' }} />);
      continue;
    }

    // Standard Paragraph
    elements.push(
      <p
        key={`p-${i}`}
        style={{
          margin: '4px 0',
          fontSize: '13.5px',
          lineHeight: '1.65',
          color: 'var(--text-primary, #172033)',
        }}
      >
        {formatInlineText(line)}
      </p>
    );
  }

  if (tableRows.length > 0) {
    const flushed = flushTable('end');
    if (flushed) elements.push(flushed);
  }

  return <div style={{ wordBreak: 'break-word' }}>{elements}</div>;
}

// Helper to format inline bold, formulas ($...$), and inline code (`...`)
function formatInlineText(text) {
  if (!text) return '';

  // Split by inline code, math formulas, and bold
  const parts = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    // 1. Math block or inline math $...$
    const mathMatch = remaining.match(/^(\$\$?)(.+?)\1/);
    if (mathMatch) {
      parts.push(
        <span
          key={`math-${keyIdx++}`}
          style={{
            fontFamily: 'var(--font-mono), Consolas, monospace',
            background: 'rgba(99, 102, 241, 0.08)',
            color: 'var(--accent-primary, #6366f1)',
            padding: '2px 6px',
            borderRadius: '5px',
            fontSize: '12.5px',
            fontWeight: 600,
            display: 'inline-block',
            margin: '0 2px',
          }}
        >
          {mathMatch[2].replace(/\\text\{/g, '').replace(/\}/g, '')}
        </span>
      );
      remaining = remaining.slice(mathMatch[0].length);
      continue;
    }

    // 2. Inline code `...`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      parts.push(
        <code
          key={`code-${keyIdx++}`}
          style={{
            fontFamily: 'var(--font-mono), monospace',
            background: 'var(--bg-tertiary, #f0f2f8)',
            color: 'var(--accent-primary, #6366f1)',
            padding: '2px 5px',
            borderRadius: '4px',
            fontSize: '12px',
          }}
        >
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // 3. Bold text **...**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      parts.push(
        <strong key={`bold-${keyIdx++}`} style={{ fontWeight: 700, color: 'var(--text-primary, #1a1d2e)' }}>
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Regular text chunk up to next special symbol
    const nextSpecial = remaining.search(/(\$|`|\*\*)/);
    if (nextSpecial === -1) {
      parts.push(remaining);
      break;
    } else if (nextSpecial === 0) {
      parts.push(remaining[0]);
      remaining = remaining.slice(1);
    } else {
      parts.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    }
  }

  return parts;
}

// Clean markdown syntax for speech synthesis
function cleanTextForSpeech(text) {
  if (!text) return '';
  return text
    .replace(/###\s+/g, '')
    .replace(/##\s+/g, '')
    .replace(/\*\*/g, '')
    .replace(/```[\s\S]*?```/g, 'Code example omitted.')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\$\$?(.+?)\$\$?/g, '$1')
    .replace(/\|/g, ' ')
    .replace(/---/g, '')
    .replace(/>\s+/g, '')
    .trim();
}

function TutorContent() {
  const searchParams = useSearchParams();

  // Syllabus context state
  const [year, setYear] = useState('1st_year');
  const [stream, setStream] = useState('mpc');
  const [subject, setSubject] = useState('physics');
  const [chapter, setChapter] = useState('mechanics');
  const [topic, setTopic] = useState("Newton's Laws of Motion and Friction");
  const [showSyllabusSelector, setShowSyllabusSelector] = useState(true);

  const initialWelcomeMessage = {
    role: 'assistant',
    content:
      "ðŸ‘‹ Hi! I'm your Furqan NovaAI. Select your Stream, Year, Subject, and Topic above, or ask me any question directly! Try clicking one of the quick suggestions below.",
  };

  const [messages, setMessages] = useState([initialWelcomeMessage]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('standard');
  const [loading, setLoading] = useState(false);

  // Message action states
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [speakingIndex, setSpeakingIndex] = useState(null);

  const messagesEndRef = useRef(null);

  // Restore messages from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('studyai_tutor_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save messages to localStorage whenever updated
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('studyai_tutor_messages', JSON.stringify(messages));
      } catch {
        // Ignore localStorage quota errors
      }
    }
  }, [messages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

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

    // Stop speaking if active
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
    }

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
          content: `âŒ ${error.message}`,
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

  const handleCopyMessage = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleToggleSpeech = (text, idx) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (speakingIndex === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = cleanTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    setSpeakingIndex(idx);
    window.speechSynthesis.speak(utterance);
  };

  const handleNewConversation = () => {
    const confirmed = window.confirm(
      'Start a new conversation? This will clear the current chat history while preserving your stream and topic settings.'
    );
    if (confirmed) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setSpeakingIndex(null);
      setMessages([initialWelcomeMessage]);
      try {
        localStorage.removeItem('studyai_tutor_messages');
      } catch {}
    }
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
                boxShadow: 'var(--shadow-accent, 0 4px 12px rgba(99,102,241,0.25))',
              }}
            >
              ðŸ¤–
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>
                Furqan NovaAI
              </h1>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary, #5a5f7a)' }}>
                MPC â€¢ BiPC â€¢ MEC â€¢ CEC (1st & 2nd Year)
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleNewConversation}
              className="btn btn-ghost btn-sm"
              style={{
                fontSize: '12px',
                padding: '8px 12px',
                border: '1px solid var(--border, #d8dce8)',
                borderRadius: '10px',
              }}
              title="Start a new conversation and clear chat history"
            >
              ðŸ—‘ï¸ New Chat
            </button>

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
              ðŸ“š {showSyllabusSelector ? 'Hide Syllabus Drawer' : 'Change Stream & Topic'}
            </button>

            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              aria-label="Select tutoring pedagogy mode"
              style={{
                padding: '9px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border, #d8dce8)',
                background: 'var(--bg-secondary, #ffffff)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="standard">ðŸ“š Standard Mode</option>
              <option value="beginner">ðŸŒ± Simple / Beginner</option>
              <option value="deep">ðŸ§  Deep Learning</option>
              <option value="exam">ðŸŽ¯ Exam Mode</option>
              <option value="socratic">ðŸ’¡ Socratic Mode</option>
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
                {activeYearObj?.shortLabel} â€¢ {activeStreamObj?.name} â€¢ {activeSubjectObj?.name} â†’ {activeChapterObj?.name}
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
                âš¡ Try: Newton&apos;s Laws in Simple Terms
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div
            style={{
              minHeight: '380px',
              maxHeight: '560px',
              overflowY: 'auto',
              padding: '16px',
              background: 'var(--bg-tertiary, #f8f9fd)',
              borderRadius: '16px',
              marginBottom: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {messages.map((message, index) => {
              const isUser = message.role === 'user';
              const isSpeaking = speakingIndex === index;
              const isCopied = copiedIndex === index;

              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '100%',
                  }}
                >
                  {/* Sender Badge */}
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--text-tertiary, #8a8fa6)',
                      marginBottom: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>{isUser ? 'ðŸ‘¤ You' : 'ðŸ¤– Furqan NovaAI'}</span>
                  </div>

                  {/* Message Bubble Card */}
                  <div
                    style={{
                      maxWidth: isUser ? '85%' : '92%',
                      padding: '16px 20px',
                      borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      background: isUser ? 'var(--accent-primary, #6366f1)' : 'var(--bg-card, #ffffff)',
                      color: isUser ? '#ffffff' : 'var(--text-primary, #172033)',
                      boxShadow: isUser ? 'var(--shadow-sm)' : '0 2px 14px rgba(0,0,0,0.06)',
                      border: isUser ? 'none' : '1px solid var(--border, #e2e5f0)',
                    }}
                  >
                    {isUser ? (
                      <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '14px' }}>
                        {message.content}
                      </div>
                    ) : (
                      <FormattedMessage content={message.content} />
                    )}

                    {/* AI Response Action Toolbar (Copy & Voice) */}
                    {!isUser && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginTop: '12px',
                          paddingTop: '10px',
                          borderTop: '1px solid var(--border-light, #eef0f6)',
                          flexWrap: 'wrap',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleCopyMessage(message.content, index)}
                          style={{
                            background: 'none',
                            border: '1px solid var(--border, #e2e5f0)',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: 'var(--text-secondary, #5a5f7a)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s ease',
                          }}
                          title="Copy explanation to clipboard"
                        >
                          {isCopied ? 'âœ“ Copied!' : 'ðŸ“‹ Copy'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleSpeech(message.content, index)}
                          style={{
                            background: isSpeaking ? 'rgba(239, 68, 68, 0.1)' : 'none',
                            border: isSpeaking ? '1px solid #ef4444' : '1px solid var(--border, #e2e5f0)',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: isSpeaking ? '#ef4444' : 'var(--text-secondary, #5a5f7a)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s ease',
                          }}
                          title={isSpeaking ? 'Stop voice narration' : 'Listen to this explanation'}
                        >
                          {isSpeaking ? 'â¹ï¸ Stop' : 'ðŸ”Š Listen'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary, #8a8fa6)', marginBottom: '4px' }}>
                  ðŸ¤– Furqan NovaAI
                </div>
                <div
                  style={{
                    padding: '14px 20px',
                    background: 'var(--bg-card, #ffffff)',
                    borderRadius: '18px 18px 18px 4px',
                    color: 'var(--text-secondary, #687386)',
                    boxShadow: '0 2px 14px rgba(0,0,0,0.06)',
                    fontSize: '13.5px',
                    border: '1px solid var(--border, #e2e5f0)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span className="animate-spin">â³</span> Thinking and preparing step-by-step syllabus answer...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Dynamic Follow-up Suggestions Bar */}
          <div style={{ marginBottom: '14px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--text-tertiary, #8a8fa6)',
                textTransform: 'uppercase',
                marginBottom: '6px',
                letterSpacing: '0.5px',
              }}
            >
              Suggested Follow-ups & Actions:
            </div>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              {[
                {
                  label: 'ðŸ’¡ Explain this more simply',
                  prompt: 'Make that simpler and explain in easier words.',
                },
                {
                  label: 'ðŸ“š Give another example',
                  prompt: 'Give me another real-world example of this concept.',
                },
                {
                  label: 'ðŸ§ª Quiz me on this',
                  prompt: 'Quiz me on this concept with a practice question.',
                },
                {
                  label: 'ðŸŽ¯ Show an exam tip',
                  prompt: `What are the most common exam questions and tips for ${topic || 'this topic'}?`,
                },
                {
                  label: 'âš–ï¸ Compare related concepts',
                  prompt: `What is the difference and comparison for key concepts in ${topic || 'this topic'}?`,
                },
              ].map((action) => (
                <button
                  key={action.label}
                  type="button"
                  disabled={loading}
                  onClick={() => executePrompt(action.prompt)}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '16px',
                    border: '1px solid var(--border, #d8dce8)',
                    background: 'var(--bg-secondary, #ffffff)',
                    color: 'var(--text-primary, #172033)',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
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
              placeholder={`Ask a question about ${topic || 'your Intermediate syllabus'} (e.g. 'Why?', 'Explain step 2', 'Give an example')...`}
              disabled={loading}
              style={{
                flex: 1,
                padding: '14px 18px',
                borderRadius: '12px',
                border: '1.5px solid var(--border, #d8dce8)',
                background: 'var(--bg-secondary, #ffffff)',
                color: 'var(--text-primary, #172033)',
                fontSize: '14px',
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
                fontSize: '14px',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !input.trim() ? 0.6 : 1,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: 'var(--shadow-accent, 0 4px 12px rgba(99,102,241,0.25))',
              }}
            >
              {loading ? 'Thinking...' : 'Send ðŸš€'}
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
          Loading Furqan NovaAI...
        </div>
      }
    >
      <TutorContent />
    </Suspense>
  );
}
