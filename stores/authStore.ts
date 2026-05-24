import { create } from 'zustand';
import { UserAccount } from '../utils/types';

interface AuthStore {
  account: UserAccount | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAccount: (account: UserAccount | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  account: null,
  isLoading: true,
  isAuthenticated: false,

  setAccount: (account) =>
    set({
      account,
      isAuthenticated: Boolean(account),
      isLoading: false,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  logout: () =>
    set({
      account: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}));
