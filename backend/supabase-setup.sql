-- Supabase RLS Policies for Comprasur

-- 1. Orders table
-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own orders
CREATE POLICY "Users can view their own orders" 
ON orders FOR SELECT 
USING (auth.uid()::text = user_id::text);

-- Policy: Users can insert their own orders
CREATE POLICY "Users can insert their own orders" 
ON orders FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

-- 2. Order Items table
-- Enable RLS
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view items from their own orders
CREATE POLICY "Users can view their own order items" 
ON order_items FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id::text = auth.uid()::text
  )
);

-- Note: Ensure 'user_id' column exists in 'orders' table and is a UUID or matches auth.uid() type.
