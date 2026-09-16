'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { store } from '@/lib/store';
import { getMockQuizQuestions } from '@/lib/mock-ai';

// ============================================================
// COMPREHENSIVE PRACTICE QUESTION POOL ACROSS 6 MODES
// ============================================================
const GENERAL_MCQ_QUESTIONS = [
  {
    id: 'm1',
    category: 'Mathematics',
    topic: 'Algebra & Equations',
    difficulty: 'Beginner',
    question: 'What is the solution to the linear equation: 3x + 9 = 24?',
    options: ['x = 3', 'x = 5', 'x = 7', 'x = 9'],
    correct: 1,
    explanation: 'Subtract 9 from both sides: 3x = 15. Divide by 3: x = 5.',
  },
  {
    id: 'm2',
    category: 'Mathematics',
    topic: 'Trigonometry',
    difficulty: 'Intermediate',
    question: 'What is the exact value of sin(90Â°) + cos(0Â°)?',
    options: ['0', '1', '2', '0.5'],
    correct: 2,
    explanation: 'sin(90Â°) = 1 and cos(0Â°) = 1. Therefore, 1 + 1 = 2.',
  },
  {
    id: 'm3',
    category: 'Science',
    topic: 'Physics: Laws of Motion',
    difficulty: 'Intermediate',
    question: 'Which law of motion states that for every action there is an equal and opposite reaction?',
    options: ['Newtonâ€™s 1st Law', 'Newtonâ€™s 2nd Law', 'Newtonâ€™s 3rd Law', 'Law of Gravitation'],
    correct: 2,
    explanation: 'Newtonâ€™s Third Law states that every action force has an equal and opposite reaction force.',
  },
  {
    id: 'm4',
    category: 'Science',
    topic: 'Chemistry: Atomic Bonding',
    difficulty: 'Beginner',
    question: 'Which type of bond is formed when electrons are transferred between atoms?',
    options: ['Covalent Bond', 'Ionic Bond', 'Metallic Bond', 'Hydrogen Bond'],
    correct: 1,
    explanation: 'Ionic bonding involves the complete transfer of valence electrons between atoms.',
  },
  {
    id: 'm5',
    category: 'English',
    topic: 'Grammar & Vocabulary',
    difficulty: 'Beginner',
    question: 'Identify the adverb in this sentence: "The student solved the problem quickly."',
    options: ['student', 'solved', 'problem', 'quickly'],
    correct: 3,
    explanation: '"Quickly" is an adverb describing the verb "solved".',
  },
  {
    id: 'm6',
    category: 'Computer Science',
    topic: 'Data Structures',
    difficulty: 'Intermediate',
    question: 'Which data structure operates on a Last-In, First-Out (LIFO) principle?',
    options: ['Queue', 'Stack', 'Array', 'Linked List'],
    correct: 1,
    explanation: 'A Stack follows LIFO, where the last element inserted is the first to be popped.',
  },
];

const CODE_COMPLETION_QUESTIONS = [
  {
    id: 'cc1',
    category: 'Python',
    topic: 'Functions',
    difficulty: 'Beginner',
    task: 'Complete the Python function to calculate the square of a number:',
    codeSnippet: `def square(n):\n    # Fill in the missing return expression\n    return ________`,
    options: ['n * n', 'n + 2', 'n ^ 2', 'sq(n)'],
    correct: 0,
    hint: 'In Python, squaring a number is n * n or n ** 2.',
    explanation: 'return n * n multiplies n by itself to return its square.',
  },
  {
    id: 'cc2',
    category: 'Python',
    topic: 'Loops & Accumulators',
    difficulty: 'Intermediate',
    task: 'Complete the loop to calculate the sum of numbers from 1 to 5:',
    codeSnippet: `total = 0\nfor i in range(1, 6):\n    ________\nprint("Total:", total)`,
    options: ['total = i', 'total += i', 'total * i', 'i += total'],
    correct: 1,
    hint: 'Use the augmented assignment operator += to accumulate.',
    explanation: 'total += i adds the current iteration number i to the running sum total.',
  },
  {
    id: 'cc3',
    category: 'Python',
    topic: 'List Operations',
    difficulty: 'Beginner',
    task: 'Complete the statement to add "Orange" to the fruits list:',
    codeSnippet: `fruits = ["Apple", "Banana"]\nfruits.________("Orange")`,
    options: ['push', 'insert_last', 'append', 'add'],
    correct: 2,
    hint: 'Python lists use the .append() method to add items to the end.',
    explanation: 'fruits.append("Orange") adds the item to the end of the list in Python.',
  },
];

const PREDICT_OUTPUT_QUESTIONS = [
  {
    id: 'po1',
    category: 'Python',
    topic: 'Conditionals',
    difficulty: 'Beginner',
    snippet: `x = 15\nif x > 20:\n    print("A")\nelif x > 10:\n    print("B")\nelse:\n    print("C")`,
    question: 'What will be printed to the console?',
    options: ['A', 'B', 'C', 'A and B'],
    correct: 1,
    explanation: 'x is 15. The first condition (15 > 20) is False; the second condition (15 > 10) is True, so "B" is printed.',
  },
  {
    id: 'po2',
    category: 'Python',
    topic: 'Lists & Slicing',
    difficulty: 'Intermediate',
    snippet: `nums = [10, 20, 30, 40, 50]\nprint(nums[1:4])`,
    question: 'What is the output of the slice nums[1:4]?',
    options: ['[10, 20, 30]', '[20, 30, 40]', '[20, 30, 40, 50]', '[10, 20, 30, 40]'],
    correct: 1,
    explanation: 'Slice [1:4] starts at index 1 (20) and stops before index 4 (50), yielding [20, 30, 40].',
  },
  {
    id: 'po3',
    category: 'Python',
    topic: 'String Slicing & Negative Indexing',
    difficulty: 'Beginner',
    snippet: `word = "Python"\nprint(word[-1] + word[0])`,
    question: 'What is the output of this string expression?',
    options: ['nP', 'Pn', 'nohtyP', 'Error'],
    correct: 0,
    explanation: 'word[-1] is "n" (last letter) and word[0] is "P" (first letter). Concatenating them produces "nP".',
  },
];

const DEBUGGING_CHALLENGES = [
  {
    id: 'db1',
    category: 'Python',
    topic: 'Syntax & Types',
    difficulty: 'Beginner',
    buggyCode: `age = 16\nprint("I am " + age + " years old")`,
    question: 'Why does this code throw a TypeError when executed?',
    options: [
      'Missing semicolon at the end of the line',
      'Cannot concatenate a string with an integer using +',
      'The variable age must be capitalized',
      'print() cannot take strings',
    ],
    correct: 1,
    fixedCode: `age = 16\nprint(f"I am {age} years old")  # or print("I am " + str(age) + " years old")`,
    hint: 'In Python, string + integer is invalid. Use an f-string or str().',
    explanation: 'Python does not automatically convert integers to strings during concatenation. Use f"I am {age} years old" instead.',
  },
  {
    id: 'db2',
    category: 'Python',
    topic: 'Loops & Off-by-One Errors',
    difficulty: 'Intermediate',
    buggyCode: `# Wanted: numbers 1 to 5\nfor i in range(1, 5):\n    print(i)`,
    question: 'What is the bug in this loop intended to print 1 through 5?',
    options: [
      'It produces an infinite loop',
      'range(1, 5) stops at 4, omitting 5',
      'i is not initialized outside the loop',
      'print() needs formatting',
    ],
    correct: 1,
    fixedCode: `for i in range(1, 6):\n    print(i)  # range stops before end argument`,
    hint: 'Remember that range(start, stop) stops before the stop number.',
    explanation: 'To include 5, the stop parameter must be 6: range(1, 6).',
  },
];

const STEP_BY_STEP_PROBLEMS = [
  {
    id: 'sb1',
    title: 'Solving Quadratic Equation: xÂ² - 5x + 6 = 0',
    category: 'Mathematics',
    difficulty: 'Intermediate',
    steps: [
      {
        stepNum: 1,
        title: 'Step 1: Identify coefficients a, b, and c',
        instruction: 'For axÂ² + bx + c = 0, what are the values of a, b, c?',
        options: ['a=1, b=-5, c=6', 'a=1, b=5, c=6', 'a=0, b=-5, c=6', 'a=1, b=-5, c=-6'],
        correct: 0,
        hint: 'Compare xÂ² - 5x + 6 with axÂ² + bx + c.',
        explanation: 'Here a = 1, b = -5, and c = 6.',
      },
      {
        stepNum: 2,
        title: 'Step 2: Calculate Discriminant D = bÂ² - 4ac',
        instruction: 'What is D = (-5)Â² - 4(1)(6)?',
        options: ['D = 25 - 24 = 1', 'D = 25 + 24 = 49', 'D = -25 - 24 = -49', 'D = 0'],
        correct: 0,
        hint: '(-5)Â² is 25 and 4 Ã— 1 Ã— 6 is 24.',
        explanation: 'D = 25 - 24 = 1. Since D > 0, there are two distinct real roots.',
      },
      {
        stepNum: 3,
        title: 'Step 3: Apply Quadratic Formula x = (-b Â± âˆšD) / 2a',
        instruction: 'What are the two roots xâ‚ and xâ‚‚?',
        options: ['x = 2 and x = 3', 'x = -2 and x = -3', 'x = 1 and x = 6', 'x = 5 and x = 1'],
        correct: 0,
        hint: 'x = (5 Â± âˆš1) / 2 = (5 Â± 1) / 2.',
        explanation: '(5 + 1)/2 = 3 and (5 - 1)/2 = 2. Roots are x = 2 and x = 3.',
      },
    ],
  },
];

function PracticeContent() {
  const searchParams = useSearchParams();
  const subjectQuery = searchParams.get('subject') || 'all';

  const [activeMode, setActiveMode] = useState('mcq'); // 'mcq' | 'completion' | 'predict' | 'debug' | 'step_by_step'
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState(subjectQuery === 'python' ? 'Python' : 'All');

  // Question navigation state
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(store.getUser());
    try {
      const saved = localStorage.getItem('studyai_practice_completed');
      if (saved) setCompletedExercises(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    if (subjectQuery === 'python') {
      setSelectedCategory('Python');
    }
  }, [subjectQuery]);

  // Determine current active question list based on mode
  let currentQuestions = [];
  if (activeMode === 'mcq') currentQuestions = GENERAL_MCQ_QUESTIONS;
  else if (activeMode === 'completion') currentQuestions = CODE_COMPLETION_QUESTIONS;
  else if (activeMode === 'predict') currentQuestions = PREDICT_OUTPUT_QUESTIONS;
  else if (activeMode === 'debug') currentQuestions = DEBUGGING_CHALLENGES;
  else if (activeMode === 'step_by_step') currentQuestions = STEP_BY_STEP_PROBLEMS;

  // Filter questions by category and difficulty
  const filteredQuestions = currentQuestions.filter((q) => {
    const matchCat = selectedCategory === 'All' || q.category === selectedCategory || (selectedCategory === 'Python' && q.category === 'Python');
    const matchDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    return matchCat && matchDiff;
  });

  const activeQuestion = filteredQuestions[activeQuestionIdx] || filteredQuestions[0] || null;

  const handleModeChange = (mode) => {
    setActiveMode(mode);
    setActiveQuestionIdx(0);
    setSelectedAnswers({});
    setIsAnswerChecked(false);
    setShowHint(false);
    setShowSolution(false);
    setStepIndex(0);
  };

  const handleSelectOption = (optIdx) => {
    if (isAnswerChecked) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [activeQuestionIdx]: optIdx,
    }));
  };

  const handleCheckAnswer = () => {
    setIsAnswerChecked(true);
    const isCorrect = selectedAnswers[activeQuestionIdx] === activeQuestion?.correct;

    if (isCorrect) {
      store.addXP(15);
      const newCompleted = [...completedExercises, activeQuestion?.id].filter(Boolean);
      setCompletedExercises(newCompleted);
      try {
        localStorage.setItem('studyai_practice_completed', JSON.stringify(newCompleted));
      } catch {}
      store.logActivity({
        type: 'practice',
        title: `Solved Practice Challenge: ${activeQuestion?.topic || activeQuestion?.title}`,
      });
      setUser(store.getUser());
    }
  };

  const handleNextQuestion = () => {
    setIsAnswerChecked(false);
    setShowHint(false);
    setShowSolution(false);
    if (activeQuestionIdx < filteredQuestions.length - 1) {
      setActiveQuestionIdx((p) => p + 1);
    } else {
      setActiveQuestionIdx(0);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[activeQuestionIdx];
      return copy;
    });
    setIsAnswerChecked(false);
    setShowHint(false);
    setShowSolution(false);
  };

  return (
    <div className="page-container animate-fade-in" style={{ maxWidth: '1360px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* SECTION A: ADVANCED PRACTICE DASHBOARD */}
      <div
        className="card"
        style={{
          padding: '24px',
          marginBottom: '24px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '20px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '2.5rem' }}>ðŸŽ¯</span>
              <div>
                <h1 className="page-title" style={{ margin: 0, fontSize: '26px' }}>Practice & Problem Solving Center</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      background: 'rgba(99, 102, 241, 0.12)',
                      color: 'var(--accent-primary)',
                      padding: '2px 10px',
                      borderRadius: '9999px',
                    }}
                  >
                    6 Practice Modes Â· Validated Learning
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    Streak: <strong style={{ color: '#f59e0b' }}>ðŸ”¥ {user?.streak || 0} Days</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/coding" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              ðŸ Python Coding Hub
            </Link>
            <Link href="/quizzes" className="btn btn-outline btn-sm">
              ðŸ“ Quizzes
            </Link>
            <Link href="/flashcards" className="btn btn-ghost btn-sm">
              ðŸƒ Flashcards
            </Link>
            <Link href="/tutor" className="btn btn-ghost btn-sm">
              ðŸ¤– Ask Furqan NovaAI
            </Link>
          </div>
        </div>

        {/* Dashboard Metrics Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-light)',
          }}
        >
          <div style={{ background: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
              Solved Challenges
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
              {completedExercises.length} Completed
            </div>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Study XP
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>
              âš¡ {user?.xp || 0} XP
            </div>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
              Current Level
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '2px' }}>
              Level {user?.level || 1} Student
            </div>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
              Practice Track
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {selectedCategory} Â· {selectedDifficulty}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION B: 6 PRACTICE MODES NAVIGATION */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '10px',
          overflowX: 'auto',
          flexWrap: 'wrap',
        }}
      >
        {[
          { id: 'mcq', label: 'ðŸ”˜ Multiple Choice (MCQ)', icon: 'ðŸ“' },
          { id: 'completion', label: 'ðŸ§© Code Completion', icon: 'âš¡' },
          { id: 'predict', label: 'ðŸ”® Predict the Output', icon: 'ðŸ”' },
          { id: 'debug', label: 'ðŸž Debugging Challenge', icon: 'ðŸ› ï¸' },
          { id: 'step_by_step', label: 'ðŸªœ Step-by-Step Problem', icon: 'ðŸ“' },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => handleModeChange(m.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '10px',
              border: activeMode === m.id ? '1px solid var(--accent-primary)' : '1px solid var(--border)',
              background: activeMode === m.id ? 'var(--accent-primary)' : 'var(--bg-secondary)',
              color: activeMode === m.id ? '#ffffff' : 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{m.icon}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Filter Category & Difficulty Ribbon */}
      <div
        className="card"
        style={{
          padding: '14px 20px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Category:
          </span>
          {['All', 'Python', 'Mathematics', 'Science', 'English', 'Computer Science'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setActiveQuestionIdx(0);
                setIsAnswerChecked(false);
              }}
              style={{
                padding: '5px 12px',
                borderRadius: '16px',
                border: selectedCategory === cat ? '1px solid var(--accent-primary)' : '1px solid var(--border)',
                background: selectedCategory === cat ? 'var(--accent-primary-light)' : 'transparent',
                color: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Difficulty:
          </span>
          {['All', 'Beginner', 'Intermediate'].map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => {
                setSelectedDifficulty(diff);
                setActiveQuestionIdx(0);
                setIsAnswerChecked(false);
              }}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: selectedDifficulty === diff ? '1px solid var(--accent-primary)' : '1px solid var(--border)',
                background: selectedDifficulty === diff ? 'var(--accent-primary-light)' : 'transparent',
                color: selectedDifficulty === diff ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVE PRACTICE QUESTION PLAYER */}
      {activeMode !== 'step_by_step' ? (
        activeQuestion ? (
          <div className="card animate-fade-in" style={{ padding: '28px' }}>
            {/* Question Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--accent-primary)',
                    background: 'var(--accent-primary-light)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                  }}
                >
                  {activeQuestion.category} Â· {activeQuestion.topic || activeQuestion.difficulty}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                  Question {activeQuestionIdx + 1} of {filteredQuestions.length}
                </span>
              </div>

              {completedExercises.includes(activeQuestion.id) && (
                <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 700 }}>
                  âœ“ Mastered (+15 XP)
                </span>
              )}
            </div>

            {/* Task / Prompt / Code Snippet */}
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px 0', lineHeight: '1.5' }}>
              {activeQuestion.task || activeQuestion.question}
            </h2>

            {/* Code Snippet Box (for Code Completion, Predict Output, Debugging) */}
            {(activeQuestion.codeSnippet || activeQuestion.snippet || activeQuestion.buggyCode) && (
              <div
                style={{
                  background: '#0d1117',
                  color: '#e6edf3',
                  padding: '16px 20px',
                  borderRadius: '10px',
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  marginBottom: '20px',
                  border: '1px solid #30363d',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {activeQuestion.codeSnippet || activeQuestion.snippet || activeQuestion.buggyCode}
              </div>
            )}

            {/* Options Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {activeQuestion.options?.map((option, optIdx) => {
                const isSelected = selectedAnswers[activeQuestionIdx] === optIdx;
                let border = '1px solid var(--border)';
                let bg = 'var(--bg-secondary)';

                if (isAnswerChecked) {
                  if (optIdx === activeQuestion.correct) {
                    border = '1.5px solid #10b981';
                    bg = 'rgba(16, 185, 129, 0.12)';
                  } else if (isSelected) {
                    border = '1.5px solid #ef4444';
                    bg = 'rgba(239, 68, 68, 0.12)';
                  }
                } else if (isSelected) {
                  border = '1.5px solid var(--accent-primary)';
                  bg = 'var(--accent-primary-light)';
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={isAnswerChecked}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 18px',
                      borderRadius: '10px',
                      border,
                      background: bg,
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontWeight: 500,
                      textAlign: 'left',
                      cursor: isAnswerChecked ? 'default' : 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: isSelected ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                        color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                      }}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span style={{ flex: 1, fontFamily: activeMode === 'completion' ? 'var(--font-mono)' : 'inherit' }}>
                      {option}
                    </span>
                    {isAnswerChecked && optIdx === activeQuestion.correct && (
                      <span style={{ color: '#10b981', fontWeight: 700 }}>âœ“ Correct</span>
                    )}
                    {isAnswerChecked && isSelected && optIdx !== activeQuestion.correct && (
                      <span style={{ color: '#ef4444', fontWeight: 700 }}>âœ— Incorrect</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Feedback & Detailed Explanation */}
            {isAnswerChecked && (
              <div
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  background: 'var(--bg-tertiary)',
                  borderLeft: `4px solid ${selectedAnswers[activeQuestionIdx] === activeQuestion.correct ? '#10b981' : '#ef4444'}`,
                  marginBottom: '20px',
                  fontSize: '13px',
                  lineHeight: '1.6',
                }}
              >
                <strong style={{ color: selectedAnswers[activeQuestionIdx] === activeQuestion.correct ? '#059669' : '#dc2626' }}>
                  {selectedAnswers[activeQuestionIdx] === activeQuestion.correct ? 'ðŸŽ‰ Correct Answer!' : 'âŒ Incorrect.'}
                </strong>
                <div style={{ marginTop: '4px', color: 'var(--text-primary)' }}>
                  <strong>Explanation:</strong> {activeQuestion.explanation}
                </div>
                {activeQuestion.fixedCode && (
                  <div style={{ marginTop: '8px' }}>
                    <strong>Correct Code:</strong>
                    <pre style={{ background: '#0d1117', color: '#7ee787', padding: '10px', borderRadius: '6px', fontSize: '12px' }}>
                      {activeQuestion.fixedCode}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {showHint && activeQuestion.hint && (
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: 'var(--bg-tertiary)',
                  borderLeft: '3px solid #f59e0b',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  marginBottom: '16px',
                }}
              >
                <strong>Hint:</strong> {activeQuestion.hint}
              </div>
            )}

            {/* Bottom Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: '12px' }}
                >
                  {showHint ? 'Hide Hint' : 'ðŸ’¡ Need a Hint?'}
                </button>
                {isAnswerChecked && (
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '12px' }}
                  >
                    ðŸ”„ Retry
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                {!isAnswerChecked ? (
                  <button
                    type="button"
                    onClick={handleCheckAnswer}
                    disabled={selectedAnswers[activeQuestionIdx] === undefined}
                    className="btn btn-primary btn-sm"
                    style={{ padding: '8px 20px', fontSize: '13px' }}
                  >
                    Verify Answer âœ“
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="btn btn-primary btn-sm"
                    style={{ padding: '8px 20px', fontSize: '13px' }}
                  >
                    Next Question â†’
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No questions match this category/difficulty filter. Please select &quot;All&quot; to see available questions.
          </div>
        )
      ) : (
        /* STEP BY STEP PROBLEM SOLVING MODE */
        <div className="card animate-fade-in" style={{ padding: '28px' }}>
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
              Step-by-Step Problem Solving
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '6px 0 0 0' }}>
              {STEP_BY_STEP_PROBLEMS[0].title}
            </h2>
          </div>

          {/* Current Step */}
          {(() => {
            const currentStep = STEP_BY_STEP_PROBLEMS[0].steps[stepIndex];
            const isStepCorrect = selectedAnswers[`step_${stepIndex}`] === currentStep.correct;

            return (
              <div>
                <div style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '10px', marginBottom: '16px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 700 }}>
                    {currentStep.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {currentStep.instruction}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  {currentStep.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[`step_${stepIndex}`] === optIdx;
                    let border = '1px solid var(--border)';
                    let bg = 'var(--bg-secondary)';

                    if (isAnswerChecked) {
                      if (optIdx === currentStep.correct) {
                        border = '1.5px solid #10b981';
                        bg = 'rgba(16, 185, 129, 0.12)';
                      } else if (isSelected) {
                        border = '1.5px solid #ef4444';
                        bg = 'rgba(239, 68, 68, 0.12)';
                      }
                    } else if (isSelected) {
                      border = '1.5px solid var(--accent-primary)';
                      bg = 'var(--accent-primary-light)';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => setSelectedAnswers((p) => ({ ...p, [`step_${stepIndex}`]: optIdx }))}
                        disabled={isAnswerChecked}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border,
                          background: bg,
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                          textAlign: 'left',
                          cursor: isAnswerChecked ? 'default' : 'pointer',
                        }}
                      >
                        <span style={{ fontWeight: 700 }}>{String.fromCharCode(65 + optIdx)}.</span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {isAnswerChecked && (
                  <div
                    style={{
                      padding: '14px',
                      background: 'var(--bg-tertiary)',
                      borderRadius: '8px',
                      borderLeft: `4px solid ${isStepCorrect ? '#10b981' : '#ef4444'}`,
                      marginBottom: '16px',
                      fontSize: '13px',
                    }}
                  >
                    <strong>{isStepCorrect ? 'âœ“ Step Solved Correctly!' : 'âœ— Step Incorrect.'}</strong>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)' }}>
                      {currentStep.explanation}
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setStepIndex((p) => Math.max(0, p - 1));
                      setIsAnswerChecked(false);
                    }}
                    disabled={stepIndex === 0}
                    className="btn btn-ghost btn-sm"
                  >
                    â† Previous Step
                  </button>

                  {!isAnswerChecked ? (
                    <button
                      type="button"
                      onClick={() => setIsAnswerChecked(true)}
                      disabled={selectedAnswers[`step_${stepIndex}`] === undefined}
                      className="btn btn-primary btn-sm"
                    >
                      Verify Step âœ“
                    </button>
                  ) : stepIndex < STEP_BY_STEP_PROBLEMS[0].steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setStepIndex((p) => p + 1);
                        setIsAnswerChecked(false);
                      }}
                      className="btn btn-primary btn-sm"
                    >
                      Next Step â†’
                    </button>
                  ) : (
                    <span style={{ color: '#10b981', fontWeight: 700, fontSize: '13px' }}>
                      ðŸŽ‰ Entire Problem Solved! (+25 XP)
                    </span>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="page-container" style={{ padding: '40px', textAlign: 'center' }}>Loading Practice Center...</div>}>
      <PracticeContent />
    </Suspense>
  );
}

