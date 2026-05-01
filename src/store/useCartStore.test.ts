import { useCartStore } from './useCartStore';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Simple mock for external dependencies if needed
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  const mockProduct = {
    id: 1,
    name: 'Guantes',
    price: 15,
    description: 'Desc',
    imageAlt: 'Guantes',
    imageKey: 'medical',
    colors: {
      primary: '#000',
      background: '#fff',
      text: '#000',
      accent: '#ccc',
    },
  };

  it('should add an item to the cart', () => {
    useCartStore.getState().addItem(mockProduct);
    
    const items = useCartStore.getState().items;
    expect(items.length).toBe(1);
    expect(items[0].name).toBe('Guantes');
    expect(items[0].quantity).toBe(1);
  });

  it('should increase quantity if adding the same item', () => {
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().addItem(mockProduct);
    
    const items = useCartStore.getState().items;
    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(2);
  });

  it('should remove an item from the cart', () => {
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().removeItem(1);
    
    const items = useCartStore.getState().items;
    expect(items.length).toBe(0);
  });
});
