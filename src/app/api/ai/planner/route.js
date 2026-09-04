import { NextResponse } from 'next/server';
import { getMockStudyPlan } from '@/lib/mock-ai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export async function POST(request) {
  try {
    const { subjects, examDate, hoursPerDay, importantChapters, knowledgeLevel } = await request.json();

    if (!subjects || subjects.length === 0) {
      return NextResponse.json({ error: 'At least one subject is required' }, { status: 400 });
    }

    if (!OPENAI_API_KEY) {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));
      const plan = getMockStudyPlan(subjects, examDate, hoursPerDay);
      return NextResponse.json({ plan, mock: true });
    }

    const prompt = `Create a weekly study schedule for a student with these parameters:
- Subjects: ${subjects.join(', ')}
- Exam date: ${examDate || 'Not specified'}
- Available study time: ${hoursPerDay || 2} hours per day
- Important chapters: ${importantChapters || 'Not specified'}
- Current knowledge level: ${knowledgeLevel || 'Intermediate'}

Return a JSON array for each day (Monday-Sunday). Each day should have:
- "day": day name
- "tasks": array of tasks, each with "subject", "topic", "duration" (in minutes), "type" (study/revision/practice)

Return ONLY valid JSON array.`;

    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: 'You are a study planner AI. Return ONLY valid JSON.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Plan generation failed' }, { status: response.status });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      const plan = JSON.parse(jsonMatch ? jsonMatch[0] : content);
      return NextResponse.json({ plan, mock: false });
    } catch {
      const plan = getMockStudyPlan(subjects, examDate, hoursPerDay);
      return NextResponse.json({ plan, mock: true });
    }

  } catch (error) {
    console.error('Planner API Error:', error);
    return NextResponse.json({ error: 'Study plan generation failed' }, { status: 500 });
  }
}
