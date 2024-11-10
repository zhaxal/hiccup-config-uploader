// server.js
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Enable file upload middleware
app.use(fileUpload());

// Serve static HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle file upload
app.post('/upload', (req, res) => {
    if (!req.files || !req.files.config) {
        return res.status(400).send('No config file was uploaded.');
    }

    const configFile = req.files.config;
    const configDir = path.join(__dirname, 'configs');
    const uploadPath = path.join(configDir, 'config.json');

    // Create configs directory if it doesn't exist
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir);
    }

    // Save file
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