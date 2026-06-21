'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

interface AuthState {
  user: User | null;
  tokens: Tokens | null;
  isAuthenticated: boolean;
  setAuth: (user: User, tokens: Tokens) => void;
  setTokens: (tokens: Tokens) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      setAuth: (user, tokens) => set({ user, tokens, isAuthenticated: true }),
      setTokens: (tokens) => set({ tokens }),
      logout: () => set({ user: null, tokens: null, isAuthenticated: false }),
    }),
    {
      name: 'speffo-auth',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
