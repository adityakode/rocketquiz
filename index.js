// index.js

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Allow cross-origin requests
app.use(express.static('public')); // Serve static files (like your HTML, CSS, JS)

// MySQL Connection
const db = mysql.createConnection({
    port: 3306,
    host: 'rocketquizdb.cdq6wo0ak7vo.ap-south-1.rds.amazonaws.com', // Remove trailing slash
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

// Route to post score
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

// Route to get top 5 players
app.get('/api/leaderboard', (req, res) => {
    const sql = 'SELECT username, avatar, score FROM scores ORDER BY score DESC LIMIT 5';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching leaderboard:', err);
            res.status(500).send('Error fetching leaderboard');
            return;
        }
        res.json(results);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
