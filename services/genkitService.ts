import { genkit, z } from 'genkit';
import { googleAI, gemini15Flash } from '@genkit-ai/googleai';

/**
 * GENKIT ENGINE - SAMPAHKU 2026
 * Core AI logic for waste classification and transformation routing.
 */

// 1. Initialize Genkit with Google AI Plugin
// The API key is retrieved from environment variables for security.
export const ai = genkit({
    plugins: [
        googleAI({
            apiKey: process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY
        })
    ],
    model: gemini15Flash,
});

// 2. Define the Schema for Waste Analysis
// This ensures the AI always returns the exact format the frontend expects.
export const WasteAnalysisSchema = z.object({
    isRecyclable: z.boolean(),
    materialType: z.enum([
        "Plastic",
        "Paper",
        "Organic",
        "Metal",
        "E-Waste",
        "Residue",
        "Human",
        "Non-Waste"
    ]),
    disposalInstructions: z.string(),
    energyPotential: z.string(),
    transformationRoute: z.enum(["organic", "inorganic", "b3", "residu", "none"]),
    confidence: z.number(),
});

// 3. Define the Main AI Flow ("Mata Alam")
export const analyzeWasteFlow = ai.defineFlow(
    {
        name: 'analyzeWasteFlow',
        inputSchema: z.string(), // Base64 Image
        outputSchema: WasteAnalysisSchema,
    },
    async (base64Image) => {
        const response = await ai.generate({
            prompt: [
                {
                    text: `ANDA ADALAH: SCANNER SAMPAHKU. 
          Tugas Anda adalah menganalisis gambar limbah dan memberikan rute transformasi yang tepat untuk program SampahKu 2026.
          Gunakan pengetahuan tentang ekonomi sirkular dan pengolahan limbah ramah lingkungan.
          
          OUTPUT HARUS BERUPA JSON VALID.`
                },
                {
                    media: {
                        url: `data:image/jpeg;base64,${base64Image}`,
                        contentType: 'image/jpeg'
                    }
                }
            ],
            output: {
                format: 'json',
                schema: WasteAnalysisSchema
            }
        });

        return response.output;
    }
);
