import { NextResponse } from 'next/server';
import { getMockNoteSummary } from '@/lib/mock-ai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const actionPrompts = {
  summarize: 'Summarize the following study notes into clear, concise key points.',
  explain: 'Explain the following study notes in very simple language, as if explaining to a beginner.',
  quiz: 'Generate a short quiz (3-5 questions) based on the following notes. Include answers.',
  important: 'Extract and highlight the most important points, definitions, and formulas from these notes.',
  flashcards: 'Generate flashcards (question on front, answer on back) from these notes.',
};

export async function POST(request) {
  try {
    const { content, action } = await request.json();

    if (!content || !action) {
      return NextResponse.json({ error: 'Content and action are required' }, { status: 400 });
    }

    if (!OPENAI_API_KEY) {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
      const result = getMockNoteSummary(content, action);
      return NextResponse.json({ result, mock: true });
    }

    const prompt = `${actionPrompts[action] || 'Process the following notes:'}\n\n${content}`;

    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: 'You are an educational AI assistant. Help students with their notes.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Note processing failed' }, { status: response.status });
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;

    return NextResponse.json({ result, mock: false });

  } catch (error) {
    console.error('Notes API Error:', error);
    return NextResponse.json({ error: 'Note processing failed' }, { status: 500 });
  }
}
