export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

type Role = 'teacher' | 'student' | 'parent';
type Tier = 'free' | 'premium' | 'institution';
type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Previous Year';
type QuestionType = 'MCQ' | 'Assertion-Reason' | 'Match the Column' | 'Integer Type' | 'Short Answer';
type TestStatus = 'draft' | 'published' | 'active' | 'completed';
type SubStatus = 'active' | 'cancelled' | 'expired';

export type Database = {
  public: {
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
    Tables: {
      profiles: {
        Row: {
          id: string; name: string; phone: string | null; role: Role; tier: Tier;
          institution: string | null; exam_type: string | null; avatar_url: string | null;
          expo_push_token: string | null; ai_generations_today: number;
          ai_generations_reset_at: string; created_at: string;
        };
        Insert: {
          id: string; name?: string; phone?: string | null; role?: Role; tier?: Tier;
          institution?: string | null; exam_type?: string | null; avatar_url?: string | null;
          expo_push_token?: string | null; ai_generations_today?: number;
          ai_generations_reset_at?: string; created_at?: string;
        };
        Update: {
          name?: string; phone?: string | null; role?: Role; tier?: Tier;
          institution?: string | null; exam_type?: string | null; avatar_url?: string | null;
          expo_push_token?: string | null; ai_generations_today?: number;
          ai_generations_reset_at?: string;
        };
      };
      batches: {
        Row: { id: string; teacher_id: string; name: string; exam_type: string; description: string | null; created_at: string };
        Insert: { id?: string; teacher_id: string; name: string; exam_type: string; description?: string | null; created_at?: string };
        Update: { name?: string; exam_type?: string; description?: string | null };
      };
      batch_students: {
        Row: { batch_id: string; student_id: string; joined_at: string };
        Insert: { batch_id: string; student_id: string; joined_at?: string };
        Update: { joined_at?: string };
      };
      parent_children: {
        Row: { parent_id: string; student_id: string };
        Insert: { parent_id: string; student_id: string };
        Update: Record<string, never>;
      };
      questions: {
        Row: {
          id: string; teacher_id: string; subject: string; chapter: string;
          difficulty: Difficulty; type: QuestionType; exam_type: string;
          content: string; options: string[] | null; correct_answer: string;
          explanation: string; marks: number; created_at: string;
        };
        Insert: {
          id?: string; teacher_id: string; subject: string; chapter: string;
          difficulty: Difficulty; type: QuestionType; exam_type: string;
          content: string; options?: string[] | null; correct_answer: string;
          explanation: string; marks?: number; created_at?: string;
        };
        Update: {
          subject?: string; chapter?: string; difficulty?: Difficulty; type?: QuestionType;
          exam_type?: string; content?: string; options?: string[] | null;
          correct_answer?: string; explanation?: string; marks?: number;
        };
      };
      tests: {
        Row: {
          id: string; teacher_id: string; title: string; exam_type: string;
          subject: string | null; config: Json; scheduled_at: string | null;
          due_at: string | null; status: TestStatus; created_at: string;
        };
        Insert: {
          id?: string; teacher_id: string; title: string; exam_type: string;
          subject?: string | null; config?: Json; scheduled_at?: string | null;
          due_at?: string | null; status?: TestStatus; created_at?: string;
        };
        Update: {
          title?: string; exam_type?: string; subject?: string | null; config?: Json;
          scheduled_at?: string | null; due_at?: string | null; status?: TestStatus;
        };
      };
      test_questions: {
        Row: { test_id: string; question_id: string; position: number };
        Insert: { test_id: string; question_id: string; position: number };
        Update: { position?: number };
      };
      test_assignments: {
        Row: { id: string; test_id: string; batch_id: string | null; student_id: string | null; assigned_at: string };
        Insert: { id?: string; test_id: string; batch_id?: string | null; student_id?: string | null; assigned_at?: string };
        Update: { batch_id?: string | null; student_id?: string | null };
      };
      test_attempts: {
        Row: {
          id: string; test_id: string; student_id: string; answers: Json; flagged: Json;
          score: number | null; total_marks: number | null; time_taken: number | null;
          rank: number | null; percentile: number | null; started_at: string; submitted_at: string | null;
        };
        Insert: {
          id?: string; test_id: string; student_id: string; answers?: Json; flagged?: Json;
          score?: number | null; total_marks?: number | null; time_taken?: number | null;
          rank?: number | null; percentile?: number | null; started_at?: string; submitted_at?: string | null;
        };
        Update: {
          answers?: Json; flagged?: Json; score?: number | null; total_marks?: number | null;
          time_taken?: number | null; rank?: number | null; percentile?: number | null; submitted_at?: string | null;
        };
      };
      subscriptions: {
        Row: {
          id: string; user_id: string; plan: Tier; razorpay_subscription_id: string | null;
          status: SubStatus; started_at: string; expires_at: string | null;
        };
        Insert: {
          id?: string; user_id: string; plan: Tier; razorpay_subscription_id?: string | null;
          status?: SubStatus; started_at?: string; expires_at?: string | null;
        };
        Update: {
          plan?: Tier; razorpay_subscription_id?: string | null; status?: SubStatus; expires_at?: string | null;
        };
      };
    };
  };
};
