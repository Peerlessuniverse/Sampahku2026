import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { WasteAnalysis } from "../types";

// Ambil API Key dari environment variable Vite (Lokal) atau App Hosting (Produksi)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzeWasteImage = async (base64Image: string): Promise<WasteAnalysis> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // gemini-2.5-flash doesn't exist yet, 1.5 is current
    });

    const response = await model.generateContent({
      contents: [{
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          {
            text: "Analyze this image of waste/trash. Determine if it is recyclable, what material it is (Plastic, Paper, Organic, Metal, E-Waste, Residue), and provide short disposal instructions (Indonesian). Return JSON.",
          },
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

    const result = await response.response;
    const text = result.text();
    if (!text) {
      throw new Error("No response from AI");
    }
    return JSON.parse(text) as WasteAnalysis;
  } catch (error) {
    console.error("Error analyzing waste:", error);
    throw error;
  }
};
