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
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (e) {
            console.error('Failed to parse stored sponsors', e);
        }
    }
    return [];
};

export const saveSponsors = (sponsors: SponsorData[], syncToServer = true) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sponsors));

    if (syncToServer && typeof window !== 'undefined') {
        fetch('/api/sponsors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sponsors)
        }).catch(err => console.error('Background Sync Failed:', err));
    }
};

export const syncSponsorsWithServer = async () => {
    if (typeof window === 'undefined') return;
    try {
        const res = await fetch('/api/sponsors');
        if (res.ok) {
            const serverData = await res.json();
            if (Array.isArray(serverData) && serverData.length > 0) {
                console.log('[SponsorService] Synced with server:', serverData.length);
                saveSponsors(serverData, false);
            }
        }
    } catch (e) {
        console.error('[SponsorService] Sync failed', e);
    }
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

export interface SponsorPaymentDetails {
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    packageTitle: string;
    amount: string;
}

export const processPayment = async (details: SponsorPaymentDetails): Promise<{ success: boolean; transactionId: string }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real app, this would call the UTAS webhook or API
    console.log('Processing payment via UTAS for:', details);

    return {
        success: true,
        transactionId: `TRX-${Date.now()}`
    };
};
