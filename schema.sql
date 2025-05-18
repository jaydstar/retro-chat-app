-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE
);

-- Create rooms table
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Create messages table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(id),
    user_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert 10 static users
INSERT INTO users (username) VALUES
    ('User1'),
    ('User2'),
    ('User3'),
    ('User4'),
    ('User5'),
    ('User6'),
    ('User7'),
    ('User8'),
    ('User9'),
    ('User10');

-- Insert 5 static rooms
INSERT INTO rooms (name) VALUES
    ('General'),
    ('Technology'),
    ('Random'),
    ('Support'),
    ('Announcements');
