import { create } from 'zustand';
import { FREE_TIER_LIMITS } from '@/constants/taxonomy';

interface UsageState {
  generateCount: number;
  practiceCount: number;
  incrementGenerate: () => void;
  incrementPractice: () => void;
  isGenerateLimitReached: () => boolean;
  isPracticeLimitReached: () => boolean;
  generateRemaining: () => number;
  practiceRemaining: () => number;
}

export const useUsageStore = create<UsageState>((set, get) => ({
  generateCount: 0,
  practiceCount: 0,

  incrementGenerate: () => set((s) => ({ generateCount: s.generateCount + 1 })),
  incrementPractice: () => set((s) => ({ practiceCount: s.practiceCount + 1 })),

  isGenerateLimitReached: () => get().generateCount >= FREE_TIER_LIMITS.dailyGenerations,
  isPracticeLimitReached: () => get().practiceCount >= FREE_TIER_LIMITS.weeklyPracticeTests,

  generateRemaining: () => Math.max(0, FREE_TIER_LIMITS.dailyGenerations - get().generateCount),
  practiceRemaining: () => Math.max(0, FREE_TIER_LIMITS.weeklyPracticeTests - get().practiceCount),
}));
