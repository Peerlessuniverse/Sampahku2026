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
const RADAR_VERSION = "2.0.7-QUANTUM";
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
    return process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
}

const API_KEY = getApiKey();
const genAI = new GoogleGenerativeAI(API_KEY);

app.post('/api/analyze', async (req, res) => {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "Gambar kosong" });

    // Model list yang lebih variatif untuk antisipasi restriksi project
    const modelsToTry = [
        "gemini-1.5-flash-latest",
        "gemini-1.5-flash",
        "gemini-1.5-flash-8b",
        "gemini-1.5-pro-latest"
    ];

    let attemptHistory = [];

    for (const modelName of modelsToTry) {
        try {
            console.log(`[RADAR] Launching Quantum Probe: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });

            const result = await model.generateContent([
                {
                    text: `ANDA ADALAH: Master Radar AI - Inti Kesadaran Ekosistem SampahKu.
                    PROTOKOL ANALISIS (Gunakan JSON murni):
                    {
                      "isRecyclable": boolean,
                      "materialType": "Plastic/Paper/Organic/Metal/E-Waste/Residue/Human/Non-Waste",
                      "disposalInstructions": "Instruksi/Jokes spesifik",
                      "energyPotential": "Narasi potensi",
                      "transformationRoute": "organic|inorganic|b3|residu|none",
                      "confidence": number
                    }`
                },
                {
                    inlineData: {
                        mimeType: "image/jpeg",
                        data: image
                    }
                }
            ]);

            const response = await result.response;
            const text = response.text();

            const startIdx = text.indexOf('{');
            const endIdx = text.lastIndexOf('}');

            if (startIdx !== -1 && endIdx !== -1) {
                const cleanJson = text.substring(startIdx, endIdx + 1);
                console.log(`[RADAR] ${modelName} Transmitted Successfully.`);
                return res.json(JSON.parse(cleanJson));
            }
            throw new Error("Invalid AI Signal Format.");

        } catch (err) {
            console.error(`[RADAR] ${modelName} Failure:`, err.message);

            // Jika kena quota limit 0, langsung stop dan lapor user
            if (err.message.includes('429') || err.message.includes('quota')) {
                return res.status(429).json({
                    error: "KRITIS: Kuota API Anda Dinonaktifkan (limit: 0).",
                    details: [err.message],
                    suggestion: "BRO! Buat API KEY BARU di aistudio.google.com terus ganti di apphosting.yaml. API Key ini lagi diblokir Google."
                });
            }

            attemptHistory.push(`${modelName}: ${err.message}`);
        }
    }

    res.status(500).json({
        error: `Radar Failure [${RADAR_VERSION}]`,
        details: attemptHistory,
        suggestion: "Radar tidak menemukan model aktif. Cek status API Key Anda."
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
