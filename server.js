import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Gunakan PORT yang diberikan Firebase, atau 8080 sebagai cadangan
const PORT = process.env.PORT || 8080;

const DIST_PATH = path.join(__dirname, 'dist');

app.use(express.static(DIST_PATH));

app.get('(.*)', (req, res) => {
    res.sendFile(path.join(DIST_PATH, 'index.html'));
});

// PENTING: Mendengarkan di 0.0.0.0 agar bisa dijangkau dari luar container
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server aktif di port: ${PORT}`);
});
