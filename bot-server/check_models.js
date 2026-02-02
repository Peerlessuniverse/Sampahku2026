const https = require('https');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const key = process.env.BOT_GEMINI_API_KEY;

if (!key) {
    console.error("No Key Found in .env");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

console.log("🔍 Checking available Gemini models...");

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error("❌ API Error:", json.error.message);
                console.error("Details:", JSON.stringify(json.error, null, 2));
            } else if (json.models) {
                console.log("\n✅ AVAILABLE MODELS (Vision & Text):");
                const visionModels = json.models.filter(m => m.supportedGenerationMethods.includes('generateContent') && m.name.includes('vision'));
                const flashModels = json.models.filter(m => m.name.includes('flash'));
                const proModels = json.models.filter(m => m.name.includes('pro') && !m.name.includes('vision'));

                // Print all valid generateContent models
                json.models.forEach(m => {
                    if (m.supportedGenerationMethods.includes('generateContent')) {
                        const isVision = m.supportedGenerationMethods.includes('generateContent'); // Simplified check, actually depends on model capability
                        // But usually flash supports multimodality.
                        console.log(`- ${m.name.replace('models/', '')}`);
                    }
                });
            } else {
                console.log("⚠️ Unexpected Response:", data);
            }
        } catch (e) {
            console.error("❌ Parse Error:", e);
            console.log("Raw:", data);
        }
    });
}).on('error', e => console.error("❌ Network Error:", e));
