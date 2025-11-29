-- Migration: Create Users Table
-- Description: Stores user accounts with authentication and role information

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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON Users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON Users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON Users(role);

-- Add comments
COMMENT ON TABLE Users IS 'User accounts with authentication and role-based access control';
COMMENT ON COLUMN Users.role IS 'User role: customer or admin';
COMMENT ON COLUMN Users.is_active IS 'Soft delete flag - false means account is deactivated';

-- Rollback SQL:
-- DROP TABLE IF EXISTS Users CASCADE;
