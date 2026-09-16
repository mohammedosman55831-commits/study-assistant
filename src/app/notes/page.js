'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { store } from '@/lib/store';
import { formatDate } from '@/lib/utils';

const DEFAULT_TEMPLATES = [
  {
    id: 'python_cheatsheet',
    title: 'Python Core Cheatsheet',
    subject: 'python',
    tags: ['python', 'basics', 'syntax'],
    content: `# Python Core Cheatsheet

## 1. Variables & Types
- \`x = 10\` (int)
- \`pi = 3.14\` (float)
- \`name = "StudyAI"\` (str)
- \`is_active = True\` (bool)

## 2. Collections
- **List (mutable)**: \`nums = [1, 2, 3]\` -> \`nums.append(4)\`
- **Tuple (immutable)**: \`coords = (10, 20)\`
- **Dictionary**: \`student = {"name": "Alex", "score": 95}\`
- **Set (unique)**: \`unique_ids = {1, 2, 3}\`

## 3. Control Flow
\`\`\`python
if score >= 90:
    print("Grade A")
elif score >= 75:
    print("Grade B")
else:
    print("Keep Practicing")
\`\`\`

## 4. Loops & Functions
\`\`\`python
def calculate_average(scores):
    return sum(scores) / len(scores)

for i in range(5):
    print(f"Index: {i}")
\`\`\`
`,
  },
  {
    id: 'math_formulas',
    title: 'Mathematics Essential Formulas',
    subject: 'math',
    tags: ['algebra', 'trigonometry', 'calculus'],
    content: `# Mathematics Formula Sheet

## 1. Quadratic Equation
For $ax^2 + bx + c = 0$:
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

- Discriminant $\\Delta = b^2 - 4ac$
- If $\\Delta > 0$: 2 real distinct roots
- If $\\Delta = 0$: 1 real repeated root
- If $\\Delta < 0$: 2 complex conjugate roots

## 2. Trigonometric Identities
- $\\sin^2(\\theta) + \\cos^2(\\theta) = 1$
- $1 + \\tan^2(\\theta) = \\sec^2(\\theta)$
- $\\sin(2\\theta) = 2\\sin(\\theta)\\cos(\\theta)$
- $\\cos(2\\theta) = \\cos^2(\\theta) - \\sin^2(\\theta)$

## 3. Calculus Basics
- $\\frac{d}{dx}[x^n] = n x^{n-1}$
- $\\frac{d}{dx}[\\sin(x)] = \\cos(x)$
- $\\int x^n dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)$
`,
  },
  {
    id: 'physics_laws',
    title: 'Physics Mechanics Summary',
    subject: 'physics',
    tags: ['physics', 'mechanics', 'energy'],
    content: `# Physics Mechanics Summary

## 1. Newton's Laws of Motion
1. **Law of Inertia**: An object at rest remains at rest unless acted on by external force.
2. **Force & Acceleration**: $F = ma$
3. **Action & Reaction**: For every action, there is an equal and opposite reaction.

## 2. Work, Power & Energy
- Work: $W = F \\cdot d \\cdot \\cos(\\theta)$
- Kinetic Energy: $KE = \\frac{1}{2}mv^2$
- Gravitational Potential Energy: $PE = mgh$
- Power: $P = \\frac{W}{t}$
`,
  },
];

const SUBJECT_OPTIONS = [
  { id: 'all', label: 'All Subjects', icon: '📁' },
  { id: 'python', label: 'Python / Coding', icon: '🐍' },
  { id: 'math', label: 'Mathematics', icon: '📐' },
  { id: 'physics', label: 'Physics', icon: '⚛️' },
  { id: 'chemistry', label: 'Chemistry', icon: '🧪' },
  { id: 'biology', label: 'Biology', icon: '🧬' },
  { id: 'cs', label: 'Computer Science', icon: '💻' },
  { id: 'english', label: 'English', icon: '📖' },
];

function NotesContent() {
  const searchParams = useSearchParams();
  const initialSubject = searchParams.get('subject') || 'all';

  const [notes, setNotes] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNoteId, setActiveNoteId] = useState(null);

  // Editor states
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editSubject, setEditSubject] = useState('python');
  const [editTags, setEditTags] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // AI Assistant states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [aiAction, setAiAction] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);

  // Load notes on mount
  useEffect(() => {
    let savedNotes = store.getNotes();
    if (!savedNotes || savedNotes.length === 0) {
      // Seed with initial template notes
      DEFAULT_TEMPLATES.forEach(tpl => {
        store.saveNote({
          id: tpl.id,
          title: tpl.title,
          subject: tpl.subject,
          tags: tpl.tags,
          content: tpl.content,
        });
      });
      savedNotes = store.getNotes();
    }
    setNotes(savedNotes);

    // Pick first note or matching note
    if (savedNotes.length > 0) {
      const match = initialSubject !== 'all' 
        ? savedNotes.find(n => n.subject === initialSubject) || savedNotes[0]
        : savedNotes[0];
      selectNote(match);
    }
  }, [initialSubject]);

  const selectNote = (note) => {
    if (!note) return;
    setActiveNoteId(note.id);
    setEditTitle(note.title || '');
    setEditContent(note.content || '');
    setEditSubject(note.subject || 'python');
    setEditTags(Array.isArray(note.tags) ? note.tags.join(', ') : (note.tags || ''));
    setSaveStatus('');
  };

  const handleCreateNewNote = (template = null) => {
    const newNote = {
      id: Date.now().toString(),
      title: template ? template.title : 'Untitled Study Note',
      subject: template ? template.subject : (selectedSubject !== 'all' ? selectedSubject : 'python'),
      tags: template ? template.tags : ['study'],
      content: template ? template.content : '# New Study Note\n\nWrite your key points, formulas, or code snippets here...',
    };

    const updated = store.saveNote(newNote);
    store.addXP(10);
    store.unlockAchievement('note_taker');
    store.logActivity({ type: 'note_created', title: `Created note: ${newNote.title}` });
    
    setNotes(updated);
    selectNote(newNote);
    setSaveStatus('✨ New note created (+10 XP)');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleSaveNote = () => {
    if (!activeNoteId) return;
    setIsSaving(true);
    
    const tagsArray = editTags
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    const updatedNote = {
      id: activeNoteId,
      title: editTitle.trim() || 'Untitled Note',
      subject: editSubject,
      tags: tagsArray,
      content: editContent,
    };

    const updatedNotes = store.saveNote(updatedNote);
    setNotes(updatedNotes);
    setIsSaving(false);
    setSaveStatus('Saved successfully ✓');
    setTimeout(() => setSaveStatus(''), 2500);
  };

  const handleDeleteNote = (id, e) => {
    e?.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this study note?')) return;
    
    const remaining = store.deleteNote(id);
    setNotes(remaining);
    
    if (activeNoteId === id) {
      if (remaining.length > 0) {
        selectNote(remaining[0]);
      } else {
        setActiveNoteId(null);
        setEditTitle('');
        setEditContent('');
      }
    }
  };

  // AI Helper functions
  const handleRunAiAction = async (action) => {
    if (!editContent.trim()) {
      alert('Please add some content to your note first!');
      return;
    }
    setAiAction(action);
    setAiLoading(true);
    setShowAiModal(true);
    setAiResult('');

    try {
      const res = await fetch('/api/ai/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `${editTitle}\n\n${editContent}`,
          action: action,
        }),
      });

      const data = await res.json();
      if (data.result) {
        setAiResult(data.result);
      } else {
        setAiResult('Unable to process note. Please try again.');
      }
    } catch (err) {
      console.error('Note AI processing error:', err);
      setAiResult('AI Assistant encountered a temporary error. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAppendAiResult = () => {
    if (!aiResult) return;
    setEditContent(prev => prev + '\n\n---\n\n' + aiResult);
    setShowAiModal(false);
    setSaveStatus('Appended AI insights to note ✓');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  // Filter notes
  const filteredNotes = notes.filter(note => {
    const matchesSubject = selectedSubject === 'all' || note.subject === selectedSubject;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      (Array.isArray(note.tags) && note.tags.some(t => t.toLowerCase().includes(query)));
    return matchesSubject && matchesSearch;
  });

  const activeNote = notes.find(n => n.id === activeNoteId);

  return (
    <div className="page-container animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Top Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '1.8rem' }}>📒</span>
            <h1 className="page-title" style={{ margin: 0 }}>Study Notes Workspace</h1>
          </div>
          <p className="page-subtitle">
            Create, organize, and enhance your subject notes with AI summaries, formula extractions, and flashcard conversions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => handleCreateNewNote()} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>➕</span> New Note
          </button>
          <Link href="/planner" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>📅</span> Planner
          </Link>
          <Link href="/practice" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>✏️</span> Practice
          </Link>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Sidebar: Notes List & Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="🔍 Search notes or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                background: 'var(--card-bg, rgba(255,255,255,0.05))',
                color: 'inherit',
                fontSize: '0.9rem',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Subject Pills Filter */}
          <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.3rem', flexWrap: 'wrap' }}>
            {SUBJECT_OPTIONS.map(subj => (
              <button
                key={subj.id}
                onClick={() => setSelectedSubject(subj.id)}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: selectedSubject === subj.id ? '600' : '400',
                  border: selectedSubject === subj.id ? '1px solid var(--primary)' : '1px solid var(--border)',
                  background: selectedSubject === subj.id ? 'rgba(99, 102, 241, 0.15)' : 'var(--card-bg, transparent)',
                  color: selectedSubject === subj.id ? 'var(--primary)' : 'inherit',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{subj.icon}</span>
                <span>{subj.label}</span>
              </button>
            ))}
          </div>

          {/* Notes List Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '620px', overflowY: 'auto', paddingRight: '0.3rem' }}>
            {filteredNotes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--card-bg, rgba(255,255,255,0.03))', borderRadius: '12px', border: '1px dashed var(--border)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.8rem' }}>No notes found</p>
                <button className="btn btn-sm btn-outline" onClick={() => handleCreateNewNote()}>
                  Create your first note
                </button>
              </div>
            ) : (
              filteredNotes.map(note => {
                const isActive = note.id === activeNoteId;
                const subjInfo = SUBJECT_OPTIONS.find(s => s.id === note.subject) || { icon: '📝', label: note.subject };
                return (
                  <div
                    key={note.id}
                    onClick={() => selectNote(note)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      border: isActive ? '2px solid var(--primary, #6366f1)' : '1px solid var(--border)',
                      background: isActive ? 'rgba(99, 102, 241, 0.08)' : 'var(--card-bg, rgba(255,255,255,0.03))',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.45rem', borderRadius: '6px', background: 'rgba(255,255,255,0.07)', color: 'var(--text-muted)' }}>
                        {subjInfo.icon} {subjInfo.label}
                      </span>
                      <button
                        onClick={(e) => handleDeleteNote(note.id, e)}
                        title="Delete note"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--text-muted)',
                          fontSize: '0.85rem',
                          padding: '0.1rem 0.3rem',
                          opacity: 0.6,
                        }}
                        onMouseEnter={(e) => e.target.style.opacity = 1}
                        onMouseLeave={(e) => e.target.style.opacity = 0.6}
                      >
                        🗑️
                      </button>
                    </div>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.3rem', color: isActive ? 'var(--primary)' : 'inherit' }}>
                      {note.title || 'Untitled Note'}
                    </h4>

                    <p style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      marginBottom: '0.4rem',
                      lineHeight: '1.3',
                    }}>
                      {note.content?.replace(/[#*`$\-\n]/g, ' ') || 'Empty note...'}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      <span>{formatDate(note.updatedAt || note.createdAt || new Date().toISOString())}</span>
                      {Array.isArray(note.tags) && note.tags.length > 0 && (
                        <span style={{ opacity: 0.7 }}>#{note.tags[0]}</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Starter Templates */}
          <div style={{ marginTop: '0.5rem', padding: '0.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
              ⚡ QUICK TEMPLATES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {DEFAULT_TEMPLATES.map(tpl => (
                <button
                  key={tpl.id}
                  onClick={() => handleCreateNewNote(tpl)}
                  className="btn btn-sm btn-ghost"
                  style={{ justifyContent: 'flex-start', fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                >
                  ➕ {tpl.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Editor & AI Enhancement Panel */}
        <div style={{
          background: 'var(--card-bg, rgba(255,255,255,0.04))',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
          minHeight: '620px',
        }}>
          {activeNoteId ? (
            <>
              {/* Note Metadata Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flex: 1, minWidth: '240px' }}>
                  <select
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    style={{
                      padding: '0.5rem 0.8rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--background)',
                      color: 'inherit',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                    }}
                  >
                    {SUBJECT_OPTIONS.filter(s => s.id !== 'all').map(s => (
                      <option key={s.id} value={s.id}>{s.icon} {s.label}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Tags (comma separated)..."
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    style={{
                      padding: '0.5rem 0.8rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--background)',
                      color: 'inherit',
                      fontSize: '0.85rem',
                      flex: 1,
                    }}
                  />
                </div>

                {/* Save and Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  {saveStatus && (
                    <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: '500' }}>
                      {saveStatus}
                    </span>
                  )}
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleSaveNote}
                    disabled={isSaving}
                    style={{ minWidth: '90px' }}
                  >
                    {isSaving ? 'Saving...' : '💾 Save Note'}
                  </button>
                </div>
              </div>

              {/* Note Title Input */}
              <input
                type="text"
                placeholder="Note Title..."
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{
                  width: '100%',
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  padding: '0.4rem 0',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--border)',
                  color: 'inherit',
                  outline: 'none',
                }}
              />

              {/* AI Quick Tools Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flexWrap: 'wrap',
                background: 'rgba(99, 102, 241, 0.06)',
                padding: '0.6rem 0.8rem',
                borderRadius: '10px',
                border: '1px solid rgba(99, 102, 241, 0.2)',
              }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary, #6366f1)', marginRight: '0.3rem' }}>
                  ✨ AI TOOLS:
                </span>
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => handleRunAiAction('summarize')}
                  style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                >
                  📋 Summarize Key Points
                </button>
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => handleRunAiAction('explain')}
                  style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                >
                  💡 Explain Simply
                </button>
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => handleRunAiAction('important')}
                  style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                >
                  ⚡ Extract Formulas & Terms
                </button>
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => handleRunAiAction('quiz')}
                  style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                >
                  ❓ Generate Quiz
                </button>
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => handleRunAiAction('flashcards')}
                  style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                >
                  🃏 Convert to Flashcards
                </button>
              </div>

              {/* Note Content Textarea */}
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Write your detailed study notes, code, examples, or questions here..."
                style={{
                  width: '100%',
                  flex: 1,
                  minHeight: '340px',
                  background: 'var(--background)',
                  color: 'inherit',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '1rem',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  fontFamily: 'monospace, inherit',
                  resize: 'vertical',
                  outline: 'none',
                }}
              />

              {/* Footer info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>{editContent.length} characters · {editContent.split(/\s+/).filter(Boolean).length} words</span>
                <span>Press <strong>Ctrl+S</strong> or click Save to keep changes</span>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '1rem' }}>
              <div style={{ fontSize: '3rem' }}>📝</div>
              <h3>No Note Selected</h3>
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', maxWidth: '360px' }}>
                Select a note from the left sidebar or create a new note to start writing and studying.
              </p>
              <button className="btn btn-primary" onClick={() => handleCreateNewNote()}>
                ➕ Create Note
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AI Results Modal */}
      {showAiModal && (
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
          <div style={{
            background: 'var(--background)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            overflow: 'hidden',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.2rem 1.5rem',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>✨</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                  AI Note Assistant: {aiAction.toUpperCase()}
                </h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              {aiLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 1rem', gap: '1rem' }}>
                  <div className="skeleton" style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Analyzing note content with AI...</p>
                </div>
              ) : (
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '0.95rem' }}>
                  {aiResult}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.8rem',
            }}>
              <button className="btn btn-secondary" onClick={() => setShowAiModal(false)}>
                Close
              </button>
              {aiResult && !aiLoading && (
                <button className="btn btn-primary" onClick={handleAppendAiResult}>
                  ➕ Insert into Note
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NotesPage() {
  return (
    <Suspense fallback={<div className="page-container"><p>Loading Study Notes...</p></div>}>
      <NotesContent />
    </Suspense>
  );
}
