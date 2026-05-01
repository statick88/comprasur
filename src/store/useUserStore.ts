// src/store/useUserStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_USER } from '../data/mockData';

export type UserData = {
  id?: string;
  name: string;
  email?: string;
  avatar_url?: string;
  location?: string;
};

type UserStore = {
  id?: string;
  name: string;
  location: string;
  email?: string;
  avatar_url?: string;
  isLoggedIn: boolean;
  isGuest: boolean;
  login: () => void;
  loginAsGuest: () => void;
  logout: () => void;
  updateProfile: (data: { name?: string; location?: string; avatar_url?: string }) => void;
  setUser: (userData: UserData) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      id: undefined,
      name: MOCK_USER.name,
      location: MOCK_USER.location,
      email: undefined,
      avatar_url: undefined,
      isLoggedIn: false,
      isGuest: false,

      login: () => set({ isLoggedIn: true, isGuest: false }),

      loginAsGuest: () => set({ isLoggedIn: false, isGuest: true, name: 'Invitado' }),

      logout: () =>
        set({
          id: undefined,
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
          avatar_url: data.avatar_url ?? state.avatar_url,
        })),

      setUser: (userData) =>
        set({
          id: userData.id,
          isLoggedIn: true,
          isGuest: false,
          name: userData.name,
          email: userData.email,
          avatar_url: userData.avatar_url,
          location: userData.location || MOCK_USER.location,
        }),
    }),
    {
      name: 'comprasur-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
