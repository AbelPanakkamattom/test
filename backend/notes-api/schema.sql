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

-- --- Automation Triggers for Timestamp Synchronization ---

/**
 * Trigger Function: Automatically manages updating the updated_at column 
 * state whenever a row mutation occurs.
 */
CREATE OR REPLACE FUNCTION update_modified_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

/**
 * Bind the synchronization trigger function explicitly to execution scopes 
 * running against the notes index table layout.
 */
CREATE TRIGGER set_notes_timestamp
BEFORE UPDATE ON notes
FOR EACH ROW
EXECUTE FUNCTION update_modified_timestamp_column();


-- 3. Optimization Indexes (Satisfies the "Efficient Search" requirement)

-- FIX: Corrected typo 'COALLESCE' to 'COALESCE' for functional full-text search string processing
CREATE INDEX idx_notes_search ON notes USING gin(to_tsvector('english', title || ' ' || COALESCE(content, '')));

-- Accelerates sorting operations for the "most recently updated" listing requirement
CREATE INDEX idx_notes_updated_at ON notes (updated_at DESC);


-- --- Seed Initial Mock Data (Aligns with baseline test scripts) ---

-- Note: Removed explicit sequential hardcoded ID injection parameters to prevent sequence out-of-sync issues.
INSERT INTO users (name, email) VALUES
('Amit', 'amit@test.com'),
('Riya', 'riya@test.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO notes (title, content, user_id) VALUES
('Note 1', 'Content 1', (SELECT id FROM users WHERE email = 'amit@test.com')),
('Note 2', 'Content 2', (SELECT id FROM users WHERE email = 'riya@test.com'))
ON CONFLICT DO NOTHING;