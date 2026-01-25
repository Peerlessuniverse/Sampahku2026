import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Use dotenv for robust environment variable management across Node versions
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { analyzeWasteFlow } from './services/genkitEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, 'dist');

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

// RADAR VERSION TAG
const RADAR_VERSION = "2.1.1-SUPERNOVA";
console.log(`[SYS] Initializing RADAR ENGINE ${RADAR_VERSION}...`);

// Debug endpoint to see what models are actually accessible
app.get('/api/debug-models', async (req, res) => {
    const key = getApiKey();
    if (!key) return res.status(500).json({ error: "Missing Key" });
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    try {
        const resp = await fetch(url);
        const data = await resp.json();
        res.json({
            version: RADAR_VERSION,
            keyPrefix: key.slice(0, 10),
            models: data
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    try {
        const distExists = fs.existsSync(distPath);
        res.json({
            status: 'Radar AI Backend: ONLINE 🚀',
            version: RADAR_VERSION,
            timestamp: new Date().toISOString(),
            distExists: distExists,
            envKeys: Object.keys(process.env).filter(k => k.includes('VITE') || k.includes('API')).sort()
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.use(express.static(distPath));

function getApiKey() {
    return process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
}

const API_KEY = getApiKey();

app.post('/api/analyze', async (req, res) => {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "Gambar kosong" });
    if (!getApiKey()) return res.status(500).json({ error: "API KEY TIDAK TERDETEKSI! Periksa .env atau Secret Manager." });

    console.log(`[RADAR] Request diterima pada ${new Date().toLocaleTimeString()}`);

    try {
        console.log(`[RADAR] Mengaktifkan Genkit Flow 'analyzeWasteFlow'...`);

        // Execute Genkit Flow
        const result = await analyzeWasteFlow(image);

        console.log(`[RADAR] Sukses! Terdeteksi sebagai: ${result.materialType} (Confidence: ${result.confidence})`);
        return res.json(result);

    } catch (err) {
        console.error(`[RADAR ANALYZE ERROR]:`, err.message);

        // Detailed error for debugging while launching
        res.status(500).json({
            error: "Analisis Radar Gagal (via Genkit)",
            message: err.message,
            suggestion: "Pastikan API Key memiliki akses ke Gemini 1.5 Flash dan kuota harian masih tersedia."
        });
    }
});


// Single point of entry for all frontend requests
app.get('*', (req, res) => {
    // Avoid interfering with missing API routes
    if (req.path.startsWith('/api/')) return res.status(404).json({ error: "API Route Not Found" });

    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        let html = fs.readFileSync(indexPath, 'utf8');

        const firebaseApiKey = process.env.VITE_FIREBASE_API_KEY || "AIzaSyCqLvs1Oa0fjghLgVsBjIyWfUQku9AhsKQ";
        const geminiApiKey = process.env.VITE_GEMINI_API_KEY || "";

        const runtimeConfig = `
        <script>
            window.RADAR_CONFIG = {
                VITE_FIREBASE_API_KEY: "${firebaseApiKey}",
                VITE_FIREBASE_AUTH_DOMAIN: "${process.env.VITE_FIREBASE_AUTH_DOMAIN || 'sampahku2026.firebaseapp.com'}",
                VITE_FIREBASE_PROJECT_ID: "${process.env.VITE_FIREBASE_PROJECT_ID || 'sampahku2026'}",
                VITE_FIREBASE_STORAGE_BUCKET: "${process.env.VITE_FIREBASE_STORAGE_BUCKET || 'sampahku2026.firebasestorage.app'}",
                VITE_FIREBASE_MESSAGING_SENDER_ID: "${process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '776475826770'}",
                VITE_FIREBASE_APP_ID: "${process.env.VITE_FIREBASE_APP_ID || '1:776475826770:web:e874257466f2f0324ddd8b'}",
                VITE_FIREBASE_MEASUREMENT_ID: "${process.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-FCG2XK0FF3'}",
                VITE_GEMINI_API_KEY: "${geminiApiKey}",
                VITE_ENV: "production"
            };
        </script>
        `;

        html = html.replace('<head>', `<head>${runtimeConfig}`);
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.send(html);
    } else {
        res.status(404).send("Frontend not found. Please build the project.");
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 RADAR ENGINE ${RADAR_VERSION} ONLINE ON PORT ${PORT}`);
});
