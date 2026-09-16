'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { store } from '@/lib/store';
import { getMockFlashcards } from '@/lib/mock-ai';

const DEFAULT_DECKS = [
  {
    id: 'python_core',
    title: 'Python Core Essentials',
    subject: 'programming',
    icon: 'ðŸ',
    badgeColor: '#f59e0b',
    description: 'Master core Python terms: variables, lists, tuples, dictionaries, loops, and functions.',
    cards: [
      { front: 'What is a variable in Python?', back: 'A named memory location that stores a value (e.g., score = 100). Variables can hold numbers, strings, or data structures.' },
      { front: 'What is the key difference between a List and a Tuple?', back: 'Lists [] are MUTABLE (can be changed/appended), while Tuples () are IMMUTABLE (cannot be modified after creation).' },
      { front: 'What does the range(1, 6) function produce?', back: 'Generates integers from 1 up to (but not including) 6: [1, 2, 3, 4, 5].' },
      { front: 'What is a Python dictionary?', back: 'An unordered collection of key-value pairs written with curly braces { "name": "Alex", "age": 16 }.' },
      { front: 'What keyword defines a function in Python?', back: 'The def keyword (e.g., def calculate_total(price, tax): return price + tax).' },
      { front: 'What is a List Comprehension?', back: 'A concise syntax to generate lists: [x * 2 for x in range(1, 6)] produces [2, 4, 6, 8, 10].' },
      { front: 'What is the purpose of try...except blocks?', back: 'To handle runtime errors (exceptions) gracefully without crashing the application.' },
      { front: 'What does the len() function return?', back: 'The number of items in a string, list, tuple, dictionary, or set.' },
    ],
  },
  {
    id: 'math_algebra',
    title: 'Algebra & Trigonometry',
    subject: 'math',
    icon: 'ðŸ“',
    badgeColor: '#6366f1',
    description: 'Essential formulas for quadratic equations, trigonometric values, and logarithms.',
    cards: [
      { front: 'What is the Quadratic Formula?', back: 'x = (-b Â± âˆš(bÂ² - 4ac)) / (2a) for axÂ² + bx + c = 0.' },
      { front: 'What is the value of sin(30Â°) and cos(60Â°)?', back: 'Both sin(30Â°) and cos(60Â°) are equal to 1/2 (0.5).' },
      { front: 'What is the fundamental Pythagorean trigonometric identity?', back: 'sinÂ²(Î¸) + cosÂ²(Î¸) = 1 for any angle Î¸.' },
      { front: 'What is the slope-intercept equation of a line?', back: 'y = mx + c, where m is the slope and c is the y-intercept.' },
      { front: 'What is log(a Ã— b) equivalent to?', back: 'log(a) + log(b) by the product rule of logarithms.' },
    ],
  },
  {
    id: 'physics_mechanics',
    title: 'Physics: Laws & Energy',
    subject: 'physics',
    icon: 'âš›ï¸',
    badgeColor: '#3b82f6',
    description: 'Newtonâ€™s laws, kinetic & potential energy, gravity, and momentum.',
    cards: [
      { front: 'State Newtonâ€™s First Law of Motion', back: 'An object remains at rest or in uniform motion unless acted upon by a net external force (Inertia).' },
      { front: 'What is the formula for Kinetic Energy?', back: 'KE = 1/2 Ã— m Ã— vÂ², where m is mass and v is velocity.' },
      { front: 'What is the formula for Gravitational Potential Energy?', back: 'PE = m Ã— g Ã— h (mass Ã— acceleration due to gravity Ã— height).' },
      { front: 'State Newtonâ€™s Second Law formula', back: 'F = m Ã— a (Force equals mass times acceleration).' },
      { front: 'What is the standard value of acceleration due to gravity (g) on Earth?', back: 'g â‰ˆ 9.8 m/sÂ² (or approximately 9.81 m/sÂ²).' },
    ],
  },
  {
    id: 'chemistry_atoms',
    title: 'Chemistry: Structure & Bonds',
    subject: 'chemistry',
    icon: 'ðŸ§ª',
    badgeColor: '#10b981',
    description: 'Ionic vs covalent bonds, atomic subparticles, pH scale, and molar mass.',
    cards: [
      { front: 'What are the three subatomic particles in an atom?', back: 'Protons (positive charge), Neutrons (neutral charge), and Electrons (negative charge).' },
      { front: 'What is the difference between Ionic and Covalent bonds?', back: 'Ionic bonds form by the transfer of electrons between atoms; Covalent bonds form by the sharing of electron pairs.' },
      { front: 'What is the pH of a neutral solution at 25Â°C?', back: 'pH = 7. Values < 7 are acidic, and values > 7 are basic/alkaline.' },
      { front: 'What is Avogadroâ€™s Number?', back: '6.022 Ã— 10Â²Â³ particles per mole of a substance.' },
      { front: 'What is an exothermic reaction?', back: 'A chemical reaction that releases heat energy into its surroundings (Î”H < 0).' },
    ],
  },
  {
    id: 'biology_genetics',
    title: 'Biology: Cells & DNA',
    subject: 'biology',
    icon: 'ðŸ§¬',
    badgeColor: '#22c55e',
    description: 'Organelles, mitosis vs meiosis, DNA structure, and cellular respiration.',
    cards: [
      { front: 'What is known as the "Powerhouse of the Cell"?', back: 'Mitochondria, because they produce cellular energy in the form of ATP.' },
      { front: 'What are the four nucleotide nitrogenous bases in DNA?', back: 'Adenine (A), Thymine (T), Cytosine (C), and Guanine (G). A pairs with T, and C pairs with G.' },
      { front: 'What is the primary difference between Mitosis and Meiosis?', back: 'Mitosis creates 2 genetically identical diploid daughter cells; Meiosis creates 4 diverse haploid gametes.' },
      { front: 'What organelle contains chlorophyll for photosynthesis in plant cells?', back: 'Chloroplast.' },
    ],
  },
];

function FlashcardsContent() {
  const searchParams = useSearchParams();
  const subjectQuery = searchParams.get('subject') || 'all';

  const [decks, setDecks] = useState(DEFAULT_DECKS);
  const [selectedDeck, setSelectedDeck] = useState(DEFAULT_DECKS[0]);
  const [activeCards, setActiveCards] = useState(DEFAULT_DECKS[0].cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState({});
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [customSubject, setCustomSubject] = useState(subjectQuery === 'python' ? 'Python' : 'Mathematics');
  const [customTopic, setCustomTopic] = useState('');
  const [customCount, setCustomCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(store.getUser());
    const savedCustomDecks = store.getFlashcards();
    if (savedCustomDecks && savedCustomDecks.length > 0) {
      setDecks([...DEFAULT_DECKS, ...savedCustomDecks]);
    }
  }, []);

  useEffect(() => {
    if (subjectQuery === 'python') {
      const pythonDeck = decks.find((d) => d.id === 'python_core' || d.subject === 'programming');
      if (pythonDeck) {
        handleSelectDeck(pythonDeck);
      }
    }
  }, [subjectQuery]);

  const handleSelectDeck = (deck) => {
    setSelectedDeck(deck);
    setActiveCards(deck.cards);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev < activeCards.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : activeCards.length - 1));
  };

  const handleMarkMastered = () => {
    const cardId = `${selectedDeck.id}_${currentIndex}`;
    const newMastered = { ...masteredCards, [cardId]: true };
    setMasteredCards(newMastered);

    // Award XP
    store.addXP(5);
    store.unlockAchievement('flashcard_pro');
    store.logActivity({
      type: 'flashcard',
      title: `Mastered flashcard in ${selectedDeck.title}`,
    });
    setUser(store.getUser());

    handleNext();
  };

  const handleShuffleDeck = () => {
    const shuffled = [...activeCards].sort(() => Math.random() - 0.5);
    setActiveCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleResetDeck = () => {
    setActiveCards(selectedDeck.cards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredCards({});
  };

  const handleGenerateCustomDeck = async (e) => {
    if (e) e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: customSubject,
          topic: customTopic,
          count: customCount,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const newCards = data.cards && data.cards.length > 0 ? data.cards : getMockFlashcards(customSubject, customCount);
        const newDeck = {
          id: `custom_${Date.now()}`,
          title: customTopic ? `${customSubject}: ${customTopic}` : `${customSubject} AI Deck`,
          subject: customSubject.toLowerCase(),
          icon: customSubject.toLowerCase().includes('python') ? 'ðŸ' : 'ðŸƒ',
          badgeColor: '#8b5cf6',
          description: `AI-generated flashcards on ${customSubject}${customTopic ? ` - ${customTopic}` : ''}.`,
          cards: newCards,
        };

        const updated = [...decks, newDeck];
        setDecks(updated);
        store.addFlashcardSet(newDeck);
        handleSelectDeck(newDeck);
        setIsGeneratorOpen(false);
      } else {
        const mockCards = getMockFlashcards(customSubject, customCount);
        const newDeck = {
          id: `custom_${Date.now()}`,
          title: `${customSubject} Study Deck`,
          subject: customSubject.toLowerCase(),
          icon: 'ðŸƒ',
          badgeColor: '#8b5cf6',
          description: `Study flashcards for ${customSubject}.`,
          cards: mockCards,
        };
        const updated = [...decks, newDeck];
        setDecks(updated);
        store.addFlashcardSet(newDeck);
        handleSelectDeck(newDeck);
        setIsGeneratorOpen(false);
      }
    } catch {
      const mockCards = getMockFlashcards(customSubject, customCount);
      const newDeck = {
        id: `custom_${Date.now()}`,
        title: `${customSubject} Study Deck`,
        subject: customSubject.toLowerCase(),
        icon: 'ðŸƒ',
        badgeColor: '#8b5cf6',
        description: `Study flashcards for ${customSubject}.`,
        cards: mockCards,
      };
      const updated = [...decks, newDeck];
      setDecks(updated);
      handleSelectDeck(newDeck);
      setIsGeneratorOpen(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentCard = activeCards[currentIndex] || { front: 'No cards in this deck', back: 'Please select another deck' };
  const currentCardId = `${selectedDeck.id}_${currentIndex}`;
  const isCurrentMastered = masteredCards[currentCardId];
  const masteredCount = Object.keys(masteredCards).filter((k) => k.startsWith(selectedDeck.id)).length;
  const masteryPercent = activeCards.length > 0 ? Math.round((masteredCount / activeCards.length) * 100) : 0;

  return (
    <div className="page-container animate-fade-in" style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '2.2rem' }}>ðŸƒ</span>
            <h1 className="page-title" style={{ margin: 0 }}>Interactive Flashcards</h1>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                background: 'rgba(99, 102, 241, 0.12)',
                color: 'var(--accent-primary)',
                padding: '4px 10px',
                borderRadius: '9999px',
                border: '1px solid rgba(99, 102, 241, 0.25)',
              }}
            >
              Active Recall & Spaced Repetition
            </span>
          </div>
          <p className="page-subtitle" style={{ margin: 0 }}>
            Flip interactive study cards, test your active recall, and master key concepts across subjects.
          </p>
        </div>

        {/* Quick Nav Actions */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setIsGeneratorOpen(!isGeneratorOpen)}
            className="btn btn-primary btn-sm"
          >
            âœ¨ Generate AI Flashcards
          </button>
          <Link href="/practice" className="btn btn-outline btn-sm">
            âœï¸ Practice Center
          </Link>
          <Link href="/coding" className="btn btn-ghost btn-sm">
            ðŸ Python Coding
          </Link>
          <Link href="/tutor" className="btn btn-ghost btn-sm">
            ðŸ¤– Ask Furqan NovaAI
          </Link>
        </div>
      </div>

      {/* AI Generator Modal / Form */}
      {isGeneratorOpen && (
        <div className="card animate-fade-in" style={{ padding: '24px', marginBottom: '24px', border: '1.5px solid var(--accent-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>ðŸ¤–</span>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Generate Custom AI Flashcard Deck</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsGeneratorOpen(false)}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '11px' }}
            >
              âœ• Close
            </button>
          </div>

          <form onSubmit={handleGenerateCustomDeck} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                  Subject
                </label>
                <select
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                  }}
                >
                  <option value="Python">Python Programming</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="English">English</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                  Specific Topic / Key Concepts
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g. List Comprehensions, Newton's Laws, Periodic Table..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                  Cards Count
                </label>
                <select
                  value={customCount}
                  onChange={(e) => setCustomCount(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                  }}
                >
                  <option value={5}>5 Cards</option>
                  <option value={8}>8 Cards</option>
                  <option value={12}>12 Cards</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="btn btn-primary"
              style={{ alignSelf: 'flex-start', padding: '10px 22px', fontSize: '13px' }}
            >
              {isGenerating ? 'Generating Deck with AI...' : 'Create Flashcard Deck ðŸš€'}
            </button>
          </form>
        </div>
      )}

      {/* Deck Selector Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '8px',
          flexWrap: 'wrap',
        }}
      >
        {decks.map((deck) => {
          const isSelected = selectedDeck.id === deck.id;
          return (
            <button
              key={deck.id}
              type="button"
              onClick={() => handleSelectDeck(deck)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '12px',
                border: isSelected ? '1.5px solid var(--accent-primary)' : '1px solid var(--border)',
                background: isSelected ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                transition: 'all 0.15s ease',
              }}
            >
              <span>{deck.icon}</span>
              <span>{deck.title}</span>
              <span
                style={{
                  fontSize: '11px',
                  background: 'var(--bg-tertiary)',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  color: 'var(--text-tertiary)',
                }}
              >
                {deck.cards.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Flashcard Interactive Player */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', maxWidth: '780px', margin: '0 auto' }}>
        {/* Top Progress & Mastery Stats */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              Card {currentIndex + 1} of {activeCards.length}
            </span>
            {isCurrentMastered && (
              <span style={{ color: '#10b981', fontWeight: 700, fontSize: '11px' }}>
                âœ“ Mastered
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>
              Mastery: {masteredCount}/{activeCards.length} ({masteryPercent}%)
            </span>
            <button
              type="button"
              onClick={handleShuffleDeck}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '11px', padding: '4px 8px' }}
              title="Shuffle card order"
            >
              ðŸ”€ Shuffle
            </button>
            <button
              type="button"
              onClick={handleResetDeck}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '11px', padding: '4px 8px' }}
              title="Reset deck session"
            >
              ðŸ”„ Reset
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar" style={{ height: '6px' }}>
          <div
            className="progress-fill"
            style={{ width: `${((currentIndex + 1) / activeCards.length) * 100}%`, background: 'var(--accent-primary)' }}
          />
        </div>

        {/* 3D Flip Card */}
        <div
          onClick={handleFlipCard}
          style={{
            perspective: '1000px',
            cursor: 'pointer',
            minHeight: '280px',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              minHeight: '280px',
              textAlign: 'center',
              transition: 'transform 0.45s ease',
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Front Side */}
            <div
              className="card"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '36px 30px',
                borderRadius: '18px',
                border: '1.5px solid var(--border)',
                background: 'var(--bg-secondary)',
                boxShadow: 'var(--shadow-md)',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: selectedDeck.badgeColor || 'var(--accent-primary)',
                  }}
                >
                  {selectedDeck.title}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                  Question Prompt
                </span>
              </div>

              <div style={{ padding: '20px 0' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: '1.5', margin: 0 }}>
                  {currentCard.front}
                </h2>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>
                ðŸ”„ Tap or Click anywhere to reveal answer
              </div>
            </div>

            {/* Back Side */}
            <div
              className="card"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '36px 30px',
                borderRadius: '18px',
                border: '1.5px solid var(--accent-primary)',
                background: 'var(--bg-tertiary)',
                boxShadow: 'var(--shadow-lg)',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#10b981' }}>
                  âœ“ Key Takeaway & Answer
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                  Answer Explanation
                </span>
              </div>

              <div style={{ padding: '20px 0' }}>
                <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: '1.6', margin: 0 }}>
                  {currentCard.back}
                </p>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 500 }}>
                ðŸ”„ Tap to flip back to question
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls Toolbar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '8px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <button
            type="button"
            onClick={handlePrev}
            className="btn btn-outline btn-sm"
            style={{ padding: '8px 18px' }}
          >
            â† Previous
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={handleFlipCard}
              className="btn btn-ghost btn-sm"
              style={{ padding: '8px 16px' }}
            >
              ðŸ”„ Flip Card
            </button>

            <button
              type="button"
              onClick={handleMarkMastered}
              className="btn btn-primary btn-sm"
              style={{
                padding: '8px 20px',
                background: '#10b981',
                borderColor: '#10b981',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              âœ“ Mastered (+5 XP)
            </button>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="btn btn-outline btn-sm"
            style={{ padding: '8px 18px' }}
          >
            Next â†’
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FlashcardsPage() {
  return (
    <Suspense fallback={<div className="page-container" style={{ padding: '40px', textAlign: 'center' }}>Loading Flashcards...</div>}>
      <FlashcardsContent />
    </Suspense>
  );
}

