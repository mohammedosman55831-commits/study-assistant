import { NextResponse } from 'next/server';
import { getMockQuizQuestions } from '@/lib/mock-ai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export async function POST(request) {
  try {
    const { subject, chapter, topic, difficulty, count, questionType } = await request.json();

    if (!subject) {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    }

    const numQuestions = Math.min(count || 5, 20);

    // Mock mode
    if (!OPENAI_API_KEY) {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));
      const questions = getMockQuizQuestions(subject, numQuestions, difficulty);
      return NextResponse.json({ questions, mock: true });
    }

    // Real AI quiz generation
    const prompt = `Generate exactly ${numQuestions} ${difficulty || 'medium'} difficulty quiz questions about ${subject}${chapter ? ` - ${chapter}` : ''}${topic ? ` - ${topic}` : ''}.

Question type: ${questionType || 'multiple_choice'}

Return a JSON array of questions. Each question object must have:
- "question": the question text
- "options": array of 4 answer options (for multiple choice)
- "correct": index of correct answer (0-3)
- "explanation": why the correct answer is right

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
          { role: 'system', content: 'You are a quiz generator. Return ONLY valid JSON.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Quiz generation failed' }, { status: response.status });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    try {
      // Try to parse JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      const questions = JSON.parse(jsonMatch ? jsonMatch[0] : content);
      return NextResponse.json({
        questions: questions.map((q, idx) => ({ ...q, id: idx + 1, difficulty })),
        mock: false,
      });
    } catch {
      // If parsing fails, fall back to mock
      const questions = getMockQuizQuestions(subject, numQuestions, difficulty);
      return NextResponse.json({ questions, mock: true });
    }

  } catch (error) {
    console.error('Quiz API Error:', error);
    return NextResponse.json({ error: 'Quiz generation failed' }, { status: 500 });
  }
}
