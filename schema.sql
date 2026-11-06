-- ========================================================
-- BiasharaHub Kenya Database Schema
-- Compatible with SQLite, PostgreSQL, and MySQL
-- Owner: Henry Okoth (M-Pesa: 0181288331)
-- ========================================================

-- 1. Listings Table (Businesses, Products, Institutions, Jobs)
CREATE TABLE IF NOT EXISTS listings (
    id VARCHAR(64) PRIMARY KEY,
    type VARCHAR(32) NOT NULL, -- 'product', 'business', 'institution', 'job'
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    price VARCHAR(64), -- Price in KSh or Salary Range
    description TEXT NOT NULL,
    location VARCHAR(128) NOT NULL, -- County / Town (e.g. Nairobi, Kisumu, Mombasa)
    address VARCHAR(255),
    contact_name VARCHAR(128) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    whatsapp VARCHAR(32),
    email VARCHAR(128),
    website VARCHAR(255),
    image_url TEXT,
    
    -- Payment & Verification Fields
    listing_fee INT DEFAULT 200,
    mpesa_code VARCHAR(32) NOT NULL, -- Safaricom M-Pesa Transaction Code
    mpesa_number VARCHAR(32) NOT NULL, -- Sender Phone Number
    mpesa_recipient_number VARCHAR(32) DEFAULT '0181288331',
    mpesa_recipient_name VARCHAR(64) DEFAULT 'Henry Okoth',
    payment_status VARCHAR(32) DEFAULT 'pending_approval', -- 'pending_approval', 'approved', 'rejected'
    
    -- Status & Analytics
    is_featured BOOLEAN DEFAULT 0,
    status VARCHAR(32) DEFAULT 'pending', -- 'pending', 'active', 'paused'
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Reference Table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(64) PRIMARY KEY,
    type VARCHAR(32) NOT NULL,
    name VARCHAR(128) NOT NULL,
    icon VARCHAR(64) DEFAULT 'bi-tag'
);

-- 3. System Settings Table
CREATE TABLE IF NOT EXISTS settings (
    key VARCHAR(64) PRIMARY KEY,
    value TEXT NOT NULL
);

-- Initial default settings for Henry Okoth's M-Pesa
INSERT INTO settings (key, value) VALUES 
('mpesa_number', '0181288331'),
('mpesa_name', 'Henry Okoth'),
('fee_product', '100'),
('fee_business', '200'),
('fee_job', '300'),
('fee_institution', '500')
ON CONFLICT(key) DO NOTHING;
