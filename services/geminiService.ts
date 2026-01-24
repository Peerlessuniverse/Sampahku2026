import { WasteAnalysis } from "../types";

export const analyzeWasteImage = async (base64Image: string): Promise<WasteAnalysis> => {
  console.log("Radar: Mencoba koneksi ke Pusat...");

  const PROD_URL = 'https://bek2sampahku2026--sampahku2026.asia-southeast1.hosted.app/api/analyze';
  const LOCAL_URL = '/api/analyze';

  // Order: Try Local first if in development, then Prod
  const endpoints = [LOCAL_URL, PROD_URL];

  for (const url of endpoints) {
    try {
      console.log(`Radar: Menghubungi unit ${url}...`);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Radar: Transmisi Berhasil via ${url}!`);
        return data;
      }

      // Capture the specific error from backend
      const errorData = await response.json().catch(() => ({ error: "Gagal membaca detail error" }));
      const specificError = errorData.error || `Error status: ${response.status}`;
      console.warn(`Radar: Unit ${url} merespon error:`, specificError);

      // If the local server actually replied with an error, throw that specific error 
      // instead of continuing to next or throwing generic message
      if (url === LOCAL_URL) {
        throw new Error(specificError);
      }

    } catch (e: any) {
      if (e.message && !e.message.includes("is not reachable") && !e.message.includes("failed to fetch")) {
        throw e; // Relaunch if it's a specific logic error (like from the backend)
      }
      console.warn(`Radar: Unit ${url} tidak terjangkau atau timeout.`);
    }
  }

  throw new Error("Sistem Radar: Semua jalur komunikasi terputus. Pastikan server lokal 'node server.js' sudah dijalankan atau tunggu beberapa saat.");
};
