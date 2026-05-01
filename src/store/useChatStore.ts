// src/store/useChatStore.ts
import { create } from 'zustand';

export type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

type ChatStore = {
  messages: Message[];
  sendMessage: (text: string) => void;
  addBotResponse: (text: string) => void;
  clearMessages: () => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],

  sendMessage: (text) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Date.now().toString(),
          text,
          isUser: true,
          timestamp: new Date(),
        },
      ],
    })),

  addBotResponse: (text) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Date.now().toString(),
          text,
          isUser: false,
          timestamp: new Date(),
        },
      ],
    })),

  clearMessages: () => set({ messages: [] }),
}));