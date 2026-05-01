import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
};

const SUPPORT_WELCOME_MESSAGE =
  'Hola, soy Soporte Comprasur. Puedo ayudarte con precios, stock, entregas y pedidos.';

function createMessage(text: string, isUser: boolean, id = `${isUser ? 'user' : 'support'}-${Date.now()}`): Message {
  return {
    id,
    text,
    isUser,
    timestamp: new Date().toISOString(),
  };
}

function appendUniqueMessage(messages: Message[], nextMessage: Message) {
  return messages.some((message) => message.id === nextMessage.id)
    ? messages
    : [...messages, nextMessage];
}

function getSupportReply(text: string) {
  const normalized = text.toLowerCase();

  if (normalized.includes('precio') || normalized.includes('cost') || normalized.includes('valor')) {
    return 'Claro. Puedes revisar el precio actualizado en cada producto y, si quieres, te ayudo a comparar opciones antes de pagar.';
  }

  if (normalized.includes('stock') || normalized.includes('dispon') || normalized.includes('hay')) {
    return 'Tenemos stock visible en catálogo. Si ves el producto disponible, puedes agregarlo al carrito sin problema.';
  }

  if (normalized.includes('env') || normalized.includes('entrega') || normalized.includes('llega')) {
    return 'La entrega estimada de esta demo es de 24 a 48 horas. Si necesitas priorizar un pedido, déjamelo saber.';
  }

  if (normalized.includes('pago') || normalized.includes('paypal') || normalized.includes('comprar')) {
    return 'Te acompaño con el pago. Cuando estés listo, agrega el producto al carrito y continúa con el checkout.';
  }

  return 'Gracias por escribirnos. En esta demo puedo orientarte con precios, stock, pagos y tiempos de entrega.';
}

type ChatStore = {
  messages: Message[];
  channel: ReturnType<typeof supabase.channel> | null;
  sendMessage: (text: string) => void;
  addBotResponse: (text: string) => void;
  clearMessages: () => void;
  initRealtime: () => () => void;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [createMessage(SUPPORT_WELCOME_MESSAGE, false, 'support-welcome')],
  channel: null,

  sendMessage: (text) => {
    const msg = createMessage(text, true);
    set((s) => ({ messages: appendUniqueMessage(s.messages, msg) }));
    get().channel?.send({ type: 'broadcast', event: 'message', payload: msg });

    const supportReply = getSupportReply(text);
    setTimeout(() => {
      get().addBotResponse(supportReply);
    }, 1200);
  },

  addBotResponse: (text) => {
    const msg = createMessage(text, false);
    set((s) => ({ messages: appendUniqueMessage(s.messages, msg) }));
  },

  clearMessages: () => set({ messages: [createMessage(SUPPORT_WELCOME_MESSAGE, false, 'support-welcome')] }),

  initRealtime: () => {
    const channel = supabase.channel('chat-support');
    channel
      .on('broadcast', { event: 'message' }, ({ payload }) => {
        if (payload && !payload.isUser) {
          set((s) => ({ messages: appendUniqueMessage(s.messages, payload as Message) }));
        }
      })
      .subscribe();
    set({ channel });
    return () => {
      supabase.removeChannel(channel);
    };
  },
}));
