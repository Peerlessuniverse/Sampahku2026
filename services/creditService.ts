export interface CreditTransaction {
    id: string;
    amount: number;
    description: string;
    timestamp: string;
    type: 'earn' | 'redeem';
}

const STORAGE_KEY = 'sampahku_eco_credits';
const HISTORY_KEY = 'sampahku_credit_history';

export const getCredits = (): number => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored) : 0;
};

export const addCredits = (amount: number, description: string) => {
    const current = getCredits();
    const newValue = current + amount;
    localStorage.setItem(STORAGE_KEY, newValue.toString());

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
};

export const getCreditHistory = (): CreditTransaction[] => {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
};
