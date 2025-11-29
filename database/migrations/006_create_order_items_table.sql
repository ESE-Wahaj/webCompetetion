-- Migration: Create OrderItems Table
-- Description: Junction table storing individual items within orders

CREATE TABLE IF NOT EXISTS OrderItems (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES Orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES Products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_orderitems_order ON OrderItems(order_id);
CREATE INDEX IF NOT EXISTS idx_orderitems_product ON OrderItems(product_id);

-- Add comments
COMMENT ON TABLE OrderItems IS 'Individual items within orders - junction table between Orders and Products';
COMMENT ON COLUMN OrderItems.price_at_purchase IS 'Price of the product at the time of purchase (historical pricing)';
COMMENT ON COLUMN OrderItems.quantity IS 'Number of items purchased, must be positive';

-- Rollback SQL:
-- DROP TABLE IF EXISTS OrderItems CASCADE;
