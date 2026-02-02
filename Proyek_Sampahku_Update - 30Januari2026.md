Ringkasan Implementasi & Instruksi Deploy

A. Hosting & Struktur proyek
- Web app tetap di Firebase Hosting dengan root dist/; route /mini adalah entry point Mini App.
- Dist/ memiliki SPA rewrite ke index.html untuk app utama;/router untuk /mini mengarahkan ke dist/mini/index.html.
- Struktur hosting tidak diubah secara esensial.

B. Mini App (UI premium untuk sponsor)
- Bot menambahkan tombol persist: “🚀 Buka Sampahku App” yang membuka WebView Telegram ke https://sampahku2026.web.app.
- Mini App memuat sponsor premium, UI scanner, dashboard poin, redeem, leaderboard, serta halaman paket sponsor Nebula/Galactic/Cosmic.
- Autentikasi web menggunakan Firebase Anonymous (tanpa Google login widget); linking Telegram via kode 6-digit (deep-link) dilakukan di Mini App.
- Linking Telegram melalui Cloud Function: linkTelegramWithCode; kode 6-digit didapat dari bot melalui /link atau URL query.
- Data sponsor/banner di Firestore; event tracking sponsor dicatat sesuai sistem ads kamu.

C. Sinkronisasi poin Telegram ↔ Web (server-trusted)
- Menghapus sumber kebenaran poin dari PostgreSQL bot; semua awarding kredits via Firebase backend.
- Endpoints Firebase (HTTPS onRequest):
  - awardCreditsTelegram: award credits untuk telegramUserId dengan idempotencyKey; auth via X-BOT-SECRET.
  - createLinkCode: generate 6-digit code untuk linking.
  - linkTelegramWithCode: mengikat Telegram dengan akun web (requires Firebase ID token).
- Flow: lookup telegram_user → uid; lakukan awarding idempotent; tulis wallet/ledger; balas {awarded, balance, entryId}.
- Firestore struktur inti: wallets/{uid}.balance, ledgers/{entryId}, telegramLinks/{code}, users/{uid}.
- After analysis di bot, telpon awardCreditsTelegram untuk sinkronisasi saldo; tampilkan hasilnya di bot.

D. Linking akun Telegram ke akun Web (deep-link code)
- Tambah command /link di bot untuk menghasilkan kode linking via function; kirim kode + tombol “🔗 Hubungkan Akun” yang membuka Mini App dengan query code.
- Di Mini App: login anonymous; ketika kode dipakai, panggil linkTelegramWithCode untuk mengaitkan telegramUserId ↔ uid; invalidate kode tersebut.

E. Badge system
- Badges tetap ada sebagai label/achievement di UI; awarding badge di bot tidak menambah saldo (gantung implementasi server).
- Minimal perbaikan: badge_unlock bisa tetap muncul di bot, namun saldo selalu berasal dari server (wallet balance).

F. Leaderboard & stats
- Data leaderboard & stats diambil dari Firestore/Functions, bukan Postgres:
  - stats: wallets/{uid}.balance + ledgers(20 terakhir)
  - leaderboard: top balances dari wallets dengan pemetaan user displayName.

G. Fly.io (bot)
- Bot tetap di Fly.io; Web kredits server-trusted di Firebase.
- Bot tetap menjadi pintu akses utama + funnel edukasi/komunitas.

H. Acceptance criteria (mapping)
- Bot membuka WebView ke /mini via tombol.
- /mini menampilkan saldo EcoCredits jika linked, sponsor aktif, serta Scan/Redeem/Riwayat.
- Sponsor tracking (impression/click) dicatat sesuai event ads.
- Jika belum linked: Mini App menampilkan CTA hubungkan Telegram dengan petunjuk kode dari bot.
- Setelah linking: saldo di Mini App konsisten dengan saldo di web dashboard (1 dompet).

I. Deploy & Testing (langkah rinci)
- Persiapan:
  - Pastikan Firebase CLI terpasang; Fly.io CLI siap; BOT_SECRET tersedia.
- Firebase Hosting:
  1) Pastikan dist/ berisi index.html untuk app utama dan dist/mini/index.html plus dist/mini/mini-app.js untuk mini app.
  2) Konfigurasi firebase.json agar routing /mini -> /mini/index.html dengan rewrites.
  3) firebase login
  4) firebase init hosting (root dist sebagai public) jika belum; konfirmasi rewrite rules.
  5) firebase deploy --only hosting
- Firebase Functions:
  6) Pindah ke folder functions/; npm install
  7) Sesuaikan env var BOT_SECRET via firebase functions:config:set bot.secret="..."
  8) firebase deploy --only functions
- Fly.io (Bot)
  9) fly auth login
  10) Sesuaikan env/bot secret pada app (fly secrets set BOT_SECRET=...)
  11) fly deploy
- Verifikasi & test:
  12) Jalankan flow: klik tombol di bot untuk membuka Mini App; periksa WebView berfungsi.
  13) /mini balance muncul jika user sudah linked; CTA hubungkan Telegram jika belum linked.
  14) Test linking: generate kode via bot (/link), buka Mini App dengan kode, login Anonymous, masukkan kode; lihat linking terjadi.
  15) Test awarding: call awardCreditsTelegram dengan idempotencyKey baru; pastikan balance bertambah; lakukan ulang dengan idempotencyKey yang sama untuk memastikan tidak doble.
  16) Cek sponsor: banner sponsor aktif ditampilkan; klik banner tertangkap sesuai event tracking.
- Domain produksi (opsional): jika ingin https://sampahku.com/mini, tambahkan hosting domain pada Firebase sesuai panduan.

J. Risiko & catatan teknis
- Cold start Functions bisa memengaruhi latency; pertimbangkan caching/keep-warn.
- Keamanan: pastikan secret BOT dan token auth disimpan di environment/secret management.
- Pastikan skema Firestore konsisten antara web dan bot; rollback mudah jika ada perbedaan.

Dokumen ini dimaksudkan sebagai ringkasan implementasi dan panduan deploy/testing. Ganti placeholder konfigurasi (Firebase config, region, URL functions) dengan nilai asli proyekmu sebelum menjalankan patch ini.
