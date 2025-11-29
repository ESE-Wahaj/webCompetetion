-- Seed Products
-- Description: Sample products for testing

INSERT INTO Products (name, description, price, stock, sku, image_url, category_id, is_active) VALUES
-- Electronics
('Wireless Bluetooth Headphones', 'High-quality wireless headphones with noise cancellation and 30-hour battery life', 79.99, 50, 'ELECT-001', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 1, true),
('Smartphone Stand', 'Adjustable aluminum smartphone stand for desk', 24.99, 100, 'ELECT-002', 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400', 1, true),
('USB-C Cable 6ft', 'Durable braided USB-C charging cable', 12.99, 200, 'ELECT-003', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400', 1, true),
('Laptop Backpack', 'Water-resistant laptop backpack with USB charging port', 49.99, 75, 'ELECT-004', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', 1, true),
('Wireless Mouse', 'Ergonomic wireless mouse with adjustable DPI', 29.99, 150, 'ELECT-005', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', 1, true),

-- Clothing
('Classic Cotton T-Shirt', 'Comfortable 100% cotton t-shirt available in multiple colors', 19.99, 200, 'CLOTH-001', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 2, true),
('Denim Jeans', 'Classic fit denim jeans with stretch comfort', 59.99, 120, 'CLOTH-002', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', 2, true),
('Hooded Sweatshirt', 'Warm and cozy hooded sweatshirt with kangaroo pocket', 39.99, 90, 'CLOTH-003', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', 2, true),
('Running Shoes', 'Lightweight running shoes with cushioned sole', 89.99, 60, 'CLOTH-004', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 2, true),
('Baseball Cap', 'Adjustable baseball cap with embroidered logo', 24.99, 180, 'CLOTH-005', 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400', 2, true),

-- Home & Garden
('Ceramic Plant Pot Set', 'Set of 3 modern ceramic plant pots with drainage holes', 34.99, 80, 'HOME-001', 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400', 3, true),
('LED Desk Lamp', 'Adjustable LED desk lamp with touch control and USB port', 44.99, 65, 'HOME-002', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', 3, true),
('Throw Pillow Cover', 'Decorative throw pillow cover 18x18 inches', 14.99, 150, 'HOME-003', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400', 3, true),
('Wall Clock', 'Modern minimalist wall clock 12 inch', 29.99, 95, 'HOME-004', 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400', 3, true),
('Aroma Diffuser', 'Ultrasonic aroma diffuser with LED lights', 39.99, 70, 'HOME-005', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400', 3, true),

-- Sports & Outdoors
('Yoga Mat', 'Non-slip exercise yoga mat with carrying strap', 29.99, 110, 'SPORT-001', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400', 4, true),
('Water Bottle 32oz', 'Insulated stainless steel water bottle keeps drinks cold for 24 hours', 24.99, 140, 'SPORT-002', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', 4, true),
('Resistance Bands Set', 'Set of 5 resistance bands for strength training', 19.99, 130, 'SPORT-003', 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400', 4, true),
('Camping Tent 2-Person', 'Lightweight waterproof camping tent for 2 people', 129.99, 35, 'SPORT-004', 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400', 4, true),
('Bicycle Helmet', 'Lightweight adjustable bicycle helmet with ventilation', 49.99, 55, 'SPORT-005', 'https://images.unsplash.com/photo-1611843467160-25afb8df1074?w=400', 4, true),

-- Books
('The Art of Programming', 'Comprehensive guide to modern programming practices', 49.99, 40, 'BOOK-001', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', 5, true),
('Cookbook: Healthy Meals', 'Collection of 200+ healthy and delicious recipes', 29.99, 60, 'BOOK-002', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', 5, true),
('Mystery Novel Set', 'Bestselling mystery novel series boxed set', 59.99, 30, 'BOOK-003', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', 5, true),

-- Toys & Games
('Building Blocks Set', 'Creative building blocks set 500 pieces', 39.99, 85, 'TOY-001', 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400', 6, true),
('Board Game Classic', 'Family-friendly strategy board game for ages 8+', 34.99, 70, 'TOY-002', 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400', 6, true),
('Puzzle 1000 Pieces', 'Challenging jigsaw puzzle with beautiful artwork', 24.99, 95, 'TOY-003', 'https://images.unsplash.com/photo-1587760780214-53de1bb14f7f?w=400', 6, true),

-- Health & Beauty
('Facial Cleanser', 'Gentle daily facial cleanser for all skin types', 18.99, 120, 'HEALTH-001', 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400', 7, true),
('Vitamin C Serum', 'Anti-aging vitamin C serum for radiant skin', 29.99, 100, 'HEALTH-002', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400', 7, true),
('Electric Toothbrush', 'Rechargeable electric toothbrush with 3 modes', 59.99, 50, 'HEALTH-003', 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400', 7, true),
('Essential Oil Set', 'Set of 6 pure essential oils for aromatherapy', 39.99, 75, 'HEALTH-004', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400', 7, true),

-- Food & Beverage
('Organic Green Tea', 'Premium organic green tea 100 bags', 14.99, 200, 'FOOD-001', 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400', 8, true),
('Dark Chocolate Bar', 'Artisan 70% cacao dark chocolate bar', 5.99, 250, 'FOOD-002', 'https://images.unsplash.com/photo-1606312619070-d48b4a8a5ef3?w=400', 8, true),
('Trail Mix Variety Pack', 'Healthy trail mix variety pack 12 bags', 24.99, 160, 'FOOD-003', 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400', 8, true),
('Coffee Beans 1lb', 'Premium whole coffee beans medium roast', 18.99, 110, 'FOOD-004', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400', 8, true)

ON CONFLICT (sku) DO NOTHING;
