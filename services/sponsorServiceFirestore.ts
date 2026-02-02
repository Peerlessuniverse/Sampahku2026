import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    increment,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './firebaseConfig';

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

const SPONSORS_COLLECTION = 'sponsors';

// Sponsor plan weights for weighted random selection
const SPONSOR_PLAN_WEIGHTS = {
    cosmic: 100,   // Cosmic gets 10x more frequency than Nebula
    galactic: 30,  // Galactic gets 3x more frequency
    nebula: 10,
    none: 1
} as const;

// Get all sponsors from Firestore
export const getStoredSponsors = async (limitCount = 100): Promise<SponsorData[]> => {
    try {
        const sponsorsRef = collection(db, SPONSORS_COLLECTION);
        const q = query(sponsorsRef, orderBy('createdAt', 'desc'), limit(limitCount));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as SponsorData));
    } catch (error) {
        console.error('Error fetching sponsors:', error);
        return [];
    }
};

// Get active sponsors
export const getActiveSponsors = async (): Promise<SponsorData[]> => {
    try {
        const sponsorsRef = collection(db, SPONSORS_COLLECTION);
        const q = query(sponsorsRef, where('status', '==', 'active'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as SponsorData));
    } catch (error) {
        console.error('Error fetching active sponsors:', error);
        return [];
    }
};

// Get a single active sponsor (weighted random selection)
export const getActiveSponsor = async (): Promise<SponsorData | null> => {
    try {
        // Try to get active sponsors first
        const sponsorsRef = collection(db, SPONSORS_COLLECTION);
        const activeQ = query(
            sponsorsRef,
            where('status', '==', 'active'),
            orderBy('createdAt', 'desc'),
            limit(50)
        );
        const activeSnapshot = await getDocs(activeQ);

        let sponsorsList: SponsorData[] = [];

        if (activeSnapshot.empty) {
            // Fallback: get latest sponsor regardless of status with a single query
            const fallbackQ = query(
                sponsorsRef,
                orderBy('createdAt', 'desc'),
                limit(1)
            );
            const fallbackSnap = await getDocs(fallbackQ);
            if (fallbackSnap.empty) return null;

            sponsorsList = fallbackSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as SponsorData));

            return sponsorsList[0];
        }

        // Map active sponsors
        sponsorsList = activeSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as SponsorData));

        // Calculate total weight using extracted constants
        const totalWeight = sponsorsList.reduce((sum, s) => sum + (SPONSOR_PLAN_WEIGHTS[s.plan] || 1), 0);

        // Pick a random number between 0 and totalWeight
        let random = Math.random() * totalWeight;

        // Select the sponsor based on weight
        for (const sponsor of sponsorsList) {
            const weight = SPONSOR_PLAN_WEIGHTS[sponsor.plan] || 1;
            if (random < weight) {
                return sponsor;
            }
            random -= weight;
        }

        return sponsorsList[0];
    } catch (error) {
        console.error('Error fetching active sponsor:', error);
        return null;
    }
};

// Add a new sponsor
export const addSponsor = async (sponsorData: Omit<SponsorData, 'id'>): Promise<string> => {
    try {
        const sponsorsRef = collection(db, SPONSORS_COLLECTION);
        const docRef = await addDoc(sponsorsRef, {
            ...sponsorData,
            createdAt: sponsorData.createdAt || new Date().toISOString(),
            stats: sponsorData.stats || { impressions: 0, clicks: 0 }
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding sponsor:', error);
        throw error;
    }
};

// Update an existing sponsor
export const updateSponsor = async (id: string, updates: Partial<SponsorData>): Promise<void> => {
    try {
        const sponsorRef = doc(db, SPONSORS_COLLECTION, id);
        await updateDoc(sponsorRef, updates as any);
    } catch (error) {
        console.error('Error updating sponsor:', error);
        throw error;
    }
};

// Delete a sponsor
export const deleteSponsor = async (id: string): Promise<void> => {
    try {
        const sponsorRef = doc(db, SPONSORS_COLLECTION, id);
        await deleteDoc(sponsorRef);
    } catch (error) {
        console.error('Error deleting sponsor:', error);
        throw error;
    }
};

// Track impression (increment counter)
export const trackImpression = async (id: string): Promise<void> => {
    try {
        const sponsorRef = doc(db, SPONSORS_COLLECTION, id);
        await updateDoc(sponsorRef, {
            'stats.impressions': increment(1)
        });
    } catch (error) {
        console.error('Error tracking impression:', error);
    }
};

// Track click (increment counter)
export const trackClick = async (id: string): Promise<void> => {
    try {
        const sponsorRef = doc(db, SPONSORS_COLLECTION, id);
        await updateDoc(sponsorRef, {
            'stats.clicks': increment(1)
        });
    } catch (error) {
        console.error('Error tracking click:', error);
    }
};

// Sponsor payment details interface
export interface SponsorPaymentDetails {
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    packageTitle: string;
    amount: string;
}

// Process payment (placeholder for Xendit integration)
export const processPayment = async (details: SponsorPaymentDetails): Promise<{ success: boolean; transactionId: string }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // TODO: Integrate with Xendit API
    console.log('Processing payment via Xendit for:', details);

    return {
        success: true,
        transactionId: `TRX-${Date.now()}`
    };
};

