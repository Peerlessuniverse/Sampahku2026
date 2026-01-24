import { genkit, z } from 'genkit';
import { googleAI, gemini15Flash } from '@genkit-ai/googleai';

/**
 * GENKIT RUNTIME ENGINE - JS VERSION FOR BACKEND
 */

export const ai = genkit({
    plugins: [
        googleAI({
            apiKey: process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY
        })
    ],
    model: gemini15Flash,
});

export const WasteAnalysisSchema = z.object({
    isRecyclable: z.boolean(),
    materialType: z.enum([
        "Plastic", "Paper", "Organic", "Metal", "E-Waste", "Residue", "Human", "Non-Waste"
    ]),
    disposalInstructions: z.string(),
    energyPotential: z.string(),
    transformationRoute: z.enum(["organic", "inorganic", "b3", "residu", "none"]),
    confidence: z.number(),
});

export const analyzeWasteFlow = ai.defineFlow(
    {
        name: 'analyzeWasteFlow',
        inputSchema: z.string(),
        outputSchema: WasteAnalysisSchema,
    },
    async (base64Image) => {
        try {
            const response = await ai.generate({
                prompt: [
                    {
                        text: "ANDA ADALAH: SCANNER SAMPAHKU. ANALISIS GAMBAR INI UNTUK PROGRAM SAMPAHKU 2026."
                    },
                    {
                        media: {
                            url: `data:image/jpeg;base64,${base64Image}`
                        }
                    }
                ],
                output: {
                    format: 'json',
                    schema: WasteAnalysisSchema
                }
            });

            return response.output();
        } catch (error) {
            console.error("[GENKIT FLOW ERROR]:", error.message);
            throw error;
        }
    }
);
