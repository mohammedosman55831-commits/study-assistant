'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  SYLLABUS_YEARS,
  SYLLABUS_STREAMS,
  SYLLABUS_ACTIONS,
  getSubjectsForStream,
  getChaptersForSubject,
} from '@/lib/syllabus-data';

export default function SyllabusPage() {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState('1st_year');
  const [selectedStream, setSelectedStream] = useState('mpc');
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const currentStreamObj = SYLLABUS_STREAMS.find((s) => s.id === selectedStream) || SYLLABUS_STREAMS[0];
  const currentYearObj = SYLLABUS_YEARS.find((y) => y.id === selectedYear) || SYLLABUS_YEARS[0];
  const streamSubjects = getSubjectsForStream(selectedStream);

  const handleStudyTopic = (subjectName, chapterName, topicName, actionId = 'explain') => {
    const params = new URLSearchParams({
      year: selectedYear,
      stream: selectedStream,
      subject: subjectName.toLowerCase().replace(/\s+/g, '_'),
      chapter: chapterName,
      topic: topicName,
      action: actionId,
    });
    router.push(`/tutor?${params.toString()}`);
  };

  return (
    <div className="page-container animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{ fontSize: '2rem' }}>ðŸŽ“</span>
          <div>
            <h1 className="page-title" style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>
              Intermediate / Class 11â€“12 Syllabus
            </h1>
            <p className="page-subtitle" style={{ margin: 0, color: 'var(--text-secondary, #5a5f7a)' }}>
              Comprehensive curriculum for MPC, BiPC, MEC, and CEC streams with instant Furqan NovaAI integration.
            </p>
          </div>
        </div>
      </div>

      {/* Year & Stream Hierarchy Nav */}
      <div
        style={{
          background: 'var(--bg-card, #ffffff)',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid var(--border, #e2e5f0)',
          boxShadow: 'var(--shadow-md, 0 4px 12px rgba(0,0,0,0.05))',
          marginBottom: '28px',
        }}
      >
        {/* Step 1: Year Selection */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary, #8a8fa6)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
            ðŸ“… Academic Year
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {SYLLABUS_YEARS.map((y) => {
              const isSelected = selectedYear === y.id;
              return (
                <button
                  key={y.id}
                  type="button"
                  onClick={() => setSelectedYear(y.id)}
                  style={{
                    flex: '1 1 200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 20px',
                    borderRadius: '14px',
                    border: isSelected ? '2px solid var(--accent-primary, #6366f1)' : '1px solid var(--border, #e2e5f0)',
                    background: isSelected ? 'var(--accent-primary-light, rgba(99, 102, 241, 0.08))' : 'var(--bg-secondary, #ffffff)',
                    color: isSelected ? 'var(--accent-primary, #6366f1)' : 'var(--text-primary, #1a1d2e)',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: '15px' }}>{y.label}</span>
                  <span
                    style={{
                      background: isSelected ? 'var(--accent-primary, #6366f1)' : 'var(--bg-tertiary, #f0f2f8)',
                      color: isSelected ? '#ffffff' : 'var(--text-secondary, #5a5f7a)',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    {y.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Stream Selection (MPC, BiPC, MEC, CEC) */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary, #8a8fa6)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
            ðŸŽ¯ Stream Selection
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
            }}
          >
            {SYLLABUS_STREAMS.map((s) => {
              const isSelected = selectedStream === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedStream(s.id)}
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    border: isSelected ? `2px solid ${s.color}` : '1px solid var(--border, #e2e5f0)',
                    background: isSelected ? `${s.color}15` : 'var(--bg-secondary, #ffffff)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: isSelected ? s.color : 'var(--text-primary, #1a1d2e)' }}>
                      {s.name}
                    </span>
                    <span style={{ fontSize: '18px' }}>{s.icon}</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary, #1a1d2e)', marginBottom: '4px' }}>
                    {s.fullName}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary, #5a5f7a)' }}>
                    {s.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stream Overview Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          padding: '16px 20px',
          borderRadius: '16px',
          background: `linear-gradient(135deg, ${currentStreamObj.color}20, ${currentStreamObj.color}08)`,
          border: `1px solid ${currentStreamObj.color}40`,
          marginBottom: '24px',
        }}
      >
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: currentStreamObj.color, textTransform: 'uppercase' }}>
            Current View: {currentYearObj.label}
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary, #1a1d2e)' }}>
            {currentStreamObj.name} â€” {currentStreamObj.fullName}
          </div>
        </div>

        {/* Quick Search filter */}
        <input
          type="text"
          placeholder="ðŸ” Search chapters or topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '12px',
            border: '1px solid var(--border, #d8dce8)',
            background: 'var(--bg-secondary, #ffffff)',
            fontSize: '13px',
            outline: 'none',
            minWidth: '240px',
          }}
        />
      </div>

      {/* Subjects & Chapters List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {streamSubjects.map((subject) => {
          const chapters = getChaptersForSubject(subject.id, selectedYear);
          const filteredChapters = searchTerm
            ? chapters.filter(
                (c) =>
                  c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  c.topics.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
              )
            : chapters;

          return (
            <div
              key={subject.id}
              style={{
                background: 'var(--bg-card, #ffffff)',
                borderRadius: '20px',
                border: '1px solid var(--border, #e2e5f0)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.04))',
              }}
            >
              {/* Subject Title Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '18px 24px',
                  background: 'var(--bg-tertiary, #f0f2f8)',
                  borderBottom: '1px solid var(--border, #e2e5f0)',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.6rem' }}>{subject.icon}</span>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary, #1a1d2e)' }}>
                      {subject.name}
                    </h2>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary, #5a5f7a)' }}>
                      {chapters.length} Chapters â€¢ {chapters.reduce((acc, c) => acc + c.topics.length, 0)} Core Topics
                    </p>
                  </div>
                </div>

                <Link
                  href={`/tutor?year=${selectedYear}&stream=${selectedStream}&subject=${subject.id}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    background: subject.color,
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span>Ask {subject.name} Tutor</span>
                  <span>ðŸš€</span>
                </Link>
              </div>

              {/* Chapters List */}
              <div style={{ padding: '16px 24px' }}>
                {filteredChapters.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary, #5a5f7a)' }}>
                    No chapters matched your search "{searchTerm}".
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {filteredChapters.map((chapter) => {
                      const isExpanded = expandedChapter === `${subject.id}-${chapter.id}`;
                      return (
                        <div
                          key={chapter.id}
                          style={{
                            border: '1px solid var(--border, #e2e5f0)',
                            borderRadius: '14px',
                            background: 'var(--bg-secondary, #ffffff)',
                            overflow: 'hidden',
                          }}
                        >
                          {/* Chapter Header */}
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '14px 18px',
                              cursor: 'pointer',
                              background: isExpanded ? 'var(--bg-tertiary, #f0f2f8)' : 'transparent',
                            }}
                            onClick={() =>
                              setExpandedChapter(isExpanded ? null : `${subject.id}-${chapter.id}`)
                            }
                          >
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary, #1a1d2e)' }}>
                                  ðŸ“– {chapter.name}
                                </span>
                                <span
                                  style={{
                                    background: 'var(--bg-tertiary, #f0f2f8)',
                                    padding: '2px 8px',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: 'var(--text-secondary, #5a5f7a)',
                                  }}
                                >
                                  {chapter.topics.length} topics
                                </span>
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--text-secondary, #5a5f7a)', marginTop: '2px' }}>
                                {chapter.description}
                              </div>
                            </div>

                            <span style={{ fontSize: '14px', color: 'var(--text-tertiary, #8a8fa6)', marginLeft: '12px' }}>
                              {isExpanded ? 'â–²' : 'â–¼'}
                            </span>
                          </div>

                          {/* Topics List & Quick Action Chips */}
                          {isExpanded && (
                            <div
                              style={{
                                padding: '16px 18px',
                                borderTop: '1px solid var(--border, #e2e5f0)',
                                background: 'var(--bg-card, #ffffff)',
                              }}
                            >
                              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary, #8a8fa6)', marginBottom: '10px', textTransform: 'uppercase' }}>
                                Topics & Study Launchpad:
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {chapter.topics.map((topicName, idx) => (
                                  <div
                                    key={idx}
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      padding: '10px 14px',
                                      borderRadius: '10px',
                                      background: 'var(--bg-tertiary, #f8f9fd)',
                                      flexWrap: 'wrap',
                                      gap: '8px',
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <span style={{ color: 'var(--accent-primary, #6366f1)', fontSize: '14px' }}>ðŸ“Œ</span>
                                      <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary, #1a1d2e)' }}>
                                        {topicName}
                                      </span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                      <button
                                        type="button"
                                        onClick={() => handleStudyTopic(subject.name, chapter.name, topicName, 'simple')}
                                        style={{
                                          padding: '5px 10px',
                                          borderRadius: '8px',
                                          border: '1px solid var(--border, #d8dce8)',
                                          background: '#ffffff',
                                          fontSize: '11px',
                                          fontWeight: 600,
                                          color: 'var(--text-primary, #1a1d2e)',
                                          cursor: 'pointer',
                                        }}
                                      >
                                        ðŸ’¡ Simple
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleStudyTopic(subject.name, chapter.name, topicName, 'mcqs')}
                                        style={{
                                          padding: '5px 10px',
                                          borderRadius: '8px',
                                          border: '1px solid var(--border, #d8dce8)',
                                          background: '#ffffff',
                                          fontSize: '11px',
                                          fontWeight: 600,
                                          color: 'var(--text-primary, #1a1d2e)',
                                          cursor: 'pointer',
                                        }}
                                      >
                                        ðŸ”˜ MCQs
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleStudyTopic(subject.name, chapter.name, topicName, 'solve')}
                                        style={{
                                          padding: '5px 10px',
                                          borderRadius: '8px',
                                          border: '1px solid var(--border, #d8dce8)',
                                          background: '#ffffff',
                                          fontSize: '11px',
                                          fontWeight: 600,
                                          color: 'var(--text-primary, #1a1d2e)',
                                          cursor: 'pointer',
                                        }}
                                      >
                                        ðŸ§© Solve
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleStudyTopic(subject.name, chapter.name, topicName, 'explain')}
                                        style={{
                                          padding: '5px 12px',
                                          borderRadius: '8px',
                                          border: 'none',
                                          background: 'var(--accent-primary, #6366f1)',
                                          color: '#ffffff',
                                          fontSize: '11px',
                                          fontWeight: 700,
                                          cursor: 'pointer',
                                        }}
                                      >
                                        Tutor â†’
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

