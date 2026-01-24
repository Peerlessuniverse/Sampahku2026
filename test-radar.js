import fetch from 'node-fetch';

// GANTI DENGAN API KEY BARU ANDA UNTUK TESTING
const TEST_API_KEY = "AIzaSyAOheV5Ql8bagqkKJH6WngrgnSBWb9GmlU";

async function testRadar() {
    console.log("=== SAMPKAHKU RADAR PRE-FLIGHT CHECK ===");
    console.log("Menguji API Key: " + TEST_API_KEY.slice(0, 10) + "...");

    const models = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-8b",
        "gemini-2.0-flash-exp"
    ];

    for (const model of models) {
        console.log(`\n[Mencoba Model: ${model}]`);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${TEST_API_KEY}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: "Sapa saya dengan 'Halo SampahKu'" }] }]
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log(`✅ BERHASIL! Respon dari ${model}:`);
                console.log("   ->", data.candidates[0].content.parts[0].text);
            } else {
                console.log(`❌ GAGAL! Status: ${response.status}`);
                console.log(`   Pesan: ${data.error?.message || "Error tidak diketahui"}`);
                if (data.error?.message?.includes("limit: 0")) {
                    console.log("   💡 DIAGNOSA: Akun ini kena Limit 0. Ganti Akun Google!");
                }
            }
        } catch (e) {
            console.log("❌ KESALAHAN JARINGAN:", e.message);
        }
    }
}

if (TEST_API_KEY === "MASUKKAN_API_KEY_DISINI") {
    console.log("⚠️ Harap masukkan API KEY Anda di dalam file test-radar.js terlebih dahulu!");
} else {
    testRadar();
}
