export const AppSpec = {
  auth: {
    allowGuest: true,
    googleLogin: true,
    redirectAfterLogin: 'Catálogo',
  },
  catalog: {
    title: '¿Qué vas a llevar hoy?',
    layout: { columns: 2, rows: 6 },
  },
  product: {
    colorOptions: 4,
    mustSelectColor: true,
  },
  cart: {
    buttonText: 'adquirir',
    maxVisibleItems: 3,
  },
  chat: {
    realtime: true,
  },
  account: {
    fields: ['photo', 'name', 'location'] as const,
  },
} as const;

describe('AppSpec Configuration', () => {
  it('should have valid auth config', () => {
    expect(AppSpec.auth).toBeDefined();
  });
});
