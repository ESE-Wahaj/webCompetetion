-- Seed Users
-- Description: Sample users for testing
-- NOTE: Passwords are bcrypt hashed (12 rounds)
-- Admin password: Admin1234
-- Customer password: Customer1234

INSERT INTO Users (username, email, hashed_password, role, first_name, last_name, phone, address, is_active) VALUES
('admin', 'admin@shoppingmart.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lE3HFpJfKEZm', 'admin', 'Admin', 'User', '555-0001', '123 Admin Street, Admin City, AC 12345', true),
('customer1', 'customer@shoppingmart.com', '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 'John', 'Doe', '555-0002', '456 Customer Ave, Customer City, CC 67890', true),
('customer2', 'jane.smith@email.com', '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 'Jane', 'Smith', '555-0003', '789 Buyer Blvd, Buyer Town, BT 11111', true),
('customer3', 'bob.wilson@email.com', '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 'Bob', 'Wilson', '555-0004', '321 Shopper Lane, Shop City, SC 22222', true)
ON CONFLICT (email) DO NOTHING;

-- Note: The hashed passwords are for demonstration purposes
-- In production, passwords should be hashed during registration via the API
