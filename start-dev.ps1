# Start-Dev.ps1
# Script untuk menjalankan lingkungan pengembangan SampahKu 2026

Write-Host "Memulai Lingkungan Pengembangan SampahKu 2026..." -ForegroundColor Green

# 1. Cek .env.local
if (-not (Test-Path ".env.local")) {
    Write-Host "PERINGATAN: file .env.local tidak ditemukan!" -ForegroundColor Red
    Write-Host "Pastikan Anda memiliki VITE_GEMINI_API_KEY di dalamnya."
    exit 1
}

# 2. Mulai Firebase Emulators
Write-Host "Menjalankan Firebase Emulators..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/c firebase emulators:start --only auth,firestore" -NoNewWindow:$false -PassThru
Start-Sleep -Seconds 5

# 3. Mulai Backend Server (API)
Write-Host "Menjalankan Backend Server (Port 8080)..." -ForegroundColor Cyan
Start-Process -FilePath "cmd" -ArgumentList "/c node server.js" -NoNewWindow:$false -PassThru

# 4. Mulai Frontend (Vite)
Write-Host "Menjalankan Frontend (Vite)..." -ForegroundColor Green
Write-Host "Aplikasi akan tersedia di http://localhost:3000"

# Execute Vite directly
npm run dev
