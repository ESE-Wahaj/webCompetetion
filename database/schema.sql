-- Complete Database Schema for ShoppingMart
-- This file contains the complete schema as a reference

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('customer', 'admin')) DEFAULT 'customer',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS Categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
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

-- Cart Table
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

-- Orders Table
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

-- OrderItems Table
CREATE TABLE IF NOT EXISTS OrderItems (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES Orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES Products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create all indexes
CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_users_username ON Users(username);
CREATE INDEX idx_users_role ON Users(role);
CREATE INDEX idx_products_name ON Products(name);
CREATE INDEX idx_products_category ON Products(category_id);
CREATE INDEX idx_products_active ON Products(is_active);
CREATE INDEX idx_products_price ON Products(price);
CREATE INDEX idx_cart_user ON Cart(user_id);
CREATE INDEX idx_cart_session ON Cart(session_id);
CREATE INDEX idx_cart_product ON Cart(product_id);
CREATE INDEX idx_orders_user ON Orders(user_id);
CREATE INDEX idx_orders_status ON Orders(status);
CREATE INDEX idx_orders_created ON Orders(created_at DESC);
CREATE INDEX idx_orderitems_order ON OrderItems(order_id);
CREATE INDEX idx_orderitems_product ON OrderItems(product_id);
CREATE INDEX idx_products_active_category ON Products(is_active, category_id) WHERE is_active = true;
CREATE INDEX idx_cart_user_product ON Cart(user_id, product_id);
CREATE INDEX idx_orders_user_status ON Orders(user_id, status);
CREATE INDEX idx_products_name_trgm ON Products USING gin(name gin_trgm_ops);
