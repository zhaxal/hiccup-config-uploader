// server.js
require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const { isAuthenticated } = require('./middleware/auth');

const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret-key',
    resave: false,
    saveUninitialized: false
}));

// The hashed password should be stored in environment variable
const HASHED_PASSWORD = process.env.HASHED_PASSWORD || '$2a$10$X7uK9vXW9Uq5HhYtXgBpA.YhCj6kK1s8aF6JGuM6nf0e.kOo/AfK6'; // Default: "admin"

// Routes
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', async (req, res) => {
    const { password } = req.body;
    const isValid = await bcrypt.compare(password, HASHED_PASSWORD);
    
    if (isValid) {
        req.session.isAuthenticated = true;
        res.redirect('/');
    } else {
        res.status(401).send('Invalid password');
    }
});

app.get('/', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'upload.html'));
});

app.post('/upload', isAuthenticated, (req, res) => {
    if (!req.files || !req.files.config) {
        return res.status(400).send('No config file was uploaded.');
    }

    const configFile = req.files.config;
    const configDir = path.join(__dirname, 'configs');
    const uploadPath = path.join(configDir, 'config.json');

    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir);
    }

    configFile.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send('Config file uploaded successfully!');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});