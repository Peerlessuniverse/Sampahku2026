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
const RADAR_VERSION = "2.0.8-CORE-REPAIR";
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
const genAI = new GoogleGenerativeAI(API_KEY);

app.post('/api/analyze', async (req, res) => {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "Gambar kosong" });
    if (!API_KEY) return res.status(500).json({ error: "API KEY TIDAK TERDETEKSI DI SERVER!" });

    // Gunakan nama model yang paling standar & universal
    const modelsToTry = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-8b",
        "gemini-1.5-pro"
    ];

    let lastErrorDetails = [];

    // TAHAP 1: PROBE TEKS (Hanya untuk diagnostik apakah API Projekt nyambung)
    try {
        console.log("[RADAR] Phase 1: Text Connectivity Test...");
        const probeModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        await probeModel.generateContent("test");
        console.log("[RADAR] Phase 1: SUCCESS. Project API is active.");
    } catch (probeErr) {
        console.error("[RADAR] Phase 1: FAILED! Project/Key Issue:", probeErr.message);
        return res.status(500).json({
            error: "PROJECT API MATI (404/429)",
            details: [probeErr.message],
            suggestion: "BRO! Ini fiks Project Google Cloud kamu belum aktifin 'Generative Language API'. Bikin KEY BARU di AI Studio tapi pilih 'Create API key in NEW project' (Jangan pake project lama)."
        });
    }

    // TAHAP 2: PROBE GAMBAR (Analisis Sebenarnya)
    for (const modelName of modelsToTry) {
        try {
            console.log(`[RADAR] Phase 2: Analyzing with ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });

            const prompt = `ANDA ADALAH: Master Radar AI. ANALISIS GAMBAR INI (Output JSON murni):
            {
              "isRecyclable": boolean,
              "materialType": "Plastic/Paper/Organic/Metal/E-Waste/Residue/Human/Non-Waste",
              "disposalInstructions": "Instruksi spesifik",
              "energyPotential": "Narasi potensi",
              "transformationRoute": "organic|inorganic|b3|residu|none",
              "confidence": number
            }`;

            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        mimeType: "image/jpeg",
                        data: image
                    }
                }
            ]);

            const text = result.response.text();
            const startIdx = text.indexOf('{');
            const endIdx = text.lastIndexOf('}');

            if (startIdx !== -1 && endIdx !== -1) {
                return res.json(JSON.parse(text.substring(startIdx, endIdx + 1)));
            }
            throw new Error("Invalid format from AI");

        } catch (err) {
            console.error(`[RADAR] ${modelName} FAILED:`, err.message);
            lastErrorDetails.push(`${modelName}: ${err.message}`);
        }
    }

    res.status(500).json({
        error: "Radar Analysis Failed",
        details: lastErrorDetails,
        suggestion: "Coba foto objek lain atau buat API Key baru di project yang berbeda."
    });
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
