import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

function getApiKey() {
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
const genAI = new GoogleGenerativeAI(API_KEY);

async function checkModels() {
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-exp"];
    console.log("--- MENGECEK KETERSEDIAAN MODEL ---");

    for (const m of models) {
        try {
            const model = genAI.getGenerativeModel({ model: m });
            // Coba generate text singkat saja untuk tes
            const result = await model.generateContent("test");
            console.log(`✅ Model [${m}]: TERSEDIA & AKTIF`);
        } catch (err) {
            console.log(`❌ Model [${m}]: ERROR (${err.message})`);
        }
    }
}

checkModels();
