'use client';

import { useState } from 'react';
import {
  SYLLABUS_YEARS,
  SYLLABUS_STREAMS,
  SYLLABUS_ACTIONS,
  getSubjectsForStream,
  getChaptersForSubject,
  getTopicsForChapter,
  getSubjectById,
  getChapterById,
} from '@/lib/syllabus-data';

export default function SyllabusSelector({
  year = '1st_year',
  stream = 'mpc',
  subject = 'physics',
  chapter = '',
  topic = '',
  onYearChange,
  onStreamChange,
  onSubjectChange,
  onChapterChange,
  onTopicChange,
  onActionSelect,
  compact = false,
}) {
  const [isActionsOpen, setIsActionsOpen] = useState(true);

  // Available subjects for the stream
  const availableSubjects = getSubjectsForStream(stream);

  // Default subject fallback if current subject is not in this stream
  const activeSubjectId = availableSubjects.some((s) => s.id === subject)
    ? subject
    : availableSubjects[0]?.id || 'physics';

  // Available chapters for the subject & year
  const availableChapters = getChaptersForSubject(activeSubjectId, year);
  const activeChapterId = availableChapters.some((c) => c.id === chapter)
    ? chapter
    : availableChapters[0]?.id || '';

  // Available topics for the chapter
  const availableTopics = getTopicsForChapter(activeSubjectId, year, activeChapterId);
  const activeTopicName = topic || availableTopics[0] || '';

  const activeSubjectObj = getSubjectById(activeSubjectId);
  const activeChapterObj = getChapterById(activeSubjectId, year, activeChapterId);

  const handleStreamSelect = (streamId) => {
    onStreamChange?.(streamId);
    const newSubjects = getSubjectsForStream(streamId);
    if (newSubjects.length > 0) {
      const newSubjectId = newSubjects[0].id;
      onSubjectChange?.(newSubjectId);
      const newChapters = getChaptersForSubject(newSubjectId, year);
      if (newChapters.length > 0) {
        onChapterChange?.(newChapters[0].id);
        const newTopics = newChapters[0].topics || [];
        onTopicChange?.(newTopics[0] || '');
      }
    }
  };

  const handleYearSelect = (yearId) => {
    onYearChange?.(yearId);
    const newChapters = getChaptersForSubject(activeSubjectId, yearId);
    if (newChapters.length > 0) {
      onChapterChange?.(newChapters[0].id);
      const newTopics = newChapters[0].topics || [];
      onTopicChange?.(newTopics[0] || '');
    }
  };

  const handleSubjectSelect = (subId) => {
    onSubjectChange?.(subId);
    const newChapters = getChaptersForSubject(subId, year);
    if (newChapters.length > 0) {
      onChapterChange?.(newChapters[0].id);
      const newTopics = newChapters[0].topics || [];
      onTopicChange?.(newTopics[0] || '');
    }
  };

  const handleChapterSelect = (chapId) => {
    onChapterChange?.(chapId);
    const newTopics = getTopicsForChapter(activeSubjectId, year, chapId);
    onTopicChange?.(newTopics[0] || '');
  };

  return (
    <div
      style={{
        background: 'var(--bg-card, #ffffff)',
        borderRadius: compact ? '16px' : '20px',
        padding: compact ? '18px' : '24px',
        border: '1px solid var(--border, #e2e5f0)',
        boxShadow: 'var(--shadow-md, 0 4px 12px rgba(0,0,0,0.05))',
        marginBottom: '20px',
      }}
    >
      {/* Top Header & Year Tabs */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.4rem' }}>📚</span>
          <div>
            <h3 style={{ margin: 0, fontSize: compact ? '16px' : '18px', fontWeight: 700, color: 'var(--text-primary, #1a1d2e)' }}>
              Intermediate Syllabus Navigator
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary, #5a5f7a)' }}>
              Class 11 & 12 • Andhra Pradesh / Telangana / CBSE State Board Aligned
            </p>
          </div>
        </div>

        {/* Year Toggle */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-tertiary, #f0f2f8)',
            padding: '4px',
            borderRadius: '12px',
            gap: '4px',
          }}
        >
          {SYLLABUS_YEARS.map((y) => (
            <button
              key={y.id}
              type="button"
              onClick={() => handleYearSelect(y.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: year === y.id ? 'var(--accent-primary, #6366f1)' : 'transparent',
                color: year === y.id ? '#ffffff' : 'var(--text-secondary, #5a5f7a)',
                fontWeight: year === y.id ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {y.shortLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Stream Tabs (MPC, BiPC, MEC, CEC) */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary, #8a8fa6)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Step 1: Select Stream
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '10px',
          }}
        >
          {SYLLABUS_STREAMS.map((s) => {
            const isSelected = stream === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleStreamSelect(s.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: isSelected ? `2px solid ${s.color}` : '1px solid var(--border, #e2e5f0)',
                  background: isSelected ? `${s.color}15` : 'var(--bg-secondary, #ffffff)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{s.icon.slice(0, 2)}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: isSelected ? s.color : 'var(--text-primary, #1a1d2e)' }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary, #8a8fa6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>
                    {s.fullName}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subject Selector */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary, #8a8fa6)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Step 2: Select Subject
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {availableSubjects.map((sub) => {
            const isSelected = activeSubjectId === sub.id;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => handleSubjectSelect(sub.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: isSelected ? `2px solid ${sub.color}` : '1px solid var(--border, #e2e5f0)',
                  background: isSelected ? sub.color : 'var(--bg-secondary, #ffffff)',
                  color: isSelected ? '#ffffff' : 'var(--text-primary, #1a1d2e)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{sub.icon}</span>
                <span>{sub.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chapter & Topic Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px',
          marginBottom: '16px',
        }}
      >
        {/* Chapters Dropdown / List */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary, #8a8fa6)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Step 3: Select Chapter ({availableChapters.length})
          </label>
          <select
            value={activeChapterId}
            onChange={(e) => handleChapterSelect(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border, #d8dce8)',
              background: 'var(--bg-secondary, #ffffff)',
              color: 'var(--text-primary, #1a1d2e)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {availableChapters.map((chap) => (
              <option key={chap.id} value={chap.id}>
                📖 {chap.name} ({chap.topics.length} topics)
              </option>
            ))}
          </select>
          {activeChapterObj && (
            <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: 'var(--text-secondary, #5a5f7a)' }}>
              {activeChapterObj.description}
            </p>
          )}
        </div>

        {/* Topics Dropdown / List */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary, #8a8fa6)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Step 4: Select Topic
          </label>
          <select
            value={activeTopicName}
            onChange={(e) => onTopicChange?.(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border, #d8dce8)',
              background: 'var(--bg-secondary, #ffffff)',
              color: 'var(--text-primary, #1a1d2e)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {availableTopics.map((top, idx) => (
              <option key={idx} value={top}>
                📌 {top}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Syllabus Path Chip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          background: 'var(--bg-tertiary, #f0f2f8)',
          borderRadius: '12px',
          fontSize: '12px',
          color: 'var(--text-secondary, #5a5f7a)',
          marginBottom: '16px',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontWeight: 700, color: 'var(--accent-primary, #6366f1)' }}>Active Context:</span>
        <span style={{ background: '#ffffff', padding: '2px 8px', borderRadius: '6px', border: '1px solid var(--border, #e2e5f0)', fontWeight: 600 }}>
          {year === '1st_year' ? '1st Year (Class 11)' : '2nd Year (Class 12)'}
        </span>
        <span>›</span>
        <span style={{ background: '#ffffff', padding: '2px 8px', borderRadius: '6px', border: '1px solid var(--border, #e2e5f0)', fontWeight: 600 }}>
          {stream.toUpperCase()}
        </span>
        <span>›</span>
        <span style={{ background: '#ffffff', padding: '2px 8px', borderRadius: '6px', border: '1px solid var(--border, #e2e5f0)', fontWeight: 600 }}>
          {activeSubjectObj?.name}
        </span>
        <span>›</span>
        <span style={{ background: '#ffffff', padding: '2px 8px', borderRadius: '6px', border: '1px solid var(--border, #e2e5f0)', fontWeight: 600 }}>
          {activeChapterObj?.name}
        </span>
        <span>›</span>
        <span style={{ background: '#6366f1', color: '#ffffff', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
          {activeTopicName || 'All Topics'}
        </span>
      </div>

      {/* AI Study Actions Bar */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary, #8a8fa6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ⚡ AI Study Actions (Click to Prompt Tutor)
          </div>
          <button
            type="button"
            onClick={() => setIsActionsOpen(!isActionsOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-primary, #6366f1)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {isActionsOpen ? '▲ Collapse Actions' : '▼ Expand Actions'}
          </button>
        </div>

        {isActionsOpen && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '8px',
            }}
          >
            {SYLLABUS_ACTIONS.map((act) => (
              <button
                key={act.id}
                type="button"
                onClick={() =>
                  onActionSelect?.({
                    actionId: act.id,
                    actionLabel: act.label,
                    stream,
                    year,
                    subject: activeSubjectObj?.name,
                    chapter: activeChapterObj?.name,
                    topic: activeTopicName,
                    promptPrefix: act.promptPrefix,
                  })
                }
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border, #d8dce8)',
                  background: 'var(--bg-secondary, #ffffff)',
                  color: 'var(--text-primary, #1a1d2e)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary, #6366f1)';
                  e.currentTarget.style.background = 'var(--accent-primary-light, rgba(99,102,241,0.08))';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border, #d8dce8)';
                  e.currentTarget.style.background = 'var(--bg-secondary, #ffffff)';
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{act.icon}</span>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{act.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
