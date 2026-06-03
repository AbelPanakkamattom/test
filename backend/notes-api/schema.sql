-- 1. Create Tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Seed Initial Mock Data
INSERT INTO users (name, email) 
VALUES 
    ('Amit', 'amit@test.com'),
    ('Riya', 'riya@test.com')
ON CONFLICT (email) DO NOTHING;

-- Seed initial notes
INSERT INTO notes (title, content, user_id) 
SELECT 'Getting Started', 'Review the fullstack developer assignment documents closely.', id 
FROM users 
WHERE email = 'amit@test.com'
AND NOT EXISTS (SELECT 1 FROM notes WHERE title = 'Getting Started');

INSERT INTO notes (title, content, user_id) 
SELECT 'Next Steps', 'Complete the API integration with the PostgreSQL backend.', id 
FROM users 
WHERE email = 'riya@test.com'
AND NOT EXISTS (SELECT 1 FROM notes WHERE title = 'Next Steps');