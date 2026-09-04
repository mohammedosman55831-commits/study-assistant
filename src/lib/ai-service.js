/* ============================================
   AI SERVICE — Abstraction Layer
   ============================================ */

/**
 * AI Service with mock fallback.
 * When NEXT_PUBLIC_AI_PROVIDER is not set, uses intelligent mock responses.
 * To connect a real API, set environment variables:
 *   - OPENAI_API_KEY
 *   - OPENAI_BASE_URL (optional, defaults to OpenAI)
 *   - OPENAI_MODEL (optional, defaults to gpt-4o-mini)
 */

export async function callAI(messages, options = {}) {
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        mode: options.mode || 'standard',
        subject: options.subject || '',
        type: options.type || 'chat',
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `AI request failed (${response.status})`);
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
}

export async function generateQuiz(options) {
  try {
    const response = await fetch('/api/ai/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Quiz generation failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Quiz Generation Error:', error);
    throw error;
  }
}

export async function generateFlashcards(options) {
  try {
    const response = await fetch('/api/ai/flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Flashcard generation failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Flashcard Generation Error:', error);
    throw error;
  }
}

export async function generateStudyPlan(options) {
  try {
    const response = await fetch('/api/ai/planner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Study plan generation failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Study Plan Error:', error);
    throw error;
  }
}

export async function processNote(noteContent, action) {
  try {
    const response = await fetch('/api/ai/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: noteContent, action }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Note processing failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Note Processing Error:', error);
    throw error;
  }
}
