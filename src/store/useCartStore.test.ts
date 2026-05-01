import { useCartStore } from './useCartStore';

// Simple mock for external dependencies if needed
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('should add an item to the cart', () => {
    const product = { id: 1, name: 'Guantes', price: 15, description: 'Desc', colors: [] };
    useCartStore.getState().addItem(product);
    
    const items = useCartStore.getState().items;
    expect(items.length).toBe(1);
    expect(items[0].name).toBe('Guantes');
    expect(items[0].quantity).toBe(1);
  });

  it('should increase quantity if adding the same item', () => {
    const product = { id: 1, name: 'Guantes', price: 15, description: 'Desc', colors: [] };
    useCartStore.getState().addItem(product);
    useCartStore.getState().addItem(product);
    
    const items = useCartStore.getState().items;
    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(2);
  });

  it('should remove an item from the cart', () => {
    const product = { id: 1, name: 'Guantes', price: 15, description: 'Desc', colors: [] };
    useCartStore.getState().addItem(product);
    useCartStore.getState().removeItem(1);
    
    const items = useCartStore.getState().items;
    expect(items.length).toBe(0);
  });
});
