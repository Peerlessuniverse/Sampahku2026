export interface SponsorData {
    id: string;
    username?: string;
    password?: string;
    name: string;
    tagline: string;
    message: string;
    mediaType: 'image' | 'video' | 'none';
    mediaUrl: string;
    linkUrl: string;
    theme: 'cosmic' | 'forest';
    plan: 'nebula' | 'galactic' | 'cosmic' | 'none';
    status: 'active' | 'expired' | 'pending';
    expiryDate: string;
    createdAt: string;
    maxSlots: number;
    stats?: {
        impressions: number;
        clicks: number;
    };
}

const STORAGE_KEY = 'sampahku_active_sponsors';

export const getStoredSponsors = (): SponsorData[] => {
    const defaultSponsors: SponsorData[] = [
        {
            id: 'sampahku-original',
            username: 'Sponsor_Brands',
            password: 'Maudaftariklan1tahun###',
            name: 'SampahKu Premium',
            tagline: 'Eco-System Discovery',
            message: 'Membuka Jalur Energi Baru Untuk Bumi',
            mediaType: 'none',
            mediaUrl: '',
            linkUrl: 'https://sampahku.net',
            theme: 'cosmic',
            plan: 'cosmic',
            status: 'active',
            expiryDate: '2027-01-01',
            createdAt: '2025-01-01',
            maxSlots: 5,
            stats: { impressions: 1240, clicks: 450 }
        },
        {
            id: 'brand-001',
            username: 'partner_aqua',
            password: 'password123',
            name: 'EcoAqua Solutions',
            tagline: 'Murnikan Masa Depan',
            message: 'Setiap Botol Adalah Kesempatan Kedua Bagi Laut Kita.',
            mediaType: 'image',
            mediaUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=2000',
            linkUrl: 'https://ecoaqua.com',
            theme: 'forest',
            plan: 'nebula',
            status: 'active',
            expiryDate: '2026-06-15',
            createdAt: '2025-10-12',
            maxSlots: 1,
            stats: { impressions: 890, clicks: 210 }
        },
        {
            id: 'brand-002',
            username: 'partner_solar',
            password: 'password123',
            name: 'SolarPath Energy',
            tagline: 'Energi Dari Pusat Galaksi',
            message: 'Mengonversi Cahaya Menjadi Kehidupan Yang Tak Terbatas.',
            mediaType: 'video',
            mediaUrl: 'https://www.youtube.com/watch?v=kYI_UoG0lYk',
            linkUrl: 'https://solarpath.io',
            theme: 'cosmic',
            plan: 'galactic',
            status: 'pending',
            expiryDate: '2026-12-30',
            createdAt: '2025-11-05',
            maxSlots: 3,
            stats: { impressions: 0, clicks: 0 }
        },
        {
            id: 'brand-003',
            username: 'partner_waste',
            password: 'password123',
            name: 'ZeroWaste Collective',
            tagline: 'Nir-Residu, Penuh Arti',
            message: 'Saatnya Menata Ulang Gaya Hidup Kita Dengan Kesadaran.',
            mediaType: 'none',
            mediaUrl: '',
            linkUrl: 'https://zerowaste.org',
            theme: 'forest',
            plan: 'cosmic',
            status: 'expired',
            expiryDate: '2025-12-01',
            createdAt: '2025-05-20',
            maxSlots: 5,
            stats: { impressions: 5600, clicks: 1200 }
        }
    ];

    if (typeof window === 'undefined') return defaultSponsors;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                // If stored data exists, we check if our new dummy IDs are present.
                // This is a "Smart Merge" to ensure the user sees the new data even without a reset.
                const hasNewData = parsed.some(s => s.id === 'brand-001');
                if (!hasNewData) {
                    return [...parsed, ...defaultSponsors.filter(ds => ds.id !== 'sampahku-original')];
                }
                return parsed;
            }
        } catch (e) {
            console.error('Failed to parse stored sponsors', e);
        }
    }
    return defaultSponsors;
};

export const saveSponsors = (sponsors: SponsorData[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sponsors));
};

export const getActiveSponsor = (): SponsorData => {
    const sponsors = getStoredSponsors();
    const activeOnes = sponsors.filter(s => s.status === 'active');

    if (activeOnes.length === 0) return sponsors[0];

    // Define weights for each plan
    const weights: Record<string, number> = {
        'cosmic': 100,  // Cosmic gets 10x more frequency than Nebula
        'galactic': 30, // Galactic gets 3x more frequency
        'nebula': 10,
        'none': 1
    };

    // Calculate total weight
    const totalWeight = activeOnes.reduce((sum, s) => sum + (weights[s.plan] || 1), 0);

    // Pick a random number between 0 and totalWeight
    let random = Math.random() * totalWeight;

    // Select the sponsor
    for (const sponsor of activeOnes) {
        const weight = weights[sponsor.plan] || 1;
        if (random < weight) {
            return sponsor;
        }
        random -= weight;
    }

    return activeOnes[0];
};

export const trackImpression = (id: string) => {
    const sponsors = getStoredSponsors();
    const updated = sponsors.map(s => {
        if (s.id === id) {
            return {
                ...s,
                stats: {
                    impressions: (s.stats?.impressions || 0) + 1,
                    clicks: s.stats?.clicks || 0
                }
            };
        }
        return s;
    });
    saveSponsors(updated);
};

export const trackClick = (id: string) => {
    const sponsors = getStoredSponsors();
    const updated = sponsors.map(s => {
        if (s.id === id) {
            return {
                ...s,
                stats: {
                    impressions: s.stats?.impressions || 0,
                    clicks: (s.stats?.clicks || 0) + 1
                }
            };
        }
        return s;
    });
    saveSponsors(updated);
};
