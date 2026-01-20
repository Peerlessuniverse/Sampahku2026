import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { WasteAnalysis } from "../types";

// Ambil API Key dari environment variable Vite (Lokal) atau App Hosting (Produksi)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzeWasteImage = async (base64Image: string): Promise<WasteAnalysis> => {
  try {
    // Memanggil API internal kita sendiri (Server-Side Proxy)
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "Gagal memanggil server AI");
    }

    return await response.json() as WasteAnalysis;
  } catch (error) {
    console.error("Error analyzing waste:", error);
    throw error;
  }
};
