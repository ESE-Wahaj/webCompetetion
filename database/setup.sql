-- Database Setup Script for ShoppingMart
-- Run this script to set up the complete database

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Run all migrations (tables will be created in order)
\i migrations/001_create_users_table.sql
\i migrations/002_create_categories_table.sql
\i migrations/003_create_products_table.sql
\i migrations/004_create_cart_table.sql
\i migrations/005_create_orders_table.sql
\i migrations/006_create_order_items_table.sql
\i migrations/007_create_indexes.sql

-- Seed data
\i seeds/seed_users.sql
\i seeds/seed_categories.sql
\i seeds/seed_products.sql

-- Verify setup
SELECT 'Users created: ' || COUNT(*) FROM Users;
SELECT 'Categories created: ' || COUNT(*) FROM Categories;
SELECT 'Products created: ' || COUNT(*) FROM Products;
