import { WasteAnalysis } from "../types";

export const analyzeWasteImage = async (base64Image: string): Promise<WasteAnalysis> => {
  console.log("Radar: Mencoba koneksi ke Pusat (Produksi)...");

  // ALAMAT PRODUKSI KAMU - Kita pakai ini sebagai proxy yang sudah terverifikasi Google
  const PROD_URL = 'https://bek2sampahku2026--sampahku2026.asia-southeast1.hosted.app/api/analyze';
  const LOCAL_URL = '/api/analyze';

  const endpoints = [PROD_URL, LOCAL_URL];

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
        console.log("Radar: Transmisi Berhasil!");
        return data;
      }

      const errorText = await response.text().catch(() => "Unknown error");
      console.warn(`Radar: Unit ${url} merespon error:`, errorText);
    } catch (e) {
      console.warn(`Radar: Unit ${url} tidak terjangkau.`);
    }
  }

  throw new Error("Sistem Radar: Semua jalur komunikasi terputus. Pastikan koneksi internet stabil dan server produksi aktif.");
};
