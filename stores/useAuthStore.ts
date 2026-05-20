import { create } from 'zustand';
import { SessionUser } from '@/types/auth';
import { AuthService } from '@/services/auth.service';

// ============================================================
// MediBridgeX — Auth Store
// User state lives in memory only. No localStorage persistence.
// Session is restored on mount via /api/auth/me (httpOnly cookie).
// ============================================================

interface AuthState {
  user: SessionUser | null;
  isLoading: boolean;
  error: string | null;
  isSessionExpired: boolean;

  setSessionUser: (user: SessionUser | null) => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
  setSessionExpired: (expired: boolean) => void;
  setOnboardingComplete: (workspaceSlug: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isSessionExpired: false,

  setSessionUser: (user) => set({ user }),
  setSessionExpired: (expired) => set({ isSessionExpired: expired }),

  setOnboardingComplete: (workspaceSlug) => {
    const current = get().user;
    if (current) {
      set({
        user: {
          ...current,
          onboardingCompleted: true,
          workspaceSlug,
        },
      });
    }
  },

  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await AuthService.getMe();
      set({ user, isLoading: false });
    } catch {
      // Not authenticated — clear state silently
      set({ user: null, error: null, isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await AuthService.logout();
      set({ user: null, isLoading: false, isSessionExpired: false });
    } catch {
      set({ error: 'Failed to logout', isLoading: false });
    }
  },
}));
