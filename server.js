import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Gunakan API Key dari environment variable server
const API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

app.use(express.json({ limit: '10mb' }));
const DIST_PATH = path.join(__dirname, 'dist');
app.use(express.static(DIST_PATH));

// Endpoint khusus untuk Analisis AI (Server-Side)
app.post('/api/analyze', async (req, res) => {
    try {
        const { image } = req.body;
        if (!image) return res.status(400).json({ error: "No image data" });
        if (!API_KEY) return res.status(500).json({ error: "AI Config missing on server" });

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
        console.error("AI Error:", error);
        res.status(500).json({ error: "Gagal menganalisa gambar" });
    }
});

app.get('(.*)', (req, res) => {
    res.sendFile(path.join(DIST_PATH, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
