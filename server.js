import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Use dotenv for robust environment variable management across Node versions
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, 'dist');

// LOGGING SETUP
const logStream = fs.createWriteStream(path.join(__dirname, 'server.log'), { flags: 'a' });
const originalLog = console.log;
const originalError = console.error;

console.log = function (...args) {
    const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ');
    logStream.write(`[LOG ${new Date().toISOString()}] ${msg}\n`);
    originalLog.apply(console, args);
};

console.error = function (...args) {
    const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ');
    logStream.write(`[ERR ${new Date().toISOString()}] ${msg}\n`);
    originalError.apply(console, args);
};

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json({ limit: '30mb' }));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

const SPONSORS_FILE = path.join(__dirname, 'sponsors.json');

// API: Get Sponsors
app.get('/api/sponsors', (req, res) => {
    try {
        if (!fs.existsSync(SPONSORS_FILE)) {
            // If file doesn't exist, return empty array
            return res.json([]);
        }
        const data = fs.readFileSync(SPONSORS_FILE, 'utf8');
        const sponsors = JSON.parse(data || '[]');
        res.json(sponsors);
    } catch (err) {
        console.error('Error reading sponsors file:', err);
        res.status(500).json({ error: 'Failed to read sponsors data' });
    }
});

// API: Save Sponsors
app.post('/api/sponsors', (req, res) => {
    try {
        const sponsors = req.body;
        if (!Array.isArray(sponsors)) {
            return res.status(400).json({ error: 'Invalid data format. Expected array.' });
        }
        fs.writeFileSync(SPONSORS_FILE, JSON.stringify(sponsors, null, 2));
        console.log(`[API] Saved ${sponsors.length} sponsors to ${SPONSORS_FILE}`);
        res.json({ success: true, count: sponsors.length });
    } catch (err) {
        console.error('Error writing sponsors file:', err);
        res.status(500).json({ error: 'Failed to save sponsors data' });
    }
});

app.use(express.static(distPath));

// Single point of entry for all frontend requests
app.get('*', (req, res) => {
    // Avoid interfering with missing API routes
    if (req.path.startsWith('/api/')) return res.status(404).json({ error: "API Route Not Found" });

    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send("Frontend not found. Please build the project.");
    }
});

// Global Error Handler to ensure JSON response
app.use((err, req, res, next) => {
    console.error(`[FATAL ERROR] ${err.message}`, err.stack);
    if (!res.headersSent) {
        res.status(500).json({
            error: "Internal Server Error",
            message: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

const RADAR_VERSION = '2.1.0';

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 RADAR ENGINE ${RADAR_VERSION} ONLINE ON PORT ${PORT}`);
    console.log(`[SYS] CWD: ${process.cwd()}`);
    console.log(`[SYS] Environment: ${process.env.NODE_ENV || 'development'}`);
});
