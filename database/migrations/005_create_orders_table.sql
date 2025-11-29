-- Migration: Create Orders Table
-- Description: Stores customer orders with payment and shipping information

CREATE TABLE IF NOT EXISTS Orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id) ON DELETE SET NULL,
    order_total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    payment_method VARCHAR(50),
    tracking_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_user ON Orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON Orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON Orders(created_at DESC);

-- Add comments
COMMENT ON TABLE Orders IS 'Customer orders with payment and shipping tracking';
COMMENT ON COLUMN Orders.status IS 'Order status: pending, processing, shipped, delivered, or cancelled';
COMMENT ON COLUMN Orders.order_total IS 'Total order amount including tax and shipping';
COMMENT ON COLUMN Orders.tracking_number IS 'Shipping carrier tracking number';

-- Rollback SQL:
-- DROP TABLE IF EXISTS Orders CASCADE;
