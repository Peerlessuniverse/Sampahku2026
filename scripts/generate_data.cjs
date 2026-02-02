const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../src/data');

// --- 1. LEADERBOARD GENERATOR ---
const firstNames = ["Budi", "Siti", "Reza", "Andi", "Dewi", "Fajar", "Gita", "Hendi", "Ika", "Joko", "Rina", "Agus", "Wulan", "Eko", "Maya", "Dian", "Arief", "Nadia", "Bayu", "Lestari"];
const lastNames = ["Santoso", "Aminah", "Rahardian", "Wijaya", "Kusuma", "Pratama", "Sari", "Saputra", "Wibowo", "Hidayat", "Susanti", "Nugroho", "Utami", "Firmansyah", "Yulia", "Purnomo", "Setiawan", "Lestari", "Kurniawan", "Indri"];

function generateUsers(count) {
    const users = [];
    for (let i = 0; i < count; i++) {
        const first = firstNames[Math.floor(Math.random() * firstNames.length)];
        const last = lastNames[Math.floor(Math.random() * lastNames.length)];
        const name = `${first} ${last}`;

        const credits = Math.floor(Math.random() * 49900) + 100;

        let rank = "Eco Scout";
        if (i < 3) rank = "Cosmic Guardian"; // Actually list will be sorted later
        else if (i < 10) rank = "Planet Protector";

        const badges = [];
        if (Math.random() > 0.7) badges.push('Early Adopter');
        if (Math.random() > 0.8) badges.push('Top Contributor');
        if (Math.random() > 0.9) badges.push('Recycle Hero');

        users.push({
            id: `u-${1000 + i}`,
            name,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(' ', '')}`,
            credits,
            rank: "TBD", // Will assign after sort
            badges
        });
    }

    // Sort by credits DESC
    users.sort((a, b) => b.credits - a.credits);

    // Assign Ranks
    return users.map((u, idx) => {
        if (idx < 3) u.rank = "Cosmic Guardian";
        else if (idx < 10) u.rank = "Planet Protector";
        else u.rank = "Eco Scout";
        return u;
    });
}

// --- 2. TRANSACTIONS GENERATOR ---
const earnActions = ["Setor 5kg Kardus", "Setor Jelantah 2L", "Bonus Referral", "Setor Kaleng Bekas", "Program Bank Sampah", "Setor Plastik PET"];
const spendActions = ["Tukar Voucher PLN", "Donasi Pohon", "Diskon Belanja", "Tukar Pulsa", "Donasi Panti Asuhan"];

function generateTransactions(count) {
    const txs = [];
    for (let i = 0; i < count; i++) {
        const isEarn = Math.random() < 0.8;
        const type = isEarn ? 'EARN' : 'SPEND';
        const actionPool = isEarn ? earnActions : spendActions;
        const note = actionPool[Math.floor(Math.random() * actionPool.length)];

        let amount = isEarn
            ? Math.floor(Math.random() * 4900) + 100
            : Math.floor(Math.random() * 9000) + 1000;

        // Date in past 30 days
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));

        txs.push({
            id: `tx-${Math.random().toString(36).substr(2, 9)}`,
            userId: `u-${1000 + Math.floor(Math.random() * 50)}`, // Random user from pool
            type,
            note,
            amount,
            date: date.toISOString().split('T')[0]
        });
    }
    return txs.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// --- 4. MAP POINTS GENERATOR ---
const pointTypes = ['Bank Sampah Unit', 'Drop Box E-Waste', 'Pusat Kompos', 'Vending Machine Reverse'];
const baseCoords = { lat: -6.200000, lng: 106.845600 }; // Jakarta 中心

function generateMapPoints(count) {
    const points = [];
    for (let i = 0; i < count; i++) {
        const type = pointTypes[Math.floor(Math.random() * pointTypes.length)];
        // Jitter around Jakarta (approx radius 10km)
        const lat = baseCoords.lat + (Math.random() - 0.5) * 0.1;
        const lng = baseCoords.lng + (Math.random() - 0.5) * 0.1;

        points.push({
            id: `loc-${i}`,
            name: `${type} - Zona ${String.fromCharCode(65 + i)}`,
            type,
            lat,
            lng,
            status: Math.random() > 0.2 ? 'OPEN' : 'CLOSED',
            address: `Jl. Simulasi No. ${Math.floor(Math.random() * 100)}, Jakarta`
        });
    }
    return points;
}

// --- EXECUTE ---
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const users = generateUsers(50);
fs.writeFileSync(path.join(OUTPUT_DIR, 'mock_leaderboard.json'), JSON.stringify(users, null, 2));
console.log(`✅ Generated 50 Users -> src/data/mock_leaderboard.json`);

const txs = generateTransactions(100);
fs.writeFileSync(path.join(OUTPUT_DIR, 'mock_transactions.json'), JSON.stringify(txs, null, 2));
console.log(`✅ Generated 100 Transactions -> src/data/mock_transactions.json`);

const mapPoints = generateMapPoints(20);
fs.writeFileSync(path.join(OUTPUT_DIR, 'collection_points.json'), JSON.stringify(mapPoints, null, 2));
console.log(`✅ Generated 20 Map Points -> src/data/collection_points.json`);
