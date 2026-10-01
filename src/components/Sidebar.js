'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { store } from '@/lib/store';

const navItems = [
  { label: 'MAIN', type: 'section' },
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/tutor', label: 'AI Tutor', icon: '🤖', badge: 'AI' },
  { href: '/solver', label: 'Question Solver', icon: '🧩' },

  { label: 'LEARN', type: 'section' },
  { href: '/syllabus', label: 'Inter Syllabus', icon: '🎓', badge: '11-12' },
  { href: '/subjects', label: 'Subjects', icon: '📚' },
  { href: '/coding', label: 'Python / Coding', icon: '🐍' },
  { href: '/practice', label: 'Practice', icon: '✏️' },

  { label: 'TOOLS', type: 'section' },
  { href: '/quizzes', label: 'Quizzes', icon: '📝' },
  { href: '/flashcards', label: 'Flashcards', icon: '🃏' },
  { href: '/notes', label: 'Notes', icon: '📒' },
  { href: '/planner', label: 'Study Planner', icon: '📅' },

  { label: 'TRACK', type: 'section' },
  { href: '/progress', label: 'Progress', icon: '📈' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(store.getUser());
  }, []);

  const xpPercent = user ? Math.round((user.xp / user.xpToNextLevel) * 100) : 0;

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🎓</div>
          <div>
            <div className="sidebar-logo-text">StudyAI</div>
            <div className="sidebar-logo-badge">AI Powered</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item, idx) => {
            if (item.type === 'section') {
              return (
                <div key={idx} className="sidebar-section-title">
                  {item.label}
                </div>
              );
            }

            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="sidebar-link-badge new">{item.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        {user && (
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user.name?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.name || 'Student'}</div>
              <div className="sidebar-user-level">Level {user.level || 1} · {user.xp || 0} XP</div>
              <div className="sidebar-xp-bar">
                <div className="sidebar-xp-fill" style={{ width: `${xpPercent}%` }} />
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
