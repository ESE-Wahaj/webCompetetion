-- Seed Users
-- Description: Sample users for testing
-- NOTE: Passwords are bcrypt hashed (12 rounds)
-- Admin password: Admin1234
-- Customer password: Customer1234

INSERT INTO Users (username, email, hashed_password, role, first_name, last_name, phone, address, is_active) VALUES
('admin', 'admin@shoppingmart.com', '$2b$12$cW9I0ToxyvW1TMM1FqQQcuqOGUKZbvwPMvo84vSzOkFRuKVM4BTTC', 'admin', 'Admin', 'User', '555-0001', '123 Admin Street, Admin City, AC 12345', true),
('customer1', 'customer@shoppingmart.com', '$2b$12$rFd4.B5ZcZD99PiwHHZ/3ec5wCR.kZASwNlF0dryZS5r2TGZ.cmT6', 'customer', 'John', 'Doe', '555-0002', '456 Customer Ave, Customer City, CC 67890', true),
('customer2', 'jane.smith@email.com', '$2b$12$rFd4.B5ZcZD99PiwHHZ/3ec5wCR.kZASwNlF0dryZS5r2TGZ.cmT6', 'customer', 'Jane', 'Smith', '555-0003', '789 Buyer Blvd, Buyer Town, BT 11111', true),
('customer3', 'bob.wilson@email.com', '$2b$12$rFd4.B5ZcZD99PiwHHZ/3ec5wCR.kZASwNlF0dryZS5r2TGZ.cmT6', 'customer', 'Bob', 'Wilson', '555-0004', '321 Shopper Lane, Shop City, SC 22222', true)
ON CONFLICT (email) DO NOTHING;

-- Note: The hashed passwords are for demonstration purposes
-- In production, passwords should be hashed during registration via the API
