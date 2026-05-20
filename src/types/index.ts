export type UserRole = 'teacher' | 'student' | 'parent';
export type UserTier = 'free' | 'premium' | 'institution';
export type Subject = 'Physics' | 'Chemistry' | 'Mathematics' | 'Biology';
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Previous Year';
export type QuestionType =
  | 'MCQ'
  | 'Assertion-Reason'
  | 'Match the Column'
  | 'Integer Type'
  | 'Short Answer';
export type ExamType = 'JEE Mains' | 'JEE Advanced' | 'NEET' | 'CBSE';

export interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  tier: UserTier;
  avatar?: string;
}

export interface Teacher extends User {
  role: 'teacher';
  institution?: string;
  batchIds: string[];
}

export interface Student extends User {
  role: 'student';
  batchIds: string[];
  parentId?: string;
  examType: ExamType;
}

export interface Parent extends User {
  role: 'parent';
  childIds: string[];
}

export interface Question {
  id: string;
  subject: Subject;
  chapter: string;
  difficulty: Difficulty;
  type: QuestionType;
  examType: ExamType;
  content: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  marks: number;
  createdAt: string;
  createdBy: string;
}

export interface TestConfig {
  timeLimit: number;
  marksPerQuestion: number;
  negativeMarking: boolean;
  negativeMarksFraction: number;
  totalMarks: number;
}

export interface Test {
  id: string;
  title: string;
  examType: ExamType;
  subject?: Subject;
  createdBy: string;
  batchIds: string[];
  studentIds?: string[];
  questionIds: string[];
  config: TestConfig;
  scheduledAt: string;
  dueAt: string;
  status: 'draft' | 'published' | 'active' | 'completed';
  createdAt: string;
}

export interface Batch {
  id: string;
  name: string;
  teacherId: string;
  studentIds: string[];
  examType: ExamType;
  description?: string;
  createdAt: string;
}

export interface TestAttempt {
  id: string;
  testId: string;
  studentId: string;
  answers: Record<string, string | number>;
  flagged: string[];
  score: number;
  totalMarks: number;
  submittedAt: string;
  timeTaken: number;
  rank?: number;
  percentile?: number;
}

export interface GenerateQuestionsParams {
  subject: Subject;
  chapter: string;
  examType: ExamType;
  difficulty: Difficulty;
  type: QuestionType;
  count: number;
}
