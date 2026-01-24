import { getUserCredits, updateUserCredits, getUserHistory } from "./dbService";
import { getCurrentUser } from "./authService";

export interface CreditTransaction {
    id: string;
    amount: number;
    description: string;
    timestamp: string;
    type: 'earn' | 'redeem';
}

const STORAGE_KEY = 'sampahku_eco_credits';
const HISTORY_KEY = 'sampahku_credit_history';
const COMPLETED_ACTIVITIES_KEY = 'sampahku_completed_activities';

export const getCredits = (): number => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored) : 0;
};

export const syncWithCloud = async () => {
    const user = getCurrentUser();
    if (!user) return;

    try {
        const cloudData = await getUserCredits(user.uid);
        localStorage.setItem(STORAGE_KEY, cloudData.credits.toString());
        localStorage.setItem(COMPLETED_ACTIVITIES_KEY, JSON.stringify(cloudData.completedActivities));

        const cloudHistory = await getUserHistory(user.uid);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(cloudHistory));

        window.dispatchEvent(new CustomEvent('creditsUpdated', { detail: { credits: cloudData.credits } }));
    } catch (error) {
        console.error("Cloud Sync Error:", error);
    }
};

export const addCredits = async (amount: number, description: string, activityId?: string) => {
    if (activityId && isActivityCompleted(activityId)) {
        return false;
    }

    const current = getCredits();
    const newValue = current + amount;
    localStorage.setItem(STORAGE_KEY, newValue.toString());

    if (activityId) {
        const completed = getCompletedActivities();
        localStorage.setItem(COMPLETED_ACTIVITIES_KEY, JSON.stringify([...completed, activityId]));
    }

    const history = getCreditHistory();
    const transaction: CreditTransaction = {
        id: Date.now().toString(),
        amount,
        description,
        timestamp: new Date().toISOString(),
        type: 'earn'
    };
    localStorage.setItem(HISTORY_KEY, JSON.stringify([transaction, ...history].slice(0, 50)));

    // Sync to Cloud if authenticated
    const user = getCurrentUser();
    if (user) {
        await updateUserCredits(user.uid, amount, description, activityId);
    }

    window.dispatchEvent(new CustomEvent('creditsUpdated', { detail: { credits: newValue, transaction } }));
    return true;
};

export const redeemCredits = async (amount: number, description: string): Promise<string | null> => {
    const current = getCredits();
    if (current < amount) return null;

    const newValue = current - amount;
    localStorage.setItem(STORAGE_KEY, newValue.toString());

    const voucherCode = `ECO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const history = getCreditHistory();
    const transaction: CreditTransaction = {
        id: Date.now().toString(),
        amount,
        description: `${description} [Code: ${voucherCode}]`,
        timestamp: new Date().toISOString(),
        type: 'redeem'
    };
    localStorage.setItem(HISTORY_KEY, JSON.stringify([transaction, ...history].slice(0, 50)));

    // Sync to Cloud if authenticated
    const user = getCurrentUser();
    if (user) {
        updateUserCredits(user.uid, -amount, `${description} [Code: ${voucherCode}]`);
    }

    window.dispatchEvent(new CustomEvent('creditsUpdated', { detail: { credits: newValue, transaction } }));
    return voucherCode;
};

export const isActivityCompleted = (activityId: string): boolean => {
    const completed = getCompletedActivities();
    return completed.includes(activityId);
};

const getCompletedActivities = (): string[] => {
    const stored = localStorage.getItem(COMPLETED_ACTIVITIES_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const getCreditHistory = (): CreditTransaction[] => {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
};
