const express = require('express');
const path = require('path');
const app = express();

// Gunakan port dari environment variable (Firebase menyediakan ini)
const PORT = process.env.PORT || 8080;

const DIST_PATH = path.join(__dirname, 'dist');

// Sajikan file statis dari folder 'dist'
app.use(express.static(DIST_PATH));

// Pastikan semua rute diarahkan ke index.html (SPA Fallback)
app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_PATH, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
