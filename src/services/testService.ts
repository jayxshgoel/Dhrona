import { Test, TestAttempt, TestConfig } from '../types';
import { MOCK_TESTS, MOCK_ATTEMPTS } from './mock/data';

let tests = [...MOCK_TESTS];
let attempts = [...MOCK_ATTEMPTS];

export function getTestsByTeacher(teacherId: string): Test[] {
  return tests.filter((t) => t.createdBy === teacherId);
}

export function getTestsForStudent(studentId: string, batchIds: string[]): Test[] {
  return tests.filter(
    (t) =>
      t.status !== 'draft' &&
      (batchIds.some((b) => t.batchIds.includes(b)) ||
        t.studentIds?.includes(studentId)),
  );
}

export function getTestById(id: string): Test | undefined {
  return tests.find((t) => t.id === id);
}

export function createTest(test: Omit<Test, 'id' | 'createdAt'>): Test {
  const newTest: Test = {
    ...test,
    id: `test-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  tests = [newTest, ...tests];
  return newTest;
}

export function updateTestStatus(id: string, status: Test['status']): void {
  tests = tests.map((t) => (t.id === id ? { ...t, status } : t));
}

export function submitAttempt(
  testId: string,
  studentId: string,
  answers: Record<string, string | number>,
  flagged: string[],
  timeTaken: number,
): TestAttempt {
  const test = tests.find((t) => t.id === testId);
  if (!test) throw new Error('Test not found');

  let score = 0;
  // Scoring will be handled by grading service in production
  score = Math.floor(Math.random() * test.config.totalMarks * 0.8);

  const attempt: TestAttempt = {
    id: `attempt-${Date.now()}`,
    testId,
    studentId,
    answers,
    flagged,
    score,
    totalMarks: test.config.totalMarks,
    submittedAt: new Date().toISOString(),
    timeTaken,
    rank: Math.floor(Math.random() * 20) + 1,
    percentile: Math.floor(Math.random() * 40) + 60,
  };

  attempts = [attempt, ...attempts];
  return attempt;
}

export function getAttemptsByStudent(studentId: string): TestAttempt[] {
  return attempts.filter((a) => a.studentId === studentId);
}

export function getAttemptByTestAndStudent(
  testId: string,
  studentId: string,
): TestAttempt | undefined {
  return attempts.find((a) => a.testId === testId && a.studentId === studentId);
}

export function getTestConfig(test: Test): TestConfig {
  return test.config;
}
