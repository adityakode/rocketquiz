// index.js

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Allow all cross-origin requests

// MySQL Connection
const db = mysql.createConnection({
    port: 3306,
    host: 'rocketquizdb.cdq6wo0ak7vo.ap-south-1.rds.amazonaws.com',
    user: 'rocketquiz',
    password: '12345678',
    database: 'rocket'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// API Route to submit the score
app.post('/api/submit-score', (req, res) => {
    const { username, avatar, score } = req.body;
    const sql = 'INSERT INTO scores (username, avatar, score) VALUES (?, ?, ?)';
    db.query(sql, [username, avatar, score], (err, result) => {
        if (err) {
            console.error('Error inserting score:', err);
            res.status(500).send('Error inserting score');
            return;
        }
        res.send('Score submitted successfully');
    });
});

// API Route to get the leaderboard
app.get('/api/leaderboard', (req, res) => {
    const sql = 'SELECT username, avatar, score FROM scores ORDER BY score DESC LIMIT 10'; // Fetch top 10 scores
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching leaderboard:', err);
            res.status(500).send('Error fetching leaderboard');
            return;
        }
        res.json(results); // Send the leaderboard as JSON
    });
});

// New API Route to clear all entries in the scores table
app.delete('/api/clear', (req, res) => {
    const sql = 'DELETE FROM scores'; // Clear all rows from the scores table
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error clearing scores:', err);
            res.status(500).send('Error clearing scores');
            return;
        }
        res.send('All scores cleared successfully');
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
