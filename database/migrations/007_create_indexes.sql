-- Migration: Create Additional Indexes
-- Description: Additional indexes for query optimization

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_products_active_category ON Products(is_active, category_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_cart_user_product ON Cart(user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON Orders(user_id, status);

-- Full-text search index for product names
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON Products USING gin(name gin_trgm_ops);

-- Note: The above full-text index requires pg_trgm extension
-- If it fails, you can create it with:
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Rollback SQL:
-- DROP INDEX IF EXISTS idx_products_active_category;
-- DROP INDEX IF EXISTS idx_cart_user_product;
-- DROP INDEX IF EXISTS idx_orders_user_status;
-- DROP INDEX IF EXISTS idx_products_name_trgm;
