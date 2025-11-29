-- Migration: Create Products Table
-- Description: Stores product information with pricing, inventory, and categorization

CREATE TABLE IF NOT EXISTS Products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    sku VARCHAR(50) UNIQUE,
    image_url TEXT,
    category_id INTEGER REFERENCES Categories(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_name ON Products(name);
CREATE INDEX IF NOT EXISTS idx_products_category ON Products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON Products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_price ON Products(price);

-- Add comments
COMMENT ON TABLE Products IS 'Product catalog with inventory management';
COMMENT ON COLUMN Products.price IS 'Product price in USD, must be non-negative';
COMMENT ON COLUMN Products.stock IS 'Available inventory count, must be non-negative';
COMMENT ON COLUMN Products.sku IS 'Stock Keeping Unit - unique product identifier';
COMMENT ON COLUMN Products.is_active IS 'Soft delete flag - inactive products are hidden';

-- Rollback SQL:
-- DROP TABLE IF EXISTS Products CASCADE;
