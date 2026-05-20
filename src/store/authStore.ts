import { create } from 'zustand';
import { User, UserRole } from '../types';
import { MOCK_TEACHER, MOCK_STUDENT, MOCK_PARENT } from '../services/mock/data';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingPhone: string;

  setPhone: (phone: string) => void;
  verifyOtp: (otp: string) => Promise<void>;
  selectRole: (role: UserRole) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

const MOCK_USERS: Record<string, User> = {
  teacher: MOCK_TEACHER,
  student: MOCK_STUDENT,
  parent: MOCK_PARENT,
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  pendingPhone: '',

  setPhone: (phone) => set({ pendingPhone: phone }),

  verifyOtp: async (_otp) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 1200));
    set({ isLoading: false });
    // OTP verified — role selection happens next
  },

  selectRole: (role) => {
    const user = MOCK_USERS[role];
    set({ user, isAuthenticated: true });
  },

  logout: () => set({ user: null, isAuthenticated: false, pendingPhone: '' }),

  setLoading: (loading) => set({ isLoading: loading }),
}));
