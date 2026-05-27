import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { User, UserRole } from '../types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingPhone: string;

  setPhone: (phone: string) => void;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  selectRole: (role: UserRole) => Promise<void>;
  loadSession: () => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

function formatPhone(phone: string): string {
  // Supabase phone auth expects E.164 format: +91XXXXXXXXXX
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  return `+${digits}`;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  pendingPhone: '',

  setPhone: (phone) => set({ pendingPhone: phone }),

  sendOtp: async (phone) => {
    set({ isLoading: true });
    const { error } = await supabase.auth.signInWithOtp({
      phone: formatPhone(phone),
    });
    set({ isLoading: false });
    if (error) throw error;
  },

  verifyOtp: async (otp) => {
    set({ isLoading: true });
    const phone = formatPhone(get().pendingPhone);
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms',
    });
    set({ isLoading: false });
    if (error) throw error;
  },

  selectRole: async (role) => {
    set({ isLoading: true });
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) throw new Error('Not authenticated');

    const { error } = await (supabase
      .from('profiles') as any)
      .update({ role })
      .eq('id', authUser.id);

    if (error) throw error;

    const { data: profile } = await (supabase
      .from('profiles') as any)
      .select('*')
      .eq('id', authUser.id)
      .single() as { data: Profile | null };

    if (profile) {
      const user: User = {
        id: profile.id,
        phone: profile.phone ?? '',
        name: profile.name,
        role: profile.role as UserRole,
        tier: profile.tier as User['tier'],
        avatar: profile.avatar_url ?? undefined,
      };
      set({ user, isAuthenticated: true, isLoading: false });
    }
  },

  loadSession: async () => {
    set({ isLoading: true });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      set({ isLoading: false });
      return;
    }

    const { data: profile } = await (supabase
      .from('profiles') as any)
      .select('*')
      .eq('id', session.user.id)
      .single() as { data: Profile | null };

    if (profile?.role) {
      const user: User = {
        id: profile.id,
        phone: profile.phone ?? '',
        name: profile.name,
        role: profile.role as UserRole,
        tier: profile.tier as User['tier'],
        avatar: profile.avatar_url ?? undefined,
      };
      set({ user, isAuthenticated: true });
    }

    set({ isLoading: false });
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false, pendingPhone: '' });
  },

  setLoading: (loading) => set({ isLoading: loading }),
}));
