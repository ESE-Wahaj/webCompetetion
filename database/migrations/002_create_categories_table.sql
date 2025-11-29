-- Migration: Create Categories Table
-- Description: Stores product categories for organization

CREATE TABLE IF NOT EXISTS Categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add comments
COMMENT ON TABLE Categories IS 'Product categories for organizing the catalog';
COMMENT ON COLUMN Categories.is_active IS 'Soft delete flag - inactive categories are hidden from customers';

-- Rollback SQL:
-- DROP TABLE IF EXISTS Categories CASCADE;
