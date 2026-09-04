'use client';

/* ============================================
   DATA STORE — localStorage Persistence Layer
   ============================================ */

const STORE_PREFIX = 'studyai_';

const defaultUserData = {
  name: 'Student',
  email: '',
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  streak: 0,
  lastStudyDate: null,
  totalStudyMinutes: 0,
  joinedDate: new Date().toISOString(),
  settings: {
    theme: 'light',
    aiMode: 'standard',
    notifications: true,
    focusDuration: 25,
  },
};

const defaultSubjects = [
  { id: 'math', name: 'Mathematics', icon: '📐', color: '#6366f1', chapters: ['Algebra', 'Geometry', 'Calculus', 'Statistics', 'Trigonometry'], progress: 0, totalTopics: 25, completedTopics: 0 },
  { id: 'physics', name: 'Physics', icon: '⚛️', color: '#3b82f6', chapters: ['Mechanics', 'Thermodynamics', 'Waves', 'Optics', 'Electricity'], progress: 0, totalTopics: 25, completedTopics: 0 },
  { id: 'chemistry', name: 'Chemistry', icon: '🧪', color: '#10b981', chapters: ['Atoms', 'Chemical Bonding', 'Reactions', 'Organic Chemistry', 'Solutions'], progress: 0, totalTopics: 25, completedTopics: 0 },
  { id: 'biology', name: 'Biology', icon: '🧬', color: '#22c55e', chapters: ['Cell Biology', 'Genetics', 'Ecology', 'Human Body', 'Evolution'], progress: 0, totalTopics: 25, completedTopics: 0 },
  { id: 'cs', name: 'Computer Science', icon: '💻', color: '#8b5cf6', chapters: ['Algorithms', 'Data Structures', 'Databases', 'Networks', 'OS Concepts'], progress: 0, totalTopics: 25, completedTopics: 0 },
  { id: 'python', name: 'Python', icon: '🐍', color: '#f59e0b', chapters: ['Basics', 'Control Flow', 'Functions', 'OOP', 'File Handling'], progress: 0, totalTopics: 25, completedTopics: 0 },
  { id: 'english', name: 'English', icon: '📖', color: '#ec4899', chapters: ['Grammar', 'Literature', 'Writing', 'Vocabulary', 'Comprehension'], progress: 0, totalTopics: 25, completedTopics: 0 },
  { id: 'history', name: 'History', icon: '🏛️', color: '#f97316', chapters: ['Ancient History', 'Medieval', 'Modern History', 'World Wars', 'Civilizations'], progress: 0, totalTopics: 25, completedTopics: 0 },
  { id: 'geography', name: 'Geography', icon: '🌍', color: '#14b8a6', chapters: ['Physical Geography', 'Human Geography', 'Climate', 'Maps', 'Resources'], progress: 0, totalTopics: 25, completedTopics: 0 },
  { id: 'economics', name: 'Economics', icon: '📊', color: '#06b6d4', chapters: ['Microeconomics', 'Macroeconomics', 'Markets', 'Money & Banking', 'International Trade'], progress: 0, totalTopics: 25, completedTopics: 0 },
];

const defaultAchievements = [
  { id: 'first_lesson', name: 'First Lesson', description: 'Complete your first lesson', icon: '🎓', xp: 10, unlocked: false },
  { id: 'streak_7', name: '7-Day Streak', description: 'Study for 7 days in a row', icon: '🔥', xp: 50, unlocked: false },
  { id: 'quiz_master', name: 'Quiz Master', description: 'Score 100% on a quiz', icon: '🏆', xp: 30, unlocked: false },
  { id: 'chapter_complete', name: 'Chapter Complete', description: 'Complete all topics in a chapter', icon: '📚', xp: 25, unlocked: false },
  { id: 'coding_beginner', name: 'Coding Beginner', description: 'Complete your first coding challenge', icon: '💻', xp: 15, unlocked: false },
  { id: 'revision_champion', name: 'Revision Champion', description: 'Revise 10 topics', icon: '🔄', xp: 20, unlocked: false },
  { id: 'note_taker', name: 'Note Taker', description: 'Create 5 study notes', icon: '📝', xp: 15, unlocked: false },
  { id: 'flashcard_pro', name: 'Flashcard Pro', description: 'Review 50 flashcards', icon: '🃏', xp: 25, unlocked: false },
  { id: 'study_10h', name: 'Study Marathon', description: 'Accumulate 10 hours of study time', icon: '⏰', xp: 40, unlocked: false },
  { id: 'subject_explorer', name: 'Subject Explorer', description: 'Study 5 different subjects', icon: '🗺️', xp: 20, unlocked: false },
];

// Helper functions
function getItem(key) {
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem(STORE_PREFIX + key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

function setItem(key, value) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage write failed:', e);
  }
}

function removeItem(key) {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORE_PREFIX + key);
}

// Store API
export const store = {
  // User
  getUser() {
    return getItem('user') || { ...defaultUserData };
  },

  saveUser(data) {
    const user = { ...this.getUser(), ...data };
    setItem('user', user);
    return user;
  },

  // Subjects
  getSubjects() {
    return getItem('subjects') || [...defaultSubjects];
  },

  saveSubjects(subjects) {
    setItem('subjects', subjects);
  },

  addSubject(subject) {
    const subjects = this.getSubjects();
    subjects.push({
      id: subject.name.toLowerCase().replace(/\s+/g, '_'),
      name: subject.name,
      icon: subject.icon || '📖',
      color: subject.color || '#6366f1',
      chapters: subject.chapters || [],
      progress: 0,
      totalTopics: 0,
      completedTopics: 0,
    });
    this.saveSubjects(subjects);
    return subjects;
  },

  updateSubjectProgress(subjectId, completedTopics) {
    const subjects = this.getSubjects();
    const idx = subjects.findIndex(s => s.id === subjectId);
    if (idx !== -1) {
      subjects[idx].completedTopics = completedTopics;
      subjects[idx].progress = subjects[idx].totalTopics > 0
        ? Math.round((completedTopics / subjects[idx].totalTopics) * 100)
        : 0;
      this.saveSubjects(subjects);
    }
    return subjects;
  },

  // Quiz Results
  getQuizResults() {
    return getItem('quizResults') || [];
  },

  saveQuizResult(result) {
    const results = this.getQuizResults();
    results.unshift({
      ...result,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    });
    setItem('quizResults', results);
    this.addXP(result.score >= 80 ? 20 : result.score >= 50 ? 10 : 5);
    return results;
  },

  // Flashcards
  getFlashcards() {
    return getItem('flashcards') || [];
  },

  saveFlashcards(cards) {
    setItem('flashcards', cards);
  },

  addFlashcardSet(set) {
    const cards = this.getFlashcards();
    cards.unshift({
      ...set,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    });
    this.saveFlashcards(cards);
    return cards;
  },

  // Notes
  getNotes() {
    return getItem('notes') || [];
  },

  saveNote(note) {
    const notes = this.getNotes();
    const existingIdx = notes.findIndex(n => n.id === note.id);
    if (existingIdx !== -1) {
      notes[existingIdx] = { ...notes[existingIdx], ...note, updatedAt: new Date().toISOString() };
    } else {
      notes.unshift({
        ...note,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    setItem('notes', notes);
    return notes;
  },

  deleteNote(id) {
    const notes = this.getNotes().filter(n => n.id !== id);
    setItem('notes', notes);
    return notes;
  },

  // Study Plans
  getStudyPlans() {
    return getItem('studyPlans') || [];
  },

  saveStudyPlan(plan) {
    const plans = this.getStudyPlans();
    plans.unshift({
      ...plan,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    });
    setItem('studyPlans', plans);
    return plans;
  },

  updateStudyPlan(planId, updates) {
    const plans = this.getStudyPlans();
    const idx = plans.findIndex(p => p.id === planId);
    if (idx !== -1) {
      plans[idx] = { ...plans[idx], ...updates };
      setItem('studyPlans', plans);
    }
    return plans;
  },

  // Chat History
  getChatHistory() {
    return getItem('chatHistory') || [];
  },

  saveChatMessage(message) {
    const history = this.getChatHistory();
    history.push({
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    });
    // Keep last 200 messages
    if (history.length > 200) history.splice(0, history.length - 200);
    setItem('chatHistory', history);
    return history;
  },

  clearChatHistory() {
    setItem('chatHistory', []);
  },

  // Study Sessions
  getStudySessions() {
    return getItem('studySessions') || [];
  },

  saveStudySession(session) {
    const sessions = this.getStudySessions();
    sessions.unshift({
      ...session,
      id: Date.now().toString(),
      endedAt: new Date().toISOString(),
    });
    setItem('studySessions', sessions);

    // Update total study time
    const user = this.getUser();
    user.totalStudyMinutes = (user.totalStudyMinutes || 0) + (session.duration || 0);
    this.saveUser(user);

    return sessions;
  },

  // XP & Leveling
  addXP(amount) {
    const user = this.getUser();
    user.xp = (user.xp || 0) + amount;
    while (user.xp >= user.xpToNextLevel) {
      user.xp -= user.xpToNextLevel;
      user.level = (user.level || 1) + 1;
      user.xpToNextLevel = Math.floor(user.xpToNextLevel * 1.5);
    }
    this.saveUser(user);
    return user;
  },

  // Streak
  updateStreak() {
    const user = this.getUser();
    const today = new Date().toDateString();
    const lastStudy = user.lastStudyDate ? new Date(user.lastStudyDate).toDateString() : null;

    if (lastStudy !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastStudy === yesterday.toDateString()) {
        user.streak = (user.streak || 0) + 1;
      } else if (lastStudy !== today) {
        user.streak = 1;
      }
      user.lastStudyDate = new Date().toISOString();
      this.saveUser(user);
    }
    return user;
  },

  // Achievements
  getAchievements() {
    return getItem('achievements') || [...defaultAchievements];
  },

  unlockAchievement(id) {
    const achievements = this.getAchievements();
    const idx = achievements.findIndex(a => a.id === id);
    if (idx !== -1 && !achievements[idx].unlocked) {
      achievements[idx].unlocked = true;
      achievements[idx].unlockedAt = new Date().toISOString();
      setItem('achievements', achievements);
      this.addXP(achievements[idx].xp);
      return achievements[idx];
    }
    return null;
  },

  // Activity
  getRecentActivity() {
    return getItem('activity') || [];
  },

  logActivity(activity) {
    const activities = this.getRecentActivity();
    activities.unshift({
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    });
    if (activities.length > 50) activities.splice(50);
    setItem('activity', activities);
    return activities;
  },

  // Weekly stats
  getWeeklyStats() {
    const sessions = this.getStudySessions();
    const quizzes = this.getQuizResults();
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weekSessions = sessions.filter(s => new Date(s.endedAt) > weekAgo);
    const weekQuizzes = quizzes.filter(q => new Date(q.date) > weekAgo);

    const dailyMinutes = [0, 0, 0, 0, 0, 0, 0];
    weekSessions.forEach(s => {
      const day = (new Date(s.endedAt).getDay() + 6) % 7; // Mon=0
      dailyMinutes[day] += s.duration || 0;
    });

    return {
      totalMinutes: weekSessions.reduce((sum, s) => sum + (s.duration || 0), 0),
      totalQuizzes: weekQuizzes.length,
      avgScore: weekQuizzes.length > 0
        ? Math.round(weekQuizzes.reduce((sum, q) => sum + q.score, 0) / weekQuizzes.length)
        : 0,
      dailyMinutes,
    };
  },

  // Settings
  getSettings() {
    const user = this.getUser();
    return user.settings || defaultUserData.settings;
  },

  saveSettings(settings) {
    const user = this.getUser();
    user.settings = { ...user.settings, ...settings };
    this.saveUser(user);
    return user.settings;
  },

  // Reset all data
  resetAll() {
    if (typeof window === 'undefined') return;
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  },
};
