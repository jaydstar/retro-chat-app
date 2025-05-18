const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// PostgreSQL connection
const pool = new Pool({
  user: 'chatadmin',
  host: 'localhost',
  database: 'chatapp',
  password: 'chatpassword',
  port: 5432,
});

// Test database connection on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Database connected successfully');
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY username');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all rooms
app.get('/api/rooms', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rooms ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get messages for a specific room
app.get('/api/rooms/:roomId/messages', async (req, res) => {
  const roomId = req.params.roomId;
  try {
    const result = await pool.query(
      `SELECT m.id, m.content, m.timestamp, u.username, r.name as room_name
       FROM messages m
       JOIN users u ON m.user_id = u.id
       JOIN rooms r ON m.room_id = r.id
       WHERE m.room_id = $1
       ORDER BY m.timestamp`,
      [roomId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Post a new message
app.post('/api/messages', async (req, res) => {
  const { roomId, userId, content } = req.body;
  
  if (!roomId || !userId || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO messages (room_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
      [roomId, userId, content]
    );
    
    // Get the complete message data with username and room name
    const messageData = await pool.query(
      `SELECT m.id, m.content, m.timestamp, u.username, r.name as room_name
       FROM messages m
       JOIN users u ON m.user_id = u.id
       JOIN rooms r ON m.room_id = r.id
       WHERE m.id = $1`,
      [result.rows[0].id]
    );
    
    res.status(201).json(messageData.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve the main app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Chat app server running on port ${port}`);
});
