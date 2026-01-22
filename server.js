import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("--- SAMPARKU SERVER STARTING ---");
console.log("CWD:", process.cwd());
console.log("__dirname:", __dirname);

const app = express();
// Ensure PORT is a number and matches environment
const PORT = parseInt(process.env.PORT || '8080', 10);

// Use API Key from server environment
const API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
console.log("Gemini API Key status:", API_KEY ? "CONFIGURED (starts with " + API_KEY.substring(0, 4) + "...)" : "MISSING");

let genAI;
try {
    if (API_KEY) {
        genAI = new GoogleGenerativeAI(API_KEY);
        console.log("GoogleGenerativeAI initialized");
    } else {
        console.warn("WARNING: Gemini API Key is missing. AI features will fail.");
    }
} catch (e) {
    console.error("CRITICAL: Failed to initialize GoogleGenerativeAI:", e);
}

app.use(express.json({ limit: '10mb' }));

const DIST_PATH = path.join(__dirname, 'dist');
console.log("Checking DIST_PATH:", DIST_PATH);
if (fs.existsSync(DIST_PATH)) {
    console.log("✓ dist folder found");
    if (fs.existsSync(path.join(DIST_PATH, 'index.html'))) {
        console.log("✓ index.html found in dist");
    } else {
        console.warn("✗ index.html NOT FOUND in dist folder");
    }
} else {
    console.error("✗ dist folder NOT FOUND! Build might have failed.");
}

app.use(express.static(DIST_PATH));

// Special endpoint for AI Analysis
app.post('/api/analyze', async (req, res) => {
    try {
        const { image } = req.body;
        if (!image) return res.status(400).json({ error: "No image data" });
        if (!genAI) return res.status(500).json({ error: "AI Config missing on server" });

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent({
            contents: [{
                role: "user",
                parts: [
                    { inlineData: { mimeType: "image/jpeg", data: image } },
                    { text: "Analyze this waste image. Determine if recyclable, material type (Plastic, Paper, Organic, Metal, E-Waste, Residue), and disposal instructions in Indonesian. Return JSON." }
                ],
            }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        isRecyclable: { type: SchemaType.BOOLEAN },
                        materialType: { type: SchemaType.STRING },
                        disposalInstructions: { type: SchemaType.STRING },
                        confidence: { type: SchemaType.NUMBER },
                    },
                    required: ["isRecyclable", "materialType", "disposalInstructions", "confidence"],
                },
            },
        });

        const text = result.response.text();
        res.json(JSON.parse(text));
    } catch (error) {
        console.error("AI Analysis Error:", error);
        res.status(500).json({ error: "Gagal menganalisa gambar: " + error.message });
    }
});

// Single Page Application - Fallback to index.html
// Using '*' for broader compatibility across Express versions
app.get('*', (req, res) => {
    const indexPath = path.join(DIST_PATH, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send("Application not built. Please check deployment logs.");
    }
});

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✓ Server successfully listening on 0.0.0.0:${PORT}`);
    console.log("--- SERVER READY ---");
});

server.on('error', (err) => {
    console.error("SERVER ERROR:", err);
});
