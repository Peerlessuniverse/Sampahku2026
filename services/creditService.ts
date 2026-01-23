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

export const addCredits = (amount: number, description: string, activityId?: string) => {
    // If an activityId is provided, check if it's already completed
    if (activityId && isActivityCompleted(activityId)) {
        return false;
    }

    const current = getCredits();
    const newValue = current + amount;
    localStorage.setItem(STORAGE_KEY, newValue.toString());

    // Mark activity as completed if activityId is present
    if (activityId) {
        const completed = getCompletedActivities();
        localStorage.setItem(COMPLETED_ACTIVITIES_KEY, JSON.stringify([...completed, activityId]));
    }

    // Add to history
    const history = getCreditHistory();
    const transaction: CreditTransaction = {
        id: Date.now().toString(),
        amount,
        description,
        timestamp: new Date().toISOString(),
        type: 'earn'
    };
    localStorage.setItem(HISTORY_KEY, JSON.stringify([transaction, ...history].slice(0, 50)));

    // Trigger custom event for reactive UI
    window.dispatchEvent(new CustomEvent('creditsUpdated', { detail: { credits: newValue, transaction } }));
    return true;
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

export const redeemCredits = (amount: number, description: string): string | null => {
    const current = getCredits();
    if (current < amount) return null;

    const newValue = current - amount;
    localStorage.setItem(STORAGE_KEY, newValue.toString());

    // Generate a unique voucher code (Cosmic Pattern)
    const voucherCode = `ECO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Add to history
    const history = getCreditHistory();
    const transaction: CreditTransaction = {
        id: Date.now().toString(),
        amount,
        description: `${description} [Code: ${voucherCode}]`,
        timestamp: new Date().toISOString(),
        type: 'redeem'
    };
    localStorage.setItem(HISTORY_KEY, JSON.stringify([transaction, ...history].slice(0, 50)));

    // Trigger custom event for reactive UI
    window.dispatchEvent(new CustomEvent('creditsUpdated', { detail: { credits: newValue, transaction } }));

    return voucherCode;
};
