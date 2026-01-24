import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from "@google/generative-ai";

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
const RADAR_VERSION = "2.0.9-NUCLEAR";
console.log(`[SYS] Initializing RADAR ENGINE ${RADAR_VERSION}...`);

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
    if (!API_KEY) return res.status(500).json({ error: "API KEY TIDAK TERDETEKSI DI SERVER!" });

    const maskedKey = `***${API_KEY.slice(-5)}`;
    console.log(`[RADAR] Launching Nuclear Probe with Key ending in: ${maskedKey}...`);

    // Model yang paling aman
    const modelName = "gemini-1.5-flash";

    // PEMANGGILAN RAW HTTP (Bypass SDK untuk menghindari 404 dari v1beta)
    const ENDPOINT = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${API_KEY}`;

    const payload = {
        contents: [{
            parts: [
                { text: "ANDA ADALAH: Master Radar AI. ANALISIS GAMBAR INI (Output JSON murni):\n{\n  \"isRecyclable\": boolean,\n  \"materialType\": \"Plastic/Paper/Organic/Metal/E-Waste/Residue/Human/Non-Waste\",\n  \"disposalInstructions\": \"Instruksi spesifik\",\n  \"energyPotential\": \"Narasi potensi\",\n  \"transformationRoute\": \"organic|inorganic|b3|residu|none\",\n  \"confidence\": number\n}" },
                { inlineData: { mimeType: "image/jpeg", data: image } }
            ]
        }]
    };

    try {
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("[RADAR] Raw API Error:", JSON.stringify(data));
            return res.status(response.status).json({
                error: `HTTP ${response.status}: ${data.error?.message || "Unknown API Error"}`,
                details: [data.error?.status || "ERROR", `Model: ${modelName}`, `Key Check: ${maskedKey}`],
                suggestion: "BRO! Kalau ini masih 404, artinya Project Google Cloud kamu MATI. Solusi: Kamu harus klik 'Create API Key in NEW PROJECT' di AI Studio."
            });
        }

        const text = data.candidates[0].content.parts[0].text;
        const startIdx = text.indexOf('{');
        const endIdx = text.lastIndexOf('}');

        if (startIdx !== -1 && endIdx !== -1) {
            return res.json(JSON.parse(text.substring(startIdx, endIdx + 1)));
        }

        throw new Error("Invalid format in AI response candidates.");

    } catch (err) {
        console.error("[RADAR] Nuclear Crash:", err.message);
        res.status(500).json({
            error: "Radar Nuclear System Failure",
            details: [err.message],
            suggestion: "Periksa kestabilan server atau buat API Key dari akun Google lain."
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
