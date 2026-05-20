import { Batch } from '../types';
import { MOCK_BATCHES } from './mock/data';

let batches = [...MOCK_BATCHES];

export function getBatchesByTeacher(teacherId: string): Batch[] {
  return batches.filter((b) => b.teacherId === teacherId);
}

export function getBatchById(id: string): Batch | undefined {
  return batches.find((b) => b.id === id);
}

export function createBatch(batch: Omit<Batch, 'id' | 'createdAt'>): Batch {
  const newBatch: Batch = {
    ...batch,
    id: `batch-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  batches = [newBatch, ...batches];
  return newBatch;
}

export function addStudentToBatch(batchId: string, studentId: string): void {
  batches = batches.map((b) =>
    b.id === batchId ? { ...b, studentIds: [...b.studentIds, studentId] } : b,
  );
}

export function removeStudentFromBatch(batchId: string, studentId: string): void {
  batches = batches.map((b) =>
    b.id === batchId
      ? { ...b, studentIds: b.studentIds.filter((id) => id !== studentId) }
      : b,
  );
}

export const MOCK_STUDENT_NAMES: Record<string, string> = {
  'student-1': 'Arjun Patel',
  'student-2': 'Priya Sharma',
  'student-3': 'Rohit Verma',
  'student-4': 'Ananya Singh',
  'student-5': 'Karan Mehta',
  'student-6': 'Sneha Reddy',
  'student-7': 'Vikram Nair',
  'student-8': 'Riya Joshi',
};
