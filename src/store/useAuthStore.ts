// src/store/useAuthStore.ts
// Auth store — integración con Supabase Auth
import { create } from 'zustand';
import { supabase } from '../lib/supabase';

type AuthStore = {
  session: any | null;       // supabase session
  user: any | null;          // supabase user
  isLoading: boolean;
  error: string | null;
  
  // Métodos
  signInWithGoogle: () => Promise<void>;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  user: null,
  isLoading: false,
  error: null,

  signInWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: 'comprasur://login' },
      });
      if (error) throw error;
      set({ session: null, user: null });
    } catch (err: any) {
      set({ error: err.message ?? 'Error en login con Google' });
    } finally {
      set({ isLoading: false });
    }
  },

  signInAnonymously: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      set({ session: null, user: data.user ?? null });
    } catch (err: any) {
      set({ error: err.message ?? 'Error en login anónimo' });
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ session: null, user: null });
    } catch (err: any) {
      set({ error: err.message ?? 'Error en logout' });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
