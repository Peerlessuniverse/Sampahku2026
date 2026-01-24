import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

app.use(express.json({ limit: '30mb' }));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

function getApiKey() {
    if (process.env.VITE_GEMINI_API_KEY) return process.env.VITE_GEMINI_API_KEY;
    try {
        const envPath = path.join(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const lines = fs.readFileSync(envPath, 'utf8').split('\n');
            for (const line of lines) {
                if (line.includes('VITE_GEMINI_API_KEY')) {
                    const value = line.split('=')[1];
                    if (value) return value.trim().replace(/['";]/g, "");
                }
            }
        }
    } catch (e) { }
    return "";
}

const API_KEY = getApiKey();
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

app.post('/api/analyze', async (req, res) => {
    if (!genAI) return res.status(500).json({ error: "Server Error: API Key tidak terbaca." });

    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "Gambar kosong" });

    const modelsToTry = [
        "gemini-1.5-flash",
        "gemini-2.0-flash-exp",
        "gemini-1.5-pro"
    ];

    let lastError = "";

    for (const modelName of modelsToTry) {
        try {
            console.log(`[${new Date().toLocaleTimeString()}] Mencoba Model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });

            const result = await model.generateContent([
                `ANDA ADALAH: Master Radar AI - Inti Kesadaran Ekosistem SampahKu.
                PROTOKOL ANALISIS (Gunakan JSON murni tanpa markdown):
                {
                  "isRecyclable": boolean,
                  "materialType": "Plastic/Paper/Organic/Metal/E-Waste/Residue/Human/Non-Waste",
                  "disposalInstructions": "Instruksi/Jokes spesifik",
                  "energyPotential": "Narasi potensi",
                  "transformationRoute": "organic|inorganic|b3|residu|none",
                  "confidence": number
                }
                
                JIKA MANUSIA: Gunakan jokes "Sampah Masyarakat & Polisi".
                JIKA BUKAN SAMPAH: Set route 'none'.`,
                { inlineData: { mimeType: "image/jpeg", data: image } }
            ]);

            const text = result.response.text();
            console.log("AI Response Raw:", text);

            const startIdx = text.indexOf('{');
            const endIdx = text.lastIndexOf('}');

            if (startIdx === -1 || endIdx === -1) {
                throw new Error("Format JSON tidak ditemukan dalam respon AI.");
            }

            const cleanJson = text.substring(startIdx, endIdx + 1);
            return res.json(JSON.parse(cleanJson));

        } catch (err) {
            console.error(`Error dengan model ${modelName}:`, err.message);
            lastError = err.message;
        }
    }

    res.status(500).json({ error: "Radar Gagal: " + lastError });
});

app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 SERVING APP + SCANNER ON PORT ${PORT}`);
});
