// src/store/useUserStore.ts
import { create } from 'zustand';
import { MOCK_USER } from '../data/mockData';

export type UserData = {
  name: string;
  email?: string;
  avatar_url?: string;
  location?: string;
};

type UserStore = {
  name: string;
  location: string;
  email?: string;
  avatar_url?: string;
  isLoggedIn: boolean;
  isGuest: boolean;
  login: () => void;
  loginAsGuest: () => void;
  logout: () => void;
  updateProfile: (data: { name?: string; location?: string }) => void;
  setUser: (userData: UserData) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  name: MOCK_USER.name,
  location: MOCK_USER.location,
  email: undefined,
  avatar_url: undefined,
  isLoggedIn: false,
  isGuest: false,

  login: () => set({ isLoggedIn: true, isGuest: false }),

  loginAsGuest: () => set({ isLoggedIn: false, isGuest: true }),

  logout: () =>
    set({
      isLoggedIn: false,
      isGuest: false,
      name: MOCK_USER.name,
      location: MOCK_USER.location,
      email: undefined,
      avatar_url: undefined,
    }),

  updateProfile: (data) =>
    set((state) => ({
      name: data.name ?? state.name,
      location: data.location ?? state.location,
    })),

  setUser: (userData) =>
    set({
      isLoggedIn: true,
      isGuest: false,
      name: userData.name,
      email: userData.email,
      avatar_url: userData.avatar_url,
      location: userData.location || MOCK_USER.location,
    }),
}));
