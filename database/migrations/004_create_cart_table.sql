-- Migration: Create Cart Table
-- Description: Stores shopping cart items for both authenticated and guest users

CREATE TABLE IF NOT EXISTS Cart (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255),
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES Products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id),
    UNIQUE(session_id, product_id),
    CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cart_user ON Cart(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_session ON Cart(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_product ON Cart(product_id);

-- Add comments
COMMENT ON TABLE Cart IS 'Shopping cart items - supports both authenticated users and guest sessions';
COMMENT ON COLUMN Cart.session_id IS 'Guest session identifier (for non-logged-in users)';
COMMENT ON COLUMN Cart.user_id IS 'Authenticated user identifier';
COMMENT ON COLUMN Cart.quantity IS 'Number of items, must be positive';

-- Rollback SQL:
-- DROP TABLE IF EXISTS Cart CASCADE;
