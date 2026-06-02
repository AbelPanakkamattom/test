-- Database Schema Design for Notes Management System

-- 1. Users Table (Matches the baseline core application data model)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Notes Table (Satisfies all core feature requirements)
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Optimization Indexes (Satisfies the "Efficient Search" requirement)
-- Accelerates text pattern matching queries on title and content fields
CREATE INDEX idx_notes_search ON notes USING gin(to_tsvector('english', title || ' ' || COALLESCE(content, '')));
-- Accelerates sorting operations for the "most recently updated" listing requirement
CREATE INDEX idx_notes_updated_at ON notes (updated_at DESC);

-- Seed Initial Mock Data (Aligns with baseline test scripts)
INSERT INTO users (id, name, email) VALUES
(1, 'Amit', 'amit@test.com'),
(2, 'Riya', 'riya@test.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO notes (id, title, content, user_id) VALUES
(1, 'Note 1', 'Content 1', 1),
(2, 'Note 2', 'Content 2', 2)
ON CONFLICT (id) DO NOTHING;