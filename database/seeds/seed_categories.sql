-- Seed Categories
-- Description: Sample product categories

INSERT INTO Categories (name, description, is_active) VALUES
('Electronics', 'Electronic devices and accessories', true),
('Clothing', 'Apparel and fashion items', true),
('Home & Garden', 'Home improvement and garden supplies', true),
('Sports & Outdoors', 'Sports equipment and outdoor gear', true),
('Books', 'Books, magazines, and reading materials', true),
('Toys & Games', 'Toys, games, and entertainment', true),
('Health & Beauty', 'Health, wellness, and beauty products', true),
('Food & Beverage', 'Food items and beverages', true)
ON CONFLICT (name) DO NOTHING;
