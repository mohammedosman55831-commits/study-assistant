'use client';

import { useState, useEffect, Suspense } from 'react';
import { store } from '@/lib/store';
import { useTheme } from '@/components/AppShell';

function SettingsContent() {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [aiMode, setAiMode] = useState('standard');
  const [focusDuration, setFocusDuration] = useState(25);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const u = store.getUser();
    setUser(u);
    setName(u.name || 'Student');
    setEmail(u.email || '');
    setAiMode(u.settings?.aiMode || 'standard');
    setFocusDuration(u.settings?.focusDuration || 25);
  }, []);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    store.saveUser({ name, email });
    store.saveSettings({ aiMode, focusDuration });
    setSaveStatus('Settings updated successfully ✓');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all progress, flashcards, notes, and XP? This action cannot be undone.')) {
      store.resetAll();
      window.location.reload();
    }
  };

  return (
    <div className="page-container animate-fade-in" style={{ paddingBottom: '3rem', maxWidth: '750px' }}>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
          <span style={{ fontSize: '1.8rem' }}>⚙️</span>
          <h1 className="page-title" style={{ margin: 0 }}>Application Settings</h1>
        </div>
        <p className="page-subtitle">
          Customize your study preferences, profile information, and application appearance.
        </p>
      </div>

      {saveStatus && (
        <div style={{
          padding: '0.75rem 1.2rem',
          borderRadius: '10px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#10b981',
          marginBottom: '1.5rem',
          fontWeight: '500',
        }}>
          {saveStatus}
        </div>
      )}

      <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Profile Details */}
        <div style={{
          background: 'var(--card-bg, rgba(255,255,255,0.03))',
          borderRadius: '14px',
          border: '1px solid var(--border)',
          padding: '1.5rem',
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>👤 Profile Information</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                Display Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'inherit',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                Email Address (Optional):
              </label>
              <input
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'inherit',
                }}
              />
            </div>
          </div>
        </div>

        {/* Study Preferences */}
        <div style={{
          background: 'var(--card-bg, rgba(255,255,255,0.03))',
          borderRadius: '14px',
          border: '1px solid var(--border)',
          padding: '1.5rem',
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>📚 Study & AI Preferences</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                Theme Appearance:
              </label>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={toggleTheme}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>{theme === 'light' ? '🌙 Switch to Dark Mode' : '☀️ Switch to Light Mode'}</span>
              </button>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                Default Focus Duration (Minutes):
              </label>
              <input
                type="number"
                min="5"
                max="120"
                step="5"
                value={focusDuration}
                onChange={(e) => setFocusDuration(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'inherit',
                }}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem', fontWeight: '600' }}>
          💾 Save Settings
        </button>

        {/* Danger Zone */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.05)',
          borderRadius: '14px',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          padding: '1.5rem',
          marginTop: '1rem',
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#ef4444' }}>⚠️ Danger Zone</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Reset all your saved flashcards, notes, XP, achievements, and study history back to default.
          </p>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleResetData}
            style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
          >
            🗑️ Reset All Local Data
          </button>
        </div>
      </form>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="page-container"><p>Loading Settings...</p></div>}>
      <SettingsContent />
    </Suspense>
  );
}
