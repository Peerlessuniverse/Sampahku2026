# 🌌 SampahKu 2026: Master Plan & Dokumentasi Lengkap
> **Visi:** "Mengolah Limbah, Menata Jiwa" — Mentransformasi limbah fisik menjadi harmoni ekosistem dan ketenangan spiritual melalui teknologi.

---

## 1. Ringkasan Proyek
**SampahKu 2026** adalah platform digital pengelolaan sampah modern yang menggabungkan estetika premium (Cosmic & Forest theme) dengan fungsionalitas cerdas (AI Scanner & Carbon Calculator). Proyek ini dibangun untuk mendidik masyarakat tentang pentingnya manajemen sampah mandiri dan sirkularitas energi.

### Core Aesthetic
*   **Cosmic Theme:** Deep Indigo (#02020a), Violet, Nebula Glow, Glassmorphism. Melambangkan luasnya potensi energi.
*   **Forest Theme:** Emerald Green (#022c22), Wood accents, Organic textures. Melambangkan keselarasan dengan bumi.

---

## 2. Arsitektur Teknologi (Stack)
*   **Frontend Framework:** React 19 + Vite (Next-gen development speed).
*   **Bahasa:** TypeScript (Skalabilitas & Type-safety).
*   **Styling:** 
    *   **Tailwind CSS:** Untuk layout responsif dan animasi nebula.
    *   **Vanilla CSS:** Untuk micro-interactions khusus.
*   **Interactive Components:**
    *   **Cobe:** Representasi bumi 3D interaktif pada landing page.
    *   **Lucide-React:** Set ikon minimalis dan modern.
*   **Artificial Intelligence:** 
    *   **Google Gemini AI:** Backend cerdas untuk identifikasi jenis sampah melalui visual scanner.
*   **State & Persistence:** 
    *   **Local Storage Sync:** Mekanisme penyimpanan data sponsor dan preferensi user secara lokal dengan sistem sinkronisasi cerdas.

---

## 3. Struktur Direktori & Modul
```text
/sampahku-web
├── /public            # Aset statis, gambar PNG/SVG premium
├── /src
│   ├── /components    # Komponen reusable (Navbar, Footer, Modal, UI Kit)
│   ├── /pages         # Halaman utama aplikasi
│   │   ├── Home.tsx                # Dashboard interaktif & Globe
│   │   ├── Transformation.tsx      # Landing page 4 kategori sampah
│   │   ├── TransformationDetail.tsx # Detail metode (Takakura, Loseda, dll)
│   │   ├── Scanner.tsx             # Interface AI "Mata Alam"
│   │   ├── WTE.tsx                 # Simulator Waste to Energy
│   │   ├── AdminSponsors.tsx       # Portal Kendali Partner
│   │   └── Login.tsx               # Gerbang Akses Admin
│   ├── /services      # Logika API & Business Logic (Gemini, Sponsor Stats)
│   ├── /types         # Definisi TypeScript interface
│   └── App.tsx        # Routing & App Global State
```

---

## 4. Analisis Fitur & Fungsionalitas

### A. Dashboard Utama (Beranda)
*   **Interactive Orbit System:** Navigasi melingkar di sekitar Globe 3D yang memudahkan user mengidentifikasi sumber sampah (Rumah Tangga, Industri, Medis, dll).
*   **Carbon Calculator:** Algoritma penghitungan jejak karbon harian berdasarkan aktivitas transportasi, listrik, dan konsumsi pangan.

### B. Modul Transformasi (Langkah Nyata)
Terbagi menjadi 4 pilar utama dengan metode detail:
1.  **Daur Organik:** Kompos Takakura, Loseda, Eco-Enzyme, Maggot BSF.
2.  **Siklus Anorganik:** Ecobrick, Bank Sampah, Upcycling Craft.
3.  **Limbah Khusus B3:** Dropbox E-Waste, Pengolahan Jelantah.
4.  **Material Residu:** Teknologi RDF, Insinerasi Modern.

### C. Mata Alam (AI Scanner)
*   User mengunggah foto sampah.
*   AI menganalisis material tersebut.
*   Output: Jenis material, tingkat akurasi (confidence score), dan instruksi pembuangan/pengolahan yang sinkron dengan modul Transformasi.

### D. Control Portal (Admin & Sponsor)
*   **Partner Management:** CRUD data sponsor/partner.
*   **Media Config:** Mendukung URL langsung, YouTube Embed, atau Google Drive Direct untuk aset iklan premium.
*   **Analytics:** Tracking impresi dan klik secara real-time untuk setiap slot sponsor.

---

## 5. Model Data Utama (Sponsor/Partner)
Sistem menggunakan schema `SponsorData` yang dinamis:
```typescript
interface SponsorData {
    id: string;
    name: string;
    plan: 'nebula' | 'galactic' | 'cosmic'; // Tingkat visibilitas
    mediaType: 'image' | 'video' | 'none';
    stats: { impressions: number, clicks: number };
    theme: 'cosmic' | 'forest'; // Menyesuaikan warna transisi
}
```

---

## 6. Roadmap Pengembangan (Masa Depan)
*   **Tahap 1 (Stability):** Penyelesaian seluruh aset visual premium (Completed).
*   **Tahap 2 (Social):** Integrasi sistem poin "Eco-Credits" yang bisa ditukar di merchant partner.
*   **Tahap 3 (Mobile):** Pengembangan aplikasi mobile native agar scanner lebih praktis digunakan di lapangan.
*   **Tahap 4 (Expert):** Forum komunitas "Warga Masuk Akal" untuk berbagi feedback pengolahan sampah.

---

## 7. Panduan Akses Cepat
*   **User View:** `http://localhost:3000/`
*   **Admin Access:** `http://localhost:3000/admin` (User: `admin`, Pass: `admin123`)
*   **Sponsor Transitions:** Muncul otomatis saat berpindah halaman antar modul (Siklus Sinkronisasi).

---

## 8. Optimasi & Stabilitas (Januari 2026)
Proyek telah melewati fase audit performa dengan peningkatan berikut:
*   **Performance:** Implementasi *Route-based Code Splitting* menggunakan `React.lazy` & `Suspense` untuk mempercepat LCP.
*   **Efficiency:** Memoization data statis guna mengurangi beban render pada komponen interaktif (Globe/Orbit).
*   **Accessibility (A11y):** Penambahan standard `aria-label`, `title`, dan audit kontras warna pada elemen UI kritis.
*   **SEO:** Struktur metadata yang lebih baik untuk identitas platform.

---
*Dokumen ini diperbarui secara otomatis berdasarkan iterasi pengembangan terakhir pada 22 Januari 2026.*
