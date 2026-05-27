import { create } from 'zustand';
import { Student } from '@/types';
import { MOCK_STUDENT } from '@/services/mock/data';

interface ChildrenState {
  children: Student[];
  selectedChildId: string;
  selectChild: (id: string) => void;
  addChild: (child: Student) => void;
  removeChild: (id: string) => void;
  selectedChild: () => Student | undefined;
}

export const useChildrenStore = create<ChildrenState>((set, get) => ({
  // Pre-seeded with the demo student so the dashboard works immediately
  children: [MOCK_STUDENT],
  selectedChildId: MOCK_STUDENT.id,

  selectChild: (id) => set({ selectedChildId: id }),

  addChild: (child) =>
    set((s) => ({
      children: s.children.find((c) => c.id === child.id) ? s.children : [...s.children, child],
      selectedChildId: child.id,
    })),

  removeChild: (id) =>
    set((s) => {
      const remaining = s.children.filter((c) => c.id !== id);
      return {
        children: remaining,
        selectedChildId:
          s.selectedChildId === id ? (remaining[0]?.id ?? '') : s.selectedChildId,
      };
    }),

  selectedChild: () => {
    const { children, selectedChildId } = get();
    return children.find((c) => c.id === selectedChildId);
  },
}));
