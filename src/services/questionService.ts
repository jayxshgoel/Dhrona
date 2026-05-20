import { GenerateQuestionsParams, Question } from '../types';
import { MOCK_QUESTIONS } from './mock/data';

let questionBank = [...MOCK_QUESTIONS];

export async function generateQuestions(params: GenerateQuestionsParams): Promise<Question[]> {
  await new Promise((r) => setTimeout(r, 2500));

  const templates = [
    {
      content: `In the context of ${params.chapter}, which statement best describes the underlying principle?`,
      options: [
        'The system always minimizes its energy state',
        'Conservation laws determine the final state',
        'Equilibrium depends on external conditions',
        'None of the above',
      ],
      correctAnswer: 'Conservation laws determine the final state',
      explanation: `This follows directly from the fundamental laws governing ${params.chapter}.`,
    },
    {
      content: `A standard problem from ${params.chapter}: Calculate the resultant when the initial conditions are at standard reference values.`,
      options: ['0', '1', '√2', '2'],
      correctAnswer: '√2',
      explanation: `Applying the primary formula of ${params.chapter} under reference conditions yields √2.`,
    },
    {
      content: `Which of the following is a direct consequence of the main theorem in ${params.chapter}?`,
      options: [
        'Energy is always conserved',
        'The rate of change equals the net flux',
        'Equilibrium requires zero net force',
        'All interactions are reversible',
      ],
      correctAnswer: 'The rate of change equals the net flux',
      explanation: `The divergence theorem, applied to ${params.chapter}, gives this result.`,
    },
    {
      content: `A numerical question from ${params.chapter}: If the primary quantity doubles, by what factor does the output change?`,
      options: ['1', '√2', '2', '4'],
      correctAnswer: '2',
      explanation: `The relationship in ${params.chapter} is linear, so doubling the input doubles the output.`,
    },
    {
      content: `Which experimental observation is most consistent with the theory of ${params.chapter}?`,
      options: [
        'Measurement increases with temperature',
        'Output is independent of initial conditions',
        'The response is proportional to the driving force',
        'System collapses to lowest energy mode',
      ],
      correctAnswer: 'The response is proportional to the driving force',
      explanation: `Linear response theory in ${params.chapter} predicts proportionality.`,
    },
  ];

  const generated: Question[] = Array.from({ length: params.count }, (_, i) => {
    const template = templates[i % templates.length];
    return {
      id: `gen-${Date.now()}-${i}`,
      subject: params.subject,
      chapter: params.chapter,
      difficulty: params.difficulty,
      type: params.type,
      examType: params.examType,
      content: template.content,
      options: params.type === 'MCQ' ? template.options : undefined,
      correctAnswer: params.type === 'Integer Type' ? i + 1 : template.correctAnswer,
      explanation: template.explanation,
      marks: params.examType === 'JEE Advanced' ? 3 : 4,
      createdAt: new Date().toISOString(),
      createdBy: 'teacher-1',
    };
  });

  return generated;
}

export function getQuestionBank(): Question[] {
  return questionBank;
}

export function saveQuestionsToBank(questions: Question[]): void {
  questionBank = [...questionBank, ...questions];
}

export function deleteQuestion(id: string): void {
  questionBank = questionBank.filter((q) => q.id !== id);
}

export function getQuestionById(id: string): Question | undefined {
  return questionBank.find((q) => q.id === id);
}

export function searchQuestions(query: string): Question[] {
  const lower = query.toLowerCase();
  return questionBank.filter(
    (q) =>
      q.content.toLowerCase().includes(lower) ||
      q.subject.toLowerCase().includes(lower) ||
      q.chapter.toLowerCase().includes(lower),
  );
}
