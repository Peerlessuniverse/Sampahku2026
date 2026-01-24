import { WasteAnalysis } from "../types";

export const analyzeWasteImage = async (base64Image: string): Promise<WasteAnalysis> => {
  console.log("Radar: Mencoba koneksi ke Inti Radar...");

  const ENDPOINT = '/api/analyze';

  try {
    console.log(`Radar: Menghubungi unit ${ENDPOINT}...`);
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image })
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`Radar: Transmisi Berhasil via ${ENDPOINT}!`);
      return data;
    }

    const errorData = await response.json().catch(() => ({ error: "Gagal membaca detail error" }));
    const specificError = errorData.error || `Error status: ${response.status}`;
    console.warn(`Radar: Unit ${ENDPOINT} merespon error:`, specificError);
    throw new Error(specificError);

  } catch (e: any) {
    console.error("Radar Error:", e.message);
    throw e;
  }
};
