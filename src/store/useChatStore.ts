import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
};

type ChatStore = {
  messages: Message[];
  channel: ReturnType<typeof supabase.channel> | null;
  sendMessage: (text: string) => void;
  addBotResponse: (text: string) => void;
  clearMessages: () => void;
  initRealtime: () => () => void;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  channel: null,

  sendMessage: (text) => {
    const msg: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date().toISOString(),
    };
    set((s) => ({ messages: [...s.messages, msg] }));
    get().channel?.send({ type: 'broadcast', event: 'message', payload: msg });
  },

  addBotResponse: (text) => {
    const msg: Message = {
      id: `bot-${Date.now()}`,
      text,
      isUser: false,
      timestamp: new Date().toISOString(),
    };
    set((s) => ({ messages: [...s.messages, msg] }));
  },

  clearMessages: () => set({ messages: [] }),

  initRealtime: () => {
    const channel = supabase.channel('chat-support');
    channel
      .on('broadcast', { event: 'message' }, ({ payload }) => {
        if (payload && !payload.isUser) {
          set((s) => ({ messages: [...s.messages, payload as Message] }));
        }
      })
      .subscribe();
    set({ channel });
    return () => {
      supabase.removeChannel(channel);
    };
  },
}));
