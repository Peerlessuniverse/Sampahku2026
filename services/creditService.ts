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
const IMPACT_KEY = 'sampahku_eco_impact'; // New Key
const HISTORY_KEY = 'sampahku_credit_history';
const COMPLETED_ACTIVITIES_KEY = 'sampahku_completed_activities';

// ⭐ NEW: Daily Limits System
const DAILY_AD_STATS_KEY = 'sampahku_daily_ad_stats';
const LAST_AD_TIMESTAMP_KEY = 'sampahku_last_ad_timestamp';

// Anti-Spam Configuration - V4.0 Session-Based Cooldown Model
export const AD_LIMITS = {
    MAX_ADS_PER_DAY: 100,              // Maximum ads watchable per day
    MAX_POINTS_FROM_ADS_PER_DAY: 145,  // Maximum points from ads per day
    ADS_PER_SESSION: 10,               // Ads per session (no cooldown within session)
    SESSION_COOLDOWN_MINUTES: 5,       // Minutes to wait BETWEEN sessions

    /**
     * Dynamic reward calculation - Decreasing value!
     * Ads 1-10: 10, 9, 8, 7, 6, 5, 4, 3, 2, 1 points (55 total)
     * Ads 11-100: 1 point each (90 total)
     * MAX: 145 points/day
     */
    getAdReward: (adNumber: number): number => {
        if (adNumber <= 0) return 0;
        if (adNumber <= 10) {
            return 11 - adNumber; // 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
        }
        return 1; // All ads after 10th get 1 point
    }
};

// Daily Stats Interface - V4.0 Session-Based
interface DailyAdStats {
    date: string;                    // YYYY-MM-DD
    totalAdsWatched: number;         // 0-100 total hari ini
    currentSessionAds: number;       // 0-10 dalam sesi saat ini
    sessionsCompleted: number;       // 0-10 sesi yang sudah selesai
    lastSessionEndTime: number | null; // timestamp untuk cooldown antar sesi
    pointsEarned: number;            // 0-145 total poin dari iklan
}

export const getCredits = (): number => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored) : 0;
};

export const getImpact = (): number => {
    const stored = localStorage.getItem(IMPACT_KEY);
    return stored ? parseFloat(stored) : 0;
};

// Logic untuk menggabungkan poin lokal (Guest) ke Cloud saat pertama kali login
export const migrateLocalCreditsToCloud = async (uid: string) => {
    const localCredits = getCredits();
    if (localCredits > 0) {
        // Cek dulu credits di cloud
        const cloudData = await getUserCredits(uid);

        // Hanya pindahkan jika ini sepertinya login baru/sinkronisasi
        // Tambahkan kredit lokal ke cloud sebagai "Saldo Awal Migrasi" atau merge history
        // Untuk sederhananya, kita update cloud dengan selisih jika lokal > cloud, 
        // atau kita bisa reset lokal jadi 0 setelah sync.

        // Strategi: Push semua histori lokal yang belum ada di cloud
        const localHistory = getCreditHistory();

        for (const tx of localHistory) {
            // Kirim satu per satu atau batch (sekarang manual loop sederhana)
            await updateUserCredits(
                uid,
                tx.amount,
                tx.description + " (from Guest)",
                tx.id,
                0,
                'generic',
                tx.id,
                { migrated: true, localTxId: tx.id }
            );
        }

        // Clear local storage agar tidak double counting nanti saat sync balik
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(IMPACT_KEY);
        localStorage.removeItem(HISTORY_KEY);
        localStorage.removeItem(COMPLETED_ACTIVITIES_KEY);
    }

    // Setelah migrasi, tarik data terbaru dari cloud
    await syncWithCloud();
};

export const syncWithCloud = async () => {
    const user = getCurrentUser();
    if (!user) return;

    try {
        const cloudData = await getUserCredits(user.uid);
        localStorage.setItem(STORAGE_KEY, cloudData.credits.toString());
        localStorage.setItem(IMPACT_KEY, cloudData.impact.toString()); // Sync Impact
        localStorage.setItem(COMPLETED_ACTIVITIES_KEY, JSON.stringify(cloudData.completedActivities));

        const cloudHistory = await getUserHistory(user.uid);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(cloudHistory));

        window.dispatchEvent(new CustomEvent('creditsUpdated', { detail: { credits: cloudData.credits, impact: cloudData.impact } }));
    } catch (error) {
        console.error("Cloud Sync Error:", error);
    }
};

export const addCredits = async (amount: number, description: string, activityId?: string, impactChange: number = 0, actionType: 'generic' | 'ad_watch' | 'scan' | 'mission' | 'quiz' | 'redeem' = 'generic', idempotencyKey?: string, metadata?: any) => {
    if (activityId && isActivityCompleted(activityId)) {
        return false;
    }

    const current = getCredits();
    const newValue = current + amount;
    localStorage.setItem(STORAGE_KEY, newValue.toString());

    // Update Impact
    const currentImpact = getImpact();
    const newImpact = currentImpact + impactChange;
    localStorage.setItem(IMPACT_KEY, newImpact.toString());

    if (activityId) {
        const completed = getCompletedActivities();
        localStorage.setItem(COMPLETED_ACTIVITIES_KEY, JSON.stringify([...completed, activityId]));
    }

    const history = getCreditHistory();
    const transaction: CreditTransaction = {
        id: activityId || Date.now().toString(),
        amount,
        description,
        timestamp: new Date().toISOString(),
        type: 'earn'
    };
    localStorage.setItem(HISTORY_KEY, JSON.stringify([transaction, ...history].slice(0, 50)));

    // Sync to Cloud if authenticated
    let cloudResult: any = null;
    const user = getCurrentUser();
    if (user) {
        cloudResult = await updateUserCredits(
            user.uid,
            amount,
            description,
            activityId,
            impactChange,
            actionType,
            idempotencyKey || transaction.id,
            { ...metadata, localTxId: transaction.id },
        );
    }

    window.dispatchEvent(new CustomEvent('creditsUpdated', { detail: { credits: newValue, impact: newImpact, transaction } }));
    return cloudResult || true;
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
        await updateUserCredits(
            user.uid,
            -amount,
            `${description} [Code: ${voucherCode}]`,
            undefined,
            0,
            'redeem',
            transaction.id,
            { voucherCode }
        );
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

// ⭐ NEW: Monthly Activity System (for Transformation & WTE Lab points)

/**
 * Get current month string (YYYY-MM in WIB timezone)
 */
export const getCurrentMonth = (): string => {
    const now = new Date();
    // Convert to WIB (UTC+7)
    const wibOffset = 7 * 60; // minutes
    const localOffset = now.getTimezoneOffset(); // minutes from UTC
    const wibTime = new Date(now.getTime() + (wibOffset + localOffset) * 60000);
    return wibTime.toISOString().slice(0, 7); // YYYY-MM
};

/**
 * Generate a monthly activity ID
 * Activities with this ID will reset every month
 * @param baseActivityId - The base activity ID (e.g., "transformation_organic")
 * @returns Monthly activity ID (e.g., "transformation_organic_2026-01")
 */
export const getMonthlyActivityId = (baseActivityId: string): string => {
    const currentMonth = getCurrentMonth();
    return `${baseActivityId}_${currentMonth}`;
};

/**
 * Check if a monthly activity is completed THIS MONTH
 * @param baseActivityId - The base activity ID (without month suffix)
 * @returns true if already completed this month
 */
export const isMonthlyActivityCompleted = (baseActivityId: string): boolean => {
    const monthlyId = getMonthlyActivityId(baseActivityId);
    return isActivityCompleted(monthlyId);
};

// ⭐ NEW: Daily Ad Limit Functions

/**
 * Get today's date string (YYYY-MM-DD in WIB timezone)
 */
const getTodayDate = (): string => {
    const now = new Date();
    // Convert to WIB (UTC+7)
    const wibOffset = 7 * 60; // minutes
    const localOffset = now.getTimezoneOffset(); // minutes from UTC
    const wibTime = new Date(now.getTime() + (wibOffset + localOffset) * 60000);
    return wibTime.toISOString().split('T')[0]; // YYYY-MM-DD
};

/**
 * Get today's ad watching statistics (V4.0 Session-Based)
 */
export const getDailyAdStats = (): DailyAdStats => {
    const stored = localStorage.getItem(DAILY_AD_STATS_KEY);
    const today = getTodayDate();

    const defaultStats: DailyAdStats = {
        date: today,
        totalAdsWatched: 0,
        currentSessionAds: 0,
        sessionsCompleted: 0,
        lastSessionEndTime: null,
        pointsEarned: 0
    };

    if (!stored) {
        return defaultStats;
    }

    const stats = JSON.parse(stored);

    // Reset if it's a new day
    if (stats.date !== today) {
        return defaultStats;
    }

    // Migration from old format (V3.0) to new format (V4.0)
    if (stats.adsWatched !== undefined && stats.totalAdsWatched === undefined) {
        return {
            date: today,
            totalAdsWatched: stats.adsWatched || 0,
            currentSessionAds: (stats.adsWatched || 0) % AD_LIMITS.ADS_PER_SESSION,
            sessionsCompleted: Math.floor((stats.adsWatched || 0) / AD_LIMITS.ADS_PER_SESSION),
            lastSessionEndTime: null,
            pointsEarned: stats.pointsEarned || 0
        };
    }

    return stats as DailyAdStats;
};

/**
 * Check if user can watch another ad (V4.0 Session-Based Cooldown)
 * - No cooldown WITHIN a session (10 ads)
 * - 5 minute cooldown BETWEEN sessions
 */
export const canWatchAd = (): { allowed: boolean; reason?: string; sessionInfo?: { current: number; total: number } } => {
    const stats = getDailyAdStats();

    // Check daily ad limit (100 ads)
    if (stats.totalAdsWatched >= AD_LIMITS.MAX_ADS_PER_DAY) {
        return {
            allowed: false,
            reason: `Batas harian tercapai! Kembali lagi besok. (${stats.totalAdsWatched}/${AD_LIMITS.MAX_ADS_PER_DAY} iklan hari ini)`
        };
    }

    // Check daily points limit (145 points)
    if (stats.pointsEarned >= AD_LIMITS.MAX_POINTS_FROM_ADS_PER_DAY) {
        return {
            allowed: false,
            reason: `Poin iklan harian maksimal! (${stats.pointsEarned}/${AD_LIMITS.MAX_POINTS_FROM_ADS_PER_DAY} poin hari ini)`
        };
    }

    // Check SESSION cooldown (only between sessions, not within!)
    // Cooldown applies when: session just completed (currentSessionAds = 0) AND lastSessionEndTime exists
    if (stats.currentSessionAds === 0 && stats.lastSessionEndTime !== null && stats.sessionsCompleted > 0) {
        const timeSinceSessionEnd = Date.now() - stats.lastSessionEndTime;
        const cooldownMs = AD_LIMITS.SESSION_COOLDOWN_MINUTES * 60 * 1000;

        if (timeSinceSessionEnd < cooldownMs) {
            const remainingMs = cooldownMs - timeSinceSessionEnd;
            const remainingMinutes = Math.ceil(remainingMs / 60000);
            const remainingSeconds = Math.ceil(remainingMs / 1000);
            
            return {
                allowed: false,
                reason: remainingMinutes > 1 
                    ? `Istirahat sebentar! Sesi berikutnya dalam ${remainingMinutes} menit`
                    : `Sesi berikutnya dalam ${remainingSeconds} detik`,
                sessionInfo: { current: stats.currentSessionAds, total: AD_LIMITS.ADS_PER_SESSION }
            };
        }
    }

    return { 
        allowed: true,
        sessionInfo: { current: stats.currentSessionAds + 1, total: AD_LIMITS.ADS_PER_SESSION }
    };
};

/**
 * Record that user watched an ad and earned points (V4.0 Session-Based)
 * @param pointsAwarded - The actual points awarded for this ad (dynamic: 10,9,8...1)
 */
export const recordAdWatch = (pointsAwarded: number): void => {
    const stats = getDailyAdStats();
    const today = getTodayDate();

    // Increment counters
    const newTotalAds = stats.totalAdsWatched + 1;
    const newSessionAds = stats.currentSessionAds + 1;
    const newPoints = stats.pointsEarned + pointsAwarded;

    // Check if session is complete (10 ads)
    const sessionComplete = newSessionAds >= AD_LIMITS.ADS_PER_SESSION;

    const newStats: DailyAdStats = {
        date: today,
        totalAdsWatched: newTotalAds,
        currentSessionAds: sessionComplete ? 0 : newSessionAds, // Reset if session complete
        sessionsCompleted: sessionComplete ? stats.sessionsCompleted + 1 : stats.sessionsCompleted,
        lastSessionEndTime: sessionComplete ? Date.now() : stats.lastSessionEndTime, // Start cooldown if session complete
        pointsEarned: newPoints,
    };

    localStorage.setItem(DAILY_AD_STATS_KEY, JSON.stringify(newStats));

    // Log session info
    if (sessionComplete) {
        console.log(`🎉 Sesi ${newStats.sessionsCompleted} selesai! Total: ${newTotalAds}/${AD_LIMITS.MAX_ADS_PER_DAY} iklan, ${newPoints}/${AD_LIMITS.MAX_POINTS_FROM_ADS_PER_DAY} poin`);
        console.log(`⏳ Cooldown ${AD_LIMITS.SESSION_COOLDOWN_MINUTES} menit dimulai...`);
    } else {
        console.log(`📊 Iklan #${newSessionAds}/10 dalam sesi. Total hari ini: ${newTotalAds} iklan, +${pointsAwarded} poin`);
    }
};

/**
 * Get remaining ads user can watch today
 */
export const getRemainingAdsToday = (): number => {
    const stats = getDailyAdStats();
    return Math.max(0, AD_LIMITS.MAX_ADS_PER_DAY - stats.totalAdsWatched);
};

/**
 * Get time until next ad session is available (in milliseconds)
 * Returns 0 if no cooldown active (within session or cooldown expired)
 */
export const getTimeUntilNextAd = (): number => {
    const stats = getDailyAdStats();
    
    // No cooldown if: first ad ever, or within a session, or no previous session
    if (stats.currentSessionAds > 0 || stats.lastSessionEndTime === null || stats.sessionsCompleted === 0) {
        return 0;
    }

    const timeSinceSessionEnd = Date.now() - stats.lastSessionEndTime;
    const cooldownMs = AD_LIMITS.SESSION_COOLDOWN_MINUTES * 60 * 1000;

    return Math.max(0, cooldownMs - timeSinceSessionEnd);
};

/**
 * Get the reward amount for the NEXT ad to be watched
 */
export const getNextAdReward = (): number => {
    const stats = getDailyAdStats();
    return AD_LIMITS.getAdReward(stats.totalAdsWatched + 1);
};

/**
 * Get current session information
 */
export const getCurrentSessionInfo = (): {
    adInSession: number;        // Which ad in current session (1-10)
    sessionNumber: number;      // Which session (1-10)
    totalAdsToday: number;      // Total ads watched today
    totalPointsToday: number;   // Total points from ads today
    isInCooldown: boolean;      // Whether in cooldown between sessions
    cooldownRemainingMs: number; // Milliseconds until cooldown ends
} => {
    const stats = getDailyAdStats();
    const cooldownRemaining = getTimeUntilNextAd();
    
    return {
        adInSession: stats.currentSessionAds + 1,
        sessionNumber: stats.sessionsCompleted + 1,
        totalAdsToday: stats.totalAdsWatched,
        totalPointsToday: stats.pointsEarned,
        isInCooldown: cooldownRemaining > 0,
        cooldownRemainingMs: cooldownRemaining
    };
};
