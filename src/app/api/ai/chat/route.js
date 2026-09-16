/* ============================================
   AI CHAT API ROUTE
   Handles all tutoring/chat requests
   Hides API key server-side
   ============================================ */

import { NextResponse } from 'next/server';
import { getMockTutorResponse, getMockSolverResponse } from '@/lib/mock-ai';
import { solveMathProblem } from '@/lib/math-solver';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const systemPrompts = {
  beginner: `You are a friendly, patient Furqan NovaAI for young students. Explain everything in the simplest possible language. Use analogies, examples from everyday life, and short sentences. Avoid jargon. Use emojis to make learning fun. After explaining, ask a simple question to check understanding.`,

  standard: `You are a knowledgeable Furqan NovaAI for students. Explain concepts clearly with examples. Use proper terminology but make it accessible. Structure your responses with headers and steps. Include practice questions when relevant. Be encouraging and supportive.`,

  deep: `You are an advanced Furqan NovaAI providing comprehensive explanations. Go deep into the underlying principles, mathematical derivations, historical context, and interconnections between topics. Include formal definitions, proofs where relevant, and advanced examples. Still maintain clarity.`,

  exam: `You are an exam preparation tutor. Focus on: key definitions, important formulas, common exam questions, marking schemes, typical mistakes to avoid, and memory techniques. Structure content for quick revision. Highlight what examiners look for. Include practice questions in exam format.`,

  socratic: `You are a Socratic tutor. Instead of giving direct answers, guide students with thought-provoking questions. Lead them to discover answers themselves. Ask "What do you think happens when...?", "Can you see a pattern?", "Why might that be?". Only give the answer after the student has attempted it. Always be encouraging.`,
};

const solverPrompt = `You are an AI question solver. When given a question, respond in this exact structure:

### â“ QUESTION
[Restate the question]

### ðŸŽ¯ WHAT WE NEED TO FIND
[What we need to solve for]

### ðŸ“– CONCEPT
[The underlying concept/formula]

### ðŸ“ STEP-BY-STEP EXPLANATION
[Detailed steps with calculations]

### âœ… FINAL ANSWER
[Clear final answer]

### ðŸ’¡ WHY THIS METHOD WORKS
[Brief explanation of the methodology]

### ðŸ§ª TRY IT YOURSELF
[A similar practice question for the student]

Format math equations clearly. Be encouraging and educational.`;

export async function POST(request) {
  try {
    const body = await request.json();
    const { messages, mode = 'standard', type = 'chat', syllabusContext = null } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1]?.content || '';

    // Fast & accurate calculation for deterministic math/trig/algebra
    if (type === 'solver') {
      const mathResult = solveMathProblem(lastMessage);
      if (
        mathResult.type === 'trigonometry' ||
        mathResult.type === 'arithmetic' ||
        mathResult.type === 'algebra'
      ) {
        return NextResponse.json({
          content: mathResult.content,
          mock: false,
          problemType: mathResult.type,
        });
      }
    }

    // If no API key, use mock responses
    if (!OPENAI_API_KEY) {
      // Simulate network delay for realism
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

      let content;

      if (type === 'solver') {
        content = getMockSolverResponse(lastMessage);
      } else {
        content = getMockTutorResponse(messages, mode, syllabusContext);
      }

      return NextResponse.json({
        content,
        mock: true,
        message: 'Using mock AI. Set OPENAI_API_KEY to use real AI.',
      });
    }

    // Real AI call
    let systemMessage = type === 'solver'
      ? solverPrompt
      : (systemPrompts[mode] || systemPrompts.standard);

    if (type === 'chat') {
      systemMessage += `

### AI STUDY ACTION RULES
When the user's message requests a specific study action, follow that action exactly.

- If asked to "Give a NEW real-world example":
  Give ONLY one new example. Do not repeat a full explanation of the topic.
  Start directly with the example, then explain the situation, what happens,
  how it demonstrates the concept, and one simple takeaway.

- If asked to "Give me one practice question":
  Give ONLY one practice question.
  Do not solve it and do not explain the topic first.
  Wait for the student's answer before checking it.

- If asked for a "hint":
  Give ONLY a helpful hint. Do not reveal the complete solution.

- If asked to "Explain Simply":
  Give a simple explanation with an easy example.

- If asked for MCQs:
  Generate the requested multiple-choice questions with four options each.
`;
    }

    if (syllabusContext) {
      const { stream, streamFullName, year, subject, chapter, topic, action } = syllabusContext;
      systemMessage += `\n\n### INTERMEDIATE SYLLABUS CONTEXT:
Target Academic Level: Intermediate / Higher Secondary (${year || 'Class 11-12'})
Stream: ${stream || 'MPC'} (${streamFullName || ''})
Subject: ${subject || ''}
Chapter: ${chapter || ''}
Topic: ${topic || ''}
Requested Mode/Action: ${action || 'Explain Topic'}

SPECIALIZED INSTRUCTIONS FOR THIS INTERMEDIATE CONTEXT:
1. Explain concepts strictly calibrated to the Intermediate / Class 11-12 syllabus depth and rigour.
2. If asked for a simple explanation, use intuitive language and real-world analogies suitable for high school students while keeping scientific/mathematical correctness.
3. If asked for step-by-step problem solutions, format with clear given data, formulas, substitutions, intermediate steps, units, and final boxed answer.
4. If asked for MCQs, quizzes, or practice questions, generate 4-option questions with marked correct answer and concise pedagogical explanation.
5. If asked for chapter summaries or exam revision, highlight high-yield definitions, essential formulas, common mistakes, and board exam tips.
6. Use clean GitHub Markdown formatting with bold key terms, tables, and clear bullet points.`;
    }

    const apiMessages = [
      { role: 'system', content: systemMessage },
      ...messages.slice(-10), // Keep last 10 messages for context
    ];

    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 429) {
        return NextResponse.json({ error: 'Rate limit reached. Please wait a moment and try again.' }, { status: 429 });
      }

      return NextResponse.json(
        { error: errorData.error?.message || 'AI service error' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 500 });
    }

    return NextResponse.json({ content, mock: false });

  } catch (error) {
    console.error('AI Chat API Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

