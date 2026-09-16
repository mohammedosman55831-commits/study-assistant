'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  SSC_CLASSES,
  SSC_SUBJECTS,
  getSSCChaptersForSubject,
} from '@/lib/ssc-data';
import {
  SYLLABUS_YEARS,
  SYLLABUS_STREAMS,
  getSubjectsForStream,
  getChaptersForSubject,
} from '@/lib/syllabus-data';

export default function SubjectsPage() {
  const router = useRouter();
  const [level, setLevel] = useState('ssc');
  const [selectedClass, setSelectedClass] = useState('class_10');
  const [selectedYear, setSelectedYear] = useState('1st_year');
  const [selectedStream, setSelectedStream] = useState('mpc');
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleStudyTopic = (subjectName, chapterName, topicName) => {
    const params = new URLSearchParams({
      topic: topicName,
      action: 'explain',
    });

    if (level === 'ssc') {
      params.set('level', 'ssc');
      params.set('class', selectedClass);
      params.set('subject', subjectName.toLowerCase().replace(/\s+/g, '_'));
    } else {
      params.set('year', selectedYear);
      params.set('stream', selectedStream);
      params.set('subject', subjectName.toLowerCase().replace(/\s+/g, '_'));
      params.set('chapter', chapterName);
    }

    router.push(`/tutor?${params.toString()}`);
  };

  // Build subject/chapter data based on level
  let subjectsList = [];

  if (level === 'ssc') {
    subjectsList = Object.values(SSC_SUBJECTS).map(sub => ({
      ...sub,
      chapters: getSSCChaptersForSubject(sub.id, selectedClass),
    }));
  } else {
    subjectsList = getSubjectsForStream(selectedStream).map(sub => ({
      ...sub,
      chapters: getChaptersForSubject(sub.id, selectedYear),
    }));
  }

  return (
    <div className="page-container animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{ fontSize: '2rem' }}>ðŸ“š</span>
          <div>
            <h1 className="page-title" style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>
              Subjects
            </h1>
            <p className="page-subtitle" style={{ margin: 0, color: 'var(--text-secondary, #5a5f7a)' }}>
              Browse all subjects, chapters, and topics. Click any topic to start learning with the Furqan NovaAI.
            </p>
          </div>
        </div>
      </div>

      {/* Level Toggle: SSC / Intermediate */}
      <div
        style={{
          background: 'var(--bg-card, #ffffff)',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid var(--border, #e2e5f0)',
          boxShadow: 'var(--shadow-md, 0 4px 12px rgba(0,0,0,0.05))',
          marginBottom: '24px',
        }}
      >
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary, #8a8fa6)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
          ðŸ“Ž Education Level
        </div>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setLevel('ssc')}
            style={{
              flex: '1 1 180px',
              padding: '16px 20px',
              borderRadius: '14px',
              border: level === 'ssc' ? '2px solid #6366f1' : '1px solid var(--border, #e2e5f0)',
              background: level === 'ssc' ? 'rgba(99,102,241,0.08)' : 'var(--bg-secondary, #ffffff)',
              color: level === 'ssc' ? '#6366f1' : 'var(--text-primary, #1a1d2e)',
              fontWeight: level === 'ssc' ? 700 : 500,
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>ðŸ« SSC (Class 6â€“10)</span>
              <span style={{
                background: level === 'ssc' ? '#6366f1' : 'var(--bg-tertiary, #f0f2f8)',
                color: level === 'ssc' ? '#fff' : 'var(--text-secondary)',
                padding: '3px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
              }}>Secondary</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setLevel('intermediate')}
            style={{
              flex: '1 1 180px',
              padding: '16px 20px',
              borderRadius: '14px',
              border: level === 'intermediate' ? '2px solid #8b5cf6' : '1px solid var(--border, #e2e5f0)',
              background: level === 'intermediate' ? 'rgba(139,92,246,0.08)' : 'var(--bg-secondary, #ffffff)',
              color: level === 'intermediate' ? '#8b5cf6' : 'var(--text-primary, #1a1d2e)',
              fontWeight: level === 'intermediate' ? 700 : 500,
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>ðŸŽ“ Intermediate (Class 11â€“12)</span>
              <span style={{
                background: level === 'intermediate' ? '#8b5cf6' : 'var(--bg-tertiary, #f0f2f8)',
                color: level === 'intermediate' ? '#fff' : 'var(--text-secondary)',
                padding: '3px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
              }}>Higher Secondary</span>
            </div>
          </button>
        </div>

        {/* SSC: Class Selector */}
        {level === 'ssc' && (
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary, #8a8fa6)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
              ðŸ“… Select Class
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {SSC_CLASSES.map((cls) => {
                const isSelected = selectedClass === cls.id;
                return (
                  <button
                    key={cls.id}
                    type="button"
                    onClick={() => setSelectedClass(cls.id)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #6366f1' : '1px solid var(--border, #e2e5f0)',
                      background: isSelected ? '#6366f1' : 'var(--bg-secondary, #ffffff)',
                      color: isSelected ? '#ffffff' : 'var(--text-primary, #1a1d2e)',
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {cls.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Intermediate: Year + Stream Selector */}
        {level === 'intermediate' && (
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary, #8a8fa6)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
              ðŸ“… Year & Stream
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
              {SYLLABUS_YEARS.map((y) => {
                const isSelected = selectedYear === y.id;
                return (
                  <button
                    key={y.id}
                    type="button"
                    onClick={() => setSelectedYear(y.id)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #8b5cf6' : '1px solid var(--border, #e2e5f0)',
                      background: isSelected ? '#8b5cf6' : 'var(--bg-secondary, #ffffff)',
                      color: isSelected ? '#ffffff' : 'var(--text-primary, #1a1d2e)',
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {y.shortLabel}
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              {SYLLABUS_STREAMS.map((s) => {
                const isSelected = selectedStream === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedStream(s.id)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: isSelected ? `2px solid ${s.color}` : '1px solid var(--border, #e2e5f0)',
                      background: isSelected ? `${s.color}15` : 'var(--bg-secondary, #ffffff)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '14px', color: isSelected ? s.color : 'var(--text-primary, #1a1d2e)' }}>
                        {s.name}
                      </span>
                      <span style={{ fontSize: '14px' }}>{s.icon.slice(0, 2)}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary, #5a5f7a)', marginTop: '2px' }}>
                      {s.fullName}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Search */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '24px',
      }}>
        <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary, #1a1d2e)' }}>
          {level === 'ssc'
            ? `ðŸ“š ${SSC_CLASSES.find(c => c.id === selectedClass)?.label} Subjects`
            : `ðŸŽ“ ${SYLLABUS_STREAMS.find(s => s.id === selectedStream)?.name} â€” ${SYLLABUS_YEARS.find(y => y.id === selectedYear)?.shortLabel}`
          }
        </div>
        <input
          type="text"
          placeholder="ðŸ” Search subjects, chapters, or topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search subjects"
          style={{
            padding: '10px 16px',
            borderRadius: '12px',
            border: '1px solid var(--border, #d8dce8)',
            background: 'var(--bg-secondary, #ffffff)',
            fontSize: '13px',
            outline: 'none',
            minWidth: '240px',
            maxWidth: '100%',
          }}
        />
      </div>

      {/* Subject Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {subjectsList.map((subject) => {
          const filteredChapters = searchTerm
            ? subject.chapters.filter(
                (c) =>
                  c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  c.topics.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
              )
            : subject.chapters;

          if (searchTerm && filteredChapters.length === 0) return null;

          const isExpanded = expandedSubject === subject.id;

          return (
            <div
              key={subject.id}
              style={{
                background: 'var(--bg-card, #ffffff)',
                borderRadius: '16px',
                border: '1px solid var(--border, #e2e5f0)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.04))',
              }}
            >
              {/* Subject Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  cursor: 'pointer',
                  background: isExpanded ? 'var(--bg-tertiary, #f0f2f8)' : 'transparent',
                  borderBottom: isExpanded ? '1px solid var(--border, #e2e5f0)' : 'none',
                  flexWrap: 'wrap',
                  gap: '10px',
                  transition: 'background 0.2s ease',
                }}
                onClick={() => setExpandedSubject(isExpanded ? null : subject.id)}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpandedSubject(isExpanded ? null : subject.id); }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{subject.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary, #1a1d2e)' }}>
                      {subject.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary, #5a5f7a)' }}>
                      {subject.chapters.length} Chapters â€¢ {subject.chapters.reduce((acc, c) => acc + c.topics.length, 0)} Topics
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      padding: '4px 14px',
                      borderRadius: '8px',
                      background: subject.color,
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    {subject.chapters.length} Chapters
                  </span>
                  <span style={{ fontSize: '14px', color: 'var(--text-tertiary, #8a8fa6)' }}>
                    {isExpanded ? 'â–²' : 'â–¼'}
                  </span>
                </div>
              </div>

              {/* Chapters & Topics */}
              {isExpanded && (
                <div style={{ padding: '16px 20px' }}>
                  {filteredChapters.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary, #5a5f7a)' }}>
                      No chapters matched your search.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {filteredChapters.map((chapter) => (
                        <div
                          key={chapter.id}
                          style={{
                            border: '1px solid var(--border, #e2e5f0)',
                            borderRadius: '12px',
                            padding: '14px 16px',
                            background: 'var(--bg-secondary, #ffffff)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary, #1a1d2e)' }}>
                              ðŸ“– {chapter.name}
                            </span>
                            <span style={{
                              background: 'var(--bg-tertiary, #f0f2f8)',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 600,
                              color: 'var(--text-secondary, #5a5f7a)',
                            }}>
                              {chapter.topics.length} topics
                            </span>
                          </div>
                          {chapter.description && (
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary, #5a5f7a)', marginBottom: '10px' }}>
                              {chapter.description}
                            </div>
                          )}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {chapter.topics.map((topicName, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleStudyTopic(subject.name, chapter.name, topicName)}
                                style={{
                                  padding: '5px 12px',
                                  borderRadius: '8px',
                                  border: '1px solid var(--border, #e2e5f0)',
                                  background: 'var(--bg-tertiary, #f8f9fd)',
                                  fontSize: '12px',
                                  fontWeight: 500,
                                  color: 'var(--text-primary, #1a1d2e)',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.borderColor = subject.color;
                                  e.currentTarget.style.color = subject.color;
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.borderColor = 'var(--border, #e2e5f0)';
                                  e.currentTarget.style.color = 'var(--text-primary, #1a1d2e)';
                                }}
                              >
                                ðŸ“Œ {topicName}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

