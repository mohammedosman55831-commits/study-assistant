import { NextResponse } from 'next/server';
import { getMockFlashcards } from '@/lib/mock-ai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export async function POST(request) {
  try {
    const { subject, chapter, topic, count } = await request.json();
    const numCards = Math.min(count || 5, 20);

    if (!OPENAI_API_KEY) {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
      const cards = getMockFlashcards(subject, numCards);
      return NextResponse.json({ cards, mock: true });
    }

    const prompt = `Generate ${numCards} flashcards about ${subject}${chapter ? ` - ${chapter}` : ''}${topic ? ` - ${topic}` : ''}.

Return a JSON array where each object has:
- "front": the question or prompt
- "back": the answer with a brief explanation

Return ONLY valid JSON array, no other text.`;

    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: 'You are an educational flashcard generator. Return ONLY valid JSON.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Flashcard generation failed' }, { status: response.status });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      const cards = JSON.parse(jsonMatch ? jsonMatch[0] : content);
      return NextResponse.json({
        cards: cards.map((c, idx) => ({ ...c, id: idx + 1, difficulty: 'medium', reviewed: false })),
        mock: false,
      });
    } catch {
      const cards = getMockFlashcards(subject, numCards);
      return NextResponse.json({ cards, mock: true });
    }

  } catch (error) {
    console.error('Flashcard API Error:', error);
    return NextResponse.json({ error: 'Flashcard generation failed' }, { status: 500 });
  }
}
