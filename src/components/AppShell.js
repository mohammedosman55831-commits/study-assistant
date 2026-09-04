'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import Sidebar from '@/components/Sidebar';
import { store } from '@/lib/store';

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const settings = store.getSettings();
    const savedTheme = settings.theme || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    store.saveSettings({ theme: newTheme });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="app-layout">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Mobile header */}
        <div className="mobile-header">
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
          <span className="mobile-logo">🎓 StudyAI</span>
          <button
            className="mobile-menu-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{ marginLeft: 'auto' }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        <main className="main-content">
          {children}
        </main>
      </div>
    </ThemeContext.Provider>
  );
}
