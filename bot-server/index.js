const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const https = require('https');
const crypto = require('crypto');

// --- CONFIGURATION ---
const token = process.env.TELEGRAM_BOT_TOKEN;
const geminiKey = process.env.BOT_GEMINI_API_KEY;
const botSecret = process.env.BOT_SECRET;
const firebaseBaseUrl = process.env.FIREBASE_FUNCTIONS_URL;
const appUrl = process.env.APP_URL;

if (!token || !geminiKey) {
    console.error("❌ ERROR: Bot Token or Gemini API Key not set in .env");
    process.exit(1);
}

// Initialize Services
const bot = new TelegramBot(token, { polling: true });
const genAI = new GoogleGenerativeAI(geminiKey);

// --- FIREBASE HELPER ---
async function callFirebase(funcName, data) {
    return new Promise((resolve, reject) => {
        const url = `${firebaseBaseUrl}/${funcName}`;
        const postData = JSON.stringify({ data });

        const req = https.request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-bot-secret': botSecret
            }
        }, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    if (res.statusCode !== 200) {
                        return reject(new Error(json.error?.message || `Firebase Error ${res.statusCode}`));
                    }
                    resolve(json.result);
                } catch (e) {
                    reject(new Error(`Failed to parse response: ${body}`));
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(postData);
        req.end();
    });
}

// --- GEMINI AI LOGIC ---
async function analyzeImage(imageBuffer) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const imageBase64 = imageBuffer.toString('base64');

    const prompt = `Analisa gambar sampah ini sebagai "Sampah Kosmik". 
    Output JSON ONLY tanpa markdown.
    {
      "type": "Kategori (Plastik/Kertas/Organik/Metal/Kaca/Residu/B3)",
      "fun_fact": "Fakta singkat & kosmik tentang entropi/siklus material ini",
      "action": "Cara daur ulang praktis",
      "value": "Nilai Ekonomi (Rendah/Sedang/Tinggi)",
      "kategori": "organik/anorganik/b3/residu"
    }`;

    try {
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: imageBase64,
                    mimeType: "image/jpeg",
                },
            },
        ]);

        const response = await result.response;
        const text = response.text().replace(/```json|```/g, '').trim();
        return JSON.parse(text);
    } catch (e) {
        console.error("AI Analysis Error:", e);
        return null;
    }
}

async function chatWithAI(userText, userName) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
    Kamu adalah "Sampah Kosmik", AI penjaga siklus materi & asisten daur ulang dari proyek SampahKu 2026.
    Lawan bicaramu: ${userName}.
    
    Persona:
    - Filosofis, puitis, kosmik (istilah: nebula, entropi, frekuensi, atom).
    - Ramah, sedikit misterius tapi sangat membantu.
    
    User: "${userText}"
    
    Jawab (singkat & conversational):`;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (e) {
        return `Sinyal kosmik terputus... coba lagi nanti.`;
    }
}

// --- BOT HANDLERS ---

console.log('🤖 SampahKu Bot is running with Firebase Backend...');

// 1. Start Command
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const name = msg.from.first_name;

    const welcomeMsg = `🌌 *Selamat Datang, Guardian ${name}!* 

Gunakan bot ini untuk menganalisa siklus material (sampah) di sekitarmu.
Setiap analisa akan memberimu *EcoCredits* yang bisa ditukar di aplikasi SampahKu.

📸 *Kirimkan foto sampah* untuk mulai analisa.
🔗 *Ketik /link* untuk menghubungkan dengan akun web.
🚀 *Ketik /app* untuk membuka Mini App.`;

    bot.sendMessage(chatId, welcomeMsg, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: "🚀 Buka SampahKu App", web_app: { url: `${appUrl}/mini` } }],
                [{ text: "💎 Cek Saldo", callback_data: 'cek_saldo' }]
            ]
        }
    });
});

// 2. Link Command
bot.onText(/\/link/, async (msg) => {
    const chatId = msg.chat.id;
    const name = msg.from.first_name;

    try {
        const result = await callFirebase('createLinkCode', {
            telegramUserId: String(chatId),
            displayName: name
        });

        const reply = `🔗 *KODE HUBUNG KOSMIK*\n\n` +
            `Kode Anda: \`${result.code}\`\n` +
            `Berlaku hingga: ${new Date(result.expiresAt).toLocaleTimeString()}\n\n` +
            `Masukkan kode ini di menu **Portal Mini App** untuk menghubungkan dompet EcoCredits Anda.`;

        bot.sendMessage(chatId, reply, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [[{
                    text: "🔗 Hubungkan Sekarang",
                    web_app: { url: `${appUrl}/mini?code=${result.code}` }
                }]]
            }
        });
    } catch (err) {
        bot.sendMessage(chatId, `❌ Gagal membuat kode: ${err.message}`);
    }
});

// 3. Check Balance
bot.onText(/\/cekpoin/, async (msg) => {
    const chatId = msg.chat.id;
    try {
        const result = await callFirebase('getUserCreditsByTelegram', {
            telegramUserId: String(chatId)
        });

        if (!result.linked) {
            bot.sendMessage(chatId, "⚠️ Akun Telegram Anda belum terhubung ke sistem Web. Ketik /link dulu ya!");
            return;
        }

        bot.sendMessage(chatId, `🪐 *STATUS GARDA KOSMIK*\n\n` +
            `💎 Saldo: *${result.credits} Partikel*\n` +
            `🌍 Impact: *${result.impact} kg*\n` +
            `🏅 Badge: ${result.badges.length > 0 ? result.badges.join(', ') : 'Belum ada'}\n\n` +
            `Terus jaga keseimbangan semesta!`, { parse_mode: 'Markdown' });
    } catch (err) {
        bot.sendMessage(chatId, `❌ Gagal mengambil data: ${err.message}`);
    }
});

// 4. App Command
bot.onText(/\/app/, (msg) => {
    bot.sendMessage(msg.chat.id, "Buka portal SampahKu 2026:", {
        reply_markup: {
            inline_keyboard: [[{ text: "🚀 Launch Mini App", web_app: { url: `${appUrl}/mini` } }]]
        }
    });
});

// 5. Image Handler
bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    const name = msg.from.first_name;
    const photo = msg.photo[msg.photo.length - 1]; // Highest res

    const loadingMsg = await bot.sendMessage(chatId, '🛰️ *Mengontak Satelit... (0%)*', { parse_mode: 'Markdown' });

    try {
        const fileLink = await bot.getFileLink(photo.file_id);

        await bot.editMessageText('🛰️ *Menganalisa Spektrum... (50%)*', {
            chat_id: chatId,
            message_id: loadingMsg.message_id,
            parse_mode: 'Markdown'
        });

        const buffer = await new Promise((resolve, reject) => {
            https.get(fileLink, (res) => {
                const chunks = [];
                res.on('data', (chunk) => chunks.push(chunk));
                res.on('end', () => resolve(Buffer.concat(chunks)));
                res.on('error', reject);
            });
        });

        const aiResult = await analyzeImage(buffer);
        if (!aiResult) throw new Error("AI gagal memproses data.");

        // Award Credits via Firebase
        const reward = await callFirebase('awardCreditsFromTelegram', {
            telegramUserId: String(chatId),
            idempotencyKey: `scan_${msg.message_id}_${chatId}`,
            actionType: 'telegram_scan',
            metadata: {
                kategori: aiResult.kategori,
                type: aiResult.type
            },
            description: `Scan Material: ${aiResult.type}`
        });

        await bot.deleteMessage(chatId, loadingMsg.message_id);

        let replyText = `🔭 *ANALISA KOSMOLOGI SELESAI*\n\n` +
            `📦 *Klasifikasi:* ${aiResult.type}\n` +
            `📜 *Arsip Semesta:* ${aiResult.fun_fact}\n` +
            `✨ *Ritual Transformasi:* ${aiResult.action}\n` +
            `⚖️ *Nilai Ekonomi:* ${aiResult.value}\n\n`;

        if (reward.ok) {
            replyText += `🌠 *+${reward.creditedAmount} Partikel Ditambahkan!* (Total: ${reward.wallet.credits})`;
            if (reward.newBadges?.length > 0) {
                replyText += `\n🏅 *Badge Baru Tercapai:* ${reward.newBadges.join(', ')}!`;
            }
        } else if (reward.reason === 'telegram_not_linked') {
            replyText += `⚠️ *Catatan:* Akun belum terhubung. Poin tersimpan sementara di radar kami. Ketik /link untuk memindahkan ke dompet utama.`;
        }

        bot.sendMessage(chatId, replyText, { parse_mode: 'Markdown' });

    } catch (error) {
        console.error("Handler Error:", error);
        bot.deleteMessage(chatId, loadingMsg.message_id).catch(() => { });
        bot.sendMessage(chatId, `🌑 *Sinyal Terganggu:* ${error.message}`);
    }
});

// Callback for inline buttons
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    if (query.data === 'cek_saldo') {
        const result = await callFirebase('getUserCreditsByTelegram', { telegramUserId: String(chatId) });
        if (!result.linked) {
            bot.answerCallbackQuery(query.id, { text: "Akun belum terhubung! Ketik /link", show_alert: true });
        } else {
            bot.answerCallbackQuery(query.id);
            bot.sendMessage(chatId, `💎 Saldo Anda: *${result.credits} Partikel*`, { parse_mode: 'Markdown' });
        }
    }
});

bot.on('message', async (msg) => {
    if (!msg.text || msg.text.startsWith('/')) return;
    bot.sendChatAction(msg.chat.id, 'typing');
    const reply = await chatWithAI(msg.text, msg.from.first_name);
    bot.sendMessage(msg.chat.id, reply);
});
