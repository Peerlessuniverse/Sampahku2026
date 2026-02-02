import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './firebaseConfig';

export interface CreditData {
    credits: number;
    impact: number; // in Ton CO2 (can be negative)
    totalWasteScanned?: number; // kept for compatibility
    completedActivities: string[];
    displayName?: string;
    photoURL?: string;
    uid?: string;
}

export interface Transaction {
    id: string;
    amount: number;
    description: string;
    timestamp: string;
    type: 'earn' | 'redeem';
    userId?: string;
}

const functions = getFunctions(app);

// Save user profile (kept as no-op for compatibility; real profiles di Firestore via other services)
export const saveUserProfile = async (_profile: { uid: string, displayName: string, photoURL: string }) => {
    return;
};

export const getUserCredits = async (userId: string): Promise<CreditData> => {
    const callable = httpsCallable(functions, 'getUserCredits');
    const res = await callable({ uid: userId });
    const data = res.data as any;
    return {
        credits: data.credits || 0,
        impact: data.impact || 0,
        completedActivities: data.completedActivities || [],
    };
};

// impactChange optional, actionType/idempotencyKey/metadata optional untuk kompatibilitas lama
export const updateUserCredits = async (
    userId: string,
    amount: number,
    description: string,
    activityId?: string,
    impactChange: number = 0,
    actionType?: 'generic' | 'ad_watch' | 'scan' | 'mission' | 'quiz' | 'redeem',
    idempotencyKey?: string,
    metadata?: any,
) => {
    const callable = httpsCallable(functions, 'awardCredits');
    const payload = {
        uid: userId,
        amount,
        description,
        activityId,
        impactChange,
        source: 'web' as const,
        actionType: actionType || 'generic',
        idempotencyKey: idempotencyKey || `client:${Date.now()}:${Math.random()}`,
        metadata: metadata || {},
    };

    const res = await callable(payload);
    return res.data as any;
};

export const getUserHistory = async (userId: string): Promise<Transaction[]> => {
    const callable = httpsCallable(functions, 'getUserHistory');
    const res = await callable({ uid: userId });
    const arr = res.data as any[];
    return arr.map((t) => ({
        id: t.id,
        amount: t.amount,
        description: t.description,
        timestamp: t.timestamp,
        type: t.type,
    }));
};

export const getGlobalLeaderboard = async (): Promise<CreditData[]> => {
    const callable = httpsCallable(functions, 'getLeaderboard');
    const res = await callable({});
    return res.data as CreditData[];
};
