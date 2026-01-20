const express = require('express');
const path = require('path');
const app = express();

// Gunakan port dari environment variable (Firebase menyediakan ini)
const PORT = process.env.PORT || 8080;

// Sajikan file statis dari folder 'dist'
app.use(express.static(path.join(__dirname, 'dist')));

// Pastikan semua rute diarahkan ke index.html (SPA Fallback)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
